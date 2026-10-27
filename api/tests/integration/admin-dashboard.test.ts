import request from 'supertest';
import { createApp } from '../../src/app';
import { AppDataSource } from '../../src/config/database';
import { CryptoUtil } from '../../src/common/utils/crypto';
import { SystemRole } from '../../src/common/types/auth';
import { User, UserStatus } from '../../src/database/entities/user.entity';
import { closeTestDatabase, setupTestDatabase } from '../test-db';

describe('Admin dashboard endpoints', () => {
  let app: any;
  let adminToken: string;
  let hostToken: string;

  beforeAll(async () => {
    await setupTestDatabase();
    app = createApp();
    const userRepo = AppDataSource.getRepository(User);
    const passwordHash = await CryptoUtil.hashPassword('SuperSecure123');

    const admin = await userRepo.save(
      userRepo.create({
        email: 'dash-admin@zfund.org',
        passwordHash,
        firstName: 'Dash',
        lastName: 'Admin',
        role: SystemRole.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
      })
    );
    const host = await userRepo.save(
      userRepo.create({
        email: 'dash-host@zfund.org',
        passwordHash,
        firstName: 'Dash',
        lastName: 'Host',
        role: SystemRole.ACCOUNT_OWNER,
        status: UserStatus.ACTIVE,
      })
    );
    adminToken = CryptoUtil.generateAccessToken({ userId: admin.id, email: admin.email, role: admin.role });
    hostToken = CryptoUtil.generateAccessToken({ userId: host.id, email: host.email, role: host.role });
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it('denies hosts access to the overview', async () => {
    const res = await request(app)
      .get('/api/v1/admin/dashboard/overview')
      .set('Authorization', `Bearer ${hostToken}`);
    expect(res.status).toBe(403);
  });

  it('returns overview counts for admins', async () => {
    const res = await request(app)
      .get('/api/v1/admin/dashboard/overview')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.activeHosts.value).toBe(1);
    expect(res.body.data.fundsGenerated.value).toBe('0.00');
    expect(res.body.data.transactions.value).toBe(0);
  });

  it('returns 12 monthly buckets and 30 daily buckets', async () => {
    const monthly = await request(app)
      .get('/api/v1/admin/dashboard/fund-trend')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(monthly.body.data.buckets).toHaveLength(12);

    const daily = await request(app)
      .get('/api/v1/admin/dashboard/fund-trend?period=30d')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(daily.body.data.buckets).toHaveLength(30);
  });

  it('lists hosts with funds issued and shows new hosts after creation', async () => {
    const create = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'new-host@zfund.org',
        password: 'TempPass123',
        firstName: 'New',
        lastName: 'Host',
        role: SystemRole.ACCOUNT_OWNER,
      });
    expect(create.status).toBe(201);

    const res = await request(app)
      .get('/api/v1/admin/dashboard/hosts?limit=5')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.map((h: any) => h.email)).toContain('new-host@zfund.org');
    expect(res.body.data[0].fundsIssued).toBe('0.00');
  });

  it('paginates hosts with status counts and supports search', async () => {
    const res = await request(app)
      .get('/api/v1/admin/hosts?page=1&limit=1')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta.total).toBeGreaterThanOrEqual(2);
    expect(res.body.meta.totalPages).toBeGreaterThanOrEqual(2);
    expect(res.body.meta.counts.active).toBeGreaterThanOrEqual(2);

    const search = await request(app)
      .get('/api/v1/admin/hosts?search=new-host')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(search.body.data).toHaveLength(1);
    expect(search.body.data[0].email).toBe('new-host@zfund.org');
  });

  it('returns host detail and 404 for unknown hosts', async () => {
    const list = await request(app)
      .get('/api/v1/admin/hosts?search=new-host')
      .set('Authorization', `Bearer ${adminToken}`);
    const id = list.body.data[0].id;

    const detail = await request(app)
      .get(`/api/v1/admin/hosts/${id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(detail.status).toBe(200);
    expect(detail.body.data.stats.totalFunds).toBe('0.00');
    expect(detail.body.data.funds).toEqual([]);

    const missing = await request(app)
      .get('/api/v1/admin/hosts/00000000-0000-4000-8000-000000000000')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(missing.status).toBe(404);
  });

  it('returns empty paginated funds and transactions', async () => {
    const funds = await request(app)
      .get('/api/v1/admin/funds')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(funds.status).toBe(200);
    expect(funds.body.data).toEqual([]);
    expect(funds.body.meta.total).toBe(0);

    const transactions = await request(app)
      .get('/api/v1/admin/transactions?status=CONFIRMED')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(transactions.status).toBe(200);
    expect(transactions.body.data).toEqual([]);
  });

  it('returns recent activity including the host creation', async () => {
    const res = await request(app)
      .get('/api/v1/admin/dashboard/recent-activity?limit=3')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data[0].action).toBe('ADMIN_CREATE_USER');
    expect(res.body.data[0].actorName).toBe('Dash Admin');
  });
});
