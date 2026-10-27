import { In } from 'typeorm';
import { AppDataSource } from '../config/database';
import { NotFoundError } from '../common/errors/app-error';
import { SystemRole } from '../common/types/auth';
import { MoneyUtil } from '../common/utils/decimal';
import { AuditLog } from '../database/entities/audit-log.entity';
import { Contribution, ContributionStatus } from '../database/entities/contribution.entity';
import { Organization, OrgVerificationStatus } from '../database/entities/organization.entity';
import { Project, ProjectStatus } from '../database/entities/project.entity';
import { User, UserStatus } from '../database/entities/user.entity';

const COLLECTED_STATUSES = [
  ContributionStatus.CONFIRMED,
  ContributionStatus.PARTIALLY_REFUNDED,
  ContributionStatus.REFUNDED,
];

export type TrendPeriod = '12m' | '30d';

export interface DashboardOverview {
  currency: string;
  fundsGenerated: { value: string; changePct: number | null };
  activeHosts: { value: number; newThisMonth: number };
  pendingRequests: { value: number; pendingHosts: number; pendingOrganizations: number };
  transactions: { value: number; changePct: number | null };
}

export interface FundTrend {
  period: TrendPeriod;
  buckets: Array<{ key: string; label: string; amount: string }>;
  average: string;
  current: string;
}

export interface HostSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: UserStatus;
  fundsIssued: string;
  lastActiveAt: Date | null;
  createdAt: Date;
}

export interface Page<T> {
  items: T[];
  total: number;
}

export interface HostList extends Page<HostSummary> {
  counts: { total: number; active: number; pending: number; suspended: number; fundsIssued: string };
}

export interface FundSummary {
  id: string;
  name: string;
  eventCode: string;
  status: ProjectStatus;
  hostId: string;
  hostName: string;
  raised: string;
  targetAmount?: string;
  transactions: number;
  createdAt: Date;
}

export interface TransactionSummary {
  id: string;
  reference: string;
  amount: string;
  status: ContributionStatus;
  projectId: string;
  projectName: string;
  hostName: string;
  contributorName: string | null;
  createdAt: Date;
}

export interface FundCounts {
  total: number;
  published: number;
  draft: number;
  suspended: number;
  raised: string;
}

export interface TransactionCounts {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  refunded: number;
  processed: string;
}

export interface FundDetail extends FundSummary {
  description?: string;
  currency: string;
  startDate?: Date;
  endDate?: Date;
  /** Distinct people with a collected contribution. */
  contributors: number;
  averageAmount: string;
}

export interface ContributionRow {
  id: string;
  reference: string;
  contributorName: string | null;
  msisdn: string | null;
  amount: string;
  status: ContributionStatus;
  purposeName: string | null;
  createdAt: Date;
}

export interface HostDetail {
  host: HostSummary;
  stats: { totalFunds: string; fundsThisMonth: string; transactions: number };
  funds: FundSummary[];
}

export interface ActivityEntry {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  actorName: string | null;
  amount?: string;
  createdAt: Date;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function startOfMonth(d: Date, offsetMonths = 0): Date {
  return new Date(d.getFullYear(), d.getMonth() + offsetMonths, 1);
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export class AdminDashboardService {
  private get contributionRepo() { return AppDataSource.getRepository(Contribution); }
  private get userRepo() { return AppDataSource.getRepository(User); }
  private get orgRepo() { return AppDataSource.getRepository(Organization); }
  private get projectRepo() { return AppDataSource.getRepository(Project); }
  private get auditRepo() { return AppDataSource.getRepository(AuditLog); }

  private async collectedBetween(from?: Date, to?: Date): Promise<Contribution[]> {
    const query = this.contributionRepo
      .createQueryBuilder('c')
      .where('c.status IN (:...statuses)', { statuses: COLLECTED_STATUSES });
    if (from) query.andWhere('c.createdAt >= :from', { from });
    if (to) query.andWhere('c.createdAt < :to', { to });
    return query.getMany();
  }

  private sum(contributions: Contribution[]): string {
    return contributions.reduce((total, c) => MoneyUtil.add(total, c.amount), '0.00');
  }

  async getOverview(): Promise<DashboardOverview> {
    const now = new Date();
    const thisMonth = startOfMonth(now);
    const lastMonth = startOfMonth(now, -1);

    const [all, current, previous] = await Promise.all([
      this.collectedBetween(),
      this.collectedBetween(thisMonth),
      this.collectedBetween(lastMonth, thisMonth),
    ]);

    const [activeHosts, newHosts, pendingHosts, pendingOrganizations] = await Promise.all([
      this.userRepo.count({ where: { role: SystemRole.ACCOUNT_OWNER, status: UserStatus.ACTIVE } }),
      this.userRepo
        .createQueryBuilder('u')
        .where('u.role = :role', { role: SystemRole.ACCOUNT_OWNER })
        .andWhere('u.createdAt >= :thisMonth', { thisMonth })
        .getCount(),
      this.userRepo.count({
        where: { role: SystemRole.ACCOUNT_OWNER, status: UserStatus.PENDING_VERIFICATION },
      }),
      this.orgRepo.count({ where: { verificationStatus: OrgVerificationStatus.PENDING } }),
    ]);

    return {
      currency: 'GHS',
      fundsGenerated: {
        value: this.sum(all),
        changePct: pctChange(Number(this.sum(current)), Number(this.sum(previous))),
      },
      activeHosts: { value: activeHosts, newThisMonth: newHosts },
      pendingRequests: {
        value: pendingHosts + pendingOrganizations,
        pendingHosts,
        pendingOrganizations,
      },
      transactions: { value: all.length, changePct: pctChange(current.length, previous.length) },
    };
  }

  async getFundTrend(period: TrendPeriod): Promise<FundTrend> {
    const now = new Date();
    const buckets: FundTrend['buckets'] = [];
    let from: Date;

    if (period === '30d') {
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
      for (let i = 0; i < 30; i++) {
        const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
        buckets.push({
          key: d.toISOString().slice(0, 10),
          label: `${d.getDate()} ${MONTHS[d.getMonth()]}`,
          amount: '0.00',
        });
      }
    } else {
      from = startOfMonth(now, -11);
      for (let i = 0; i < 12; i++) {
        const d = startOfMonth(from, i);
        buckets.push({
          key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
          label: MONTHS[d.getMonth()],
          amount: '0.00',
        });
      }
    }

    const contributions = await this.collectedBetween(from);
    const index = new Map(buckets.map((b) => [b.key, b]));
    for (const c of contributions) {
      const d = new Date(c.createdAt);
      const key =
        period === '30d'
          ? new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10)
          : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const bucket = index.get(key);
      if (bucket) bucket.amount = MoneyUtil.add(bucket.amount, c.amount);
    }

    const total = buckets.reduce((t, b) => MoneyUtil.add(t, b.amount), '0.00');
    return {
      period,
      buckets,
      average: (Number(total) / buckets.length).toFixed(2),
      current: buckets[buckets.length - 1].amount,
    };
  }

  /** Total collected per project owner, keyed by owner id. */
  private async fundsByOwner(ownerIds: string[]): Promise<Map<string, string>> {
    const totals = new Map<string, string>();
    if (ownerIds.length === 0) return totals;

    const projects = await this.projectRepo.find({
      where: { ownerId: In(ownerIds) },
      select: ['id', 'ownerId'],
    });
    if (projects.length === 0) return totals;

    const ownerByProject = new Map(projects.map((p) => [p.id, p.ownerId]));
    const contributions = await this.contributionRepo
      .createQueryBuilder('c')
      .where('c.projectId IN (:...ids)', { ids: projects.map((p) => p.id) })
      .andWhere('c.status IN (:...statuses)', { statuses: COLLECTED_STATUSES })
      .getMany();
    for (const c of contributions) {
      const owner = ownerByProject.get(c.projectId);
      if (owner) totals.set(owner, MoneyUtil.add(totals.get(owner) ?? '0.00', c.amount));
    }
    return totals;
  }

  private toHostSummary(h: User, funds: Map<string, string>): HostSummary {
    return {
      id: h.id,
      firstName: h.firstName,
      lastName: h.lastName,
      email: h.email,
      phone: h.phone,
      status: h.status,
      fundsIssued: funds.get(h.id) ?? '0.00',
      lastActiveAt: h.lastLoginAt ?? null,
      createdAt: h.createdAt,
    };
  }

  async getHosts(
    params: { page?: number; limit?: number; search?: string; status?: UserStatus } = {}
  ): Promise<HostList> {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 5, 100);

    const query = this.userRepo
      .createQueryBuilder('u')
      .where('u.role = :role', { role: SystemRole.ACCOUNT_OWNER });
    if (params.status) query.andWhere('u.status = :status', { status: params.status });
    if (params.search) {
      query.andWhere(
        '(LOWER(u.email) LIKE :s OR LOWER(u.firstName) LIKE :s OR LOWER(u.lastName) LIKE :s OR u.phone LIKE :s)',
        { s: `%${params.search.toLowerCase()}%` }
      );
    }
    query
      .orderBy('u.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [hosts, total] = await query.getManyAndCount();
    const funds = await this.fundsByOwner(hosts.map((h) => h.id));

    // Counts cover every host, regardless of the current search or filter.
    const countFor = (status: UserStatus) =>
      this.userRepo.count({ where: { role: SystemRole.ACCOUNT_OWNER, status } });
    const [active, pending, suspended, everyHost] = await Promise.all([
      countFor(UserStatus.ACTIVE),
      countFor(UserStatus.PENDING_VERIFICATION),
      countFor(UserStatus.SUSPENDED),
      this.userRepo.find({ where: { role: SystemRole.ACCOUNT_OWNER }, select: ['id'] }),
    ]);
    const allFunds = await this.fundsByOwner(everyHost.map((h) => h.id));
    const fundsIssued = [...allFunds.values()].reduce((t, v) => MoneyUtil.add(t, v), '0.00');

    return {
      items: hosts.map((h) => this.toHostSummary(h, funds)),
      total,
      counts: { total: active + pending + suspended, active, pending, suspended, fundsIssued },
    };
  }

  private async toFundSummaries(projects: Project[]): Promise<FundSummary[]> {
    if (projects.length === 0) return [];

    const owners = await this.userRepo.find({
      where: { id: In([...new Set(projects.map((p) => p.ownerId))]) },
    });
    const ownerNames = new Map(owners.map((u) => [u.id, `${u.firstName} ${u.lastName}`.trim()]));

    const contributions = await this.contributionRepo
      .createQueryBuilder('c')
      .where('c.projectId IN (:...ids)', { ids: projects.map((p) => p.id) })
      .andWhere('c.status IN (:...statuses)', { statuses: COLLECTED_STATUSES })
      .getMany();
    const raised = new Map<string, { amount: string; count: number }>();
    for (const c of contributions) {
      const current = raised.get(c.projectId) ?? { amount: '0.00', count: 0 };
      raised.set(c.projectId, { amount: MoneyUtil.add(current.amount, c.amount), count: current.count + 1 });
    }

    return projects.map((p) => ({
      id: p.id,
      name: p.name,
      eventCode: p.eventCode,
      status: p.status,
      hostId: p.ownerId,
      hostName: ownerNames.get(p.ownerId) ?? 'Unknown host',
      raised: raised.get(p.id)?.amount ?? '0.00',
      targetAmount: p.targetAmount == null ? undefined : Number(p.targetAmount).toFixed(2),
      transactions: raised.get(p.id)?.count ?? 0,
      createdAt: p.createdAt,
    }));
  }

  async getFunds(
    params: { page?: number; limit?: number; search?: string; status?: ProjectStatus; ownerId?: string } = {}
  ): Promise<Page<FundSummary>> {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 10, 100);

    const query = this.projectRepo.createQueryBuilder('p');
    if (params.status) query.andWhere('p.status = :status', { status: params.status });
    if (params.ownerId) query.andWhere('p.ownerId = :ownerId', { ownerId: params.ownerId });
    if (params.search) {
      query.andWhere('(LOWER(p.name) LIKE :s OR LOWER(p.eventCode) LIKE :s)', {
        s: `%${params.search.toLowerCase()}%`,
      });
    }
    query
      .orderBy('p.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [projects, total] = await query.getManyAndCount();
    return { items: await this.toFundSummaries(projects), total };
  }

  async getTransactions(
    params: { page?: number; limit?: number; search?: string; status?: ContributionStatus } = {}
  ): Promise<Page<TransactionSummary>> {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 10, 100);

    const query = this.contributionRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.project', 'project')
      .leftJoinAndSelect('c.contributor', 'contributor');
    if (params.status) query.andWhere('c.status = :status', { status: params.status });
    if (params.search) {
      query.andWhere('(LOWER(c.reference) LIKE :s OR LOWER(project.name) LIKE :s)', {
        s: `%${params.search.toLowerCase()}%`,
      });
    }
    query
      .orderBy('c.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [rows, total] = await query.getManyAndCount();
    const ownerIds = [...new Set(rows.map((c) => c.project?.ownerId).filter((id): id is string => !!id))];
    const owners = ownerIds.length ? await this.userRepo.find({ where: { id: In(ownerIds) } }) : [];
    const ownerNames = new Map(owners.map((u) => [u.id, `${u.firstName} ${u.lastName}`.trim()]));

    return {
      total,
      items: rows.map((c) => ({
        id: c.id,
        reference: c.reference,
        amount: c.amount,
        status: c.status,
        projectId: c.projectId,
        projectName: c.project?.name ?? 'Unknown fund',
        hostName: (c.project && ownerNames.get(c.project.ownerId)) ?? 'Unknown host',
        contributorName: c.contributor?.name ?? null,
        createdAt: c.createdAt,
      })),
    };
  }

  async getFundDetail(id: string): Promise<FundDetail> {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundError('Campaign not found');

    const [summary] = await this.toFundSummaries([project]);
    const collected = await this.contributionRepo
      .createQueryBuilder('c')
      .where('c.projectId = :id', { id })
      .andWhere('c.status IN (:...statuses)', { statuses: COLLECTED_STATUSES })
      .getMany();
    const contributors = new Set(collected.map((c) => c.contributorId)).size;

    return {
      ...summary,
      description: project.description,
      currency: project.currency,
      startDate: project.startDate,
      endDate: project.endDate,
      contributors,
      averageAmount: collected.length ? (Number(summary.raised) / collected.length).toFixed(2) : '0.00',
    };
  }

  async getFundContributions(
    id: string,
    params: { page?: number; limit?: number; search?: string; status?: ContributionStatus } = {}
  ): Promise<Page<ContributionRow>> {
    if (!(await this.projectRepo.count({ where: { id } }))) throw new NotFoundError('Campaign not found');

    const page = params.page || 1;
    const limit = Math.min(params.limit || 10, 100);
    const query = this.contributionRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.contributor', 'contributor')
      .leftJoinAndSelect('c.purpose', 'purpose')
      .where('c.projectId = :id', { id });
    if (params.status) query.andWhere('c.status = :status', { status: params.status });
    if (params.search) {
      query.andWhere(
        '(LOWER(c.reference) LIKE :s OR LOWER(contributor.name) LIKE :s OR contributor.msisdn LIKE :s)',
        { s: `%${params.search.toLowerCase()}%` }
      );
    }
    query
      .orderBy('c.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [rows, total] = await query.getManyAndCount();
    return {
      total,
      items: rows.map((c) => ({
        id: c.id,
        reference: c.reference,
        contributorName: c.contributor?.name ?? null,
        msisdn: c.contributor?.msisdn ?? null,
        amount: c.amount,
        status: c.status,
        purposeName: c.purpose?.name ?? null,
        createdAt: c.createdAt,
      })),
    };
  }

  async getHostDetail(id: string): Promise<HostDetail> {
    const user = await this.userRepo.findOne({ where: { id, role: SystemRole.ACCOUNT_OWNER } });
    if (!user) throw new NotFoundError('Host not found');

    const totals = await this.fundsByOwner([id]);
    const funds = await this.getFunds({ ownerId: id, limit: 100 });

    const thisMonth = startOfMonth(new Date());
    const ownProjects = await this.projectRepo.find({ where: { ownerId: id }, select: ['id'] });
    let monthTotal = '0.00';
    let transactions = 0;
    if (ownProjects.length > 0) {
      const contributions = await this.contributionRepo
        .createQueryBuilder('c')
        .where('c.projectId IN (:...ids)', { ids: ownProjects.map((p) => p.id) })
        .andWhere('c.status IN (:...statuses)', { statuses: COLLECTED_STATUSES })
        .getMany();
      transactions = contributions.length;
      for (const c of contributions) {
        if (new Date(c.createdAt) >= thisMonth) monthTotal = MoneyUtil.add(monthTotal, c.amount);
      }
    }

    return {
      host: this.toHostSummary(user, totals),
      stats: { totalFunds: totals.get(id) ?? '0.00', fundsThisMonth: monthTotal, transactions },
      funds: funds.items,
    };
  }

  async getFundCounts(): Promise<FundCounts> {
    const countFor = (status: ProjectStatus) => this.projectRepo.count({ where: { status } });
    const [published, draft, suspended, collected] = await Promise.all([
      countFor(ProjectStatus.PUBLISHED),
      countFor(ProjectStatus.DRAFT),
      countFor(ProjectStatus.SUSPENDED),
      this.collectedBetween(),
    ]);
    return { total: await this.projectRepo.count(), published, draft, suspended, raised: this.sum(collected) };
  }

  async getTransactionCounts(): Promise<TransactionCounts> {
    const countFor = (...statuses: ContributionStatus[]) =>
      this.contributionRepo.count({ where: { status: In(statuses) } });
    const [completed, pending, failed, refunded, collected] = await Promise.all([
      countFor(ContributionStatus.CONFIRMED),
      countFor(ContributionStatus.PENDING, ContributionStatus.INITIATED),
      countFor(ContributionStatus.FAILED),
      countFor(ContributionStatus.REFUNDED, ContributionStatus.PARTIALLY_REFUNDED),
      this.collectedBetween(),
    ]);
    return {
      total: await this.contributionRepo.count(),
      completed,
      pending,
      failed,
      refunded,
      processed: this.sum(collected),
    };
  }

  async getActivity(params: { page?: number; limit?: number } = {}): Promise<Page<ActivityEntry>> {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 10, 100);
    const [logs, total] = await this.auditRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items: await this.toActivityEntries(logs), total };
  }

  async getRecentActivity(limit = 4): Promise<ActivityEntry[]> {
    const logs = await this.auditRepo.find({
      order: { createdAt: 'DESC' },
      take: Math.min(limit, 50),
    });
    return this.toActivityEntries(logs);
  }

  private async toActivityEntries(logs: AuditLog[]): Promise<ActivityEntry[]> {
    const actorIds = [...new Set(logs.map((l) => l.userId).filter((id): id is string => !!id))];
    const actors = actorIds.length ? await this.userRepo.find({ where: { id: In(actorIds) } }) : [];
    const names = new Map(actors.map((u) => [u.id, `${u.firstName} ${u.lastName}`.trim()]));

    return logs.map((l) => {
      const amount = (l.newValues as { amount?: string } | undefined)?.amount;
      return {
        id: l.id,
        action: l.action,
        entityType: l.entityType,
        entityId: l.entityId,
        actorName: l.userId ? (names.get(l.userId) ?? null) : null,
        ...(amount ? { amount: String(amount) } : {}),
        createdAt: l.createdAt,
      };
    });
  }
}

export const adminDashboardService = new AdminDashboardService();
