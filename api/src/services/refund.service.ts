import { AppDataSource } from '../config/database';
import { BadRequestError, NotFoundError } from '../common/errors/app-error';
import { CryptoUtil } from '../common/utils/crypto';
import { MoneyUtil } from '../common/utils/decimal';
import { auditService } from './audit.service';
import { Contribution, ContributionStatus } from '../database/entities/contribution.entity';
import { financialService } from './financial.service';
import { notificationService } from './notification.service';
import { PaymentAttempt, PaymentStatus } from '../database/entities/payment-attempt.entity';
import { paystackProvider } from './paystack.provider';
import { Refund, RefundStatus } from '../database/entities/refund.entity';
import { CreateRefundInput, ReviewRefundInput } from '../schemas/refund.schemas';

export class RefundService {
  private get refundRepo() { return AppDataSource.getRepository(Refund); }
  private get contributionRepo() { return AppDataSource.getRepository(Contribution); }
  private get paymentAttemptRepo() { return AppDataSource.getRepository(PaymentAttempt); }

  async requestRefund(input: CreateRefundInput, requestedById: string): Promise<Refund> {
    const contribution = await this.contributionRepo.findOne({
      where: { id: input.contributionId },
      relations: ['project', 'paymentAttempts'],
    });

    if (!contribution) {
      throw new NotFoundError('Contribution not found');
    }

    if (
      contribution.status !== ContributionStatus.CONFIRMED &&
      contribution.status !== ContributionStatus.PARTIALLY_REFUNDED
    ) {
      throw new BadRequestError(
        `Cannot refund contribution with status '${contribution.status}'. Only confirmed contributions are eligible.`
      );
    }

    // Find successful payment attempt
    const successfulAttempt = contribution.paymentAttempts.find(
      (p) => p.status === PaymentStatus.SUCCESSFUL
    );

    if (!successfulAttempt) {
      throw new BadRequestError('No confirmed payment attempt found for this contribution');
    }

    // Calculate existing approved or completed refunds
    const existingRefunds = await this.refundRepo.find({
      where: {
        contributionId: contribution.id,
      },
    });

    let alreadyRefunded = '0.00';
    for (const r of existingRefunds) {
      if (
        r.status === RefundStatus.APPROVED ||
        r.status === RefundStatus.COMPLETED ||
        r.status === RefundStatus.PROCESSING ||
        r.status === RefundStatus.REQUESTED
      ) {
        alreadyRefunded = MoneyUtil.add(alreadyRefunded, r.amount);
      }
    }

    const remainingRefundable = MoneyUtil.subtract(contribution.amount, alreadyRefunded);

    if (MoneyUtil.compare(input.amount, remainingRefundable) > 0) {
      throw new BadRequestError(
        `Requested refund amount (${contribution.currency} ${input.amount}) exceeds remaining refundable amount (${contribution.currency} ${remainingRefundable})`
      );
    }

    const refund = this.refundRepo.create({
      refundReference: CryptoUtil.generateReference('ZF-REF'),
      contributionId: contribution.id,
      paymentAttemptId: successfulAttempt.id,
      requestedById,
      amount: input.amount,
      currency: contribution.currency,
      reason: input.reason,
      status: RefundStatus.REQUESTED,
    });

    const saved = await this.refundRepo.save(refund);

    await auditService.log({
      userId: requestedById,
      organizationId: contribution.project?.organizationId,
      entityType: 'REFUND',
      entityId: saved.id,
      action: 'REQUEST_REFUND',
      newValues: {
        amount: saved.amount,
        contributionId: saved.contributionId,
        reference: saved.refundReference,
      },
    });

    return saved;
  }

  async reviewRefund(
    refundId: string,
    input: ReviewRefundInput,
    reviewerId: string
  ): Promise<Refund> {
    const refund = await this.refundRepo.findOne({
      where: { id: refundId },
      relations: ['contribution', 'contribution.project'],
    });

    if (!refund) {
      throw new NotFoundError('Refund request not found');
    }

    if (refund.status !== RefundStatus.REQUESTED) {
      throw new BadRequestError(`Refund has already been reviewed (current status: ${refund.status})`);
    }

    refund.status = input.status;
    refund.approvalNotes = input.approvalNotes;
    refund.reviewedById = reviewerId;
    refund.reviewedAt = new Date();

    const saved = await this.refundRepo.save(refund);

    await auditService.log({
      userId: reviewerId,
      entityType: 'REFUND',
      entityId: saved.id,
      action: 'REVIEW_REFUND',
      newValues: { status: saved.status, notes: saved.approvalNotes },
    });

    return saved;
  }

  async processRefund(refundId: string, actorId: string): Promise<Refund> {
    const refund = await this.refundRepo.findOne({
      where: { id: refundId },
      relations: ['contribution', 'paymentAttempt'],
    });

    if (!refund) {
      throw new NotFoundError('Refund request not found');
    }

    if (refund.status !== RefundStatus.APPROVED) {
      throw new BadRequestError(
        `Only approved refunds can be processed (current status: ${refund.status})`
      );
    }

    if (!refund.paymentAttempt) {
      throw new BadRequestError('Associated payment attempt missing for refund');
    }

    // Call Paystack refund API
    const providerResult = await paystackProvider.initiateRefund({
      transactionReference: refund.paymentAttempt.reference,
      amount: refund.amount,
      currency: refund.currency,
      merchantNote: `ZFund Refund for ${refund.refundReference}`,
    });

    // Execute state update and financial ledger entries inside TypeORM transaction
    await AppDataSource.transaction(async (manager) => {
      refund.status = RefundStatus.COMPLETED;
      refund.providerRefundId = providerResult.providerRefundId;
      refund.processedAt = new Date();
      await manager.save(refund);

      // Record double-entry financial ledger refund
      await financialService.recordRefundCompleted(refund, manager);

      // Check if contribution is fully or partially refunded
      const contribution = refund.contribution;
      const allCompletedRefunds = await manager.find(Refund, {
        where: { contributionId: contribution.id, status: RefundStatus.COMPLETED },
      });

      let totalRefunded = '0.00';
      for (const r of allCompletedRefunds) {
        totalRefunded = MoneyUtil.add(totalRefunded, r.amount);
      }

      if (MoneyUtil.compare(totalRefunded, contribution.amount) >= 0) {
        contribution.status = ContributionStatus.REFUNDED;
      } else {
        contribution.status = ContributionStatus.PARTIALLY_REFUNDED;
      }

      await manager.save(contribution);
    });

    // Notify contributor via SMS
    if (refund.paymentAttempt?.msisdn) {
      await notificationService.sendNotification({
        templateKey: 'REFUND_COMPLETED_CONTRIBUTOR',
        recipientPhone: refund.paymentAttempt.msisdn,
        eventType: 'REFUND_COMPLETED',
        variables: {
          amount: refund.amount,
          currency: refund.currency,
          reference: refund.refundReference,
        },
      });
    }

    await auditService.log({
      userId: actorId,
      entityType: 'REFUND',
      entityId: refund.id,
      action: 'PROCESS_REFUND',
      newValues: { status: refund.status, providerRefundId: refund.providerRefundId },
    });

    return refund;
  }

  async getRefunds(params: {
    contributionId?: string;
    status?: RefundStatus;
    page?: number;
    limit?: number;
  }): Promise<{ refunds: Refund[]; total: number }> {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const query = this.refundRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.contribution', 'c')
      .leftJoinAndSelect('r.requestedBy', 'user');

    if (params.contributionId) {
      query.andWhere('r.contributionId = :cid', { cid: params.contributionId });
    }
    if (params.status) {
      query.andWhere('r.status = :status', { status: params.status });
    }

    query.orderBy('r.createdAt', 'DESC').skip(skip).take(limit);

    const [refunds, total] = await query.getManyAndCount();
    return { refunds, total };
  }
}

export const refundService = new RefundService();
