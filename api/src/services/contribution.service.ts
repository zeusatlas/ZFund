import { AppDataSource } from '../config/database';
import { NotFoundError } from '../common/errors/app-error';
import { Contribution, ContributionStatus } from '../database/entities/contribution.entity';
import { SystemRole } from '../common/types/auth';

export class ContributionService {
  private get contributionRepo() {
    return AppDataSource.getRepository(Contribution);
  }

  async getContributions(params: {
    userId?: string;
    userRole?: string;
    projectId?: string;
    contributorId?: string;
    status?: ContributionStatus | string;
    search?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    contributions: Contribution[];
    total: number;
    summary: {
      received: number;
      paid: number;
      pending: number;
      failed: number;
    };
  }> {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const query = this.contributionRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.project', 'project')
      .leftJoinAndSelect('c.contributor', 'contributor')
      .leftJoinAndSelect('c.purpose', 'purpose')
      .leftJoinAndSelect('c.paymentAttempts', 'paymentAttempts');

    const isPlatformStaff = [
      SystemRole.SUPER_ADMIN,
      SystemRole.PLATFORM_ADMIN,
      SystemRole.AUDITOR,
    ].includes(params.userRole as SystemRole);

    if (!isPlatformStaff && params.userId) {
      query.innerJoin(
        'project_members',
        'pm',
        'pm.projectId = c.projectId AND pm.userId = :userId',
        { userId: params.userId }
      );
    }

    if (params.projectId && params.projectId !== 'All') {
      query.andWhere('c.projectId = :projectId', { projectId: params.projectId });
    }
    if (params.contributorId) {
      query.andWhere('c.contributorId = :contributorId', { contributorId: params.contributorId });
    }

    if (params.status && params.status !== 'All') {
      if (params.status === 'Paid' || params.status === ContributionStatus.CONFIRMED) {
        query.andWhere('c.status = :status', { status: ContributionStatus.CONFIRMED });
      } else if (params.status === 'Pending') {
        query.andWhere('c.status IN (:...pendingStatuses)', {
          pendingStatuses: [ContributionStatus.PENDING, ContributionStatus.INITIATED],
        });
      } else if (params.status === 'Failed') {
        query.andWhere('c.status IN (:...failedStatuses)', {
          failedStatuses: [
            ContributionStatus.FAILED,
            ContributionStatus.REFUNDED,
            ContributionStatus.PARTIALLY_REFUNDED,
          ],
        });
      } else {
        query.andWhere('c.status = :status', { status: params.status });
      }
    }

    if (params.search && params.search.trim()) {
      const s = params.search.trim();
      query.andWhere(
        '(c.reference ILIKE :search OR contributor.msisdn LIKE :search OR contributor.name ILIKE :search)',
        { search: `%${s}%` }
      );
    }

    if (params.from) {
      query.andWhere('c.createdAt >= :fromDate', {
        fromDate: new Date(`${params.from}T00:00:00.000Z`),
      });
    }
    if (params.to) {
      query.andWhere('c.createdAt <= :toDate', {
        toDate: new Date(`${params.to}T23:59:59.999Z`),
      });
    }

    // Clone query for computing summary statistics across matching records
    const summaryRaw = await query
      .clone()
      .select([
        `COALESCE(SUM(CASE WHEN c.status = '${ContributionStatus.CONFIRMED}' THEN CAST(c.amount AS numeric) ELSE 0 END), 0) AS "totalReceived"`,
        `COUNT(CASE WHEN c.status = '${ContributionStatus.CONFIRMED}' THEN 1 END) AS "paidCount"`,
        `COUNT(CASE WHEN c.status IN ('${ContributionStatus.PENDING}', '${ContributionStatus.INITIATED}') THEN 1 END) AS "pendingCount"`,
        `COUNT(CASE WHEN c.status IN ('${ContributionStatus.FAILED}', '${ContributionStatus.REFUNDED}', '${ContributionStatus.PARTIALLY_REFUNDED}') THEN 1 END) AS "failedCount"`,
      ])
      .offset(undefined)
      .limit(undefined)
      .orderBy()
      .getRawOne();

    const summary = {
      received: Math.round(parseFloat(summaryRaw?.totalReceived || '0') * 100),
      paid: parseInt(summaryRaw?.paidCount || '0', 10),
      pending: parseInt(summaryRaw?.pendingCount || '0', 10),
      failed: parseInt(summaryRaw?.failedCount || '0', 10),
    };

    query.orderBy('c.createdAt', 'DESC').skip(skip).take(limit);

    const [contributions, total] = await query.getManyAndCount();
    return { contributions, total, summary };
  }

  async getContributionById(id: string): Promise<Contribution> {
    const contribution = await this.contributionRepo.findOne({
      where: [{ id }, { reference: id }],
      relations: ['project', 'contributor', 'purpose', 'paymentAttempts'],
    });

    if (!contribution) {
      throw new NotFoundError('Contribution not found');
    }

    return contribution;
  }
}

export const contributionService = new ContributionService();
