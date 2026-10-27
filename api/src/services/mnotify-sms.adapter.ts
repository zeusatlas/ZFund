import axios from 'axios';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { ISmsProvider, SendSmsParams, SendSmsResult } from './sms-provider.interface';

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

export class MNotifySmsAdapter implements ISmsProvider {
  readonly code = 'MNOTIFY';
  private customApiKey?: string;

  constructor(apiKey?: string) {
    this.customApiKey = apiKey;
  }

  /**
   * Check if message contains Unicode characters (outside standard GSM-7)
   */
  static isUnicode(message: string): boolean {
    return /[^\x00-\x7F]|[€,£{}[\]~^\\|]/.test(message);
  }

  /**
   * Calculate SMS credits needed based on message length and recipient count
   */
  static calculateSMSCredits(message: string, recipientCount = 1): number {
    const messageLength = message.length;
    const unicode = MNotifySmsAdapter.isUnicode(message);

    let parts = 0;
    if (unicode) {
      parts = messageLength <= 70 ? 1 : Math.ceil(messageLength / 67);
    } else {
      parts = messageLength <= 160 ? 1 : Math.ceil(messageLength / 153);
    }

    return parts * recipientCount;
  }

  async sendSms(params: SendSmsParams): Promise<SendSmsResult> {
    const apiKey =
      this.customApiKey ||
      process.env.MNOTIFY_API_KEY ||
      env.MNOTIFY_API_KEY ||
      env.SMS_API_KEY;
    const baseUrl = env.MNOTIFY_URL || 'https://api.mnotify.com/api/sms/quick';
    const defaultSender = params.senderId || env.MNOTIFY_SENDER_ID || env.SMS_SENDER_ID || 'ZFund';

    if (!apiKey || apiKey.includes('placeholder')) {
      logger.warn('mNotify SMS API key not configured. Check environment settings.');
      return {
        success: false,
        provider: 'MNOTIFY',
        status: 'failed',
        errorMessage: 'mNotify SMS API key not configured',
      };
    }

    // Format recipient phone number into array (e.g. ['233240000001'])
    const recipients = Array.isArray(params.recipient)
      ? params.recipient
      : [params.recipient.trim()];

    const url = `${baseUrl}?key=${apiKey}`;

    const payload = {
      recipient: recipients,
      sender: defaultSender,
      message: params.message,
      is_schedule: false,
    };

    try {
      const response = await axios.post<MNotifySendResponse>(url, payload, {
        headers: { Accept: 'application/json' },
        timeout: 10000,
      });

      const data = response.data;
      const messageId = data?.summary?._id;

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

      logger.info(
        {
          messageId,
          recipient: params.recipient,
          sender: defaultSender,
          creditUsed: data.summary.credit_used,
          creditLeft: data.summary.credit_left,
        },
        'mNotify SMS dispatched successfully'
      );

      return {
        success: true,
        provider: 'MNOTIFY',
        providerMessageId: messageId,
        status: 'sent',
        rawResponse: data as unknown as Record<string, unknown>,
      };
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosErr = err as any;
      const errorMsg =
        axiosErr.response?.data?.message || axiosErr.message || 'mNotify SMS dispatch failed';

      logger.error(
        {
          err: axiosErr.response?.data || errorMsg,
          recipient: params.recipient,
        },
        'mNotify SMS sending failed'
      );

      return {
        success: false,
        provider: 'MNOTIFY',
        status: 'failed',
        errorMessage: errorMsg,
        rawResponse: axiosErr.response?.data,
      };
    }
  }

  /**
   * Check delivery status from mNotify
   */
  async checkDeliveryStatus(messageId: string): Promise<string> {
    const apiKey = env.MNOTIFY_API_KEY || env.SMS_API_KEY;
    if (!apiKey) return 'UNKNOWN';

    try {
      const url = `https://api.mnotify.com/api/sms/delivery?key=${apiKey}&campaign_id=${messageId}`;
      const response = await axios.get<MNotifyDeliveryResponse>(url, {
        headers: { Accept: 'application/json' },
        timeout: 5000,
      });

      return response.data?.report?.status || response.data?.status || 'PENDING';
    } catch (err) {
      logger.warn({ err, messageId }, 'Failed to check mNotify delivery status');
      return 'UNKNOWN';
    }
  }
}

export const mnotifySmsAdapter = new MNotifySmsAdapter();
