import request from 'supertest';
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
  const testUserPassword = 'ChurchPassword123';
  let accountOwnerToken = '';
  let accountOwnerRefreshToken = '';

  it('should register a new account owner and securely hash the password with Argon2id', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: testUserEmail,
        password: testUserPassword,
        firstName: 'James',
        lastName: 'Mensah',
        phone: '233240000003',
        role: SystemRole.ACCOUNT_OWNER,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testUserEmail);
    expect(res.body.data.role).toBe(SystemRole.ACCOUNT_OWNER);
    // Password hash must NEVER be returned in response
    expect(res.body.data.passwordHash).toBeUndefined();

    // Verify in database that password was hashed
    const userRepo = AppDataSource.getRepository(User);
    const dbUser = await userRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email: testUserEmail })
      .getOne();
    expect(dbUser).toBeDefined();
    expect(dbUser?.passwordHash).not.toBe(testUserPassword);
    expect(dbUser?.passwordHash).toMatch(/^\$argon2id\$/);
  });

  it('should reject registration if email is already registered', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: testUserEmail,
        password: testUserPassword,
        firstName: 'Duplicate',
        lastName: 'User',
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('already exists');
  });

  it('should reject login with invalid password (401 Unauthorized)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUserEmail,
        password: 'WrongPassword999',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid email or password');
  });

  it('should successfully log in with valid credentials, returning JWT and setting refresh token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUserEmail,
        password: testUserPassword,
      });

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
