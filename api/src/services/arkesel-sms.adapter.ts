import axios from 'axios';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { ISmsProvider, SendSmsParams, SendSmsResult } from './sms-provider.interface';

export class ArkeselSmsAdapter implements ISmsProvider {
  readonly code = 'ARKESEL';

  async sendSms(params: SendSmsParams): Promise<SendSmsResult> {
    if (!env.SMS_API_KEY || env.SMS_API_KEY.includes('placeholder')) {
      logger.warn('Arkesel SMS API key not configured. Check environment settings.');
      return {
        success: false,
        provider: 'ARKESEL',
        status: 'failed',
        errorMessage: 'Arkesel SMS API key not configured',
      };
    }

    try {
      const sender = params.senderId || env.SMS_SENDER_ID || 'RaiseFunds';

      const response = await axios.post(
        env.SMS_API_URL,
        {
          sender,
          message: params.message,
          recipients: [params.recipient],
        },
        {
          headers: {
            'api-key': env.SMS_API_KEY,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      const data = response.data;
      const isSuccess = data?.status === 'success' || response.status === 200;

      return {
        success: isSuccess,
        provider: 'ARKESEL',
        providerMessageId: data?.data?.id || data?.id,
        status: isSuccess ? 'sent' : 'failed',
        rawResponse: data,
      };
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosErr = err as any;
      logger.error(
        {
          recipient: params.recipient,
          error: axiosErr.response?.data || axiosErr.message,
        },
        'Failed to deliver SMS via Arkesel'
      );

      return {
        success: false,
        provider: 'ARKESEL',
        status: 'failed',
        errorMessage: axiosErr.response?.data?.message || axiosErr.message || 'SMS delivery failed',
      };
    }
  }
}

export const arkeselSmsAdapter = new ArkeselSmsAdapter();
