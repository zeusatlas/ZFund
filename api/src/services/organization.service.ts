import { AppDataSource } from '../config/database';
import { ConflictError, ForbiddenError, NotFoundError } from '../common/errors/app-error';
import { SystemRole } from '../common/types/auth';
import { auditService } from './audit.service';
import { User } from '../database/entities/user.entity';
import {
  OrganizationMember,
  OrgMemberRole,
} from '../database/entities/organization-member.entity';
import {
  Organization,
  OrgVerificationStatus,
} from '../database/entities/organization.entity';
import {
  AddMemberInput,
  CreateOrgInput,
  UpdateOrgInput,
  VerifyOrgInput,
} from '../schemas/organization.schemas';

export class OrganizationService {
  private get orgRepo() { return AppDataSource.getRepository(Organization); }
  private get memberRepo() { return AppDataSource.getRepository(OrganizationMember); }
  private get userRepo() { return AppDataSource.getRepository(User); }

  async createOrganization(input: CreateOrgInput, creatorId: string): Promise<Organization> {
    const slug =
      input.slug ||
      input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const existingSlug = await this.orgRepo.findOne({ where: { slug } });
    if (existingSlug) {
      throw new ConflictError(`Organization slug '${slug}' is already taken`);
    }

    const org = this.orgRepo.create({
      name: input.name,
      slug,
      description: input.description,
      registrationNumber: input.registrationNumber,
      taxNumber: input.taxNumber,
      contactEmail: input.contactEmail,
      contactPhone: input.contactPhone,
      address: input.address,
      verificationStatus: OrgVerificationStatus.PENDING,
    });

    const savedOrg = await this.orgRepo.save(org);

    // Creator becomes initial Org Administrator
    await this.memberRepo.save(
      this.memberRepo.create({
        organizationId: savedOrg.id,
        userId: creatorId,
        role: OrgMemberRole.ORG_ADMIN,
        isActive: true,
      })
    );

    await auditService.log({
      userId: creatorId,
      organizationId: savedOrg.id,
      entityType: 'ORGANIZATION',
      entityId: savedOrg.id,
      action: 'CREATE_ORGANIZATION',
      newValues: { name: savedOrg.name, slug: savedOrg.slug },
    });

    return savedOrg;
  }

  async getOrganizations(params: {
    userId?: string;
    userRole?: string;
    page?: number;
    limit?: number;
    verificationStatus?: OrgVerificationStatus;
    search?: string;
  }): Promise<{ organizations: Organization[]; total: number }> {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const query = this.orgRepo
      .createQueryBuilder('org')
      .leftJoinAndSelect('org.members', 'member')
      .leftJoinAndSelect('member.user', 'memberUser');

    // Super Admin, Platform Admin, Verification Officer, Auditor can view all orgs
    const isPlatformStaff = [
      SystemRole.SUPER_ADMIN,
      SystemRole.PLATFORM_ADMIN,
      SystemRole.VERIFICATION_OFFICER,
      SystemRole.AUDITOR,
    ].includes(params.userRole as SystemRole);

    if (!isPlatformStaff && params.userId) {
      // Regular account owner can only view organizations they are a member of
      query.innerJoin(
        'organization_members',
        'myMember',
        'myMember.organizationId = org.id AND myMember.userId = :userId AND myMember.isActive = true',
        { userId: params.userId }
      );
    }

    if (params.verificationStatus) {
      query.andWhere('org.verificationStatus = :status', { status: params.verificationStatus });
    }

    if (params.search) {
      query.andWhere('(LOWER(org.name) LIKE :search OR LOWER(org.slug) LIKE :search)', {
        search: `%${params.search.toLowerCase()}%`,
      });
    }

    query.orderBy('org.createdAt', 'DESC').skip(skip).take(limit);

    const [organizations, total] = await query.getManyAndCount();
    return { organizations, total };
  }

  async getOrganizationById(id: string, userId?: string, userRole?: string): Promise<Organization> {
    const org = await this.orgRepo.findOne({
      where: { id },
      relations: ['members', 'members.user', 'projects'],
    });

    if (!org) {
      throw new NotFoundError('Organization not found');
    }

    const isPlatformStaff = [
      SystemRole.SUPER_ADMIN,
      SystemRole.PLATFORM_ADMIN,
      SystemRole.VERIFICATION_OFFICER,
      SystemRole.AUDITOR,
    ].includes(userRole as SystemRole);

    if (!isPlatformStaff && userId) {
      const isMember = org.members.some((m) => m.userId === userId && m.isActive);
      if (!isMember) {
        throw new ForbiddenError('You do not have access to this organization');
      }
    }

    return org;
  }

  async updateOrganization(
    id: string,
    input: UpdateOrgInput,
    userId: string,
    userRole: string
  ): Promise<Organization> {
    const org = await this.getOrganizationById(id, userId, userRole);

    // Only platform admin or Org Admin can update org details
    if (userRole !== SystemRole.SUPER_ADMIN && userRole !== SystemRole.PLATFORM_ADMIN) {
      const member = await this.memberRepo.findOne({
        where: { organizationId: id, userId, isActive: true },
      });
      if (!member || member.role !== OrgMemberRole.ORG_ADMIN) {
        throw new ForbiddenError('Only Organization Administrators can update organization details');
      }
    }

    const oldValues = { name: org.name, description: org.description, address: org.address };
    Object.assign(org, input);

    const saved = await this.orgRepo.save(org);

    await auditService.log({
      userId,
      organizationId: org.id,
      entityType: 'ORGANIZATION',
      entityId: org.id,
      action: 'UPDATE_ORGANIZATION',
      oldValues,
      newValues: input,
    });

    return saved;
  }

  async verifyOrganization(id: string, input: VerifyOrgInput, officerId: string): Promise<Organization> {
    const org = await this.orgRepo.findOne({ where: { id } });
    if (!org) {
      throw new NotFoundError('Organization not found');
    }

    const oldStatus = org.verificationStatus;
    org.verificationStatus = input.status;
    if (input.status === OrgVerificationStatus.VERIFIED) {
      org.verifiedAt = new Date();
    } else {
      org.verifiedAt = undefined;
    }

    const saved = await this.orgRepo.save(org);

    await auditService.log({
      userId: officerId,
      organizationId: org.id,
      entityType: 'ORGANIZATION',
      entityId: org.id,
      action: 'VERIFY_ORGANIZATION',
      oldValues: { verificationStatus: oldStatus },
      newValues: { verificationStatus: input.status },
    });

    return saved;
  }

  async addMember(
    orgId: string,
    input: AddMemberInput,
    actorId: string,
    actorRole: string
  ): Promise<OrganizationMember> {
    await this.getOrganizationById(orgId, actorId, actorRole);

    const userToAdd = await this.userRepo.findOne({ where: { id: input.userId } });
    if (!userToAdd) {
      throw new NotFoundError('User to add not found');
    }

    const existingMember = await this.memberRepo.findOne({
      where: { organizationId: orgId, userId: input.userId },
    });

    if (existingMember) {
      if (existingMember.isActive) {
        throw new ConflictError('User is already an active member of this organization');
      }
      existingMember.isActive = true;
      existingMember.role = input.role;
      return await this.memberRepo.save(existingMember);
    }

    const member = this.memberRepo.create({
      organizationId: orgId,
      userId: input.userId,
      role: input.role,
      isActive: true,
    });

    const saved = await this.memberRepo.save(member);

    await auditService.log({
      userId: actorId,
      organizationId: orgId,
      entityType: 'ORGANIZATION_MEMBER',
      entityId: saved.id,
      action: 'ADD_MEMBER',
      newValues: { userId: input.userId, role: input.role },
    });

    return saved;
  }

  async removeMember(
    orgId: string,
    memberUserId: string,
    actorId: string,
    actorRole: string
  ): Promise<void> {
    await this.getOrganizationById(orgId, actorId, actorRole);

    const member = await this.memberRepo.findOne({
      where: { organizationId: orgId, userId: memberUserId },
    });

    if (!member) {
      throw new NotFoundError('Member not found in organization');
    }

    member.isActive = false;
    await this.memberRepo.save(member);

    await auditService.log({
      userId: actorId,
      organizationId: orgId,
      entityType: 'ORGANIZATION_MEMBER',
      entityId: member.id,
      action: 'REMOVE_MEMBER',
      oldValues: { userId: memberUserId, role: member.role },
    });
  }
}

export const organizationService = new OrganizationService();
