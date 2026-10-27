import request from 'supertest';
import { createApp } from '../../src/app';
import { AppDataSource } from '../../src/config/database';
import { CryptoUtil } from '../../src/common/utils/crypto';
import { SystemRole } from '../../src/common/types/auth';
import { Contribution, ContributionStatus } from '../../src/database/entities/contribution.entity';
import { Contributor } from '../../src/database/entities/contributor.entity';
import { Project, ProjectStatus } from '../../src/database/entities/project.entity';
import { User, UserStatus } from '../../src/database/entities/user.entity';
import { closeTestDatabase, setupTestDatabase } from '../test-db';

describe('Withdrawal requests', () => {
  let app: any;
  let adminToken: string;
  let hostToken: string;
  let otherHostToken: string;
  let projectId: string;
  let requestId: string;

  const body = (overrides: Record<string, unknown> = {}) => ({
    projectId,
    amount: '40.00',
    method: 'MOBILE_MONEY',
    recipientName: 'Akosua Mensah',
    institution: 'MTN',
    accountNumber: '0241234567',
    purpose: 'Pay for the venue and catering',
    ...overrides,
  });

  const makeUser = async (email: string, role: SystemRole) => {
    const repo = AppDataSource.getRepository(User);
    const user = await repo.save(
      repo.create({ email, passwordHash: 'hash', firstName: 'Test', lastName: email.split('@')[0], role, status: UserStatus.ACTIVE })
    );
    return { user, token: CryptoUtil.generateAccessToken({ userId: user.id, email, role }) };
  };

  beforeAll(async () => {
    await setupTestDatabase();
    app = createApp();

    const admin = await makeUser('wd-admin@zfund.org', SystemRole.SUPER_ADMIN);
    const host = await makeUser('wd-host@zfund.org', SystemRole.ACCOUNT_OWNER);
    const other = await makeUser('wd-other@zfund.org', SystemRole.ACCOUNT_OWNER);
    adminToken = admin.token;
    hostToken = host.token;
    otherHostToken = other.token;

    const project = await AppDataSource.getRepository(Project).save(
      AppDataSource.getRepository(Project).create({
        name: 'Roof Fund',
        ownerId: host.user.id,
        eventCode: '7007',
        currency: 'GHS',
        minAmount: '1.00',
        maxAmount: '5000.00',
        status: ProjectStatus.PUBLISHED,
        acceptsContributions: true,
      })
    );
    projectId = project.id;

    const contributor = await AppDataSource.getRepository(Contributor).save(
      AppDataSource.getRepository(Contributor).create({ msisdn: '233240000009', name: 'Kofi', email: 'k@example.com' })
    );
    await AppDataSource.getRepository(Contribution).save(
      AppDataSource.getRepository(Contribution).create({
        reference: 'ZF-CON-WD-001',
        projectId,
        contributorId: contributor.id,
        amount: '100.00',
        currency: 'GHS',
        status: ContributionStatus.CONFIRMED,
      })
    );
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it('rejects invalid account numbers', async () => {
    const res = await request(app)
      .post('/api/v1/withdrawals')
      .set('Authorization', `Bearer ${hostToken}`)
      .send(body({ accountNumber: '123' }));
    expect(res.status).toBe(400);
  });

  it('refuses a withdrawal larger than the available balance', async () => {
    const res = await request(app)
      .post('/api/v1/withdrawals')
      .set('Authorization', `Bearer ${hostToken}`)
      .send(body({ amount: '150.00' }));
    expect(res.status).toBe(400);
  });

  it("refuses a withdrawal from someone else's campaign", async () => {
    const res = await request(app)
      .post('/api/v1/withdrawals')
      .set('Authorization', `Bearer ${otherHostToken}`)
      .send(body());
    expect(res.status).toBe(403);
  });

  it('lets a host request a withdrawal and reserves the amount', async () => {
    const res = await request(app)
      .post('/api/v1/withdrawals')
      .set('Authorization', `Bearer ${hostToken}`)
      .send(body());
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('PENDING');
    requestId = res.body.data.id;

    const mine = await request(app).get('/api/v1/withdrawals/mine').set('Authorization', `Bearer ${hostToken}`);
    expect(mine.body.meta.balance.available).toBe('60.00');

    // The reserved 40.00 cannot be requested again.
    const again = await request(app)
      .post('/api/v1/withdrawals')
      .set('Authorization', `Bearer ${hostToken}`)
      .send(body({ amount: '70.00' }));
    expect(again.status).toBe(400);
  });

  it('shows admins the request with stat counts', async () => {
    const res = await request(app).get('/api/v1/admin/withdrawals').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].hostName).toContain('wd-host');
    expect(res.body.data[0].projectName).toBe('Roof Fund');
    expect(res.body.meta.counts).toMatchObject({ total: 1, pending: 1, outstanding: '40.00', paidOut: '0.00' });
  });

  it('keeps hosts out of the admin list', async () => {
    const res = await request(app).get('/api/v1/admin/withdrawals').set('Authorization', `Bearer ${hostToken}`);
    expect(res.status).toBe(403);
  });

  it('moves a request from pending to processing to done, then locks it', async () => {
    const processing = await request(app)
      .patch(`/api/v1/admin/withdrawals/${requestId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'PROCESSING' });
    expect(processing.status).toBe(200);
    expect(processing.body.data.status).toBe('PROCESSING');

    const done = await request(app)
      .patch(`/api/v1/admin/withdrawals/${requestId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'DONE', note: 'Paid via MTN MoMo' });
    expect(done.body.data.status).toBe('DONE');
    expect(done.body.data.reviewNote).toBe('Paid via MTN MoMo');
    expect(done.body.data.reviewedByName).toContain('wd-admin');

    const locked = await request(app)
      .patch(`/api/v1/admin/withdrawals/${requestId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'REJECTED' });
    expect(locked.status).toBe(400);

    const counts = await request(app).get('/api/v1/admin/withdrawals').set('Authorization', `Bearer ${adminToken}`);
    expect(counts.body.meta.counts).toMatchObject({ done: 1, pending: 0, outstanding: '0.00', paidOut: '40.00' });
  });

  it('releases the amount again when a request is rejected', async () => {
    const created = await request(app)
      .post('/api/v1/withdrawals')
      .set('Authorization', `Bearer ${hostToken}`)
      .send(body({ amount: '30.00' }));
    expect(created.status).toBe(201);

    await request(app)
      .patch(`/api/v1/admin/withdrawals/${created.body.data.id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'REJECTED', note: 'Details did not match' });

    const mine = await request(app).get('/api/v1/withdrawals/mine').set('Authorization', `Bearer ${hostToken}`);
    expect(mine.body.meta.balance.available).toBe('60.00');
  });
});
