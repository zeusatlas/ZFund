import { In } from 'typeorm';
import { AppDataSource } from '../config/database';
import { BadRequestError, ForbiddenError, NotFoundError } from '../common/errors/app-error';
import { CryptoUtil } from '../common/utils/crypto';
import { MoneyUtil } from '../common/utils/decimal';
import { SystemRole } from '../common/types/auth';
import { Contribution, ContributionStatus } from '../database/entities/contribution.entity';
import { Project } from '../database/entities/project.entity';
import { User } from '../database/entities/user.entity';
import {
  WithdrawalMethod,
  WithdrawalRequest,
  WithdrawalStatus,
} from '../database/entities/withdrawal-request.entity';
import { CreateWithdrawalInput, UpdateWithdrawalInput } from '../schemas/withdrawal.schemas';
import { auditService } from './audit.service';

const COLLECTED = [
  ContributionStatus.CONFIRMED,
  ContributionStatus.PARTIALLY_REFUNDED,
  ContributionStatus.REFUNDED,
];

/** Statuses whose amount can no longer be withdrawn again. */
const RESERVED = [WithdrawalStatus.PENDING, WithdrawalStatus.PROCESSING, WithdrawalStatus.DONE];

/** Allowed moves once a request has been created. DONE and REJECTED are final. */
const TRANSITIONS: Record<WithdrawalStatus, WithdrawalStatus[]> = {
  [WithdrawalStatus.PENDING]: [WithdrawalStatus.PROCESSING, WithdrawalStatus.DONE, WithdrawalStatus.REJECTED],
  [WithdrawalStatus.PROCESSING]: [WithdrawalStatus.DONE, WithdrawalStatus.REJECTED],
  [WithdrawalStatus.DONE]: [],
  [WithdrawalStatus.REJECTED]: [],
};

export interface WithdrawalView {
  id: string;
  reference: string;
  hostId: string;
  hostName: string;
  hostEmail: string;
  projectId?: string;
  projectName: string | null;
  amount: string;
  currency: string;
  method: WithdrawalMethod;
  recipientName: string;
  institution: string;
  accountNumber: string;
  purpose: string;
  status: WithdrawalStatus;
  reviewNote?: string;
  reviewedByName: string | null;
  reviewedAt?: Date;
  createdAt: Date;
}

export interface WithdrawalCounts {
  total: number;
  pending: number;
  processing: number;
  done: number;
  rejected: number;
  /** Amount still to be attended to (pending + processing). */
  outstanding: string;
  /** Amount already paid out. */
  paidOut: string;
}

export interface WithdrawalBalanceSummary {
  raised: string;
  commission: string;
  netRaised: string;
  reserved: string;
  paid: string;
  available: string;
}

export class WithdrawalService {
  private get repo() { return AppDataSource.getRepository(WithdrawalRequest); }
  private get userRepo() { return AppDataSource.getRepository(User); }
  private get projectRepo() { return AppDataSource.getRepository(Project); }
  private get contributionRepo() { return AppDataSource.getRepository(Contribution); }

  /** Collected funds minus everything already requested, for a host (optionally one project). */
  async getAvailable(hostId?: string, projectId?: string): Promise<WithdrawalBalanceSummary> {
    const projectsQuery = this.projectRepo.createQueryBuilder('p');
    if (projectId) {
      projectsQuery.andWhere('p.id = :projectId', { projectId });
    }
    if (hostId) {
      const user = await this.userRepo.findOne({ where: { id: hostId } });
      const isPlatformStaff =
        user &&
        [SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN, SystemRole.AUDITOR].includes(user.role);
      if (!isPlatformStaff) {
        projectsQuery
          .leftJoin('project_members', 'pm', 'pm.projectId = p.id AND pm.userId = :hostId', { hostId })
          .andWhere('(p.ownerId = :hostId OR pm.id IS NOT NULL)', { hostId });
      }
    }
    const projects = await projectsQuery.select(['p.id']).getMany();
    let raised = '0.00';
    if (projects.length > 0) {
      const contributions = await this.contributionRepo
        .createQueryBuilder('c')
        .where('c.projectId IN (:...ids)', { ids: projects.map((p) => p.id) })
        .andWhere('c.status IN (:...statuses)', { statuses: COLLECTED })
        .getMany();
      raised = contributions.reduce((t, c) => MoneyUtil.add(t, c.amount), '0.00');
    }

    const reqQuery = this.repo.createQueryBuilder('w');
    if (projectId) {
      reqQuery.andWhere('w.projectId = :projectId', { projectId });
    }
    if (hostId) {
      const user = await this.userRepo.findOne({ where: { id: hostId } });
      const isPlatformStaff =
        user &&
        [SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN, SystemRole.AUDITOR].includes(user.role);
      if (!isPlatformStaff) {
        reqQuery.andWhere('w.hostId = :hostId', { hostId });
      }
    }

    const allRequests = await reqQuery.getMany();
    const reservedRequests = allRequests.filter((r) =>
      [WithdrawalStatus.PENDING, WithdrawalStatus.PROCESSING].includes(r.status)
    );
    const paidRequests = allRequests.filter((r) => r.status === WithdrawalStatus.DONE);

    const reserved = reservedRequests.reduce((t, r) => MoneyUtil.add(t, r.amount), '0.00');
    const paid = paidRequests.reduce((t, r) => MoneyUtil.add(t, r.amount), '0.00');
    const totalDeducted = MoneyUtil.add(reserved, paid);

    // 14% platform commission on collected contributions
    const commission = MoneyUtil.multiply(raised, '0.14');
    const netRaised = MoneyUtil.subtract(raised, commission);
    const left = MoneyUtil.subtract(netRaised, totalDeducted);
    const available = MoneyUtil.isPositive(left) ? left : '0.00';

    return { raised, commission, netRaised, reserved, paid, available };
  }

  async create(hostId: string, input: CreateWithdrawalInput): Promise<WithdrawalRequest> {
    if (!MoneyUtil.isPositive(input.amount)) {
      throw new BadRequestError('Withdrawal amount must be greater than zero');
    }

    if (input.projectId) {
      const project = await this.projectRepo.findOne({ where: { id: input.projectId } });
      if (!project) throw new NotFoundError('Campaign not found');
      const user = await this.userRepo.findOne({ where: { id: hostId } });
      const isStaff =
        user && [SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN].includes(user.role);
      if (project.ownerId && project.ownerId !== hostId && !isStaff) {
        throw new ForbiddenError('You can only withdraw from your own campaigns');
      }
    }

    const { available } = await this.getAvailable(hostId, input.projectId);
    if (MoneyUtil.compare(input.amount, available) > 0) {
      throw new BadRequestError(`Requested amount exceeds the available balance of GHS ${available}`);
    }

    const saved = await this.repo.save(
      this.repo.create({
        reference: CryptoUtil.generateReference('ZF-WDR'),
        hostId,
        projectId: input.projectId,
        amount: input.amount,
        method: input.method,
        recipientName: input.recipientName,
        institution: input.institution,
        accountNumber: input.accountNumber,
        purpose: input.purpose,
        status: WithdrawalStatus.PENDING,
      })
    );

    await auditService.log({
      userId: hostId,
      entityType: 'WITHDRAWAL',
      entityId: saved.id,
      action: 'WITHDRAWAL_REQUESTED',
      newValues: { reference: saved.reference, amount: saved.amount },
    });

    return saved;
  }

  async getById(id: string): Promise<WithdrawalView> {
    const request = await this.repo.findOne({
      where: [{ id }, { reference: id }],
    });
    if (!request) throw new NotFoundError('Withdrawal request not found');
    const views = await this.toViews([request]);
    return views[0];
  }

  async update(id: string, input: UpdateWithdrawalInput, hostId?: string): Promise<WithdrawalView> {
    const request = await this.repo.findOne({ where: [{ id }, { reference: id }] });
    if (!request) throw new NotFoundError('Withdrawal request not found');

    if (request.status !== WithdrawalStatus.PENDING) {
      throw new BadRequestError('Only pending withdrawal requests can be modified');
    }

    if (hostId && request.hostId !== hostId) {
      const user = await this.userRepo.findOne({ where: { id: hostId } });
      const isStaff =
        user && [SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN].includes(user.role);
      if (!isStaff) throw new ForbiddenError('You can only modify your own withdrawal requests');
    }

    if (input.amount && MoneyUtil.compare(input.amount, request.amount) !== 0) {
      if (!MoneyUtil.isPositive(input.amount)) {
        throw new BadRequestError('Withdrawal amount must be greater than zero');
      }
      const { available } = await this.getAvailable(request.hostId, request.projectId);
      const effectiveAvailable = MoneyUtil.add(available, request.amount);
      if (MoneyUtil.compare(input.amount, effectiveAvailable) > 0) {
        throw new BadRequestError(`Requested amount exceeds available balance of GHS ${effectiveAvailable}`);
      }
      request.amount = input.amount;
    }

    if (input.method) request.method = input.method;
    if (input.recipientName) request.recipientName = input.recipientName;
    if (input.institution) request.institution = input.institution;
    if (input.accountNumber) request.accountNumber = input.accountNumber;
    if (input.purpose) request.purpose = input.purpose;

    await this.repo.save(request);

    if (hostId) {
      await auditService.log({
        userId: hostId,
        entityType: 'WITHDRAWAL',
        entityId: request.id,
        action: 'WITHDRAWAL_UPDATED',
        newValues: { reference: request.reference, amount: request.amount },
      });
    }

    return (await this.toViews([request]))[0];
  }

  async delete(id: string, hostId?: string): Promise<void> {
    const request = await this.repo.findOne({ where: [{ id }, { reference: id }] });
    if (!request) throw new NotFoundError('Withdrawal request not found');

    if (request.status !== WithdrawalStatus.PENDING) {
      throw new BadRequestError('Only pending withdrawal requests can be cancelled');
    }

    if (hostId && request.hostId !== hostId) {
      const user = await this.userRepo.findOne({ where: { id: hostId } });
      const isStaff =
        user && [SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN].includes(user.role);
      if (!isStaff) throw new ForbiddenError('You can only cancel your own withdrawal requests');
    }

    await this.repo.remove(request);

    if (hostId) {
      await auditService.log({
        userId: hostId,
        entityType: 'WITHDRAWAL',
        entityId: id,
        action: 'WITHDRAWAL_CANCELLED',
        oldValues: { reference: request.reference, amount: request.amount },
      });
    }
  }

  private async toViews(rows: WithdrawalRequest[]): Promise<WithdrawalView[]> {
    if (rows.length === 0) return [];
    const userIds = [
      ...new Set(rows.flatMap((r) => [r.hostId, r.reviewedById]).filter((id): id is string => !!id)),
    ];
    const users = await this.userRepo.find({ where: { id: In(userIds) } });
    const byId = new Map(users.map((u) => [u.id, u]));

    const projectIds = [
      ...new Set(rows.map((r) => r.projectId).filter((id): id is string => !!id)),
    ];
    const projects = projectIds.length
      ? await this.projectRepo.find({ where: { id: In(projectIds) } })
      : [];
    const projectNames = new Map(projects.map((p) => [p.id, p.name]));

    const fullName = (u?: User) => (u ? `${u.firstName} ${u.lastName}`.trim() : null);

    return rows.map((r) => ({
      id: r.id,
      reference: r.reference,
      hostId: r.hostId,
      hostName: fullName(byId.get(r.hostId)) ?? 'Unknown host',
      hostEmail: byId.get(r.hostId)?.email ?? '',
      projectId: r.projectId,
      projectName: r.projectId ? (projectNames.get(r.projectId) ?? null) : null,
      amount: r.amount,
      currency: r.currency,
      method: r.method,
      recipientName: r.recipientName,
      institution: r.institution,
      accountNumber: r.accountNumber,
      purpose: r.purpose,
      status: r.status,
      reviewNote: r.reviewNote,
      reviewedByName: r.reviewedById ? fullName(byId.get(r.reviewedById)) : null,
      reviewedAt: r.reviewedAt,
      createdAt: r.createdAt,
    }));
  }

  async list(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: WithdrawalStatus;
    hostId?: string;
    projectId?: string;
  }): Promise<{ items: WithdrawalView[]; total: number; balance: WithdrawalBalanceSummary }> {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 10, 100);

    const query = this.repo
      .createQueryBuilder('w')
      .leftJoin('w.host', 'host')
      .leftJoin('w.project', 'project');

    if (params.hostId) {
      const user = await this.userRepo.findOne({ where: { id: params.hostId } });
      const isPlatformStaff =
        user &&
        [SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN, SystemRole.AUDITOR].includes(user.role);
      if (!isPlatformStaff) {
        query.andWhere('w.hostId = :hostId', { hostId: params.hostId });
      }
    }
    if (params.projectId && params.projectId !== 'All') {
      query.andWhere('w.projectId = :projectId', { projectId: params.projectId });
    }
    if (params.status) {
      query.andWhere('w.status = :status', { status: params.status });
    }
    if (params.search) {
      query.andWhere(
        '(LOWER(w.reference) LIKE :s OR LOWER(w.recipientName) LIKE :s OR LOWER(w.accountNumber) LIKE :s OR LOWER(host.firstName) LIKE :s OR LOWER(host.lastName) LIKE :s OR LOWER(project.name) LIKE :s)',
        { s: `%${params.search.toLowerCase()}%` }
      );
    }
    query
      .orderBy('w.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [rows, total] = await query.getManyAndCount();
    const balance = await this.getAvailable(params.hostId, params.projectId !== 'All' ? params.projectId : undefined);

    return { items: await this.toViews(rows), total, balance };
  }

  async getCounts(): Promise<WithdrawalCounts> {
    const all = await this.repo.find({ select: ['id', 'amount', 'status'] });
    const sum = (statuses: WithdrawalStatus[]) =>
      all.filter((r) => statuses.includes(r.status)).reduce((t, r) => MoneyUtil.add(t, r.amount), '0.00');
    const count = (status: WithdrawalStatus) => all.filter((r) => r.status === status).length;

    return {
      total: all.length,
      pending: count(WithdrawalStatus.PENDING),
      processing: count(WithdrawalStatus.PROCESSING),
      done: count(WithdrawalStatus.DONE),
      rejected: count(WithdrawalStatus.REJECTED),
      outstanding: sum([WithdrawalStatus.PENDING, WithdrawalStatus.PROCESSING]),
      paidOut: sum([WithdrawalStatus.DONE]),
    };
  }

  async updateStatus(
    id: string,
    status: WithdrawalStatus,
    note: string | undefined,
    actorId: string
  ): Promise<WithdrawalView> {
    const request = await this.repo.findOne({ where: [{ id }, { reference: id }] });
    if (!request) throw new NotFoundError('Withdrawal request not found');

    if (!TRANSITIONS[request.status].includes(status)) {
      throw new BadRequestError(
        `A ${request.status.toLowerCase()} request cannot be moved to ${status.toLowerCase()}`
      );
    }

    const previous = request.status;
    request.status = status;
    request.reviewedById = actorId;
    request.reviewedAt = new Date();
    if (note) request.reviewNote = note;
    await this.repo.save(request);

    await auditService.log({
      userId: actorId,
      entityType: 'WITHDRAWAL',
      entityId: request.id,
      action: 'WITHDRAWAL_STATUS_CHANGED',
      oldValues: { status: previous },
      newValues: { status, reference: request.reference, amount: request.amount },
    });

    return (await this.toViews([request]))[0];
  }
}

export const withdrawalService = new WithdrawalService();
