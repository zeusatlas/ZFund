import { EntityManager } from 'typeorm';
import { AppDataSource } from '../config/database';
import { MoneyUtil } from '../common/utils/decimal';
import { CryptoUtil } from '../common/utils/crypto';
import { Contribution } from '../database/entities/contribution.entity';
import { PaymentAttempt } from '../database/entities/payment-attempt.entity';
import { Refund } from '../database/entities/refund.entity';
import { FinancialLedgerAccount } from '../database/entities/financial-ledger-account.entity';
import { FinancialLedgerEntry } from '../database/entities/financial-ledger-entry.entity';

export class FinancialService {
  private get ledgerEntryRepo() { return AppDataSource.getRepository(FinancialLedgerEntry); }
  private get ledgerAccountRepo() { return AppDataSource.getRepository(FinancialLedgerAccount); }

  /**
   * Records double-entry financial ledger entries for confirmed payment
   */
  async recordPaymentConfirmed(
    contribution: Contribution,
    attempt: PaymentAttempt,
    transactionalManager?: EntityManager
  ): Promise<FinancialLedgerEntry[]> {
    const manager = transactionalManager || AppDataSource.manager;

    const entries: FinancialLedgerEntry[] = [];
    const entryReference = CryptoUtil.generateReference('ZF-LED');

    // 1. Debit Cash/Clearing (Asset), Credit Contributions Payable (Liability)
    const principalEntry = manager.create(FinancialLedgerEntry, {
      entryReference,
      contributionId: contribution.id,
      debitAccount: '1000_CASH_CLEARING',
      creditAccount: '2000_CONTRIBUTIONS_PAYABLE',
      amount: attempt.amount,
      currency: attempt.currency,
      description: `Contribution collection for project ${contribution.projectId} via ${attempt.provider}`,
      metadata: {
        paymentAttemptId: attempt.id,
        reference: attempt.reference,
        projectId: contribution.projectId,
      },
    });

    entries.push(await manager.save(principalEntry));

    // 2. If provider fee > 0, record provider fee expense
    if (MoneyUtil.isPositive(attempt.fee)) {
      const feeEntry = manager.create(FinancialLedgerEntry, {
        entryReference: CryptoUtil.generateReference('ZF-LED-FEE'),
        contributionId: contribution.id,
        debitAccount: '5000_PAYMENT_GATEWAY_FEE',
        creditAccount: '1000_CASH_CLEARING',
        amount: attempt.fee,
        currency: attempt.currency,
        description: `Payment processing fee for ${attempt.reference}`,
        metadata: {
          paymentAttemptId: attempt.id,
          reference: attempt.reference,
        },
      });
      entries.push(await manager.save(feeEntry));
    }

    return entries;
  }

  /**
   * Records financial entries for processed refund
   */
  async recordRefundCompleted(
    refund: Refund,
    transactionalManager?: EntityManager
  ): Promise<FinancialLedgerEntry> {
    const manager = transactionalManager || AppDataSource.manager;

    const entry = manager.create(FinancialLedgerEntry, {
      entryReference: CryptoUtil.generateReference('ZF-LED-REF'),
      contributionId: refund.contributionId,
      refundId: refund.id,
      debitAccount: '2000_CONTRIBUTIONS_PAYABLE',
      creditAccount: '1000_CASH_CLEARING',
      amount: refund.amount,
      currency: refund.currency,
      description: `Refund processed for contribution ${refund.contributionId}. Ref: ${refund.refundReference}`,
      metadata: {
        refundReference: refund.refundReference,
        providerRefundId: refund.providerRefundId,
      },
    });

    return await manager.save(entry);
  }

  /**
   * Retrieves accounting ledger entries
   */
  async getLedgerEntries(params: {
    contributionId?: string;
    refundId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ entries: FinancialLedgerEntry[]; total: number }> {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const query = this.ledgerEntryRepo.createQueryBuilder('ledger');

    if (params.contributionId) {
      query.andWhere('ledger.contributionId = :cid', { cid: params.contributionId });
    }
    if (params.refundId) {
      query.andWhere('ledger.refundId = :rid', { rid: params.refundId });
    }

    query.orderBy('ledger.createdAt', 'DESC').skip(skip).take(limit);

    const [entries, total] = await query.getManyAndCount();
    return { entries, total };
  }
}

export const financialService = new FinancialService();
