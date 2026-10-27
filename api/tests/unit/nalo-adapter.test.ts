import { NaloAdapter } from '../../src/services/nalo.adapter';

describe('NaloAdapter (NALO USSD Gateway contract and parsing)', () => {
  it('should parse initial project-specific dial request and extract event code', () => {
    const rawPayload = {
      USERID: 'NALOTest',
      MSISDN: '233241234567',
      USERDATA: '*920*969*1001#',
      MSGTYPE: false, // initial request in NALO contract
      NETWORK: 'MTN',
      SESSIONID: '16590115252429751',
    };

    const parsed = NaloAdapter.parseRequest(rawPayload);

    expect(parsed.msisdn).toBe('233241234567');
    expect(typeof parsed.msisdn).toBe('string');
    expect(parsed.isInitialRequest).toBe(true);
    expect(parsed.eventCodeExtracted).toBe('1001');
    expect(parsed.sessionId).toBe('16590115252429751');
    expect(parsed.network).toBe('MTN');
  });

  it('should parse general dial code without event code', () => {
    const rawPayload = {
      USERID: 'NALOTest',
      MSISDN: '233209876543',
      USERDATA: '*920*969#',
      MSGTYPE: false,
      SESSIONID: '987654321',
    };

    const parsed = NaloAdapter.parseRequest(rawPayload);
    expect(parsed.eventCodeExtracted).toBeUndefined();
    expect(parsed.isInitialRequest).toBe(true);
  });

  it('should parse continuing request with numeric menu choice', () => {
    const rawPayload = {
      USERID: 'NALOTest',
      MSISDN: '233241234567',
      USERDATA: '2',
      MSGTYPE: true, // continuing session
      SESSIONID: '16590115252429751',
    };

    const parsed = NaloAdapter.parseRequest(rawPayload);
    expect(parsed.isInitialRequest).toBe(false);
    expect(parsed.userInput).toBe('2');
  });

  it('should format response according to NALO contract and enforce 120 character limit', () => {
    const request = {
      provider: 'NALO' as const,
      userId: 'NALOTest',
      msisdn: '233241234567',
      userInput: '1',
      isInitialRequest: false,
      sessionId: '12345',
    };

    // Normal message under 120 chars
    const shortResponse = NaloAdapter.formatResponse(request, {
      message: 'Welcome to Grace Church.\n1. Offering\n2. Tithe',
      continueSession: true,
    });

    expect(shortResponse.USERID).toBe('NALOTest');
    expect(shortResponse.MSISDN).toBe('233241234567');
    expect(shortResponse.MSGTYPE).toBe(true);
    expect(shortResponse.MSG).toBe('Welcome to Grace Church.\n1. Offering\n2. Tithe');

    // Message exceeding 120 characters clamped to 120
    const longMsg =
      'This is an exceptionally long USSD prompt that exceeds the provider maximum limit of one hundred and twenty characters allowed by the NALO USSD Gateway network protocol specifications.';
    expect(longMsg.length).toBeGreaterThan(120);

    const clampedResponse = NaloAdapter.formatResponse(request, {
      message: longMsg,
      continueSession: true,
    });

    expect(clampedResponse.MSG.length).toBeLessThanOrEqual(120);
    expect(clampedResponse.MSG.endsWith('...')).toBe(true);
  });
});
