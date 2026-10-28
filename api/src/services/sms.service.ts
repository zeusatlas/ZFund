import { AppDataSource } from '../config/database';
import { logger } from '../config/logger';
import { NotificationDeliveryAttempt } from '../database/entities/notification-delivery-attempt.entity';
import { SmsProviderFactory } from './sms-provider.factory';

export class SmsService {
  private get attemptRepo() { return AppDataSource.getRepository(NotificationDeliveryAttempt); }

  /**
   * Main dispatch function supporting both regular and OTP SMS
   */
  async send(params: {
    notificationId?: string;
    recipient: string | string[];
    message: string;
    senderId?: string;
    isOtp?: boolean;
    smsType?: 'otp' | 'normal';
    skipDeliveryCheck?: boolean;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const provider = SmsProviderFactory.getProvider();

    try {
      const result = await provider.sendSms({
        recipient: params.recipient,
        message: params.message,
        senderId: params.senderId,
        isOtp: params.isOtp,
        smsType: params.smsType,
        skipDeliveryCheck: params.skipDeliveryCheck,
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

  /**
   * Dedicated normal / regular SMS dispatch
   */
  async sendMessage(
    recipient: string | string[],
    message: string,
    options?: { senderId?: string; notificationId?: string; skipDeliveryCheck?: boolean }
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    return this.send({
      recipient,
      message,
      senderId: options?.senderId,
      notificationId: options?.notificationId,
      isOtp: false,
      smsType: 'normal',
      skipDeliveryCheck: options?.skipDeliveryCheck,
    });
  }

  /**
   * Dedicated OTP SMS dispatch (routes with sms_type: 'otp')
   */
  async sendOTP(
    recipient: string | string[],
    message: string,
    options?: { senderId?: string; notificationId?: string; skipDeliveryCheck?: boolean }
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    return this.send({
      recipient,
      message,
      senderId: options?.senderId,
      notificationId: options?.notificationId,
      isOtp: true,
      smsType: 'otp',
      skipDeliveryCheck: options?.skipDeliveryCheck,
    });
  }
}

export const smsService = new SmsService();
