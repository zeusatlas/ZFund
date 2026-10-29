import request from 'supertest';
import { createApp } from '../../src/app';
import { AppDataSource } from '../../src/config/database';
import { env } from '../../src/config/env';
import { CryptoUtil } from '../../src/common/utils/crypto';
import { RobspayProvider } from '../../src/services/robspay.provider';
import { Contribution, ContributionStatus } from '../../src/database/entities/contribution.entity';
import { Contributor } from '../../src/database/entities/contributor.entity';
import { FinancialLedgerEntry } from '../../src/database/entities/financial-ledger-entry.entity';
import { Organization, OrgVerificationStatus } from '../../src/database/entities/organization.entity';
import { PaymentAttempt, PaymentChannel, PaymentStatus } from '../../src/database/entities/payment-attempt.entity';
import { ProviderTransaction } from '../../src/database/entities/provider-transaction.entity';
import { Project, ProjectStatus } from '../../src/database/entities/project.entity';
import { User, UserStatus } from '../../src/database/entities/user.entity';
import { SystemRole } from '../../src/common/types/auth';
import { closeTestDatabase, setupTestDatabase } from '../test-db';

describe('RobsPay Payment Collection & Webhook Workflow', () => {
  let app: any;
  let testProject: Project;
  let testContributor: Contributor;
  let testContribution: Contribution;
  let testPaymentAttempt: PaymentAttempt;
  const testOrderId = RobspayProvider.generateTransactionId();

  beforeAll(async () => {
    await setupTestDatabase();
    app = createApp();

    const userRepo = AppDataSource.getRepository(User);
    const orgRepo = AppDataSource.getRepository(Organization);
    const projectRepo = AppDataSource.getRepository(Project);
    const contributorRepo = AppDataSource.getRepository(Contributor);
    const contributionRepo = AppDataSource.getRepository(Contribution);
    const paymentAttemptRepo = AppDataSource.getRepository(PaymentAttempt);

    const user = await userRepo.save(
      userRepo.create({
        email: 'organizer@zfund.edu.gh',
        passwordHash: 'argon_hash',
        firstName: 'Ama',
        lastName: 'Osei',
        role: SystemRole.ACCOUNT_OWNER,
        status: UserStatus.ACTIVE,
      })
    );

    const org = await orgRepo.save(
      orgRepo.create({
        name: 'Zeus Atlas Community',
        slug: 'zeus-atlas',
        verificationStatus: OrgVerificationStatus.VERIFIED,
      })
    );

    testProject = await projectRepo.save(
      projectRepo.create({
        name: 'CPP Dues & Development Fund',
        organizationId: org.id,
        ownerId: user.id,
        eventCode: '3001',
        currency: 'GHS',
        minAmount: '1.00',
        maxAmount: '10000.00',
        status: ProjectStatus.PUBLISHED,
        acceptsContributions: true,
      })
    );

    testContributor = await contributorRepo.save(
      contributorRepo.create({
        msisdn: '0545547479',
        name: 'Donor 7479',
        email: 'donor@example.com',
      })
    );

    testContribution = await contributionRepo.save(
      contributionRepo.create({
        reference: 'ZF-CON-ROBS-1001',
        projectId: testProject.id,
        contributorId: testContributor.id,
        amount: '50.00',
        currency: 'GHS',
        status: ContributionStatus.INITIATED,
      })
    );

    testPaymentAttempt = await paymentAttemptRepo.save(
      paymentAttemptRepo.create({
        reference: 'ZF-PAY-ROBS-1001',
        contributionId: testContribution.id,
        provider: 'ROBSPAY',
        channel: PaymentChannel.MOBILE_MONEY,
        msisdn: '0545547479',
        amount: '50.00',
        currency: 'GHS',
        status: PaymentStatus.INITIATED,
        fee: '0.00',
        providerReference: testOrderId,
      })
    );
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it('should generate valid RobsPay HMAC-SHA256 signature and 12-char order ID', () => {
    const orderId = CryptoUtil.generateRobspayOrderId();
    expect(orderId).toHaveLength(12);
    expect(orderId).toMatch(/^[0-9A-F]{12}$/);

    const payload = JSON.stringify({
      merchant_id: env.ROBSPAY_MERCHANT_ID,
      amount: 1,
      customer_number: '0545547479',
      transaction_id: orderId,
      reference: 'CPP Dues Payment',
      callback_url: 'https://robspay.robsamtechnology.com/trial-callback',
    });

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = CryptoUtil.generateRobspaySignature(payload, timestamp, env.ROBSPAY_API_KEY);

    expect(signature).toBeDefined();
    expect(signature).toHaveLength(64);

    const isValid = CryptoUtil.verifyRobspaySignature(payload, signature, timestamp, env.ROBSPAY_API_KEY);
    expect(isValid).toBe(true);

    const isInvalid = CryptoUtil.verifyRobspaySignature(payload, 'wrongsignature', timestamp, env.ROBSPAY_API_KEY);
    expect(isInvalid).toBe(false);
  });

  it('should initiate payment via /api/v1/payments/initiate with ROBSPAY provider and 12-char providerReference', async () => {
    const res = await request(app)
      .post('/api/v1/payments/initiate')
      .send({
        projectId: testProject.id,
        amount: '25.00',
        msisdn: '0545547479',
        name: 'Kofi Mensah',
        email: 'kofi@example.com',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.paymentAttempt.provider).toBe('ROBSPAY');
    expect(res.body.data.paymentAttempt.providerReference).toBeDefined();
    expect(res.body.data.paymentAttempt.providerReference).toHaveLength(12);
    expect(res.body.data.paymentAttempt.status).toBe('PENDING');
  });

  it('should process valid RobsPay callback: confirm payment, update contribution, update contributor name, and write ledger entries', async () => {
    const callbackData = {
      trans_id: testOrderId,
      telco_tran_id: 'TELCO-MTN-998877',
      status: 'success',
      amount: 50.00,
      timestamp: String(Math.floor(Date.now() / 1000)),
      payment_method: 'MTN Mobile Money',
      customer_name: 'Kwame Nkrumah',
    };

    const res = await request(app)
      .post('/api/v1/payments/webhook/robspay')
      .set('Content-Type', 'application/json')
      .send(callbackData);

    expect(res.status).toBe(200);

    // Verify PaymentAttempt
    const paymentAttemptRepo = AppDataSource.getRepository(PaymentAttempt);
    const updatedAttempt = await paymentAttemptRepo.findOne({
      where: { reference: testPaymentAttempt.reference },
    });
    expect(updatedAttempt?.status).toBe(PaymentStatus.SUCCESSFUL);
    expect(updatedAttempt?.completedAt).toBeDefined();
    expect(updatedAttempt?.metadata?.telcoTransId).toBe('TELCO-MTN-998877');
    expect(updatedAttempt?.metadata?.paymentMethod).toBe('MTN Mobile Money');

    // Verify Contribution
    const contributionRepo = AppDataSource.getRepository(Contribution);
    const updatedContribution = await contributionRepo.findOne({
      where: { id: testContribution.id },
    });
    expect(updatedContribution?.status).toBe(ContributionStatus.CONFIRMED);

    // Verify Contributor name updated from customer_name
    const contributorRepo = AppDataSource.getRepository(Contributor);
    const updatedContributor = await contributorRepo.findOne({
      where: { id: testContributor.id },
    });
    expect(updatedContributor?.name).toBe('Kwame Nkrumah');

    // Verify ProviderTransaction
    const providerTxRepo = AppDataSource.getRepository(ProviderTransaction);
    const providerTx = await providerTxRepo.findOne({
      where: { reference: testPaymentAttempt.reference },
    });
    expect(providerTx).toBeDefined();
    expect(providerTx?.provider).toBe('ROBSPAY');
    expect(providerTx?.status).toBe('success');
    expect(providerTx?.providerTransactionId).toBe('TELCO-MTN-998877');

    // Verify Financial Ledger Entries (Double-Entry Bookkeeping)
    const ledgerRepo = AppDataSource.getRepository(FinancialLedgerEntry);
    const entries = await ledgerRepo.find({
      where: { contributionId: testContribution.id },
    });
    expect(entries.length).toBe(1); expect(entries[0].debitAccount).toBe("1000_CASH_CLEARING"); expect(entries[0].creditAccount).toBe("2000_CONTRIBUTIONS_PAYABLE");
  });

  it('CRITICAL IDEMPOTENCY TEST: Duplicate RobsPay callback must not duplicate ledger entries or corrupt state', async () => {
    const ledgerRepo = AppDataSource.getRepository(FinancialLedgerEntry);
    const entriesBefore = await ledgerRepo.find({
      where: { contributionId: testContribution.id },
    });

    const callbackData = {
      trans_id: testOrderId,
      telco_tran_id: 'TELCO-MTN-998877',
      status: 'success',
      amount: 50.00,
      timestamp: String(Math.floor(Date.now() / 1000)),
      payment_method: 'MTN Mobile Money',
      customer_name: 'Kwame Nkrumah',
    };

    const res = await request(app)
      .post('/api/v1/payments/webhook/robspay')
      .set('Content-Type', 'application/json')
      .send(callbackData);

    expect(res.status).toBe(200);

    const entriesAfter = await ledgerRepo.find({
      where: { contributionId: testContribution.id },
    });
    expect(entriesAfter.length).toBe(entriesBefore.length);
  });

  it('should process callback via root /trial-callback endpoint', async () => {
    const contributionRepo = AppDataSource.getRepository(Contribution);
    const paymentAttemptRepo = AppDataSource.getRepository(PaymentAttempt);
    const trialOrderId = RobspayProvider.generateTransactionId();

    const con = await contributionRepo.save(
      contributionRepo.create({
        reference: 'ZF-CON-TRIAL-999',
        projectId: testProject.id,
        contributorId: testContributor.id,
        amount: '1.00',
        currency: 'GHS',
        status: ContributionStatus.INITIATED,
      })
    );

    await paymentAttemptRepo.save(
      paymentAttemptRepo.create({
        reference: 'ZF-PAY-TRIAL-999',
        contributionId: con.id,
        provider: 'ROBSPAY',
        channel: PaymentChannel.MOBILE_MONEY,
        msisdn: '0545547479',
        amount: '1.00',
        currency: 'GHS',
        status: PaymentStatus.INITIATED,
        fee: '0.00',
        providerReference: trialOrderId,
      })
    );

    const res = await request(app)
      .post('/trial-callback')
      .set('Content-Type', 'application/json')
      .send({
        trans_id: trialOrderId,
        telco_tran_id: 'TELCO-112233',
        status: 'success',
        amount: 1,
        timestamp: String(Math.floor(Date.now() / 1000)),
        payment_method: 'Telecel Cash',
        customer_name: 'Trial User',
      });

    expect(res.status).toBe(200);

    const updated = await paymentAttemptRepo.findOne({
      where: { reference: 'ZF-PAY-TRIAL-999' },
    });
    expect(updated?.status).toBe(PaymentStatus.SUCCESSFUL);
  });

  it('should detect amount discrepancy and NOT confirm payment when received amount differs', async () => {
    const contributionRepo = AppDataSource.getRepository(Contribution);
    const paymentAttemptRepo = AppDataSource.getRepository(PaymentAttempt);
    const badOrderId = RobspayProvider.generateTransactionId();

    const con = await contributionRepo.save(
      contributionRepo.create({
        reference: 'ZF-CON-DISCREP-1',
        projectId: testProject.id,
        contributorId: testContributor.id,
        amount: '100.00',
        currency: 'GHS',
        status: ContributionStatus.INITIATED,
      })
    );

    const attempt = await paymentAttemptRepo.save(
      paymentAttemptRepo.create({
        reference: 'ZF-PAY-DISCREP-1',
        contributionId: con.id,
        provider: 'ROBSPAY',
        channel: PaymentChannel.MOBILE_MONEY,
        msisdn: '0545547479',
        amount: '100.00',
        currency: 'GHS',
        status: PaymentStatus.INITIATED,
        fee: '0.00',
        providerReference: badOrderId,
      })
    );

    // RobsPay callback claims 20.00 instead of 100.00
    const res = await request(app)
      .post('/api/v1/payments/webhook/robspay')
      .set('Content-Type', 'application/json')
      .send({
        trans_id: badOrderId,
        telco_tran_id: 'TELCO-DISCREP',
        status: 'success',
        amount: 20.00,
        timestamp: String(Math.floor(Date.now() / 1000)),
      });

    expect(res.status).toBe(200);

    const updatedAttempt = await paymentAttemptRepo.findOne({
      where: { id: attempt.id },
    });
    expect(updatedAttempt?.status).toBe(PaymentStatus.FAILED);
    expect(updatedAttempt?.metadata?.discrepancy).toBeDefined();

    const updatedCon = await contributionRepo.findOne({
      where: { id: con.id },
    });
    expect(updatedCon?.status).not.toBe(ContributionStatus.CONFIRMED);
  });

  it('should mark payment and contribution as FAILED when callback status is failed', async () => {
    const contributionRepo = AppDataSource.getRepository(Contribution);
    const paymentAttemptRepo = AppDataSource.getRepository(PaymentAttempt);
    const failedOrderId = RobspayProvider.generateTransactionId();

    const con = await contributionRepo.save(
      contributionRepo.create({
        reference: 'ZF-CON-FAIL-1',
        projectId: testProject.id,
        contributorId: testContributor.id,
        amount: '30.00',
        currency: 'GHS',
        status: ContributionStatus.INITIATED,
      })
    );

    const attempt = await paymentAttemptRepo.save(
      paymentAttemptRepo.create({
        reference: 'ZF-PAY-FAIL-1',
        contributionId: con.id,
        provider: 'ROBSPAY',
        channel: PaymentChannel.MOBILE_MONEY,
        msisdn: '0545547479',
        amount: '30.00',
        currency: 'GHS',
        status: PaymentStatus.INITIATED,
        fee: '0.00',
        providerReference: failedOrderId,
      })
    );

    const res = await request(app)
      .post('/api/v1/payments/webhook/robspay')
      .set('Content-Type', 'application/json')
      .send({
        trans_id: failedOrderId,
        telco_tran_id: 'TELCO-FAIL',
        status: 'failed',
        amount: 30.00,
        timestamp: String(Math.floor(Date.now() / 1000)),
      });

    expect(res.status).toBe(200);

    const updatedAttempt = await paymentAttemptRepo.findOne({
      where: { id: attempt.id },
    });
    expect(updatedAttempt?.status).toBe(PaymentStatus.FAILED);

    const updatedCon = await contributionRepo.findOne({
      where: { id: con.id },
    });
    expect(updatedCon?.status).toBe(ContributionStatus.FAILED);
  });

  it('should verify payment status via GET /api/v1/payments/verify/:reference', async () => {
    const res = await request(app)
      .get(`/api/v1/payments/verify/${testPaymentAttempt.reference}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('SUCCESSFUL');
  });
});
