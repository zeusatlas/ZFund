import { AppDataSource } from '../config/database';
import { logger } from '../config/logger';
import { NotificationDeliveryAttempt } from '../database/entities/notification-delivery-attempt.entity';
import { SmsProviderFactory } from './sms-provider.factory';

export class SmsService {
  private get attemptRepo() { return AppDataSource.getRepository(NotificationDeliveryAttempt); }

  async send(params: {
    notificationId?: string;
    recipient: string;
    message: string;
    senderId?: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const provider = SmsProviderFactory.getProvider();

    try {
      const result = await provider.sendSms({
        recipient: params.recipient,
        message: params.message,
        senderId: params.senderId,
      });

      if (params.notificationId) {
        await this.attemptRepo.save(
          this.attemptRepo.create({
            notificationId: params.notificationId,
            attemptNumber: 1,
            provider: result.provider,
            status: result.status,
            responseData: result.rawResponse || {},
            errorMessage: result.errorMessage,
          })
        );
      }

      return {
        success: result.success,
        messageId: result.providerMessageId,
        error: result.errorMessage,
      };
    } catch (err: unknown) {
      const msg = (err as Error).message;
      logger.error({ err: msg, recipient: params.recipient }, 'SMS dispatch encountered error');

      if (params.notificationId) {
        await this.attemptRepo.save(
          this.attemptRepo.create({
            notificationId: params.notificationId,
            attemptNumber: 1,
            provider: provider.code,
            status: 'failed',
            errorMessage: msg,
          })
        );
      }

      return {
        success: false,
        error: msg,
      };
    }
  }
}

export const smsService = new SmsService();
