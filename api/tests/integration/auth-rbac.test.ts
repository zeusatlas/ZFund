import request from 'supertest';
import { mockSmsAdapter } from '../../src/services/mock-sms.adapter';
import { createApp } from '../../src/app';
import { AppDataSource } from '../../src/config/database';
import { CryptoUtil } from '../../src/common/utils/crypto';
import { SystemRole } from '../../src/common/types/auth';
import { RefreshToken } from '../../src/database/entities/refresh-token.entity';
import { User, UserStatus } from '../../src/database/entities/user.entity';
import { closeTestDatabase, setupTestDatabase } from '../test-db';

describe('Authentication & Role-Based Access Control (RBAC)', () => {
  let app: any;
  let superAdminUser: User;
  let superAdminToken: string;

  beforeAll(async () => {
    await setupTestDatabase();
    app = createApp();

    const userRepo = AppDataSource.getRepository(User);

    const passwordHash = await CryptoUtil.hashPassword('SuperSecure123');
    superAdminUser = await userRepo.save(
      userRepo.create({
        email: 'superadmin@zfund.org',
        passwordHash,
        firstName: 'System',
        lastName: 'Administrator',
        role: SystemRole.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
      })
    );

    superAdminToken = CryptoUtil.generateAccessToken({
      userId: superAdminUser.id,
      email: superAdminUser.email,
      role: superAdminUser.role,
    });
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  const testUserEmail = 'pastor.james@church.org';
  const testUserPhone = '0240000003';
  let accountOwnerToken = '';
  let accountOwnerRefreshToken = '';

  const lastCode = () => mockSmsAdapter.sentMessages.at(-1)!.message.match(/\d{6}/)![0];

  it('should let an admin create an account, texting the user their email and phone', async () => {
    mockSmsAdapter.sentMessages.length = 0;
    const res = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        email: testUserEmail,
        firstName: 'James',
        lastName: 'Mensah',
        phone: testUserPhone,
        role: SystemRole.ACCOUNT_OWNER,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe(testUserEmail);
    expect(res.body.data.smsSent).toBe(true);
    expect(res.body.data.passwordHash).toBeUndefined();

    const sms = mockSmsAdapter.sentMessages.at(-1)!;
    expect(sms.recipient).toBe('233240000003');
    expect(sms.message).toContain(testUserEmail);
    expect(sms.message).toContain('233240000003');
  });

  it('should no longer offer public registration or password login', async () => {
    const register = await request(app).post('/api/v1/auth/register').send({ email: 'x@y.org' });
    const login = await request(app).post('/api/v1/auth/login').send({ email: testUserEmail, password: 'x' });
    expect(register.status).toBe(404);
    expect(login.status).toBe(404);
  });

  it('should not send a code when the phone does not match the account', async () => {
    mockSmsAdapter.sentMessages.length = 0;
    const res = await request(app)
      .post('/api/v1/auth/request-otp')
      .send({ email: testUserEmail, phone: '0200000000' });

    expect(res.status).toBe(200);
    expect(mockSmsAdapter.sentMessages).toHaveLength(0);
  });

  it('should reject a wrong code (401 Unauthorized)', async () => {
    await request(app).post('/api/v1/auth/request-otp').send({ email: testUserEmail, phone: testUserPhone });
    const res = await request(app)
      .post('/api/v1/auth/verify-otp')
      .send({ email: testUserEmail, phone: testUserPhone, code: lastCode() === '000000' ? '111111' : '000000' });

    expect(res.status).toBe(401);
    expect(res.body.message).toContain('Invalid or expired code');
  });

  it('should sign in with the texted code, returning JWT and setting refresh token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/verify-otp')
      .send({ email: testUserEmail, phone: '+233 24 000 0003', code: lastCode() });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.email).toBe(testUserEmail);

    accountOwnerToken = res.body.data.accessToken;
    accountOwnerRefreshToken = res.body.data.refreshToken;
    expect(accountOwnerRefreshToken).toBeDefined();

    // Verify session stored as SHA-256 hash in database
    const sessionRepo = AppDataSource.getRepository(RefreshToken);
    const hashedToken = CryptoUtil.hashToken(accountOwnerRefreshToken);
    const dbSession = await sessionRepo.findOne({ where: { tokenHash: hashedToken } });
    expect(dbSession).toBeDefined();
    expect(dbSession?.isRevoked).toBe(false);
  });

  it('should not accept the same code twice', async () => {
    const res = await request(app)
      .post('/api/v1/auth/verify-otp')
      .send({ email: testUserEmail, phone: testUserPhone, code: lastCode() });

    expect(res.status).toBe(401);
  });

  it('should allow access to protected profile endpoint with valid access token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/profile')
      .set('Authorization', `Bearer ${accountOwnerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testUserEmail);
  });

  it('should deny access to protected profile endpoint without authorization header', async () => {
    const res = await request(app).get('/api/v1/auth/profile');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should rotate refresh token and issue a new access token on token refresh', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh-token')
      .send({ refreshToken: accountOwnerRefreshToken });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    // New refresh token should be rotated
    expect(res.body.data.refreshToken).not.toBe(accountOwnerRefreshToken);

    const oldHashedToken = CryptoUtil.hashToken(accountOwnerRefreshToken);
    const newHashedToken = CryptoUtil.hashToken(res.body.data.refreshToken);

    const sessionRepo = AppDataSource.getRepository(RefreshToken);
    const oldSession = await sessionRepo.findOne({ where: { tokenHash: oldHashedToken } });
    const newSession = await sessionRepo.findOne({ where: { tokenHash: newHashedToken } });

    // Old token should be revoked, new token active
    expect(oldSession?.isRevoked).toBe(true);
    expect(newSession?.isRevoked).toBe(false);

    accountOwnerRefreshToken = res.body.data.refreshToken;
    accountOwnerToken = res.body.data.accessToken;
  });

  it('RBAC TEST: Account Owner must be DENIED access (403 Forbidden) to super-admin user listing endpoint', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${accountOwnerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Insufficient privileges');
  });

  it('RBAC TEST: Super Administrator must be GRANTED access (200 OK) to user listing endpoint', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it('RBAC TEST: Non-super-admin cannot change another user role', async () => {
    const res = await request(app)
      .patch(`/api/v1/users/${superAdminUser.id}/role`)
      .set('Authorization', `Bearer ${accountOwnerToken}`)
      .send({ role: SystemRole.SUPER_ADMIN });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should revoke session on logout', async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .send({ refreshToken: accountOwnerRefreshToken });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify session revoked in database
    const sessionRepo = AppDataSource.getRepository(RefreshToken);
    const hashed = CryptoUtil.hashToken(accountOwnerRefreshToken);
    const session = await sessionRepo.findOne({ where: { tokenHash: hashed } });
    expect(session?.isRevoked).toBe(true);
  });
});
