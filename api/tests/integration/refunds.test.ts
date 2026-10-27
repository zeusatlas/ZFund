import request from 'supertest';
import { createApp } from '../../src/app';
import { AppDataSource } from '../../src/config/database';
import { CryptoUtil } from '../../src/common/utils/crypto';
import { SystemRole } from '../../src/common/types/auth';
import { Contribution, ContributionStatus } from '../../src/database/entities/contribution.entity';
import { Contributor } from '../../src/database/entities/contributor.entity';
import { FinancialLedgerEntry } from '../../src/database/entities/financial-ledger-entry.entity';
import { Organization, OrgVerificationStatus } from '../../src/database/entities/organization.entity';
import { PaymentAttempt, PaymentChannel, PaymentStatus } from '../../src/database/entities/payment-attempt.entity';
import { Project, ProjectStatus } from '../../src/database/entities/project.entity';
import { Refund, RefundStatus } from '../../src/database/entities/refund.entity';
import { User, UserStatus } from '../../src/database/entities/user.entity';
import { PaystackProvider, paystackProvider } from '../../src/services/paystack.provider';
import { closeTestDatabase, setupTestDatabase } from '../test-db';

describe('Refund Management & Financial Reconciliation Workflow', () => {
  let app: any;
  let testUser: User;
  let testFinanceOfficer: User;
  let testProject: Project;
  let testContribution: Contribution;
  let testPaymentAttempt: PaymentAttempt;
  let adminToken: string;
  let financeToken: string;

  beforeAll(async () => {
    // Mock Paystack initiateRefund for offline deterministic integration tests
    paystackProvider.initiateRefund = async (params) => {
      return {
        providerRefundId: 'paystack_ref_' + Date.now(),
        status: 'success',
        amount: params.amount || '0.00',
        currency: params.currency || 'GHS',
        rawResponse: { status: true, data: { status: 'processed' } },
      };
    };

    await setupTestDatabase();
    app = createApp();

    const userRepo = AppDataSource.getRepository(User);
    const orgRepo = AppDataSource.getRepository(Organization);
    const projectRepo = AppDataSource.getRepository(Project);
    const contributorRepo = AppDataSource.getRepository(Contributor);
    const contributionRepo = AppDataSource.getRepository(Contribution);
    const paymentAttemptRepo = AppDataSource.getRepository(PaymentAttempt);

    testUser = await userRepo.save(
      userRepo.create({
        email: 'project.lead@zfund.org',
        passwordHash: 'hash',
        firstName: 'Daniel',
        lastName: 'Appiah',
        role: SystemRole.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
      })
    );

    testFinanceOfficer = await userRepo.save(
      userRepo.create({
        email: 'finance.officer@zfund.org',
        passwordHash: 'hash',
        firstName: 'Grace',
        lastName: 'Boateng',
        role: SystemRole.FINANCE_OFFICER,
        status: UserStatus.ACTIVE,
      })
    );

    adminToken = CryptoUtil.generateAccessToken({
      userId: testUser.id,
      email: testUser.email,
      role: testUser.role,
    });

    financeToken = CryptoUtil.generateAccessToken({
      userId: testFinanceOfficer.id,
      email: testFinanceOfficer.email,
      role: testFinanceOfficer.role,
    });

    const org = await orgRepo.save(
      orgRepo.create({
        name: 'Kumasi Tech Community',
        slug: 'kumasi-tech-community',
        verificationStatus: OrgVerificationStatus.VERIFIED,
      })
    );

    testProject = await projectRepo.save(
      projectRepo.create({
        name: 'Community Center Solar Installation',
        organizationId: org.id,
        ownerId: testUser.id,
        eventCode: '3003',
        currency: 'GHS',
        minAmount: '5.00',
        maxAmount: '5000.00',
        status: ProjectStatus.PUBLISHED,
        acceptsContributions: true,
      })
    );

    const contributor = await contributorRepo.save(
      contributorRepo.create({
        msisdn: '233240000002',
        name: 'Yaw Boakye',
        email: 'yaw@example.com',
      })
    );

    testContribution = await contributionRepo.save(
      contributionRepo.create({
        reference: 'ZF-CON-REFUND-001',
        projectId: testProject.id,
        contributorId: contributor.id,
        amount: '100.00',
        currency: 'GHS',
        status: ContributionStatus.CONFIRMED, // Eligible for refund
      })
    );

    testPaymentAttempt = await paymentAttemptRepo.save(
      paymentAttemptRepo.create({
        reference: 'ZF-PAY-REFUND-001',
        contributionId: testContribution.id,
        provider: 'PAYSTACK',
        channel: PaymentChannel.MOBILE_MONEY,
        msisdn: '233240000002',
        amount: '100.00',
        currency: 'GHS',
        status: PaymentStatus.SUCCESSFUL,
        fee: '2.00',
        providerReference: 'paystack_tx_123456',
      })
    );
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it('should reject refund request if requested amount exceeds remaining refundable amount', async () => {
    const res = await request(app)
      .post('/api/v1/refunds')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        contributionId: testContribution.id,
        amount: '150.00', // Contribution was only 100.00
        reason: 'Contributor entered wrong amount by mistake',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('exceeds remaining refundable amount');
  });

  it('should successfully submit a valid partial refund request', async () => {
    const res = await request(app)
      .post('/api/v1/refunds')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        contributionId: testContribution.id,
        amount: '40.00', // Partial refund of 40 out of 100
        reason: 'Partial contribution return requested by organizer',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe(RefundStatus.REQUESTED);
    expect(Number(res.body.data.amount)).toBe(40.00);
    expect(res.body.data.refundReference).toMatch(/^ZF-REF-/);
  });

  it('should review and approve the refund request', async () => {
    const refundRepo = AppDataSource.getRepository(Refund);
    const refund = await refundRepo.findOne({
      where: { contributionId: testContribution.id, status: RefundStatus.REQUESTED },
    });
    expect(refund).toBeDefined();

    const res = await request(app)
      .patch(`/api/v1/refunds/${refund!.id}/review`)
      .set('Authorization', `Bearer ${financeToken}`)
      .send({
        status: RefundStatus.APPROVED,
        approvalNotes: 'Verified contributor request with project manager. Approved.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe(RefundStatus.APPROVED);
    expect(res.body.data.approvalNotes).toContain('Verified');
  });

  it('should process the approved refund, record ledger entries, and update contribution status to PARTIALLY_REFUNDED', async () => {
    const refundRepo = AppDataSource.getRepository(Refund);
    const refund = await refundRepo.findOne({
      where: { contributionId: testContribution.id, status: RefundStatus.APPROVED },
    });
    expect(refund).toBeDefined();

    const res = await request(app)
      .post(`/api/v1/refunds/${refund!.id}/process`)
      .set('Authorization', `Bearer ${financeToken}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe(RefundStatus.COMPLETED);

    // Verify contribution status updated to PARTIALLY_REFUNDED
    const contributionRepo = AppDataSource.getRepository(Contribution);
    const updatedContribution = await contributionRepo.findOne({
      where: { id: testContribution.id },
    });
    expect(updatedContribution?.status).toBe(ContributionStatus.PARTIALLY_REFUNDED);

    // Verify double-entry ledger entry was created for the refund
    const ledgerRepo = AppDataSource.getRepository(FinancialLedgerEntry);
    const refundLedger = await ledgerRepo.findOne({
      where: { refundId: refund!.id },
    });

    expect(refundLedger).toBeDefined();
    // In refund: Debit Contributions Payable (liability decreased), Credit Cash/Clearing (asset decreased)
    expect(refundLedger?.debitAccount).toBe('2000_CONTRIBUTIONS_PAYABLE');
    expect(refundLedger?.creditAccount).toBe('1000_CASH_CLEARING');
    expect(Number(refundLedger?.amount)).toBe(40.00);
  });

  it('should prevent requesting another refund for more than the remaining refundable balance', async () => {
    // 100 - 40 = 60 remaining
    const res = await request(app)
      .post('/api/v1/refunds')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        contributionId: testContribution.id,
        amount: '65.00', // Exceeds 60.00
        reason: 'Attempting to refund more than remainder',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('exceeds remaining refundable amount');
  });

  it('should allow refunding remaining 60.00 and transition contribution to fully REFUNDED', async () => {
    // 1. Request remainder
    const reqRes = await request(app)
      .post('/api/v1/refunds')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        contributionId: testContribution.id,
        amount: '60.00',
        reason: 'Final refund balance',
      });
    expect(reqRes.status).toBe(201);
    const refundId = reqRes.body.data.id;

    // 2. Approve
    await request(app)
      .patch(`/api/v1/refunds/${refundId}/review`)
      .set('Authorization', `Bearer ${financeToken}`)
      .send({
        status: RefundStatus.APPROVED,
        approvalNotes: 'Approved final balance',
      });

    // 3. Process
    const processRes = await request(app)
      .post(`/api/v1/refunds/${refundId}/process`)
      .set('Authorization', `Bearer ${financeToken}`)
      .send();

    expect(processRes.status).toBe(200);

    // Verify contribution status is now REFUNDED (fully refunded)
    const contributionRepo = AppDataSource.getRepository(Contribution);
    const finalContribution = await contributionRepo.findOne({
      where: { id: testContribution.id },
    });
    expect(finalContribution?.status).toBe(ContributionStatus.REFUNDED);
  });
});
