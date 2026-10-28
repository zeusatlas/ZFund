import axios from 'axios';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { ISmsProvider, SendSmsParams, SendSmsResult } from './sms-provider.interface';

// ==================== INTERFACES ====================

interface MNotifySendResponse {
  status: string;
  code: string;
  message: string;
  summary: {
    _id: string;
    type: string;
    total_sent: number;
    contacts: number;
    total_rejected: number;
    numbers_sent: string[];
    credit_used: number;
    credit_left: number;
  };
}

interface MNotifyDeliveryResponse {
  status: string;
  report?: {
    _id: number;
    recipient: string;
    message: string;
    sender: string;
    status: string;
    date_sent: string;
    campaign_id: string;
    retries: number;
  };
}

// ==================== HELPER FUNCTIONS (ZDesk Core Logic) ====================

/**
 * Check if message contains Unicode characters (outside standard GSM-7)
 */
export function isUnicode(message: string): boolean {
  return /[^\x00-\x7F]|[€,£{}[\]~^\\|]/.test(message);
}

/**
 * Calculate SMS credits needed based on message length and recipient count
 */
export function calculateSMSCredits(message: string, recipientCount = 1): number {
  const messageLength = message.length;
  const unicode = isUnicode(message);

  let parts = 0;
  if (unicode) {
    parts = messageLength <= 70 ? 1 : Math.ceil(messageLength / 67);
  } else {
    parts = messageLength <= 160 ? 1 : Math.ceil(messageLength / 153);
  }

  return parts * recipientCount;
}

/**
 * Validates SMS credentials & endpoints
 */
function validateEnvVariables(customApiKey?: string): { apiKey: string; baseUrl: string; defaultSender: string } {
  const apiKey =
    customApiKey ||
    process.env.MNOTIFY_API_KEY ||
    env.SMS_API_KEY;
  const baseUrl =
    process.env.MNOTIFY_URL ||
    env.SMS_API_URL ||
    'https://api.mnotify.com/api/sms/quick';
  const defaultSender =
    process.env.MNOTIFY_SENDER_ID ||
    env.SMS_SENDER_ID ||
    'RaiseFunds';

  return { apiKey, baseUrl, defaultSender };
}

/**
 * Check delivery status from mNotify with retries (ported from ZDesk)
 */
export async function checkDeliveryStatus(
  messageId: string,
  apiKey: string,
  maxAttempts = 5,
  delayMs = 10000
): Promise<string> {
  const baseUrl = (process.env.MNOTIFY_URL || env.SMS_API_URL || 'https://api.mnotify.com/api/sms/quick').replace(
    '/sms/quick',
    ''
  );
  const url = `${baseUrl}/status/${messageId}?key=${apiKey}`;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const { data } = await axios.get<MNotifyDeliveryResponse>(url, {
        headers: { Accept: 'application/json' },
        timeout: 5000,
      });

      const status = data.report?.status?.toUpperCase();

      if (status) {
        logger.info({ attempt, status, messageId }, 'mNotify delivery status check');

        if (status === 'DELIVERED') {
          return 'DELIVERED';
        }

        if (['FAILED', 'REJECTED', 'EXPIRED'].includes(status)) {
          return status;
        }
      }

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    } catch (err: any) {
      logger.warn({ attempt, err: err.response?.data || err.message }, 'mNotify delivery status check error');
    }
  }

  return 'PENDING';
}

/**
 * Send low credit alert to administrators (ZDesk logic)
 */
export async function sendLowCreditAlert(creditLeft: number, accountName?: string): Promise<void> {
  const alertRecipients = ['0245482029', '020001546', '0247098016'];
  const source = accountName ? `Account: ${accountName}` : 'ZFund Platform';
  const alertMessage = `⚠️ SMS Credit Alert\n${source}\nBalance: ${creditLeft} credits remaining.\nPlease top up soon.`;

  try {
    const { apiKey, baseUrl, defaultSender } = validateEnvVariables();
    if (!apiKey || apiKey.includes('placeholder')) return;

    const url = `${baseUrl}?key=${apiKey}`;
    const payload = {
      recipient: alertRecipients,
      sender: defaultSender,
      message: alertMessage,
      is_schedule: false,
    };

    await axios.post(url, payload, { headers: { Accept: 'application/json' }, timeout: 10000 });
    logger.info({ creditLeft }, 'mNotify low credit alert dispatched to admins');
  } catch (err: any) {
    logger.error({ err: err.response?.data || err.message }, 'Failed to send low credit alert');
  }
}

// ==================== CORE SMS SENDING FUNCTIONS (ZDesk) ====================

/**
 * Send normal (regular) SMS using mNotify
 */
export async function sendMessage(
  recipient: string | string[],
  message: string,
  options?: { senderId?: string; skipDeliveryCheck?: boolean; apiKey?: string }
): Promise<SendSmsResult> {
  if (!recipient || !message) {
    return {
      success: false,
      provider: 'MNOTIFY',
      status: 'failed',
      errorMessage: 'Recipient and message are required',
    };
  }

  const { apiKey, baseUrl, defaultSender } = validateEnvVariables(options?.apiKey);
  if (!apiKey || apiKey.includes('placeholder')) {
    logger.warn('mNotify SMS API key not configured. Check environment settings.');
    return {
      success: false,
      provider: 'MNOTIFY',
      status: 'failed',
      errorMessage: 'mNotify SMS API key not configured',
    };
  }

  const recipients = Array.isArray(recipient) ? recipient : [String(recipient).trim()];
  const sender = options?.senderId || defaultSender;
  const url = `${baseUrl}?key=${apiKey}`;

  const payload = {
    recipient: recipients,
    sender,
    message,
    is_schedule: false,
  };

  try {
    const { data } = await axios.post<MNotifySendResponse>(url, payload, {
      headers: { Accept: 'application/json' },
      timeout: 10000,
    });

    const messageId = data?.summary?._id;
    const creditLeft = data?.summary?.credit_left;
    const creditUsed = data?.summary?.credit_used;
    const totalSent = data?.summary?.total_sent;

    if (!messageId) {
      logger.error({ response: data }, 'No message ID returned from mNotify SMS provider');
      return {
        success: false,
        provider: 'MNOTIFY',
        status: 'failed',
        errorMessage: data?.message || 'No message ID returned from mNotify',
        rawResponse: data as unknown as Record<string, unknown>,
      };
    }

    // Trigger low credit notification if below 20 credits
    if (typeof creditLeft === 'number' && creditLeft < 20) {
      sendLowCreditAlert(creditLeft).catch(() => {});
    }

    logger.info(
      {
        messageId,
        recipient,
        sender,
        creditUsed,
        creditLeft,
      },
      'mNotify normal SMS dispatched successfully'
    );

    return {
      success: true,
      provider: 'MNOTIFY',
      providerMessageId: messageId,
      status: 'sent',
      creditUsed,
      creditLeft,
      totalSent,
      sender,
      rawResponse: data as unknown as Record<string, unknown>,
    };
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || err.message || 'mNotify SMS sending failed';
    logger.error({ err: err.response?.data || errorMsg, recipient }, 'mNotify SMS sending failed');
    return {
      success: false,
      provider: 'MNOTIFY',
      status: 'failed',
      errorMessage: errorMsg,
      rawResponse: err.response?.data,
    };
  }
}

/**
 * Send OTP SMS using mNotify (Dedicated OTP channel with sms_type: 'otp')
 */
export async function sendOTP(
  recipient: string | string[],
  message: string,
  options?: { senderId?: string; skipDeliveryCheck?: boolean; apiKey?: string }
): Promise<SendSmsResult> {
  if (!recipient || !message) {
    return {
      success: false,
      provider: 'MNOTIFY',
      status: 'failed',
      errorMessage: 'Recipient and message are required',
    };
  }

  const { apiKey, baseUrl, defaultSender } = validateEnvVariables(options?.apiKey);
  if (!apiKey || apiKey.includes('placeholder')) {
    logger.warn('mNotify SMS API key not configured. Check environment settings.');
    return {
      success: false,
      provider: 'MNOTIFY',
      status: 'failed',
      errorMessage: 'mNotify SMS API key not configured',
    };
  }

  const recipients = Array.isArray(recipient) ? recipient : [String(recipient).trim()];
  const sender = options?.senderId || defaultSender;
  const url = `${baseUrl}?key=${apiKey}`;

  // Dedicated OTP payload specification from ZDesk: includes sms_type: 'otp'
  const payload = {
    recipient: recipients,
    sender,
    message,
    is_schedule: false,
    sms_type: 'otp',
  };

  try {
    const { data } = await axios.post<MNotifySendResponse>(url, payload, {
      headers: { Accept: 'application/json' },
      timeout: 10000,
    });

    const messageId = data?.summary?._id;
    const creditLeft = data?.summary?.credit_left;
    const creditUsed = data?.summary?.credit_used;
    const totalSent = data?.summary?.total_sent;

    if (!messageId) {
      logger.error({ response: data }, 'No message ID returned from mNotify OTP SMS provider');
      return {
        success: false,
        provider: 'MNOTIFY',
        status: 'failed',
        errorMessage: data?.message || 'No message ID returned from mNotify OTP service',
        rawResponse: data as unknown as Record<string, unknown>,
      };
    }

    if (typeof creditLeft === 'number' && creditLeft < 20) {
      sendLowCreditAlert(creditLeft).catch(() => {});
    }

    logger.info(
      {
        messageId,
        recipient,
        sender,
        creditUsed,
        creditLeft,
      },
      'mNotify OTP SMS dispatched successfully'
    );

    return {
      success: true,
      provider: 'MNOTIFY',
      providerMessageId: messageId,
      status: 'sent',
      creditUsed,
      creditLeft,
      totalSent,
      sender,
      rawResponse: data as unknown as Record<string, unknown>,
    };
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || err.message || 'mNotify OTP SMS dispatch failed';
    logger.error({ err: err.response?.data || errorMsg, recipient }, 'mNotify OTP SMS dispatch failed');
    return {
      success: false,
      provider: 'MNOTIFY',
      status: 'failed',
      errorMessage: errorMsg,
      rawResponse: err.response?.data,
    };
  }
}

// ==================== ADAPTER CLASS ====================

export class MNotifySmsAdapter implements ISmsProvider {
  readonly code = 'MNOTIFY';
  private customApiKey?: string;

  constructor(apiKey?: string) {
    this.customApiKey = apiKey;
  }

  static isUnicode = isUnicode;
  static calculateSMSCredits = calculateSMSCredits;

  /**
   * Universal sendSms dispatcher: automatically routes to sendOTP if isOtp is set, or normal sendMessage
   */
  async sendSms(params: SendSmsParams): Promise<SendSmsResult> {
    if (params.isOtp || params.smsType === 'otp') {
      return this.sendOTP(params.recipient, params.message, {
        senderId: params.senderId,
        skipDeliveryCheck: params.skipDeliveryCheck,
      });
    }

    return this.sendMessage(params.recipient, params.message, {
      senderId: params.senderId,
      skipDeliveryCheck: params.skipDeliveryCheck,
    });
  }

  /**
   * Normal SMS
   */
  async sendMessage(
    recipient: string | string[],
    message: string,
    options?: { senderId?: string; skipDeliveryCheck?: boolean }
  ): Promise<SendSmsResult> {
    return sendMessage(recipient, message, {
      ...options,
      apiKey: this.customApiKey,
    });
  }

  /**
   * OTP SMS
   */
  async sendOTP(
    recipient: string | string[],
    message: string,
    options?: { senderId?: string; skipDeliveryCheck?: boolean }
  ): Promise<SendSmsResult> {
    return sendOTP(recipient, message, {
      ...options,
      apiKey: this.customApiKey,
    });
  }

  /**
   * Check delivery status
   */
  async checkDeliveryStatus(messageId: string): Promise<string> {
    const apiKey = this.customApiKey || process.env.MNOTIFY_API_KEY || env.SMS_API_KEY;
    if (!apiKey) return 'UNKNOWN';
    return checkDeliveryStatus(messageId, apiKey, 1, 0);
  }
}

export const mnotifySmsAdapter = new MNotifySmsAdapter();
