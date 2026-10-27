import { In } from 'typeorm';
import { AppDataSource } from '../config/database';
import { BadRequestError, ForbiddenError, NotFoundError } from '../common/errors/app-error';
import { CryptoUtil } from '../common/utils/crypto';
import { MoneyUtil } from '../common/utils/decimal';
import { Contribution, ContributionStatus } from '../database/entities/contribution.entity';
import { Project } from '../database/entities/project.entity';
import { User } from '../database/entities/user.entity';
import {
  WithdrawalMethod,
  WithdrawalRequest,
  WithdrawalStatus,
} from '../database/entities/withdrawal-request.entity';
import { CreateWithdrawalInput } from '../schemas/withdrawal.schemas';
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

export class WithdrawalService {
  private get repo() { return AppDataSource.getRepository(WithdrawalRequest); }
  private get userRepo() { return AppDataSource.getRepository(User); }
  private get projectRepo() { return AppDataSource.getRepository(Project); }
  private get contributionRepo() { return AppDataSource.getRepository(Contribution); }

  /** Collected funds minus everything already requested, for a host (optionally one project). */
  async getAvailable(hostId: string, projectId?: string): Promise<{ raised: string; reserved: string; available: string }> {
    const projects = await this.projectRepo.find({
      where: projectId ? { id: projectId, ownerId: hostId } : { ownerId: hostId },
      select: ['id'],
    });
    let raised = '0.00';
    if (projects.length > 0) {
      const contributions = await this.contributionRepo
        .createQueryBuilder('c')
        .where('c.projectId IN (:...ids)', { ids: projects.map((p) => p.id) })
        .andWhere('c.status IN (:...statuses)', { statuses: COLLECTED })
        .getMany();
      raised = contributions.reduce((t, c) => MoneyUtil.add(t, c.amount), '0.00');
    }

    const requests = await this.repo.find({
      where: { hostId, status: In(RESERVED), ...(projectId ? { projectId } : {}) },
    });
    const reserved = requests.reduce((t, r) => MoneyUtil.add(t, r.amount), '0.00');
    const left = MoneyUtil.subtract(raised, reserved);
    return { raised, reserved, available: MoneyUtil.isPositive(left) ? left : '0.00' };
  }

  async create(hostId: string, input: CreateWithdrawalInput): Promise<WithdrawalRequest> {
    if (!MoneyUtil.isPositive(input.amount)) {
      throw new BadRequestError('Withdrawal amount must be greater than zero');
    }

    if (input.projectId) {
      const project = await this.projectRepo.findOne({ where: { id: input.projectId } });
      if (!project) throw new NotFoundError('Campaign not found');
      if (project.ownerId !== hostId) throw new ForbiddenError('You can only withdraw from your own campaigns');
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

  private async toViews(rows: WithdrawalRequest[]): Promise<WithdrawalView[]> {
    if (rows.length === 0) return [];
    const userIds = [...new Set(rows.flatMap((r) => [r.hostId, r.reviewedById]).filter((id): id is string => !!id))];
    const users = await this.userRepo.find({ where: { id: In(userIds) } });
    const byId = new Map(users.map((u) => [u.id, u]));

    const projectIds = [...new Set(rows.map((r) => r.projectId).filter((id): id is string => !!id))];
    const projects = projectIds.length ? await this.projectRepo.find({ where: { id: In(projectIds) } }) : [];
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
  }): Promise<{ items: WithdrawalView[]; total: number }> {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 10, 100);

    const query = this.repo.createQueryBuilder('w').leftJoin('w.host', 'host');
    if (params.hostId) query.andWhere('w.hostId = :hostId', { hostId: params.hostId });
    if (params.status) query.andWhere('w.status = :status', { status: params.status });
    if (params.search) {
      query.andWhere(
        '(LOWER(w.reference) LIKE :s OR LOWER(w.recipientName) LIKE :s OR LOWER(host.firstName) LIKE :s OR LOWER(host.lastName) LIKE :s)',
        { s: `%${params.search.toLowerCase()}%` }
      );
    }
    query
      .orderBy('w.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [rows, total] = await query.getManyAndCount();
    return { items: await this.toViews(rows), total };
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

  async updateStatus(id: string, status: WithdrawalStatus, note: string | undefined, actorId: string): Promise<WithdrawalView> {
    const request = await this.repo.findOne({ where: { id } });
    if (!request) throw new NotFoundError('Withdrawal request not found');

    if (!TRANSITIONS[request.status].includes(status)) {
      throw new BadRequestError(`A ${request.status.toLowerCase()} request cannot be moved to ${status.toLowerCase()}`);
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
