import { AppDataSource } from '../config/database';
import { BadRequestError, NotFoundError } from '../common/errors/app-error';
import { CryptoUtil } from '../common/utils/crypto';
import { MoneyUtil } from '../common/utils/decimal';
import { logger } from '../config/logger';
import { Contribution, ContributionStatus } from '../database/entities/contribution.entity';
import { Contributor } from '../database/entities/contributor.entity';
import { financialService } from './financial.service';
import { notificationService } from './notification.service';
import { Project, ProjectStatus } from '../database/entities/project.entity';
import { PaymentAttempt, PaymentChannel, PaymentStatus } from '../database/entities/payment-attempt.entity';
import { ProviderTransaction } from '../database/entities/provider-transaction.entity';
import { ProviderWebhookEvent } from '../database/entities/provider-webhook-event.entity';
import { InitiatePaymentInput } from '../schemas/payment.schemas';
import { paystackProvider } from './paystack.provider';

export interface InitiateUssdPaymentInput {
  msisdn: string;
  amount: string;
  projectId: string;
  purposeId?: string;
  name?: string;
  email?: string;
}

export class PaymentService {
  private get paymentAttemptRepo() { return AppDataSource.getRepository(PaymentAttempt); }
  private get contributionRepo() { return AppDataSource.getRepository(Contribution); }
  private get contributorRepo() { return AppDataSource.getRepository(Contributor); }
  private get projectRepo() { return AppDataSource.getRepository(Project); }
  private get webhookEventRepo() { return AppDataSource.getRepository(ProviderWebhookEvent); }
  private get providerTxRepo() { return AppDataSource.getRepository(ProviderTransaction); }

  /**
   * Initiates payment: creates Contributor, Contribution, PaymentAttempt, calls Paystack
   */
  async initiatePayment(input: InitiatePaymentInput): Promise<{
    paymentAttempt: PaymentAttempt;
    contribution: Contribution;
    authorizationUrl?: string;
  }> {
    const project = await this.projectRepo.findOne({
      where: { id: input.projectId },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (project.status !== ProjectStatus.PUBLISHED || !project.acceptsContributions) {
      throw new BadRequestError('This project is not currently accepting contributions.');
    }

    // Validate min and max amount
    if (MoneyUtil.compare(input.amount, project.minAmount) < 0) {
      throw new BadRequestError(`Amount cannot be less than minimum of ${project.currency} ${project.minAmount}`);
    }
    if (MoneyUtil.compare(input.amount, project.maxAmount) > 0) {
      throw new BadRequestError(`Amount cannot exceed maximum of ${project.currency} ${project.maxAmount}`);
    }

    // Find or create Contributor
    let contributor = await this.contributorRepo.findOne({ where: { msisdn: input.msisdn } });
    if (!contributor) {
      contributor = this.contributorRepo.create({
        msisdn: input.msisdn,
        name: input.name,
        email: input.email,
      });
      contributor = await this.contributorRepo.save(contributor);
    }

    // Create Contribution
    const contributionRef = CryptoUtil.generateReference('ZF-CON');
    const validPurposeId =
      input.purposeId &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.purposeId)
        ? input.purposeId
        : undefined;

    const contribution = this.contributionRepo.create({
      reference: contributionRef,
      projectId: project.id,
      purposeId: validPurposeId,
      contributorId: contributor.id,
      amount: input.amount,
      currency: project.currency,
      status: ContributionStatus.INITIATED,
    });
    const savedContribution = await this.contributionRepo.save(contribution);

    // Create Payment Attempt
    const paymentRef = CryptoUtil.generateReference('ZF-PAY');
    const paymentAttempt = this.paymentAttemptRepo.create({
      reference: paymentRef,
      contributionId: savedContribution.id,
      provider: 'PAYSTACK',
      channel: input.channel || PaymentChannel.MOBILE_MONEY,
      msisdn: input.msisdn,
      amount: input.amount,
      currency: project.currency,
      status: PaymentStatus.INITIATED,
      fee: '0.00',
    });
    const savedAttempt = await this.paymentAttemptRepo.save(paymentAttempt);

    // Call Paystack provider
    const customerEmail = input.email || `${input.msisdn}@contributors.raisefundz.com`;

    try {
      const initResult = await paystackProvider.initializePayment({
        reference: paymentRef,
        amount: input.amount,
        currency: project.currency,
        email: customerEmail,
        phone: input.msisdn,
        channel: input.channel,
        callbackUrl: input.callbackUrl,
        metadata: {
          contributionId: savedContribution.id,
          projectId: project.id,
        },
      });

      savedAttempt.providerReference = initResult.providerReference;
      savedAttempt.authorizationUrl = initResult.authorizationUrl;
      savedAttempt.status = PaymentStatus.PENDING;
      await this.paymentAttemptRepo.save(savedAttempt);

      savedContribution.status = ContributionStatus.PENDING;
      await this.contributionRepo.save(savedContribution);

      return {
        paymentAttempt: savedAttempt,
        contribution: savedContribution,
        authorizationUrl: initResult.authorizationUrl,
      };
    } catch (err) {
      savedAttempt.status = PaymentStatus.FAILED;
      await this.paymentAttemptRepo.save(savedAttempt);
      savedContribution.status = ContributionStatus.FAILED;
      await this.contributionRepo.save(savedContribution);
      throw err;
    }
  }

  /**
   * Initiates direct Mobile Money charge for USSD donation via Paystack
   */
  async initiateUssdPayment(input: InitiateUssdPaymentInput): Promise<{
    paymentAttempt: PaymentAttempt;
    contribution: Contribution;
    chargeResult: any;
  }> {
    const project = await this.projectRepo.findOne({
      where: { id: input.projectId },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (project.status !== ProjectStatus.PUBLISHED || !project.acceptsContributions) {
      throw new BadRequestError('This project is not currently accepting contributions.');
    }

    if (MoneyUtil.compare(input.amount, project.minAmount) < 0) {
      throw new BadRequestError(`Amount cannot be less than minimum of ${project.currency} ${project.minAmount}`);
    }
    if (MoneyUtil.compare(input.amount, project.maxAmount) > 0) {
      throw new BadRequestError(`Amount cannot exceed maximum of ${project.currency} ${project.maxAmount}`);
    }

    // Find or create Contributor
    let contributor = await this.contributorRepo.findOne({ where: { msisdn: input.msisdn } });
    if (!contributor) {
      contributor = this.contributorRepo.create({
        msisdn: input.msisdn,
        name: input.name || `Donor ${input.msisdn.slice(-4)}`,
        email: input.email,
      });
      contributor = await this.contributorRepo.save(contributor);
    }

    // Create Contribution
    const contributionRef = CryptoUtil.generateReference('ZF-CON');
    const validPurposeId =
      input.purposeId &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.purposeId)
        ? input.purposeId
        : undefined;

    const contribution = this.contributionRepo.create({
      reference: contributionRef,
      projectId: project.id,
      purposeId: validPurposeId,
      contributorId: contributor.id,
      amount: input.amount,
      currency: project.currency,
      status: ContributionStatus.INITIATED,
    });
    const savedContribution = await this.contributionRepo.save(contribution);

    // Create Payment Attempt
    const paymentRef = CryptoUtil.generateReference('ZF-PAY');
    const paymentAttempt = this.paymentAttemptRepo.create({
      reference: paymentRef,
      contributionId: savedContribution.id,
      provider: 'PAYSTACK',
      channel: PaymentChannel.MOBILE_MONEY,
      msisdn: input.msisdn,
      amount: input.amount,
      currency: project.currency,
      status: PaymentStatus.INITIATED,
      fee: '0.00',
    });
    const savedAttempt = await this.paymentAttemptRepo.save(paymentAttempt);

    const customerEmail = input.email || `${input.msisdn}@contributors.raisefundz.com`;

    try {
      const chargeResult = await paystackProvider.chargeMobileMoney({
        reference: paymentRef,
        amount: input.amount,
        currency: project.currency,
        phone: input.msisdn,
        email: customerEmail,
        metadata: {
          contributionId: savedContribution.id,
          projectId: project.id,
          channel: 'USSD',
        },
      });

      savedAttempt.providerReference = chargeResult.reference || paymentRef;
      savedAttempt.metadata = {
        ...savedAttempt.metadata,
        requiresOtp: chargeResult.requiresOtp,
        displayText: chargeResult.displayText,
        chargeStatus: chargeResult.status,
      };

      if (chargeResult.status === 'success') {
        savedAttempt.status = PaymentStatus.SUCCESSFUL;
        savedAttempt.completedAt = new Date();
        await this.paymentAttemptRepo.save(savedAttempt);

        savedContribution.status = ContributionStatus.CONFIRMED;
        await this.contributionRepo.save(savedContribution);

        await AppDataSource.transaction(async (manager) => {
          await financialService.recordPaymentConfirmed(savedContribution, savedAttempt, manager);
        });

        await notificationService.sendNotification({
          templateKey: 'CONTRIBUTION_CONFIRMED_CONTRIBUTOR',
          recipientPhone: savedAttempt.msisdn,
          eventType: 'PAYMENT_SUCCESS',
          variables: {
            amount: savedAttempt.amount,
            currency: savedAttempt.currency,
            projectName: project.name,
            reference: savedAttempt.reference,
          },
        });
      } else if (chargeResult.status === 'failed') {
        savedAttempt.status = PaymentStatus.FAILED;
        savedAttempt.providerStatus = chargeResult.displayText || chargeResult.message || 'Charge failed';
        await this.paymentAttemptRepo.save(savedAttempt);

        savedContribution.status = ContributionStatus.FAILED;
        await this.contributionRepo.save(savedContribution);
      } else {
        // 'send_otp' or 'pay_offline'
        savedAttempt.status = PaymentStatus.PENDING;
        await this.paymentAttemptRepo.save(savedAttempt);

        savedContribution.status = ContributionStatus.PENDING;
        await this.contributionRepo.save(savedContribution);
      }

      return {
        paymentAttempt: savedAttempt,
        contribution: savedContribution,
        chargeResult,
      };
    } catch (err) {
      savedAttempt.status = PaymentStatus.FAILED;
      await this.paymentAttemptRepo.save(savedAttempt);
      savedContribution.status = ContributionStatus.FAILED;
      await this.contributionRepo.save(savedContribution);
      throw err;
    }
  }

  /**
   * Submits OTP received from contributor via USSD to Paystack
   */
  async submitUssdPaymentOtp(params: { reference: string; otp: string }): Promise<{
    status: 'success' | 'pay_offline' | 'pending' | 'failed';
    displayText?: string;
    message: string;
    paymentAttempt: PaymentAttempt;
  }> {
    const paymentAttempt = await this.paymentAttemptRepo.findOne({
      where: { reference: params.reference },
      relations: ['contribution', 'contribution.project', 'contribution.contributor'],
    });

    if (!paymentAttempt) {
      throw new NotFoundError(`Payment attempt with reference '${params.reference}' not found`);
    }

    const otpResult = await paystackProvider.submitOtp({
      reference: params.reference,
      otp: params.otp,
    });

    if (otpResult.status === 'success') {
      const chargeData = (otpResult.rawResponse?.data as Record<string, unknown>) || {
        reference: paymentAttempt.reference,
        amount: MoneyUtil.toMinorUnit(paymentAttempt.amount),
        currency: paymentAttempt.currency,
        id: paymentAttempt.providerReference || paymentAttempt.reference,
      };

      const webhookRecord = this.webhookEventRepo.create({
        provider: 'PAYSTACK',
        eventType: 'charge.success',
        reference: paymentAttempt.reference,
        rawPayload: chargeData,
        isProcessed: false,
      });

      await this.processSuccessfulCharge(chargeData, webhookRecord);
    } else if (otpResult.status === 'failed') {
      paymentAttempt.metadata = {
        ...paymentAttempt.metadata,
        lastOtpFailure: otpResult.message,
      };
      await this.paymentAttemptRepo.save(paymentAttempt);
    }

    const updatedAttempt = (await this.paymentAttemptRepo.findOne({
      where: { reference: params.reference },
      relations: ['contribution'],
    })) || paymentAttempt;

    return {
      status: otpResult.status,
      displayText: otpResult.displayText,
      message: otpResult.message,
      paymentAttempt: updatedAttempt,
    };
  }

  /**
   * Handles authenticated Paystack webhook event idempotently
   */
  async handleWebhook(rawBody: string | Buffer, eventPayload: Record<string, unknown>): Promise<void> {
    const eventType = String(eventPayload.event || '');
    const data = (eventPayload.data || {}) as Record<string, unknown>;
    const eventId = String(data.id || '');
    const reference = String(data.reference || '');

    // 1. Idempotency Check: check if this webhook event was already processed
    const existingEvent = await this.webhookEventRepo.findOne({
      where: [{ eventId }, { reference, isProcessed: true }],
    });

    if (existingEvent && existingEvent.isProcessed) {
      logger.info({ reference, eventType }, 'Webhook event already processed (idempotent skip)');
      return;
    }

    // Persist Webhook Event record
    const webhookRecord = this.webhookEventRepo.create({
      provider: 'PAYSTACK',
      eventType,
      eventId,
      reference,
      rawPayload: eventPayload,
      isProcessed: false,
    });
    await this.webhookEventRepo.save(webhookRecord);

    if (eventType === 'charge.success') {
      await this.processSuccessfulCharge(data, webhookRecord);
    } else if (eventType === 'charge.failed') {
      await this.processFailedCharge(data, webhookRecord);
    } else {
      logger.info({ eventType }, 'Unhandled Paystack webhook event type');
      webhookRecord.isProcessed = true;
      webhookRecord.processingResult = 'Ignored event type';
      await this.webhookEventRepo.save(webhookRecord);
    }
  }

  private async processSuccessfulCharge(
    data: Record<string, unknown>,
    webhookRecord?: ProviderWebhookEvent
  ): Promise<void> {
    const reference = String(data.reference);
    const amountInMinor = Number(data.amount);
    const amountInMajor = MoneyUtil.fromMinorUnit(amountInMinor);
    const feeInMajor = data.fees ? MoneyUtil.fromMinorUnit(Number(data.fees)) : '0.00';
    const currency = String(data.currency || 'GHS');

    const paymentAttempt = await this.paymentAttemptRepo.findOne({
      where: { reference },
      relations: ['contribution', 'contribution.project', 'contribution.contributor'],
    });

    if (!paymentAttempt) {
      logger.warn({ reference }, 'Payment attempt not found for successful charge webhook');
      if (webhookRecord && webhookRecord.eventType) {
        webhookRecord.isProcessed = true;
        webhookRecord.processingResult = 'PaymentAttempt not found';
        await this.webhookEventRepo.save(webhookRecord);
      }
      return;
    }

    if (paymentAttempt.status === PaymentStatus.SUCCESSFUL) {
      logger.info({ reference }, 'PaymentAttempt already marked successful (idempotent skip)');
      if (webhookRecord && webhookRecord.eventType) {
        webhookRecord.isProcessed = true;
        webhookRecord.processingResult = 'Already successful';
        await this.webhookEventRepo.save(webhookRecord);
      }
      return;
    }

    // Amount & Currency Verification
    if (MoneyUtil.compare(paymentAttempt.amount, amountInMajor) !== 0) {
      logger.error(
        {
          expected: paymentAttempt.amount,
          received: amountInMajor,
          reference,
        },
        'Payment amount discrepancy detected'
      );
      paymentAttempt.status = PaymentStatus.FAILED;
      paymentAttempt.metadata = {
        ...paymentAttempt.metadata,
        discrepancy: `Expected ${paymentAttempt.amount}, received ${amountInMajor}`,
      };
      await this.paymentAttemptRepo.save(paymentAttempt);
      if (webhookRecord && webhookRecord.eventType) {
        webhookRecord.isProcessed = true;
        webhookRecord.processingResult = 'Amount discrepancy';
        await this.webhookEventRepo.save(webhookRecord);
      }
      return;
    }

    // Transactional multi-record financial write
    await AppDataSource.transaction(async (manager) => {
      paymentAttempt.status = PaymentStatus.SUCCESSFUL;
      paymentAttempt.fee = feeInMajor;
      paymentAttempt.providerReference = String(data.id || reference);
      paymentAttempt.completedAt = new Date();
      await manager.save(paymentAttempt);

      const contribution = paymentAttempt.contribution;
      contribution.status = ContributionStatus.CONFIRMED;
      await manager.save(contribution);

      // Create ProviderTransaction record
      const providerTx = manager.create(ProviderTransaction, {
        paymentAttemptId: paymentAttempt.id,
        provider: 'PAYSTACK',
        providerTransactionId: String(data.id),
        reference,
        amount: amountInMajor,
        currency,
        fee: feeInMajor,
        status: 'success',
        gatewayResponse: String(data.gateway_response || 'Successful'),
        rawPayload: data,
      });
      await manager.save(providerTx);

      // Record double-entry financial ledger entry
      await financialService.recordPaymentConfirmed(contribution, paymentAttempt, manager);

      // Mark webhook processed if valid record supplied
      if (webhookRecord && webhookRecord.eventType && webhookRecord.rawPayload) {
        webhookRecord.isProcessed = true;
        webhookRecord.processedAt = new Date();
        webhookRecord.processingResult = 'Payment confirmed and ledger updated';
        await manager.save(webhookRecord);
      }
    });

    // Trigger contributor and project owner SMS notifications (non-blocking)
    const contribution = paymentAttempt.contribution;
    const project = contribution.project;

    await notificationService.sendNotification({
      templateKey: 'CONTRIBUTION_CONFIRMED_CONTRIBUTOR',
      recipientPhone: paymentAttempt.msisdn,
      eventType: 'PAYMENT_SUCCESS',
      variables: {
        amount: paymentAttempt.amount,
        currency: paymentAttempt.currency,
        projectName: project?.name || 'RaiseFunds Project',
        reference: paymentAttempt.reference,
      },
    });
  }

  private async processFailedCharge(
    data: Record<string, unknown>,
    webhookRecord: ProviderWebhookEvent
  ): Promise<void> {
    const reference = String(data.reference);
    const paymentAttempt = await this.paymentAttemptRepo.findOne({
      where: { reference },
      relations: ['contribution'],
    });

    if (paymentAttempt && paymentAttempt.status !== PaymentStatus.SUCCESSFUL) {
      paymentAttempt.status = PaymentStatus.FAILED;
      paymentAttempt.providerStatus = String(data.gateway_response || 'Failed');
      await this.paymentAttemptRepo.save(paymentAttempt);

      if (paymentAttempt.contribution) {
        paymentAttempt.contribution.status = ContributionStatus.FAILED;
        await this.contributionRepo.save(paymentAttempt.contribution);
      }
    }

    webhookRecord.isProcessed = true;
    webhookRecord.processedAt = new Date();
    webhookRecord.processingResult = 'Marked failed';
    await this.webhookEventRepo.save(webhookRecord);
  }

  async verifyPayment(reference: string): Promise<PaymentAttempt> {
    const paymentAttempt = await this.paymentAttemptRepo.findOne({
      where: { reference },
      relations: ['contribution', 'contribution.project'],
    });

    if (!paymentAttempt) {
      throw new NotFoundError(`Payment with reference '${reference}' not found`);
    }

    if (paymentAttempt.status === PaymentStatus.SUCCESSFUL) {
      return paymentAttempt;
    }

    const verifyResult = await paystackProvider.verifyTransaction(reference);

    if (verifyResult.status === 'success') {
      const chargePayload = (verifyResult.rawResponse?.data as Record<string, unknown>) || {};
      const webhookRecord = this.webhookEventRepo.create({
        provider: 'PAYSTACK',
        eventType: 'charge.success',
        reference,
        rawPayload: chargePayload,
        isProcessed: false,
      });
      await this.processSuccessfulCharge(chargePayload, webhookRecord);
    }

    return (await this.paymentAttemptRepo.findOne({ where: { reference } }))!;
  }

  async getPayments(params: {
    projectId?: string;
    status?: PaymentStatus;
    msisdn?: string;
    page?: number;
    limit?: number;
  }): Promise<{ payments: PaymentAttempt[]; total: number }> {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const query = this.paymentAttemptRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.contribution', 'c')
      .leftJoinAndSelect('c.project', 'project');

    if (params.projectId) {
      query.andWhere('c.projectId = :projectId', { projectId: params.projectId });
    }
    if (params.status) {
      query.andWhere('p.status = :status', { status: params.status });
    }
    if (params.msisdn) {
      query.andWhere('p.msisdn = :msisdn', { msisdn: params.msisdn });
    }

    query.orderBy('p.createdAt', 'DESC').skip(skip).take(limit);

    const [payments, total] = await query.getManyAndCount();
    return { payments, total };
  }
}

export const paymentService = new PaymentService();
