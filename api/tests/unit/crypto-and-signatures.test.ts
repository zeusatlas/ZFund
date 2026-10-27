import crypto from 'crypto';
import { CryptoUtil } from '../../src/common/utils/crypto';

describe('CryptoUtil (Argon2id, JWT, and HMAC SHA512 signatures)', () => {
  it('should hash and verify passwords using Argon2id', async () => {
    const rawPassword = 'SecurePassword2026!';
    const hash = await CryptoUtil.hashPassword(rawPassword);

    expect(hash).toContain('$argon2id$');
    const isMatch = await CryptoUtil.verifyPassword(hash, rawPassword);
    expect(isMatch).toBe(true);

    const isWrong = await CryptoUtil.verifyPassword(hash, 'WrongPassword!');
    expect(isWrong).toBe(false);
  });

  it('should generate and verify JWT access and refresh tokens', () => {
    const payload = {
      userId: 'user-uuid-1234',
      email: 'kwabena@church.org',
      role: 'ACCOUNT_OWNER',
    };

    const accessToken = CryptoUtil.generateAccessToken(payload);
    expect(typeof accessToken).toBe('string');
    const verifiedAccess = CryptoUtil.verifyAccessToken(accessToken);
    expect(verifiedAccess.userId).toBe(payload.userId);
    expect(verifiedAccess.email).toBe(payload.email);

    const refreshToken = CryptoUtil.generateRefreshToken(payload);
    expect(typeof refreshToken).toBe('string');
    const verifiedRefresh = CryptoUtil.verifyRefreshToken(refreshToken);
    expect(verifiedRefresh.userId).toBe(payload.userId);
  });

  it('should verify Paystack HMAC SHA512 webhook signature accurately', () => {
    const secretKey = 'sk_test_mock_paystack_secret_key_123456';
    const payload = JSON.stringify({
      event: 'charge.success',
      data: { reference: 'ZF-PAY-123', amount: 5000 },
    });

    // Compute expected HMAC SHA512
    const validSignature = crypto
      .createHmac('sha512', secretKey)
      .update(payload)
      .digest('hex');

    const isValid = CryptoUtil.verifyPaystackSignature(payload, validSignature, secretKey);
    expect(isValid).toBe(true);

    // Tampered payload or wrong signature
    const isInvalidTampered = CryptoUtil.verifyPaystackSignature(
      payload + 'tampered',
      validSignature,
      secretKey
    );
    expect(isInvalidTampered).toBe(false);

    const isInvalidKey = CryptoUtil.verifyPaystackSignature(
      payload,
      validSignature,
      'wrong_secret_key'
    );
    expect(isInvalidKey).toBe(false);
  });

  it('should generate unique formatted business references', () => {
    const ref1 = CryptoUtil.generateReference('ZF-PAY');
    const ref2 = CryptoUtil.generateReference('ZF-PAY');
    expect(ref1).toMatch(/^ZF-PAY-[A-Z0-9]+-[A-Z0-9]+$/);
    expect(ref1).not.toBe(ref2);
  });
});
