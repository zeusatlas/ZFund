import request from 'supertest';
import { createApp } from '../../src/app';
import { AppDataSource } from '../../src/config/database';
import { SystemRole } from '../../src/common/types/auth';
import { CryptoUtil } from '../../src/common/utils/crypto';
import { User, UserStatus } from '../../src/database/entities/user.entity';
import { mockSmsAdapter } from '../../src/services/mock-sms.adapter';
import { closeTestDatabase, setupTestDatabase } from '../test-db';

describe('Sign-in code attempt limits', () => {
  let app: any;
  const identity = { email: 'otp-limit@zfund.org', phone: '0240000555' };
  const verify = (code: string) => request(app).post('/api/v1/auth/verify-otp').send({ ...identity, code });

  beforeAll(async () => {
    await setupTestDatabase();
    app = createApp();
    const userRepo = AppDataSource.getRepository(User);
    await userRepo.save(
      userRepo.create({
        email: identity.email,
        phone: '233240000555',
        passwordHash: await CryptoUtil.hashPassword('unused-Password1'),
        firstName: 'Otp',
        lastName: 'Limit',
        role: SystemRole.ACCOUNT_OWNER,
        status: UserStatus.ACTIVE,
      })
    );
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it('warns from the third wrong attempt and locks after the fifth', async () => {
    await request(app).post('/api/v1/auth/request-otp').send(identity);
    const real = mockSmsAdapter.sentMessages.at(-1)!.message.match(/\d{6}/)![0];
    const wrong = real === '000000' ? '111111' : '000000';

    expect((await verify(wrong)).body.message).toBe('Invalid or expired code');
    expect((await verify(wrong)).body.message).toBe('Invalid or expired code');

    const third = await verify(wrong);
    expect(third.status).toBe(401);
    expect(third.body.message).toContain('2 attempts left');

    expect((await verify(wrong)).body.message).toContain('1 attempt left');

    const fifth = await verify(wrong);
    expect(fifth.status).toBe(429);
    expect(fifth.body.message).toContain('request a new code after some time');

    // Even the correct code is refused once locked.
    expect((await verify(real)).status).toBe(429);

    // And a fresh code cannot be requested until the current one has run out.
    const again = await request(app).post('/api/v1/auth/request-otp').send(identity);
    expect(again.status).toBe(429);
  });
});
