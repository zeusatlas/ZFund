import { AppDataSource } from '../config/database';
import { BadRequestError, NotFoundError } from '../common/errors/app-error';
import { CryptoUtil } from '../common/utils/crypto';
import { MoneyUtil } from '../common/utils/decimal';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { Contribution, ContributionStatus } from '../database/entities/contribution.entity';
import { Contributor } from '../database/entities/contributor.entity';
import { financialService } from './financial.service';
import { notificationService } from './notification.service';
import { Project, ProjectStatus } from '../database/entities/project.entity';
import { PaymentAttempt, PaymentChannel, PaymentStatus } from '../database/entities/payment-attempt.entity';
import { ProjectPaymentMethod } from '../database/entities/project-payment-method.entity';
import { ProviderTransaction } from '../database/entities/provider-transaction.entity';
import { ProviderWebhookEvent } from '../database/entities/provider-webhook-event.entity';
import { InitiatePaymentInput } from '../schemas/payment.schemas';
import { IPaymentProvider } from './payment-provider.interface';
import { robspayProvider, RobspayProvider } from './robspay.provider';

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
  private get paymentMethodRepo() { return AppDataSource.getRepository(ProjectPaymentMethod); }

  /**
   * Resolves the active payment provider (defaults to RobsPay)
   */
  async getProviderForProject(projectId?: string): Promise<IPaymentProvider> {
    if (projectId) {
      const projectMethod = await this.paymentMethodRepo.findOne({ where: { projectId, isEnabled: true } });
      if (projectMethod?.provider) {
        if (projectMethod.provider.toUpperCase() === 'PAYSTACK' && env.PAYMENT_PROVIDER === 'paystack') return paystackProvider;
        if (projectMethod.provider.toUpperCase() === 'ROBSPAY') return robspayProvider;
      }
    }
    return this.currentProvider;
  }

  get currentProvider(): IPaymentProvider {
    return robspayProvider;
  }

  /**
   * Initiates payment: creates Contributor, Contribution, PaymentAttempt, calls payment provider
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
    const provider = this.currentProvider;
    const paymentRef = CryptoUtil.generateReference('ZF-PAY');
    const orderId = RobspayProvider.generateTransactionId();

    const paymentAttempt = this.paymentAttemptRepo.create({
      reference: paymentRef,
      contributionId: savedContribution.id,
      provider: provider.code,
      channel: input.channel || PaymentChannel.MOBILE_MONEY,
      msisdn: input.msisdn,
      amount: input.amount,
      currency: project.currency,
      status: PaymentStatus.INITIATED,
      fee: '0.00',
      providerReference: orderId,
    });
    const savedAttempt = await this.paymentAttemptRepo.save(paymentAttempt);

    const customerEmail = input.email || `${input.msisdn}@contributors.raisefundz.com`;

    try {
      const initResult = await provider.initializePayment({
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
          transactionId: orderId,
        },
      });

      savedAttempt.providerReference = initResult.providerReference || orderId;
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
   * Initiates direct Mobile Money charge for USSD donation via active payment provider
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
    const provider = this.currentProvider;
    const paymentRef = CryptoUtil.generateReference('ZF-PAY');
    const orderId = RobspayProvider.generateTransactionId();

    const paymentAttempt = this.paymentAttemptRepo.create({
      reference: paymentRef,
      contributionId: savedContribution.id,
      provider: provider.code,
      channel: PaymentChannel.MOBILE_MONEY,
      msisdn: input.msisdn,
      amount: input.amount,
      currency: project.currency,
      status: PaymentStatus.INITIATED,
      fee: '0.00',
      providerReference: orderId,
    });
    const savedAttempt = await this.paymentAttemptRepo.save(paymentAttempt);

    const customerEmail = input.email || `${input.msisdn}@contributors.raisefundz.com`;

    try {
      const chargeResult = provider.chargeMobileMoney
        ? await provider.chargeMobileMoney({
            reference: paymentRef,
            amount: input.amount,
            currency: project.currency,
            phone: input.msisdn,
            email: customerEmail,
            metadata: {
              contributionId: savedContribution.id,
              projectId: project.id,
              channel: 'USSD',
              transactionId: orderId,
            },
          })
        : await provider.initializePayment({
            reference: paymentRef,
            amount: input.amount,
            currency: project.currency,
            phone: input.msisdn,
            email: customerEmail,
          });

      savedAttempt.providerReference = (chargeResult as any).reference || (chargeResult as any).providerReference || orderId;
      savedAttempt.metadata = {
        ...savedAttempt.metadata,
        requiresOtp: (chargeResult as any).requiresOtp ?? false,
        displayText: (chargeResult as any).displayText,
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
        savedAttempt.providerStatus = (chargeResult as any).displayText || (chargeResult as any).message || 'Charge failed';
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
   * Submits OTP received from contributor via USSD
   */
  async submitUssdPaymentOtp(params: { reference: string; otp: string }): Promise<{
    status: 'success' | 'pay_offline' | 'pending' | 'failed';
    displayText?: string;
    message: string;
    paymentAttempt: PaymentAttempt;
  }> {
    const paymentAttempt = await this.paymentAttemptRepo.findOne({
      where: [{ reference: params.reference }, { providerReference: params.reference }],
      relations: ['contribution', 'contribution.project', 'contribution.project.owner', 'contribution.contributor'],
    });

    if (!paymentAttempt) {
      throw new NotFoundError(`Payment attempt with reference '${params.reference}' not found`);
    }

    const provider = this.currentProvider;
    const otpResult = provider.submitOtp
      ? await provider.submitOtp({
          reference: params.reference,
          otp: params.otp,
        })
      : {
          reference: params.reference,
          status: 'success' as const,
          message: 'Payment confirmed.',
        };

    if (otpResult.status === 'success') {
      const chargeData = (otpResult.rawResponse?.data as Record<string, unknown>) || {
        reference: paymentAttempt.reference,
        amount: MoneyUtil.toMinorUnit(paymentAttempt.amount),
        currency: paymentAttempt.currency,
        id: paymentAttempt.providerReference || paymentAttempt.reference,
      };

      const webhookRecord = this.webhookEventRepo.create({
        provider: provider.code,
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
      where: { id: paymentAttempt.id },
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
   * Handles RobsPay payment callback asynchronously
   */
  async handleRobspayCallback(
    data: Record<string, unknown>,
    _rawBody?: string | Buffer
  ): Promise<void> {
    const transactionId = String(data.trans_id || data.transaction_id || '').trim();
    const telcoTransId = String(data.telco_tran_id || '').trim();
    const rawStatus = String(data.status || '').toLowerCase().trim();
    const amount = data.amount !== undefined ? String(data.amount) : undefined;
    const paymentMethod = data.payment_method ? String(data.payment_method) : undefined;
    const customerName = data.customer_name ? String(data.customer_name) : undefined;

    logger.info(
      { transactionId, telcoTransId, status: rawStatus, amount, paymentMethod, customerName },
      'Processing RobsPay payment callback'
    );

    if (!transactionId) {
      logger.warn({ data }, 'RobsPay callback missing transaction ID (trans_id)');
      return;
    }

    // 1. Find payment attempt by providerReference (12-char hex) or reference
    const paymentAttempt = await this.paymentAttemptRepo.findOne({
      where: [{ providerReference: transactionId }, { reference: transactionId }],
      relations: ['contribution', 'contribution.project', 'contribution.project.owner', 'contribution.contributor'],
    });

    if (!paymentAttempt) {
      logger.warn({ transactionId }, 'PaymentAttempt not found for RobsPay callback');
      return;
    }

    // 2. Idempotency Check: if already confirmed successful, skip duplicate processing
    if (paymentAttempt.status === PaymentStatus.SUCCESSFUL) {
      logger.info(
        { transactionId, reference: paymentAttempt.reference },
        'PaymentAttempt already marked successful (idempotent skip)'
      );
      return;
    }

    // 3. Persist Webhook Event record for audit
    const webhookRecord = this.webhookEventRepo.create({
      provider: 'ROBSPAY',
      eventType: `callback.${rawStatus}`,
      eventId: telcoTransId || transactionId,
      reference: paymentAttempt.reference,
      rawPayload: data,
      isProcessed: false,
    });
    await this.webhookEventRepo.save(webhookRecord);

    const isSuccess = ['success', 'successful', 'paid', 'completed'].includes(rawStatus);
    const isFailed = ['failed', 'declined', 'cancelled', 'timeout'].includes(rawStatus);

    if (isSuccess) {
      // Amount verification if amount provided in callback
      if (amount) {
        const amountInMajor = MoneyUtil.formatAmount(amount);
        if (MoneyUtil.compare(paymentAttempt.amount, amountInMajor) !== 0) {
          logger.error(
            {
              expected: paymentAttempt.amount,
              received: amountInMajor,
              transactionId,
            },
            'RobsPay payment amount discrepancy detected'
          );
          paymentAttempt.status = PaymentStatus.FAILED;
          paymentAttempt.metadata = {
            ...paymentAttempt.metadata,
            discrepancy: `Expected ${paymentAttempt.amount}, received ${amountInMajor}`,
            telcoTransId,
          };
          await this.paymentAttemptRepo.save(paymentAttempt);

          webhookRecord.isProcessed = true;
          webhookRecord.processingResult = 'Amount discrepancy';
          await this.webhookEventRepo.save(webhookRecord);
          return;
        }
      }

      // Transactional multi-record financial write
      await AppDataSource.transaction(async (manager) => {
        paymentAttempt.status = PaymentStatus.SUCCESSFUL;
        paymentAttempt.fee = '0.00';
        paymentAttempt.completedAt = new Date();
        paymentAttempt.providerReference = transactionId;
        paymentAttempt.metadata = {
          ...paymentAttempt.metadata,
          telcoTransId,
          paymentMethod,
          customerName,
        };
        await manager.save(paymentAttempt);

        const contribution = paymentAttempt.contribution;
        contribution.status = ContributionStatus.CONFIRMED;
        await manager.save(contribution);

        // Update contributor name if received from telco and donor name was default
        if (customerName && contribution.contributor) {
          const contributor = contribution.contributor;
          if (!contributor.name || contributor.name.startsWith('Donor ')) {
            contributor.name = customerName;
            await manager.save(contributor);
          }
        }

        // Create ProviderTransaction record
        const providerTx = manager.create(ProviderTransaction, {
          paymentAttemptId: paymentAttempt.id,
          provider: 'ROBSPAY',
          providerTransactionId: telcoTransId || transactionId,
          reference: paymentAttempt.reference,
          amount: paymentAttempt.amount,
          currency: paymentAttempt.currency,
          fee: '0.00',
          status: 'success',
          gatewayResponse: 'Payment Successful',
          rawPayload: data,
        });
        await manager.save(providerTx);

        // Record double-entry financial ledger entry
        await financialService.recordPaymentConfirmed(contribution, paymentAttempt, manager);

        webhookRecord.isProcessed = true;
        webhookRecord.processedAt = new Date();
        webhookRecord.processingResult = 'Payment confirmed and ledger updated';
        await manager.save(webhookRecord);
      });

      // Trigger contributor SMS confirmation notification (non-blocking)
      const contribution = paymentAttempt.contribution;
      const project = contribution?.project;
      const contributorPhone = paymentAttempt.msisdn || contribution?.contributor?.msisdn;

      await notificationService.sendNotification({
        templateKey: 'CONTRIBUTION_CONFIRMED_CONTRIBUTOR',
        recipientPhone: contributorPhone || paymentAttempt.msisdn,
        eventType: 'PAYMENT_SUCCESS',
        variables: {
          amount: paymentAttempt.amount,
          currency: paymentAttempt.currency,
          projectName: project?.name || 'RaiseFunds Project',
          reference: paymentAttempt.reference,
        },
      });
      // Trigger host (project owner) SMS alert (non-blocking)
      if (project?.owner?.phone) {
        await notificationService.sendNotification({
          templateKey: 'NEW_CONTRIBUTION_OWNER',
          recipientPhone: project.owner.phone,
          eventType: 'PAYMENT_SUCCESS',
          variables: {
            amount: paymentAttempt.amount,
            currency: paymentAttempt.currency,
            projectName: project.name,
            reference: paymentAttempt.reference,
          },
        }).catch((err) => logger.warn({ err }, 'Failed to send host new contribution SMS alert'));
      }
    } else if (isFailed) {
      paymentAttempt.status = PaymentStatus.FAILED;
      paymentAttempt.providerStatus = String(data.status || 'Failed');
      await this.paymentAttemptRepo.save(paymentAttempt);

      if (paymentAttempt.contribution) {
        paymentAttempt.contribution.status = ContributionStatus.FAILED;
        await this.contributionRepo.save(paymentAttempt.contribution);
      }

      webhookRecord.isProcessed = true;
      webhookRecord.processedAt = new Date();
      webhookRecord.processingResult = 'Marked failed';
      await this.webhookEventRepo.save(webhookRecord);
    } else {
      logger.info({ status: rawStatus }, 'Unhandled RobsPay callback status (pending/other)');
      webhookRecord.isProcessed = true;
      webhookRecord.processingResult = `Status ${rawStatus}`;
      await this.webhookEventRepo.save(webhookRecord);
    }
  }

  /**
   * Handles authenticated webhook event idempotently
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
      provider: 'ROBSPAY',
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
      logger.info({ eventType }, 'Unhandled webhook event type');
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
      relations: ['contribution', 'contribution.project', 'contribution.project.owner', 'contribution.contributor'],
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
        provider: paymentAttempt.provider || 'ROBSPAY',
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
    webhookRecord?: ProviderWebhookEvent
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

    if (webhookRecord) {
      webhookRecord.isProcessed = true;
      webhookRecord.processedAt = new Date();
      webhookRecord.processingResult = 'Marked failed';
      await this.webhookEventRepo.save(webhookRecord);
    }
  }

  /**
   * Verifies payment status by reference or provider order ID
   */
  async verifyPayment(reference: string): Promise<PaymentAttempt> {
    const cleanRef = reference.trim();
    let paymentAttempt = await this.paymentAttemptRepo.findOne({
      where: [{ reference: cleanRef }, { providerReference: cleanRef }],
      relations: ['contribution', 'contribution.project', 'contribution.project.owner', 'contribution.contributor'],
    });

    if (!paymentAttempt) {
      // Check if reference is a contribution reference (ZF-CON-...) or contribution id
      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const isUuid = UUID_REGEX.test(cleanRef);
      const contribution = await this.contributionRepo.findOne({
        where: isUuid ? [{ reference: cleanRef }, { id: cleanRef }] : { reference: cleanRef },
        relations: ['paymentAttempts', 'project', 'contributor'],
      });

      if (contribution && contribution.paymentAttempts && contribution.paymentAttempts.length > 0) {
        const sorted = [...contribution.paymentAttempts].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        paymentAttempt = await this.paymentAttemptRepo.findOne({
          where: { id: sorted[0].id },
          relations: ['contribution', 'contribution.project', 'contribution.project.owner', 'contribution.contributor'],
        });
      }
    }

    if (!paymentAttempt) {
      throw new NotFoundError(`Payment with reference '${cleanRef}' not found`);
    }

    if (paymentAttempt.status === PaymentStatus.SUCCESSFUL) {
      return paymentAttempt;
    }

    const provider = this.currentProvider;
    const verifyResult = await provider.verifyTransaction(paymentAttempt.providerReference || paymentAttempt.reference);

    if (verifyResult.status === 'success') {
      const chargePayload = (verifyResult.rawResponse?.data as Record<string, unknown>) || {
        reference: paymentAttempt.reference,
        amount: MoneyUtil.toMinorUnit(paymentAttempt.amount),
        currency: paymentAttempt.currency,
        id: paymentAttempt.providerReference || paymentAttempt.reference,
      };
      const webhookRecord = this.webhookEventRepo.create({
        provider: provider.code,
        eventType: 'charge.success',
        reference: paymentAttempt.reference,
        rawPayload: chargePayload,
        isProcessed: false,
      });
      await this.processSuccessfulCharge(chargePayload, webhookRecord);
    } else if (verifyResult.status === 'failed' || verifyResult.status === 'abandoned') {
      const chargePayload = (verifyResult.rawResponse?.data as Record<string, unknown>) || {
        reference: paymentAttempt.reference,
        gateway_response: verifyResult.gatewayResponse || 'Transaction failed or abandoned',
      };
      const webhookRecord = this.webhookEventRepo.create({
        provider: provider.code,
        eventType: 'charge.failed',
        reference: paymentAttempt.reference,
        rawPayload: chargePayload,
        isProcessed: false,
      });
      await this.processFailedCharge(chargePayload, webhookRecord);
    }

    return (await this.paymentAttemptRepo.findOne({
      where: { id: paymentAttempt.id },
      relations: ['contribution', 'contribution.project', 'contribution.project.owner', 'contribution.contributor'],
    }))!;
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
