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

describe('Admin campaigns', () => {
  let app: any;
  let adminToken: string;
  let hostToken: string;
  let projectId: string;

  const makeUser = async (email: string, role: SystemRole, firstName: string) => {
    const repo = AppDataSource.getRepository(User);
    const user = await repo.save(
      repo.create({ email, passwordHash: 'hash', firstName, lastName: 'Tester', role, status: UserStatus.ACTIVE })
    );
    return { user, token: CryptoUtil.generateAccessToken({ userId: user.id, email, role }) };
  };

  beforeAll(async () => {
    await setupTestDatabase();
    app = createApp();

    const admin = await makeUser('camp-admin@zfund.org', SystemRole.SUPER_ADMIN, 'Camp');
    const host = await makeUser('camp-host@zfund.org', SystemRole.ACCOUNT_OWNER, 'Hosty');
    adminToken = admin.token;
    hostToken = host.token;

    const projects = AppDataSource.getRepository(Project);
    const project = await projects.save(
      projects.create({
        name: 'Borehole Appeal',
        description: 'Clean water for the village',
        ownerId: host.user.id,
        eventCode: '8008',
        currency: 'GHS',
        targetAmount: '1000.00',
        minAmount: '1.00',
        maxAmount: '5000.00',
        status: ProjectStatus.PUBLISHED,
        acceptsContributions: true,
      })
    );
    projectId = project.id;

    const contributors = AppDataSource.getRepository(Contributor);
    const ama = await contributors.save(contributors.create({ msisdn: '233241111111', name: 'Ama Owusu', email: 'ama@example.com' }));
    const kofi = await contributors.save(contributors.create({ msisdn: '233242222222', name: 'Kofi Mensah', email: 'kofi@example.com' }));

    const contributions = AppDataSource.getRepository(Contribution);
    const add = (reference: string, contributorId: string, amount: string, status: ContributionStatus) =>
      contributions.save(contributions.create({ reference, projectId, contributorId, amount, currency: 'GHS', status }));
    await add('ZF-CAMP-001', ama.id, '60.00', ContributionStatus.CONFIRMED);
    await add('ZF-CAMP-002', ama.id, '40.00', ContributionStatus.CONFIRMED);
    await add('ZF-CAMP-003', kofi.id, '25.00', ContributionStatus.CONFIRMED);
    await add('ZF-CAMP-004', kofi.id, '10.00', ContributionStatus.FAILED);
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it('lists campaigns with the host name, raised amount and stat counts', async () => {
    const res = await request(app).get('/api/v1/admin/funds').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data[0]).toMatchObject({ name: 'Borehole Appeal', hostName: 'Hosty Tester', raised: '125.00', transactions: 3 });
    expect(res.body.meta.counts).toMatchObject({ total: 1, published: 1, draft: 0, raised: '125.00' });
  });

  it('returns campaign detail with distinct contributors and average', async () => {
    const res = await request(app).get(`/api/v1/admin/funds/${projectId}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      name: 'Borehole Appeal',
      description: 'Clean water for the village',
      targetAmount: '1000.00',
      contributors: 2,
      averageAmount: '41.67',
    });
  });

  it('pages and searches contributions, including failed ones', async () => {
    const all = await request(app)
      .get(`/api/v1/admin/funds/${projectId}/contributions?limit=2`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(all.status).toBe(200);
    expect(all.body.data).toHaveLength(2);
    expect(all.body.meta).toMatchObject({ total: 4, totalPages: 2 });

    const search = await request(app)
      .get(`/api/v1/admin/funds/${projectId}/contributions?search=ama`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(search.body.data).toHaveLength(2);
    expect(search.body.data[0]).toMatchObject({ contributorName: 'Ama Owusu', msisdn: '233241111111' });

    const failed = await request(app)
      .get(`/api/v1/admin/funds/${projectId}/contributions?status=FAILED`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(failed.body.data).toHaveLength(1);
  });

  it('returns 404 for unknown or malformed campaign ids and 403 for hosts', async () => {
    const missing = await request(app)
      .get('/api/v1/admin/funds/00000000-0000-4000-8000-000000000000')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(missing.status).toBe(404);

    const malformed = await request(app).get('/api/v1/admin/funds/not-an-id').set('Authorization', `Bearer ${adminToken}`);
    expect(malformed.status).toBe(404);

    const forbidden = await request(app).get(`/api/v1/admin/funds/${projectId}`).set('Authorization', `Bearer ${hostToken}`);
    expect(forbidden.status).toBe(403);
  });
});
