import crypto from 'crypto';
import request from 'supertest';
import { createApp } from '../../src/app';
import { AppDataSource } from '../../src/config/database';
import { env } from '../../src/config/env';
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

describe('Paystack Webhook & Payment Confirmation Workflow', () => {
  let app: any;
  let testProject: Project;
  let testContributor: Contributor;
  let testContribution: Contribution;
  let testPaymentAttempt: PaymentAttempt;

  beforeAll(async () => {
    await setupTestDatabase();
    app = createApp();

    const userRepo = AppDataSource.getRepository(User);
    const orgRepo = AppDataSource.getRepository(Organization);
    const projectRepo = AppDataSource.getRepository(Project);
    const contributorRepo = AppDataSource.getRepository(Contributor);
    const contributionRepo = AppDataSource.getRepository(Contribution);
    const paymentAttemptRepo = AppDataSource.getRepository(PaymentAttempt);

    // Setup base entities
    const user = await userRepo.save(
      userRepo.create({
        email: 'organizer@school.edu.gh',
        passwordHash: 'argon_hash',
        firstName: 'Ama',
        lastName: 'Osei',
        role: SystemRole.ACCOUNT_OWNER,
        status: UserStatus.ACTIVE,
      })
    );

    const org = await orgRepo.save(
      orgRepo.create({
        name: 'Achimota Alumni Association',
        slug: 'achimota-alumni',
        verificationStatus: OrgVerificationStatus.VERIFIED,
      })
    );

    testProject = await projectRepo.save(
      projectRepo.create({
        name: 'Science Lab Renovation',
        organizationId: org.id,
        ownerId: user.id,
        eventCode: '2002',
        currency: 'GHS',
        minAmount: '1.00',
        maxAmount: '10000.00',
        status: ProjectStatus.PUBLISHED,
        acceptsContributions: true,
      })
    );

    testContributor = await contributorRepo.save(
      contributorRepo.create({
        msisdn: '233240000001',
        name: 'Kofi Mensah',
        email: 'kofi@example.com',
      })
    );

    testContribution = await contributionRepo.save(
      contributionRepo.create({
        reference: 'ZF-CON-TEST-1001',
        projectId: testProject.id,
        contributorId: testContributor.id,
        amount: '50.00',
        currency: 'GHS',
        status: ContributionStatus.INITIATED,
      })
    );

    testPaymentAttempt = await paymentAttemptRepo.save(
      paymentAttemptRepo.create({
        reference: 'ZF-PAY-TEST-1001',
        contributionId: testContribution.id,
        provider: 'PAYSTACK',
        channel: PaymentChannel.MOBILE_MONEY,
        msisdn: '233240000001',
        amount: '50.00',
        currency: 'GHS',
        status: PaymentStatus.INITIATED,
        fee: '0.00',
      })
    );
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  function generateSignature(payload: string): string {
    return crypto
      .createHmac('sha512', env.PAYSTACK_SECRET_KEY)
      .update(payload)
      .digest('hex');
  }

  it('should reject webhook with 401 when signature header is missing', async () => {
    const payload = JSON.stringify({
      event: 'charge.success',
      data: { reference: 'ZF-PAY-TEST-1001' },
    });

    const res = await request(app)
      .post('/api/v1/payments/webhook/paystack')
      .set('Content-Type', 'application/json')
      .send(payload);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('x-paystack-signature');
  });

  it('should reject webhook with 401 when signature is invalid', async () => {
    const payload = JSON.stringify({
      event: 'charge.success',
      data: { reference: 'ZF-PAY-TEST-1001' },
    });

    const res = await request(app)
      .post('/api/v1/payments/webhook/paystack')
      .set('Content-Type', 'application/json')
      .set('x-paystack-signature', 'invalid_signature_hash_12345')
      .send(payload);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid Paystack webhook signature');
  });

  it('should process valid charge.success webhook: confirm payment, update contribution, and write double-entry ledger entries', async () => {
    const payloadObj = {
      event: 'charge.success',
      data: {
        id: 987654321,
        reference: testPaymentAttempt.reference,
        amount: 5000, // 50.00 GHS in pesewas (minor unit)
        currency: 'GHS',
        fees: 100, // 1.00 GHS fee
        gateway_response: 'Approved',
        channel: 'mobile_money',
        customer: {
          email: 'kofi@example.com',
          phone: '233240000001',
        },
      },
    };

    const rawPayload = JSON.stringify(payloadObj);
    const validSignature = generateSignature(rawPayload);

    const res = await request(app)
      .post('/api/v1/payments/webhook/paystack')
      .set('Content-Type', 'application/json')
      .set('x-paystack-signature', validSignature)
      .send(rawPayload);

    expect(res.status).toBe(200);
    expect(res.text).toBe('Webhook processed');

    // Verify PaymentAttempt status
    const paymentAttemptRepo = AppDataSource.getRepository(PaymentAttempt);
    const updatedAttempt = await paymentAttemptRepo.findOne({
      where: { id: testPaymentAttempt.id },
    });
    expect(updatedAttempt?.status).toBe(PaymentStatus.SUCCESSFUL);
    expect(Number(updatedAttempt?.fee)).toBe(1.00);
    expect(updatedAttempt?.providerReference).toBe('987654321');

    // Verify Contribution status
    const contributionRepo = AppDataSource.getRepository(Contribution);
    const updatedContribution = await contributionRepo.findOne({
      where: { id: testContribution.id },
    });
    expect(updatedContribution?.status).toBe(ContributionStatus.CONFIRMED);

    // Verify ProviderTransaction created
    const providerTxRepo = AppDataSource.getRepository(ProviderTransaction);
    const providerTx = await providerTxRepo.findOne({
      where: { paymentAttemptId: testPaymentAttempt.id },
    });
    expect(providerTx).toBeDefined();
    expect(Number(providerTx?.amount)).toBe(50.00);
    expect(Number(providerTx?.fee)).toBe(1.00);
    expect(providerTx?.status).toBe('success');

    // Verify Double-Entry Financial Ledger Entries
    const ledgerRepo = AppDataSource.getRepository(FinancialLedgerEntry);
    const ledgerEntries = await ledgerRepo.find({
      where: { contributionId: testContribution.id },
    });

    // Expect 2 entries: Principal (Debit Cash, Credit Payable) and Provider Fee (Debit Expense, Credit Cash)
    expect(ledgerEntries.length).toBe(2);
    const principalEntry = ledgerEntries.find(
      (e) => e.debitAccount === '1000_CASH_CLEARING' && e.creditAccount === '2000_CONTRIBUTIONS_PAYABLE'
    );
    const feeEntry = ledgerEntries.find(
      (e) => e.debitAccount === '5000_PAYMENT_GATEWAY_FEE' && e.creditAccount === '1000_CASH_CLEARING'
    );

    expect(principalEntry).toBeDefined();
    expect(feeEntry).toBeDefined();
    expect(Number(principalEntry?.amount)).toBe(50.00);
    expect(Number(feeEntry?.amount)).toBe(1.00);
  });

  it('CRITICAL IDEMPOTENCY TEST: Duplicate webhook delivery must not duplicate ledger entries or corrupt state', async () => {
    const payloadObj = {
      event: 'charge.success',
      data: {
        id: 987654321,
        reference: testPaymentAttempt.reference,
        amount: 5000,
        currency: 'GHS',
        fees: 100,
        gateway_response: 'Approved',
      },
    };

    const rawPayload = JSON.stringify(payloadObj);
    const validSignature = generateSignature(rawPayload);

    // Send the exact same webhook a second time
    const res = await request(app)
      .post('/api/v1/payments/webhook/paystack')
      .set('Content-Type', 'application/json')
      .set('x-paystack-signature', validSignature)
      .send(rawPayload);

    expect(res.status).toBe(200);
    expect(res.text).toBe('Webhook processed');

    // Ledger entries count must remain exactly as before (no duplicates)
    const ledgerRepo = AppDataSource.getRepository(FinancialLedgerEntry);
    const ledgerEntries = await ledgerRepo.find({
      where: { contributionId: testContribution.id },
    });
    expect(ledgerEntries.length).toBe(2);
  });

  it('should detect amount discrepancy and NOT confirm payment when received amount differs from expected', async () => {
    const contributionRepo = AppDataSource.getRepository(Contribution);
    const paymentAttemptRepo = AppDataSource.getRepository(PaymentAttempt);

    // Create a new attempt expecting 100.00 GHS
    const newContribution = await contributionRepo.save(
      contributionRepo.create({
        reference: 'ZF-CON-TEST-DISC',
        projectId: testProject.id,
        contributorId: testContributor.id,
        amount: '100.00',
        currency: 'GHS',
        status: ContributionStatus.INITIATED,
      })
    );

    const newPaymentAttempt = await paymentAttemptRepo.save(
      paymentAttemptRepo.create({
        reference: 'ZF-PAY-TEST-DISC',
        contributionId: newContribution.id,
        provider: 'PAYSTACK',
        channel: PaymentChannel.MOBILE_MONEY,
        msisdn: '233240000001',
        amount: '100.00',
        currency: 'GHS',
        status: PaymentStatus.INITIATED,
        fee: '0.00',
      })
    );

    // Send webhook with amount of 20.00 GHS (2000 pesewas) instead of 100.00 GHS
    const discrepancyPayload = JSON.stringify({
      event: 'charge.success',
      data: {
        id: 999111,
        reference: newPaymentAttempt.reference,
        amount: 2000, // 20.00 GHS (underpaid)
        currency: 'GHS',
      },
    });

    const signature = generateSignature(discrepancyPayload);

    const res = await request(app)
      .post('/api/v1/payments/webhook/paystack')
      .set('Content-Type', 'application/json')
      .set('x-paystack-signature', signature)
      .send(discrepancyPayload);

    expect(res.status).toBe(200);

    // Verify PaymentAttempt was marked FAILED due to discrepancy
    const attempt = await paymentAttemptRepo.findOne({
      where: { id: newPaymentAttempt.id },
    });
    expect(attempt?.status).toBe(PaymentStatus.FAILED);

    // Verify Contribution was NOT confirmed
    const contribution = await contributionRepo.findOne({
      where: { id: newContribution.id },
    });
    expect(contribution?.status).toBe(ContributionStatus.INITIATED);

    // Verify NO ledger entries created for this contribution
    const ledgerRepo = AppDataSource.getRepository(FinancialLedgerEntry);
    const ledgerEntries = await ledgerRepo.find({
      where: { contributionId: newContribution.id },
    });
    expect(ledgerEntries.length).toBe(0);
  });

  describe('GET /api/v1/payments/verify/:reference', () => {
    it('should verify pending payment by payment reference and mark contribution CONFIRMED', async () => {
      const contributionRepo = AppDataSource.getRepository(Contribution);
      const paymentAttemptRepo = AppDataSource.getRepository(PaymentAttempt);

      const pendingContribution = await contributionRepo.save(
        contributionRepo.create({
          reference: 'ZF-CON-VERIFY-1',
          projectId: testProject.id,
          contributorId: testContributor.id,
          amount: '50.00',
          currency: 'GHS',
          status: ContributionStatus.PENDING,
        })
      );

      const pendingPaymentAttempt = await paymentAttemptRepo.save(
        paymentAttemptRepo.create({
          reference: 'ZF-PAY-VERIFY-1',
          contributionId: pendingContribution.id,
          provider: 'PAYSTACK',
          channel: PaymentChannel.MOBILE_MONEY,
          msisdn: '233240000001',
          amount: '50.00',
          currency: 'GHS',
          status: PaymentStatus.PENDING,
          fee: '0.00',
        })
      );

      const res = await request(app).get('/api/v1/payments/verify/' + pendingPaymentAttempt.reference);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe(PaymentStatus.SUCCESSFUL);

      // Verify DB state
      const updatedContribution = await contributionRepo.findOne({
        where: { id: pendingContribution.id },
      });
      expect(updatedContribution?.status).toBe(ContributionStatus.CONFIRMED);
    });

    it('should verify payment using contribution reference (resolving latest attempt)', async () => {
      const contributionRepo = AppDataSource.getRepository(Contribution);
      const paymentAttemptRepo = AppDataSource.getRepository(PaymentAttempt);

      const pendingContribution = await contributionRepo.save(
        contributionRepo.create({
          reference: 'ZF-CON-VERIFY-BY-CON',
          projectId: testProject.id,
          contributorId: testContributor.id,
          amount: '50.00',
          currency: 'GHS',
          status: ContributionStatus.PENDING,
        })
      );

      await paymentAttemptRepo.save(
        paymentAttemptRepo.create({
          reference: 'ZF-PAY-VERIFY-BY-CON',
          contributionId: pendingContribution.id,
          provider: 'PAYSTACK',
          channel: PaymentChannel.MOBILE_MONEY,
          msisdn: '233240000001',
          amount: '50.00',
          currency: 'GHS',
          status: PaymentStatus.PENDING,
          fee: '0.00',
        })
      );

      const res = await request(app).get('/api/v1/payments/verify/' + pendingContribution.reference);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe(PaymentStatus.SUCCESSFUL);

      const updatedContribution = await contributionRepo.findOne({
        where: { id: pendingContribution.id },
      });
      expect(updatedContribution?.status).toBe(ContributionStatus.CONFIRMED);
    });

    it('should return 404 for non-existent payment reference', async () => {
      const res = await request(app).get('/api/v1/payments/verify/NON-EXISTENT-REF-999');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
