import { AppDataSource } from '../config/database';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../common/errors/app-error';
import { SystemRole } from '../common/types/auth';
import { auditService } from './audit.service';
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
  CreateProjectInput,
  UpdateProjectInput,
  UpdateProjectStatusInput,
} from '../schemas/project.schemas';

export class ProjectService {
  private get projectRepo() { return AppDataSource.getRepository(Project); }
  private get categoryRepo() { return AppDataSource.getRepository(ProjectCategory); }
  private get memberRepo() { return AppDataSource.getRepository(ProjectMember); }
  private get projectPurposeRepo() { return AppDataSource.getRepository(ProjectContributionPurpose); }
  private get purposeRepo() { return AppDataSource.getRepository(ContributionPurpose); }
  private get paymentMethodRepo() { return AppDataSource.getRepository(ProjectPaymentMethod); }
  private get contributionRepo() { return AppDataSource.getRepository(Contribution); }
  private get settingRepo() { return AppDataSource.getRepository(ProjectSetting); }

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

  async createProject(input: CreateProjectInput, ownerId: string): Promise<Project> {
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

    const project = this.projectRepo.create({
      name: input.name,
      description: input.description,
      organizationId: input.organizationId,
      ownerId,
      categoryId: input.categoryId,
      eventCode,
      currency: input.currency || 'GHS',
      targetAmount: input.targetAmount,
      minAmount: input.minAmount || '1.00',
      maxAmount: input.maxAmount || '10000.00',
      welcomeMessage: input.welcomeMessage,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: input.endDate ? new Date(input.endDate) : undefined,
      acceptsContributions: input.acceptsContributions,
      status: ProjectStatus.DRAFT,
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

    // Initialize default Mobile Money payment method
    await this.paymentMethodRepo.save(
      this.paymentMethodRepo.create({
        projectId: savedProject.id,
        method: PaymentMethodType.MOBILE_MONEY,
        provider: 'PAYSTACK',
        isEnabled: true,
      })
    );

    await auditService.log({
      userId: ownerId,
      organizationId: savedProject.organizationId,
      entityType: 'PROJECT',
      entityId: savedProject.id,
      action: 'CREATE_PROJECT',
      newValues: { name: savedProject.name, eventCode: savedProject.eventCode },
    });

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
  }): Promise<{ projects: Project[]; total: number }> {
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

    return { projects: projectsWithStats, total };
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
    return this.projectRepo.findOne({
      where: { eventCode, status: ProjectStatus.PUBLISHED, acceptsContributions: true },
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
    const targetStatus = input.status;

    // Validate state transition
    const validTransitions: Record<ProjectStatus, ProjectStatus[]> = {
      [ProjectStatus.DRAFT]: [ProjectStatus.PENDING_REVIEW, ProjectStatus.ARCHIVED],
      [ProjectStatus.PENDING_REVIEW]: [ProjectStatus.APPROVED, ProjectStatus.DRAFT],
      [ProjectStatus.APPROVED]: [ProjectStatus.PUBLISHED, ProjectStatus.DRAFT],
      [ProjectStatus.PUBLISHED]: [ProjectStatus.SUSPENDED, ProjectStatus.COMPLETED],
      [ProjectStatus.SUSPENDED]: [
        ProjectStatus.PUBLISHED,
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
      const allowed = validTransitions[currentStatus] || [];
      if (!allowed.includes(targetStatus)) {
        throw new BadRequestError(
          `Invalid state transition from '${currentStatus}' to '${targetStatus}'.`
        );
      }
    }

    project.status = targetStatus;
    const saved = await this.projectRepo.save(project);

    await auditService.log({
      userId,
      organizationId: project.organizationId,
      entityType: 'PROJECT',
      entityId: project.id,
      action: 'UPDATE_PROJECT_STATUS',
      oldValues: { status: currentStatus },
      newValues: { status: targetStatus, notes: input.notes },
    });

    return saved;
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

  

}

export const projectService = new ProjectService();
