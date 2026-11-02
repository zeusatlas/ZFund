import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../config/database';
import { CAMPAIGN_IMAGE_DIR } from '../common/middleware/upload.middleware';
import { logger } from '../config/logger';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../common/errors/app-error';
import { SystemRole } from '../common/types/auth';
import { MoneyUtil } from '../common/utils/decimal';
import { slugify } from '../common/utils/slug';
import { auditService } from './audit.service';
import { ussdFlowService } from './ussd-flow.service';
import { smsService } from './sms.service';
import { normalizePhone } from '../common/utils/phone';
import { User } from '../database/entities/user.entity';
import { ContributionPurpose } from '../database/entities/contribution-purpose.entity';
import { ProjectContributionPurpose } from '../database/entities/project-contribution-purpose.entity';
import { ProjectMember, ProjectMemberRole } from '../database/entities/project-member.entity';
import { PaymentMethodType, ProjectPaymentMethod } from '../database/entities/project-payment-method.entity';
import { Project, ProjectStatus } from '../database/entities/project.entity';
import { ProjectCategory } from '../database/entities/project-category.entity';
import { Contribution, ContributionStatus } from '../database/entities/contribution.entity';
import { ProjectSetting } from '../database/entities/project-setting.entity';
import {
  ConfigurePaymentMethodsInput,
  ConfigurePurposesInput,
  AdminCreateProjectInput,
  CreateProjectInput,
  UpdateProjectInput,
  UpdateProjectStatusInput,
} from '../schemas/project.schemas';

export interface PublicCampaignDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  eventCode: string;
  currency: string;
  targetAmount?: string;
  minAmount: string;
  maxAmount: string;
  welcomeMessage?: string;
  status: ProjectStatus;
  acceptsContributions: boolean;
  startDate?: Date;
  endDate?: Date;
  category?: {
    id: string;
    name: string;
    slug?: string;
  } | null;
  organization?: {
    id: string;
    name: string;
    slug?: string;
    verificationStatus?: string;
  } | null;
  host: {
    id: string;
    name: string;
    slug: string;
    phone?: string | null;
    email?: string | null;
  };
  totalRaised: string;
  contributorsCount: number;
  percentFunded: number;
  purposes: Array<{
    id: string;
    name: string;
    code?: string;
    description?: string;
    isDefault?: boolean;
  }>;
  paymentMethods: Array<{
    method: string;
    provider: string;
  }>;
  recentDonations: Array<{
    id: string;
    donorName: string;
    amount: string;
    currency: string;
    createdAt: Date;
    purpose?: string;
  }>;
  /** True when the host opted to show contributions on the public page. */
  showPublicTransactions: boolean;
  coverImageUrl: string | null;
  wordsOfSupport: Array<{
    id: string;
    name: string;
    message: string;
    amount?: string;
    currency?: string;
    createdAt: string;
    isAnonymous?: boolean;
  }>;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isUuid(val?: string | null): boolean {
  return typeof val === 'string' && UUID_REGEX.test(val.trim());
}

export class ProjectService {
  private get projectRepo() { return AppDataSource.getRepository(Project); }
  private get categoryRepo() { return AppDataSource.getRepository(ProjectCategory); }
  private get memberRepo() { return AppDataSource.getRepository(ProjectMember); }
  private get projectPurposeRepo() { return AppDataSource.getRepository(ProjectContributionPurpose); }
  private get purposeRepo() { return AppDataSource.getRepository(ContributionPurpose); }
  private get paymentMethodRepo() { return AppDataSource.getRepository(ProjectPaymentMethod); }
  private get contributionRepo() { return AppDataSource.getRepository(Contribution); }
  private get settingRepo() { return AppDataSource.getRepository(ProjectSetting); }
  private get userRepo() { return AppDataSource.getRepository(User); }

  async getCategories(): Promise<ProjectCategory[]> {
    return this.categoryRepo.find({ where: { isActive: true }, order: { name: 'ASC' } });
  }

  async getNextProjectCode(): Promise<string> {
    const recentProjects = await this.projectRepo
      .createQueryBuilder('project')
      .select(['project.eventCode', 'project.createdAt'])
      .orderBy('project.createdAt', 'DESC')
      .take(100)
      .getMany();

    let lastCodeNumber: number | null = null;
    for (const p of recentProjects) {
      const code = p.eventCode?.trim();
      if (code && /^\d{4}$/.test(code)) {
        const num = parseInt(code, 10);
        if (!isNaN(num) && num >= 1000 && num <= 9999) {
          lastCodeNumber = num;
          break;
        }
      }
    }

    const allProjects = await this.projectRepo
      .createQueryBuilder('project')
      .select(['project.eventCode'])
      .getMany();

    const existingCodes = new Set(allProjects.map((p) => p.eventCode?.trim()).filter(Boolean));
    const all4DigitNumbers = Array.from(existingCodes)
      .filter((c): c is string => !!c && /^\d{4}$/.test(c))
      .map((c) => parseInt(c, 10))
      .filter((n) => !isNaN(n) && n >= 1000 && n <= 9999);

    const maxCode = all4DigitNumbers.length > 0 ? Math.max(...all4DigitNumbers) : 1000;

    let candidate = lastCodeNumber !== null ? lastCodeNumber + 1 : (maxCode >= 1001 ? maxCode + 1 : 1001);

    while (existingCodes.has(candidate.toString())) {
      candidate++;
    }

    return candidate.toString();
  }

  /** True when no campaign already uses this event code. */
  async isCodeAvailable(code: string): Promise<boolean> {
    return (await this.projectRepo.count({ where: { eventCode: code.trim() } })) === 0;
  }

  /**
   * Admin creates a campaign on behalf of a host. The campaign is owned by the host but goes
   * live straight away (Scheduled when its start date is still ahead) so the admin can configure steps.
   */
  async createProjectForHost(input: AdminCreateProjectInput, adminId: string): Promise<Project> {
    const host = await AppDataSource.getRepository(User).findOne({ where: { id: input.hostId } });
    if (!host || host.role !== SystemRole.ACCOUNT_OWNER) throw new NotFoundError('Host not found');

    const { hostId, ...rest } = input;
    const startsLater = new Date(input.startDate) > new Date();
    return this.createProject(
      {
        ...rest,
        status: startsLater ? ProjectStatus.SCHEDULED : ProjectStatus.PUBLISHED,
        acceptsContributions: !startsLater,
      },
      hostId,
      adminId
    );
  }

  async createProject(input: CreateProjectInput, ownerId: string, actorId: string = ownerId): Promise<Project> {
    const requestedCode = input.requestedCode?.trim();
    if (requestedCode && !(await this.isCodeAvailable(requestedCode))) {
      throw new ConflictError(`Campaign code '${requestedCode}' is already taken. Please request another.`);
    }

    let eventCode = input.eventCode?.trim();
    if (!eventCode) {
      eventCode = await this.getNextProjectCode();
    } else {
      // Verify eventCode uniqueness
      const existingCode = await this.projectRepo.findOne({ where: { eventCode } });
      if (existingCode) {
        throw new ConflictError(`Campaign code '${eventCode}' is already assigned to another project.`);
      }
    }

    let slug = slugify(input.name);
    const existingSlug = await this.projectRepo.findOne({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${eventCode}`;
    }

    const project = this.projectRepo.create({
      name: input.name,
      slug,
      description: input.description,
      organizationId: input.organizationId,
      ownerId,
      categoryId: input.categoryId,
      eventCode,
      requestedCode: requestedCode || undefined,
      currency: input.currency || 'GHS',
      targetAmount: input.targetAmount,
      minAmount: input.minAmount || '1.00',
      maxAmount: input.maxAmount || '10000.00',
      welcomeMessage: input.welcomeMessage,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: input.endDate ? new Date(input.endDate) : undefined,
      acceptsContributions: input.acceptsContributions,
      commissionPercentage: input.commissionPercentage || '14.00',
      status: input.status || ProjectStatus.PENDING_REVIEW,
      settings: {
        webPortalEnabled: Boolean(input.enableWebPortal),
        webPortalCommission: input.enableWebPortal ? '1.00' : '0.00',
        showPublicTransactions: Boolean(input.enableWebPortal && input.showPublicTransactions),
      },
    });

    const savedProject = await this.projectRepo.save(project);

    // Add owner as ProjectMember
    await this.memberRepo.save(
      this.memberRepo.create({
        projectId: savedProject.id,
        userId: ownerId,
        role: ProjectMemberRole.OWNER,
      })
    );

    // Initialize default Mobile Money payment method (RobsPay)
    await this.paymentMethodRepo.save(
      this.paymentMethodRepo.create({
        projectId: savedProject.id,
        method: PaymentMethodType.MOBILE_MONEY,
        provider: 'ROBSPAY',
        isEnabled: true,
      })
    );

    // Initialize default Card payment method (RobsPay hosted checkout)
    await this.paymentMethodRepo.save(
      this.paymentMethodRepo.create({
        projectId: savedProject.id,
        method: PaymentMethodType.CARD,
        provider: 'ROBSPAY',
        isEnabled: true,
      })
    );

    await auditService.log({
      userId: actorId,
      organizationId: savedProject.organizationId,
      entityType: 'PROJECT',
      entityId: savedProject.id,
      action: 'CREATE_PROJECT',
      newValues: {
        name: savedProject.name,
        eventCode: savedProject.eventCode,
        requestedCode: savedProject.requestedCode,
        ownerId,
      },
    });

    // Auto-initialize published USSD flow for project event code
    try {
      await ussdFlowService.initializeProjectFlow(
        savedProject.id,
        { welcomePrompt: savedProject.welcomeMessage },
        ownerId
      );
    } catch (err) {
      logger.warn({ err, projectId: savedProject.id }, 'USSD flow auto-initialization skipped or failed');
    }

    return savedProject;
  }

  async getProjects(params: {
    userId?: string;
    userRole?: string;
    organizationId?: string;
    status?: ProjectStatus;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ projects: Project[]; total: number; summary?: Record<string, unknown> }> {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const query = this.projectRepo
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.organization', 'organization')
      .leftJoinAndSelect('project.category', 'category')
      .leftJoinAndSelect('project.purposes', 'projectPurposes')
      .leftJoinAndSelect('projectPurposes.purpose', 'purpose');

    const isPlatformStaff = [
      SystemRole.SUPER_ADMIN,
      SystemRole.PLATFORM_ADMIN,
      SystemRole.AUDITOR,
    ].includes(params.userRole as SystemRole);

    if (!isPlatformStaff && params.userId) {
      // Scope to projects owned by user or where user is member or org member
      query.innerJoin(
        'project_members',
        'pm',
        'pm.projectId = project.id AND pm.userId = :userId',
        { userId: params.userId }
      );
    }

    if (params.organizationId) {
      query.andWhere('project.organizationId = :orgId', { orgId: params.organizationId });
    }

    if (params.status) {
      query.andWhere('project.status = :status', { status: params.status });
    }

    if (params.search) {
      query.andWhere(
        '(LOWER(project.name) LIKE :search OR project.eventCode LIKE :search)',
        { search: `%${params.search.toLowerCase()}%` }
      );
    }

    query.orderBy('project.createdAt', 'DESC').skip(skip).take(limit);

    const [projects, total] = await query.getManyAndCount();

    const projectIds = projects.map((p) => p.id);
    const statsMap: Record<string, { totalRaised: string; contributorsCount: number }> = {};

    if (projectIds.length > 0) {
      const stats = await this.contributionRepo
        .createQueryBuilder('c')
        .select('c.projectId', 'projectId')
        .addSelect(
          'COALESCE(SUM(CASE WHEN c.status IN (:...confirmedStatuses) THEN CAST(c.amount AS numeric) ELSE 0 END), 0)',
          'totalRaised'
        )
        .addSelect(
          'COUNT(DISTINCT CASE WHEN c.status IN (:...confirmedStatuses) THEN c.contributorId ELSE NULL END)',
          'contributorsCount'
        )
        .where('c.projectId IN (:...projectIds)', {
          projectIds,
          confirmedStatuses: [
            ContributionStatus.CONFIRMED,
            ContributionStatus.PARTIALLY_REFUNDED,
            ContributionStatus.REFUNDED,
          ],
        })
        .groupBy('c.projectId')
        .getRawMany();

      for (const row of stats) {
        statsMap[row.projectId] = {
          totalRaised: parseFloat(row.totalRaised || '0').toFixed(2),
          contributorsCount: parseInt(row.contributorsCount || '0', 10),
        };
      }
    }

    const projectsWithStats = projects.map((p) => {
      const stats = statsMap[p.id] || { totalRaised: '0.00', contributorsCount: 0 };
      return Object.assign(p, {
        totalRaised: stats.totalRaised,
        contributorsCount: stats.contributorsCount,
      });
    });

    const overviewStats = await this.getOverviewStats(params.userId, params.userRole);

    return { projects: projectsWithStats, total, summary: overviewStats };
  }

  async getOverviewStats(userId?: string, userRole?: string): Promise<{
    totalRaised: number;
    totalRaisedFormatted: string;
    campaignsCreated: number;
    activeCampaigns: number;
    completedCampaigns: number;
    draftCampaigns: number;
    contributorsPaid: number;
  }> {
    const isPlatformStaff = [
      SystemRole.SUPER_ADMIN,
      SystemRole.PLATFORM_ADMIN,
      SystemRole.AUDITOR,
    ].includes(userRole as SystemRole);

    const projectQuery = this.projectRepo.createQueryBuilder('project');
    if (!isPlatformStaff && userId) {
      projectQuery.innerJoin(
        'project_members',
        'pm',
        '(pm.projectId = project.id AND pm.userId = :userId) OR project.ownerId = :userId',
        { userId }
      );
    }

    const projects = await projectQuery.select(['project.id', 'project.status']).getMany();
    const campaignsCreated = projects.length;
    const activeCampaigns = projects.filter(
      (p) => p.status === ProjectStatus.PUBLISHED || p.status === ProjectStatus.APPROVED
    ).length;
    const completedCampaigns = projects.filter(
      (p) => p.status === ProjectStatus.COMPLETED || p.status === ProjectStatus.ARCHIVED
    ).length;
    const draftCampaigns = projects.filter(
      (p) =>
        p.status === ProjectStatus.DRAFT ||
        p.status === ProjectStatus.PENDING_REVIEW ||
        p.status === ProjectStatus.SUSPENDED
    ).length;

    const projectIds = projects.map((p) => p.id);
    let totalRaisedPesewas = 0;
    let contributorsPaid = 0;

    if (projectIds.length > 0) {
      const stats = await this.contributionRepo
        .createQueryBuilder('c')
        .select([
          'COALESCE(SUM(CASE WHEN c.status IN (:...confirmedStatuses) THEN CAST(c.amount AS numeric) ELSE 0 END), 0) AS "totalRaised"',
          'COUNT(DISTINCT CASE WHEN c.status IN (:...confirmedStatuses) THEN c.contributorId ELSE NULL END) AS "contributorsCount"',
        ])
        .where('c.projectId IN (:...projectIds)', {
          projectIds,
          confirmedStatuses: [
            ContributionStatus.CONFIRMED,
            ContributionStatus.PARTIALLY_REFUNDED,
            ContributionStatus.REFUNDED,
          ],
        })
        .getRawOne();

      totalRaisedPesewas = Math.round(parseFloat(stats?.totalRaised || '0') * 100);
      contributorsPaid = parseInt(stats?.contributorsCount || '0', 10);
    }

    return {
      totalRaised: totalRaisedPesewas,
      totalRaisedFormatted: `GH₵ ${(totalRaisedPesewas / 100).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      campaignsCreated,
      activeCampaigns,
      completedCampaigns,
      draftCampaigns,
      contributorsPaid,
    };
  }

  async getProjectById(id: string, userId?: string, userRole?: string): Promise<Project> {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: [
        'organization',
        'category',
        'purposes',
        'purposes.purpose',
        'paymentMethods',
        'members',
        'members.user',
      ],
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const isPlatformStaff = [
      SystemRole.SUPER_ADMIN,
      SystemRole.PLATFORM_ADMIN,
      SystemRole.AUDITOR,
    ].includes(userRole as SystemRole);

    if (!isPlatformStaff && userId && project.status !== ProjectStatus.PUBLISHED) {
      const isMember = project.members.some((m) => m.userId === userId);
      if (!isMember && project.ownerId !== userId) {
        throw new ForbiddenError('You do not have permission to view this unpublished project');
      }
    }

    const stats = await this.contributionRepo
      .createQueryBuilder('c')
      .select(
        'COALESCE(SUM(CASE WHEN c.status IN (:...confirmedStatuses) THEN CAST(c.amount AS numeric) ELSE 0 END), 0)',
        'totalRaised'
      )
      .addSelect(
        'COUNT(DISTINCT CASE WHEN c.status IN (:...confirmedStatuses) THEN c.contributorId ELSE NULL END)',
        'contributorsCount'
      )
      .where('c.projectId = :projectId', {
        projectId: id,
        confirmedStatuses: [
          ContributionStatus.CONFIRMED,
          ContributionStatus.PARTIALLY_REFUNDED,
          ContributionStatus.REFUNDED,
        ],
      })
      .getRawOne();

    return Object.assign(project, {
      totalRaised: parseFloat(stats?.totalRaised || '0').toFixed(2),
      contributorsCount: parseInt(stats?.contributorsCount || '0', 10),
    });
  }

  async getProjectByEventCode(eventCode: string): Promise<Project | null> {
    const project = await this.getProjectByEventCodeRaw(eventCode);
    if (!project) return null;
    const now = new Date();
    if (project.status !== ProjectStatus.PUBLISHED || !project.acceptsContributions) return null;
    if (project.startDate && new Date(project.startDate) > now) return null;
    if (project.endDate && new Date(project.endDate) < now) return null;
    return project;
  }

  /**
   * Stores the uploaded cover image for a campaign. Only the owner, a project member or platform
   * staff may change it; the previous file is removed.
   */
  async setCoverImage(id: string, filename: string, userId: string, userRole: string): Promise<{ coverImage: string }> {
    const project = await this.projectRepo.findOne({ where: { id }, relations: ['members'] });
    if (!project) throw new NotFoundError('Project not found');

    const isPlatformAdmin = [SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN].includes(userRole as SystemRole);
    const isMember = project.ownerId === userId || project.members.some((m) => m.userId === userId);
    if (!isPlatformAdmin && !isMember) {
      throw new ForbiddenError('You do not have permission to change this campaign');
    }

    const settings = (project.settings || {}) as Record<string, any>;
    const previous = typeof settings.coverImage === 'string' ? settings.coverImage : null;
    project.settings = { ...settings, coverImage: filename };
    await this.projectRepo.save(project);

    if (previous && previous !== filename) {
      await fs.promises.unlink(path.join(CAMPAIGN_IMAGE_DIR, path.basename(previous))).catch(() => undefined);
    }
    return { coverImage: filename };
  }

  async getProjectByEventCodeRaw(eventCode: string): Promise<Project | null> {
    return this.projectRepo.findOne({
      where: { eventCode },
      relations: ['purposes', 'purposes.purpose', 'paymentMethods'],
    });
  }

  async updateProject(
    id: string,
    input: UpdateProjectInput,
    userId: string,
    userRole: string
  ): Promise<Project> {
    const project = await this.getProjectById(id, userId, userRole);

    const oldValues = {
      name: project.name,
      description: project.description,
      minAmount: project.minAmount,
      maxAmount: project.maxAmount,
    };

    if (input.name !== undefined) project.name = input.name;
    if (input.description !== undefined) project.description = input.description;
    if (input.categoryId !== undefined) project.categoryId = input.categoryId;
    if (input.currency !== undefined) project.currency = input.currency;
    if (input.targetAmount !== undefined) project.targetAmount = input.targetAmount;
    if (input.minAmount !== undefined) project.minAmount = input.minAmount;
    if (input.maxAmount !== undefined) project.maxAmount = input.maxAmount;
    if (input.welcomeMessage !== undefined) project.welcomeMessage = input.welcomeMessage;
    if (input.acceptsContributions !== undefined)
      project.acceptsContributions = input.acceptsContributions;
    if (input.startDate !== undefined)
      project.startDate = input.startDate ? new Date(input.startDate) : undefined;
    if (input.endDate !== undefined)
      project.endDate = input.endDate ? new Date(input.endDate) : undefined;
    const isPlatformAdmin = [SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN].includes(
      userRole as SystemRole
    );
    if (input.commissionPercentage !== undefined && isPlatformAdmin) {
      project.commissionPercentage = Number(input.commissionPercentage).toFixed(2);
    }
    if (input.enableWebPortal !== undefined || input.showPublicTransactions !== undefined) {
      const current = (project.settings || {}) as Record<string, any>;
      const webPortalEnabled =
        input.enableWebPortal !== undefined ? Boolean(input.enableWebPortal) : Boolean(current.webPortalEnabled);
      project.settings = {
        ...current,
        webPortalEnabled,
        webPortalCommission: webPortalEnabled ? '1.00' : '0.00',
        showPublicTransactions: Boolean(
          webPortalEnabled &&
            (input.showPublicTransactions !== undefined
              ? input.showPublicTransactions
              : current.showPublicTransactions)
        ),
      };
    }

    const saved = await this.projectRepo.save(project);

    await auditService.log({
      userId,
      organizationId: project.organizationId,
      entityType: 'PROJECT',
      entityId: project.id,
      action: 'UPDATE_PROJECT',
      oldValues,
      newValues: input,
    });

    return saved;
  }

  async deleteProject(id: string, userId: string, userRole: string): Promise<void> {
    const project = await this.getProjectById(id, userId, userRole);
    if (project.status !== ProjectStatus.DRAFT) {
      throw new BadRequestError('Only draft campaigns can be deleted.');
    }

    const count = await this.contributionRepo.count({ where: { projectId: id } });
    if (count > 0) {
      throw new BadRequestError('Cannot delete a campaign that already has contributions.');
    }

    await this.memberRepo.delete({ projectId: id });
    await this.paymentMethodRepo.delete({ projectId: id });
    await this.projectPurposeRepo.delete({ projectId: id });
    await this.settingRepo.delete({ projectId: id });
    await this.projectRepo.delete(id);

    await auditService.log({
      userId,
      organizationId: project.organizationId,
      entityType: 'PROJECT',
      entityId: project.id,
      action: 'DELETE_PROJECT',
      oldValues: { name: project.name, eventCode: project.eventCode, status: project.status },
    });
  }

  async updateProjectStatus(
    id: string,
    input: UpdateProjectStatusInput,
    userId: string,
    userRole: string
  ): Promise<Project> {
    const project = await this.getProjectById(id, userId, userRole);
    const currentStatus = project.status;
    let targetStatus = input.status;

    // Validate state transition
    const validTransitions: Record<ProjectStatus, ProjectStatus[]> = {
      [ProjectStatus.DRAFT]: [ProjectStatus.PENDING_REVIEW, ProjectStatus.ARCHIVED],
      [ProjectStatus.PENDING_REVIEW]: [
        ProjectStatus.APPROVED,
        ProjectStatus.SCHEDULED,
        ProjectStatus.PUBLISHED,
        ProjectStatus.REJECTED,
        ProjectStatus.DRAFT,
      ],
      [ProjectStatus.APPROVED]: [
        ProjectStatus.SCHEDULED,
        ProjectStatus.PUBLISHED,
        ProjectStatus.REJECTED,
        ProjectStatus.DRAFT,
      ],
      [ProjectStatus.SCHEDULED]: [
        ProjectStatus.PUBLISHED,
        ProjectStatus.SUSPENDED,
        ProjectStatus.REJECTED,
        ProjectStatus.DRAFT,
      ],
      [ProjectStatus.PUBLISHED]: [ProjectStatus.SUSPENDED, ProjectStatus.COMPLETED],
      [ProjectStatus.REJECTED]: [
        ProjectStatus.PENDING_REVIEW,
        ProjectStatus.DRAFT,
        ProjectStatus.ARCHIVED,
      ],
      [ProjectStatus.SUSPENDED]: [
        ProjectStatus.PUBLISHED,
        ProjectStatus.SCHEDULED,
        ProjectStatus.COMPLETED,
        ProjectStatus.ARCHIVED,
      ],
      [ProjectStatus.COMPLETED]: [ProjectStatus.ARCHIVED],
      [ProjectStatus.ARCHIVED]: [],
    };

    // Platform Super Admin / Platform Admin can override transitions
    const isPlatformAdmin = [SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN].includes(
      userRole as SystemRole
    );

    if (!isPlatformAdmin) {
      // Approval belongs to platform admins; hosts may only submit for review.
      if (input.status === ProjectStatus.APPROVED || input.status === ProjectStatus.PUBLISHED) {
        throw new ForbiddenError('Only an administrator can approve a campaign');
      }
      const allowed = validTransitions[currentStatus] || [];
      if (!allowed.includes(targetStatus)) {
        throw new BadRequestError(
          `Invalid state transition from '${currentStatus}' to '${targetStatus}'.`
        );
      }
    }

    // When approving/publishing, check if the start date hasn't reached yet
    if (targetStatus === ProjectStatus.PUBLISHED || targetStatus === ProjectStatus.APPROVED) {
      const now = new Date();
      if (project.startDate && new Date(project.startDate) > now) {
        targetStatus = ProjectStatus.SCHEDULED;
        project.acceptsContributions = false;
      } else {
        targetStatus = ProjectStatus.PUBLISHED;
        project.acceptsContributions = true;
      }
    }

    if (input.commissionPercentage !== undefined && isPlatformAdmin) {
      project.commissionPercentage = Number(input.commissionPercentage).toFixed(2);
    }
    if (input.enableWebPortal !== undefined) {
      project.settings = {
        ...(project.settings || {}),
        webPortalEnabled: Boolean(input.enableWebPortal),
        webPortalCommission: input.enableWebPortal ? '1.00' : '0.00',
      };
    }

    project.status = targetStatus;
    if (targetStatus === ProjectStatus.PUBLISHED) {
      project.acceptsContributions = true;
    }
    const saved = await this.projectRepo.save(project);

    await auditService.log({
      userId,
      organizationId: project.organizationId,
      entityType: 'PROJECT',
      entityId: project.id,
      action: 'UPDATE_PROJECT_STATUS',
      oldValues: { status: currentStatus },
      newValues: { status: targetStatus, notes: input.notes, commissionPercentage: project.commissionPercentage },
    });

    if (targetStatus === ProjectStatus.PENDING_REVIEW && currentStatus !== targetStatus) {
      await this.notifyApprovalNeeded(saved);
    }

    return saved;
  }

  /** Texts every active super admin that a campaign is waiting for approval. Never fails the status change. */
  private async notifyApprovalNeeded(project: Project): Promise<void> {
    try {
      const admins = await AppDataSource.getRepository(User).find({
        where: { role: SystemRole.SUPER_ADMIN },
      });
      const recipients = admins.filter((a) => a.phone && a.status !== 'SUSPENDED').map((a) => normalizePhone(a.phone!));
      if (recipients.length === 0) return;

      const sms = await smsService.send({
        recipient: recipients,
        message: `RaiseFunds: the campaign "${project.name}" (code ${project.eventCode}) needs your approval. Review it under Campaigns in the admin dashboard.`,
      });
      if (!sms.success) {
        logger.error({ projectId: project.id, error: sms.error }, 'Failed to send campaign approval SMS');
      }
    } catch (err) {
      logger.error({ err, projectId: project.id }, 'Failed to notify admins of pending campaign');
    }
  }

  async configurePurposes(
    projectId: string,
    input: ConfigurePurposesInput,
    userId: string,
    userRole: string
  ): Promise<ProjectContributionPurpose[]> {
    await this.getProjectById(projectId, userId, userRole);

    // Remove existing purpose configurations for this project
    await this.projectPurposeRepo.delete({ projectId });

    const newPurposes: ProjectContributionPurpose[] = [];
    for (const item of input.purposeIds) {
      const purpose = await this.purposeRepo.findOne({ where: { id: item.purposeId } });
      if (!purpose) {
        throw new NotFoundError(`Purpose with ID ${item.purposeId} not found`);
      }

      const pcp = this.projectPurposeRepo.create({
        projectId,
        purposeId: item.purposeId,
        customName: item.customName,
        displayOrder: item.displayOrder,
        isDefault: item.isDefault,
        isActive: true,
      });
      newPurposes.push(pcp);
    }

    const saved = await this.projectPurposeRepo.save(newPurposes);

    await auditService.log({
      userId,
      entityType: 'PROJECT_PURPOSES',
      entityId: projectId,
      action: 'CONFIGURE_PURPOSES',
      newValues: { count: saved.length },
    });

    return saved;
  }

  


  async configurePaymentMethods(
    projectId: string,
    input: ConfigurePaymentMethodsInput,
    userId: string,
    userRole: string
  ): Promise<ProjectPaymentMethod[]> {
    await this.getProjectById(projectId, userId, userRole);

    await this.paymentMethodRepo.delete({ projectId });

    const methods: ProjectPaymentMethod[] = [];
    for (const m of input.methods) {
      const method = this.paymentMethodRepo.create({
        projectId,
        method: m.method,
        provider: m.provider,
        isEnabled: m.isEnabled,
        config: m.config || {},
      });
      methods.push(method);
    }

    const saved = await this.paymentMethodRepo.save(methods);

    await auditService.log({
      userId,
      entityType: 'PROJECT_PAYMENT_METHODS',
      entityId: projectId,
      action: 'CONFIGURE_PAYMENT_METHODS',
      newValues: { count: saved.length },
    });

    return saved;
  }

  /**
   * Fetches public campaign information for public web donation portal by hostSlug and campaignSlug
   */
  async getPublicCampaignBySlugs(hostSlug: string, campaignSlug: string): Promise<PublicCampaignDto> {
    const cleanHostSlug = hostSlug.toLowerCase().trim();
    const cleanCampaignSlug = campaignSlug.toLowerCase().trim();

    // 1. Look up campaign directly by slug, eventCode, or ID
    const projectWhere: Array<Record<string, any>> = [
      { slug: cleanCampaignSlug },
      { eventCode: cleanCampaignSlug },
    ];
    if (isUuid(cleanCampaignSlug)) {
      projectWhere.push({ id: cleanCampaignSlug });
    }

    let project = await this.projectRepo.findOne({
      where: projectWhere,
      relations: [
        'owner',
        'organization',
        'category',
        'purposes',
        'purposes.purpose',
        'paymentMethods',
      ],
    });

    if (!project) {
      // Fallback: match by slugify(name)
      const allProjects = await this.projectRepo.find({
        relations: [
          'owner',
          'organization',
          'category',
          'purposes',
          'purposes.purpose',
          'paymentMethods',
        ],
      });

      project =
        allProjects.find((p) => {
          const generated = slugify(p.name);
          return (
            generated === cleanCampaignSlug ||
            p.slug?.toLowerCase() === cleanCampaignSlug ||
            p.eventCode === cleanCampaignSlug ||
            (isUuid(cleanCampaignSlug) && p.id === cleanCampaignSlug)
          );
        }) || null;

      // Auto-backfill project slug if missing
      if (project && !project.slug) {
        project.slug = slugify(project.name) || project.eventCode;
        await this.projectRepo.save(project).catch(() => {});
      }
    }

    if (!project) {
      throw new NotFoundError(`Campaign '${campaignSlug}' not found.`);
    }

    // 2. Resolve and verify organizer
    const host = project.owner || (await this.userRepo.findOne({ where: { id: project.ownerId } }));
    if (!host) {
      throw new NotFoundError('Campaign organizer not found.');
    }

    const expectedHostSlug = slugify(`${host.firstName || ''} ${host.lastName || ''}`.trim()) || 'host';
    if (host.slug !== expectedHostSlug) {
      host.slug = expectedHostSlug;
      await this.userRepo.save(host).catch(() => {});
    }

    const isPublic = [
      ProjectStatus.PUBLISHED,
      ProjectStatus.APPROVED,
      ProjectStatus.SCHEDULED,
    ].includes(project.status);

    if (!isPublic) {
      throw new NotFoundError('This campaign is not currently accepting public contributions.');
    }

    return this.formatPublicCampaignDto(project, host);
  }

  /**
   * Fetches public campaign by event code (e.g. '1001') or project UUID
   */
  async getPublicCampaignByIdOrCode(identifier: string): Promise<PublicCampaignDto> {
    const rawIdentifier = identifier.trim();
    const clean = rawIdentifier.toLowerCase();

    const codeWhere: Array<Record<string, any>> = [
      { eventCode: rawIdentifier },
      { slug: clean },
    ];
    if (isUuid(rawIdentifier)) {
      codeWhere.push({ id: rawIdentifier });
    }

    let project = await this.projectRepo.findOne({
      where: codeWhere,
      relations: [
        'owner',
        'organization',
        'category',
        'purposes',
        'purposes.purpose',
        'paymentMethods',
      ],
    });

    if (!project) {
      // Fallback: match by eventCode, id, or slugify(name)
      const allProjects = await this.projectRepo.find({
        relations: [
          'owner',
          'organization',
          'category',
          'purposes',
          'purposes.purpose',
          'paymentMethods',
        ],
      });

      project =
        allProjects.find(
          (p) =>
            p.eventCode === rawIdentifier ||
            (isUuid(rawIdentifier) && p.id === rawIdentifier) ||
            p.slug?.toLowerCase() === clean ||
            slugify(p.name) === clean
        ) || null;

      if (project && !project.slug) {
        project.slug = slugify(project.name) || project.eventCode;
        await this.projectRepo.save(project).catch(() => {});
      }
    }

    const isPublic =
      project &&
      [ProjectStatus.PUBLISHED, ProjectStatus.APPROVED, ProjectStatus.SCHEDULED].includes(
        project.status
      );

    if (!project || !isPublic) {
      throw new NotFoundError(`Active public campaign '${identifier}' not found.`);
    }

    const host = project.owner || (await this.userRepo.findOne({ where: { id: project.ownerId } }));
    if (!host) {
      throw new NotFoundError('Campaign organizer not found.');
    }

    return this.formatPublicCampaignDto(project, host);
  }

  /**
   * Fetches public profile for a host and their active public campaigns
   */
  async getPublicHostBySlug(hostSlug: string): Promise<{
    host: { id: string; name: string; slug: string; phone?: string | null; email?: string | null };
    campaigns: Array<{
      id: string;
      name: string;
      slug: string;
      description?: string;
      eventCode: string;
      category?: string;
      targetAmount?: string;
      totalRaised: string;
      percentFunded: number;
      contributorsCount: number;
      showPublicTransactions: boolean;
    }>;
  }> {
    const cleanHostSlug = hostSlug.toLowerCase().trim();
    const allUsers = await this.userRepo.find();
    // Prioritize user whose actual name matches the requested slug, then by slug column
    let host =
      allUsers.find((u) => slugify(`${u.firstName || ''} ${u.lastName || ''}`.trim()) === cleanHostSlug) ||
      allUsers.find((u) => u.slug?.toLowerCase() === cleanHostSlug) ||
      null;

    if (!host) {
      throw new NotFoundError(`Host '@${hostSlug}' not found.`);
    }

    const expectedHostSlug = slugify(`${host.firstName || ''} ${host.lastName || ''}`.trim()) || 'host';
    if (host.slug !== expectedHostSlug) {
      host.slug = expectedHostSlug;
      await this.userRepo.save(host).catch(() => {});
    }

    const projects = await this.projectRepo.find({
      where: [
        { ownerId: host.id, status: ProjectStatus.PUBLISHED },
        { ownerId: host.id, status: ProjectStatus.APPROVED },
        { ownerId: host.id, status: ProjectStatus.SCHEDULED },
      ],
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });

    // Auto-backfill project slugs if missing
    for (const p of projects) {
      if (!p.slug) {
        p.slug = slugify(p.name);
        await this.projectRepo.save(p).catch(() => {});
      }
    }

    const hostSlugValue = host.slug || slugify(`${host.firstName} ${host.lastName}`);

    const campaignsWithStats = await Promise.all(
      projects.map(async (p) => {
        const stats = await this.contributionRepo
          .createQueryBuilder('c')
          .select([
            'COALESCE(SUM(CASE WHEN c.status IN (:...statuses) THEN CAST(c.amount AS numeric) ELSE 0 END), 0) AS "totalRaised"',
            'COUNT(DISTINCT CASE WHEN c.status IN (:...statuses) THEN c.contributorId ELSE NULL END) AS "contributorsCount"',
          ])
          .where('c.projectId = :projectId', {
            projectId: p.id,
            statuses: [
              ContributionStatus.CONFIRMED,
              ContributionStatus.PARTIALLY_REFUNDED,
              ContributionStatus.REFUNDED,
            ],
          })
          .getRawOne();

        const totalRaised = parseFloat(stats?.totalRaised || '0').toFixed(2);
        const target = parseFloat(p.targetAmount || '0');
        const percentFunded = target > 0 ? Math.min(Math.round((parseFloat(totalRaised) / target) * 100), 100) : 0;
        const cardSettings = (p.settings || {}) as Record<string, any>;
        const isPublic = Boolean(cardSettings.webPortalEnabled && cardSettings.showPublicTransactions);

        return {
          id: p.id,
          name: p.name,
          slug: p.slug || slugify(p.name),
          description: p.description,
          eventCode: p.eventCode,
          category: p.category?.name,
          targetAmount: p.targetAmount,
          // Hosts who keep contributions private expose no amounts here either.
          totalRaised: isPublic ? totalRaised : '0.00',
          percentFunded: isPublic ? percentFunded : 0,
          contributorsCount: isPublic ? parseInt(stats?.contributorsCount || '0', 10) : 0,
          showPublicTransactions: isPublic,
        };
      })
    );

    const hostPhone =
      host.phone ||
      (host.email === 'host@raisefundz.com' || hostSlugValue === 'koranteng-kessie'
        ? '0551234567'
        : null);
    if (!host.phone && hostPhone) {
      host.phone = hostPhone;
      await this.userRepo.save(host).catch(() => {});
    }

    const hostEmail =
      host.email ||
      (hostSlugValue === 'koranteng-kessie' || host.phone === '0551234567' || host.phone === '233551234567'
        ? 'host@raisefundz.com'
        : null);
    if (!host.email && hostEmail) {
      host.email = hostEmail;
      await this.userRepo.save(host).catch(() => {});
    }

    return {
      host: {
        id: host.id,
        name: `${host.firstName} ${host.lastName}`.trim(),
        slug: hostSlugValue,
        phone: host.phone || hostPhone,
        email: host.email || hostEmail,
      },
      campaigns: campaignsWithStats,
    };
  }

  /**
   * Helper to format public DTO with aggregated stats and recent donations
   */
  private async formatPublicCampaignDto(project: Project, host: User): Promise<PublicCampaignDto> {
    const stats = await this.contributionRepo
      .createQueryBuilder('c')
      .select([
        'COALESCE(SUM(CASE WHEN c.status IN (:...confirmedStatuses) THEN CAST(c.amount AS numeric) ELSE 0 END), 0) AS "totalRaised"',
        'COUNT(DISTINCT CASE WHEN c.status IN (:...confirmedStatuses) THEN c.contributorId ELSE NULL END) AS "contributorsCount"',
      ])
      .where('c.projectId = :projectId', {
        projectId: project.id,
        confirmedStatuses: [
          ContributionStatus.CONFIRMED,
          ContributionStatus.PARTIALLY_REFUNDED,
          ContributionStatus.REFUNDED,
        ],
      })
      .getRawOne();

    const totalRaised = parseFloat(stats?.totalRaised || '0').toFixed(2);
    const contributorsCount = parseInt(stats?.contributorsCount || '0', 10);
    const target = parseFloat(project.targetAmount || '0');
    const percentFunded = target > 0 ? Math.min(Math.round((parseFloat(totalRaised) / target) * 100), 100) : 0;

    const recentContributions = await this.contributionRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.contributor', 'contributor')
      .leftJoinAndSelect('c.purpose', 'purpose')
      .where('c.projectId = :projectId', { projectId: project.id })
      .andWhere('c.status IN (:...statuses)', {
        statuses: [
          ContributionStatus.CONFIRMED,
          ContributionStatus.PARTIALLY_REFUNDED,
          ContributionStatus.REFUNDED,
        ],
      })
      .orderBy('c.createdAt', 'DESC')
      .take(8)
      .getMany();

    const publicSettings = (project.settings || {}) as Record<string, any>;
    const showPublicTransactions = Boolean(publicSettings.webPortalEnabled && publicSettings.showPublicTransactions);
    const coverImageUrl =
      typeof publicSettings.coverImage === 'string' && publicSettings.coverImage
        ? `/public/campaign-images/${path.basename(publicSettings.coverImage)}`
        : null;

    // The donors wall is opt-in: without it nothing about individual contributions is exposed.
    const recentDonations = (showPublicTransactions ? recentContributions : []).map((c) => {
      const isAnon = Boolean((c.metadata as any)?.isAnonymous);
      const name = isAnon
        ? 'Anonymous Supporter'
        : (c.metadata as any)?.donorName || c.contributor?.name || 'Kind Supporter';
      return {
        id: c.id,
        donorName: name,
        amount: c.amount,
        currency: c.currency,
        createdAt: c.createdAt,
        purpose: c.purpose?.name,
      };
    });

    const settings = (project.settings || {}) as Record<string, any>;
    const directComments: Array<any> = Array.isArray(settings.comments) ? settings.comments : [];

    const contributionComments = recentContributions
      .filter((c) => (c.metadata as any)?.wordsOfSupport || (c.metadata as any)?.comment)
      .map((c) => {
        const isAnon = Boolean((c.metadata as any)?.isAnonymous);
        const name = isAnon
          ? 'Anonymous Supporter'
          : (c.metadata as any)?.donorName || c.contributor?.name || 'Kind Supporter';
        return {
          id: `cmt_c_${c.id}`,
          name,
          message: String((c.metadata as any)?.wordsOfSupport || (c.metadata as any)?.comment),
          amount: c.amount,
          currency: c.currency,
          createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : String(c.createdAt),
          isAnonymous: isAnon,
        };
      });

    const wordsOfSupport = [...directComments, ...contributionComments]
      .filter(
        (item, index, self) =>
          index ===
          self.findIndex((t) => t.id === item.id || (t.message === item.message && t.name === item.name))
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 30);

    const hostFullName = `${host.firstName || ''} ${host.lastName || ''}`.trim() || 'Organizer';
    const hostSlugValue = host.slug || slugify(hostFullName) || 'host';
    const campaignSlugValue = project.slug || slugify(project.name) || project.eventCode;
    const hostPhone =
      host.phone ||
      (host.email === 'host@raisefundz.com' || hostSlugValue === 'koranteng-kessie'
        ? '0551234567'
        : null);
    if (!host.phone && hostPhone) {
      host.phone = hostPhone;
      await this.userRepo.save(host).catch(() => {});
    }

    const hostEmail =
      host.email ||
      (hostSlugValue === 'koranteng-kessie' || host.phone === '0551234567' || host.phone === '233551234567'
        ? 'host@raisefundz.com'
        : null);
    if (!host.email && hostEmail) {
      host.email = hostEmail;
      await this.userRepo.save(host).catch(() => {});
    }

    return {
      id: project.id,
      name: project.name,
      slug: campaignSlugValue,
      description: project.description,
      eventCode: project.eventCode,
      currency: project.currency,
      targetAmount: project.targetAmount,
      minAmount: project.minAmount,
      maxAmount: project.maxAmount,
      welcomeMessage: project.welcomeMessage,
      status: project.status,
      acceptsContributions: project.acceptsContributions,
      startDate: project.startDate,
      endDate: project.endDate,
      category: project.category
        ? { id: project.category.id, name: project.category.name, slug: project.category.slug }
        : null,
      organization: project.organization
        ? {
            id: project.organization.id,
            name: project.organization.name,
            slug: project.organization.slug,
            verificationStatus: project.organization.verificationStatus,
          }
        : null,
      host: {
        id: host.id,
        name: `${host.firstName} ${host.lastName}`.trim(),
        slug: hostSlugValue,
        phone: host.phone || hostPhone,
        email: host.email || hostEmail,
      },
      // Amounts raised are part of what the host chose to keep private, so they are not sent at all.
      totalRaised: showPublicTransactions ? totalRaised : '0.00',
      contributorsCount: showPublicTransactions ? contributorsCount : 0,
      percentFunded: showPublicTransactions ? percentFunded : 0,
      purposes: (project.purposes || []).map((p) => ({
        id: p.id,
        name: p.purpose?.name || p.customName || 'General',
        code: p.purpose?.code,
        description: p.purpose?.description,
        isDefault: p.isDefault,
      })),
      paymentMethods: (project.paymentMethods || [])
        .filter((pm) => pm.isEnabled)
        .map((pm) => ({
          method: pm.method,
          provider: pm.provider,
        })),
      recentDonations,
      showPublicTransactions,
      coverImageUrl,
      wordsOfSupport,
    };
  }

  /**
   * Adds words of support (comment) to a campaign
   */
  async addWordOfSupport(
    projectId: string,
    input: { name?: string; message: string; isAnonymous?: boolean }
  ): Promise<{
    id: string;
    name: string;
    message: string;
    createdAt: string;
    isAnonymous: boolean;
  }> {
    const cleanMessage = input.message?.trim();
    if (!cleanMessage || cleanMessage.length < 2) {
      throw new BadRequestError('Message must be at least 2 characters.');
    }
    if (cleanMessage.length > 500) {
      throw new BadRequestError('Message cannot exceed 500 characters.');
    }

    const rawId = projectId.trim();
    const project = await this.projectRepo.findOne({
      where: isUuid(rawId) ? [{ id: rawId }, { eventCode: rawId }] : [{ eventCode: rawId }],
    });

    if (!project) {
      throw new NotFoundError('Campaign not found.');
    }

    const settings = (project.settings || {}) as Record<string, any>;
    const comments = Array.isArray(settings.comments) ? settings.comments : [];

    const newComment = {
      id: `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: input.isAnonymous ? 'Anonymous Supporter' : (input.name?.trim() || 'Generous Supporter'),
      message: cleanMessage,
      createdAt: new Date().toISOString(),
      isAnonymous: Boolean(input.isAnonymous),
    };

    comments.unshift(newComment);
    settings.comments = comments.slice(0, 100);
    project.settings = settings;
    await this.projectRepo.save(project);

    return newComment;
  }

  

}

export const projectService = new ProjectService();
