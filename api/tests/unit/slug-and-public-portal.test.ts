import { isReservedSlug, slugify } from '../../src/common/utils/slug';
import { PaystackProvider } from '../../src/services/paystack.provider';

describe('Slug Utility & Public Portal Routing', () => {
  it('converts host names and campaign titles into clean URL-safe slugs', () => {
    expect(slugify('Koranteng Kessie')).toBe('koranteng-kessie');
    expect(slugify('Emergency Surgery for Baby Kofi (2026)!')).toBe('emergency-surgery-for-baby-kofi-2026');
    expect(slugify('Holy Trinity Church - Harvest & Outreach')).toBe('holy-trinity-church-harvest-outreach');
    expect(slugify('   Multiple    Spaces   And---Dashes   ')).toBe('multiple-spaces-and-dashes');
  });

  it('correctly identifies and blocks reserved system slugs', () => {
    expect(isReservedSlug('admin')).toBe(true);
    expect(isReservedSlug('host')).toBe(true);
    expect(isReservedSlug('login')).toBe(true);
    expect(isReservedSlug('api')).toBe(true);
    expect(isReservedSlug('settings')).toBe(true);
    expect(isReservedSlug('contact')).toBe(true);

    expect(isReservedSlug('koranteng-kessie')).toBe(false);
    expect(isReservedSlug('holy-trinity')).toBe(false);
    expect(isReservedSlug('emergency-fund')).toBe(false);
  });

  it('matches campaigns by slugified name fallback when DB slug is null', () => {
    const campaigns = [
      { id: 'uuid-1', name: 'Emergency Surgery for Baby Kofi', slug: null, eventCode: '1002' },
      { id: 'uuid-2', name: 'Holy Trinity Church Project', slug: 'holy-trinity-church', eventCode: '1001' },
    ];

    const targetSlug = 'emergency-surgery-for-baby-kofi';
    const matched = campaigns.find(
      (c) =>
        c.slug === targetSlug ||
        slugify(c.name) === targetSlug ||
        c.eventCode === targetSlug ||
        c.id === targetSlug
    );

    expect(matched).toBeDefined();
    expect(matched?.id).toBe('uuid-1');
  });
});

describe('Paystack Provider for Card & International Payments', () => {
  const provider = new PaystackProvider();

  it('verifies provider code is PAYSTACK', () => {
    expect(provider.code).toBe('PAYSTACK');
  });

  it('initializes card payment in test/mock mode with valid checkout details', async () => {
    const result = await provider.initializePayment({
      reference: 'ZF-PAY-TEST-001',
      amount: '50.00',
      currency: 'GHS',
      email: 'donor@example.com',
      channel: 'card',
    });

    expect(result.providerReference).toBe('ZF-PAY-TEST-001');
    expect(result.authorizationUrl).toContain('https://checkout.paystack.com/');
    expect(result.status).toBe('pending');
  });

  it('verifies transaction status correctly', async () => {
    const verification = await provider.verifyTransaction('ZF-PAY-TEST-001');
    expect(verification.status).toBe('success');
    expect(verification.amount).toBe('50.00');
    expect(verification.channel).toBe('card');
  });

  it('validates webhook HMAC signature', () => {
    const payload = JSON.stringify({ event: 'charge.success', data: { reference: 'ZF-PAY-123' } });
    const crypto = require('crypto');
    const { env } = require('../../src/config/env');
    const validSignature = crypto
      .createHmac('sha512', env.PAYSTACK_SECRET_KEY)
      .update(payload)
      .digest('hex');

    expect(provider.verifyWebhookSignature(payload, validSignature)).toBe(true);
    expect(provider.verifyWebhookSignature(payload, 'invalid-signature')).toBe(false);
  });
});
