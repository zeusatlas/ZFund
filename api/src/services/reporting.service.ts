import { AppDataSource } from '../config/database';
import { MoneyUtil } from '../common/utils/decimal';
import { Contribution, ContributionStatus } from '../database/entities/contribution.entity';
import { PaymentAttempt, PaymentStatus } from '../database/entities/payment-attempt.entity';
import { Refund, RefundStatus } from '../database/entities/refund.entity';

export interface FinancialSummaryReport {
  grossCollections: string;
  totalFees: string;
  netCollections: string;
  totalRefunded: string;
  netAvailable: string;
  currency: string;
  counts: {
    totalContributions: number;
    confirmedContributions: number;
    pendingPayments: number;
    failedPayments: number;
    refundedCount: number;
  };
  byPurpose: Array<{
    purposeId: string;
    purposeName: string;
    totalAmount: string;
    count: number;
  }>;
}

export class ReportingService {
  private get contributionRepo() { return AppDataSource.getRepository(Contribution); }
  private get paymentAttemptRepo() { return AppDataSource.getRepository(PaymentAttempt); }
  private get refundRepo() { return AppDataSource.getRepository(Refund); }

  async getFinancialSummary(params: {
    projectId?: string;
    organizationId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<FinancialSummaryReport> {
    const query = this.contributionRepo
      .createQueryBuilder('c')
      .leftJoin('c.project', 'project')
      .leftJoin('c.purpose', 'purpose');

    if (params.projectId) {
      query.andWhere('c.projectId = :projectId', { projectId: params.projectId });
    }
    if (params.organizationId) {
      query.andWhere('project.organizationId = :orgId', { orgId: params.organizationId });
    }
    if (params.startDate) {
      query.andWhere('c.createdAt >= :startDate', { startDate: params.startDate });
    }
    if (params.endDate) {
      query.andWhere('c.createdAt <= :endDate', { endDate: params.endDate });
    }

    const contributions = await query.getMany();

    let gross = '0.00';
    let confirmedCount = 0;

    for (const c of contributions) {
      if (
        c.status === ContributionStatus.CONFIRMED ||
        c.status === ContributionStatus.PARTIALLY_REFUNDED ||
        c.status === ContributionStatus.REFUNDED
      ) {
        gross = MoneyUtil.add(gross, c.amount);
        confirmedCount++;
      }
    }

    // Get payment attempts stats
    const paymentQuery = this.paymentAttemptRepo.createQueryBuilder('p');
    if (params.projectId) {
      paymentQuery
        .innerJoin('p.contribution', 'c')
        .where('c.projectId = :projectId', { projectId: params.projectId });
    }
    const paymentAttempts = await paymentQuery.getMany();

    let totalFees = '0.00';
    let pendingCount = 0;
    let failedCount = 0;

    for (const p of paymentAttempts) {
      if (p.status === PaymentStatus.SUCCESSFUL) {
        totalFees = MoneyUtil.add(totalFees, p.fee);
      } else if (p.status === PaymentStatus.PENDING || p.status === PaymentStatus.INITIATED) {
        pendingCount++;
      } else if (p.status === PaymentStatus.FAILED || p.status === PaymentStatus.EXPIRED) {
        failedCount++;
      }
    }

    // Get completed refunds
    const refundQuery = this.refundRepo.createQueryBuilder('r');
    if (params.projectId) {
      refundQuery
        .innerJoin('r.contribution', 'c')
        .where('c.projectId = :projectId', { projectId: params.projectId });
    }
    refundQuery.andWhere('r.status = :rStatus', { rStatus: RefundStatus.COMPLETED });
    const refunds = await refundQuery.getMany();

    let totalRefunded = '0.00';
    for (const r of refunds) {
      totalRefunded = MoneyUtil.add(totalRefunded, r.amount);
    }

    // Calculations
    const netCollections = MoneyUtil.subtract(gross, totalFees);
    const netAvailable = MoneyUtil.subtract(netCollections, totalRefunded);

    // Breakdown by purpose
    const purposeMap = new Map<string, { purposeId: string; purposeName: string; totalAmount: string; count: number }>();
    for (const c of contributions) {
      if (
        c.status === ContributionStatus.CONFIRMED ||
        c.status === ContributionStatus.PARTIALLY_REFUNDED ||
        c.status === ContributionStatus.REFUNDED
      ) {
        const pId = c.purposeId || 'unspecified';
        const pName = c.purpose?.name || 'General';
        const existing = purposeMap.get(pId) || { purposeId: pId, purposeName: pName, totalAmount: '0.00', count: 0 };
        existing.totalAmount = MoneyUtil.add(existing.totalAmount, c.amount);
        existing.count += 1;
        purposeMap.set(pId, existing);
      }
    }

    return {
      grossCollections: gross,
      totalFees,
      netCollections,
      totalRefunded,
      netAvailable,
      currency: 'GHS',
      counts: {
        totalContributions: contributions.length,
        confirmedContributions: confirmedCount,
        pendingPayments: pendingCount,
        failedPayments: failedCount,
        refundedCount: refunds.length,
      },
      byPurpose: Array.from(purposeMap.values()),
    };
  }
}

export const reportingService = new ReportingService();
