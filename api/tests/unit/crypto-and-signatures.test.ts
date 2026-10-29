import crypto from 'crypto';
import { CryptoUtil } from '../../src/common/utils/crypto';

describe('CryptoUtil (Argon2id, JWT, RobsPay and Paystack signatures)', () => {
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

  it('should generate valid RobsPay 12-character uppercase hex order ID', () => {
    const orderId1 = CryptoUtil.generateRobspayOrderId();
    const orderId2 = CryptoUtil.generateRobspayOrderId();

    expect(orderId1).toHaveLength(12);
    expect(orderId1).toMatch(/^[0-9A-F]{12}$/);
    expect(orderId2).toHaveLength(12);
    expect(orderId2).toMatch(/^[0-9A-F]{12}$/);
    expect(orderId1).not.toBe(orderId2);
  });

  it('should generate and verify RobsPay HMAC-SHA256 signature', () => {
    const apiKey = '239d7edb7e27c718f0f662eb5779f26930c74cd909d95113b886349802b1579b';
    const payload = JSON.stringify({
      merchant_id: 'ZEU889626',
      amount: 1,
      customer_number: '0545547479',
      transaction_id: '4F5E6D7C8B9A',
      reference: 'CPP Dues Payment',
      callback_url: 'https://robspay.robsamtechnology.com/trial-callback',
    });
    const timestamp = '1730222000';

    const signature = CryptoUtil.generateRobspaySignature(payload, timestamp, apiKey);
    expect(signature).toHaveLength(64);

    const isValid = CryptoUtil.verifyRobspaySignature(payload, signature, timestamp, apiKey);
    expect(isValid).toBe(true);

    const isTampered = CryptoUtil.verifyRobspaySignature(payload + 'tampered', signature, timestamp, apiKey);
    expect(isTampered).toBe(false);

    const isWrongKey = CryptoUtil.verifyRobspaySignature(payload, signature, timestamp, 'wrong_key');
    expect(isWrongKey).toBe(false);
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
