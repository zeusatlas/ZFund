import { AppDataSource } from '../config/database';
import { logger } from '../config/logger';
import { NotificationTemplate } from '../database/entities/notification-template.entity';
import { Notification, NotificationStatus } from '../database/entities/notification.entity';
import { NotificationChannel } from '../database/entities/notification-template.entity';
import { smsService } from './sms.service';

export interface SendNotificationParams {
  templateKey: string;
  recipientPhone?: string;
  recipientEmail?: string;
  channel?: NotificationChannel;
  eventType: string;
  variables: Record<string, string | number>;
  metadata?: Record<string, unknown>;
}

export class NotificationService {
  private get templateRepo() { return AppDataSource.getRepository(NotificationTemplate); }
  private get notificationRepo() { return AppDataSource.getRepository(Notification); }

  async sendNotification(params: SendNotificationParams): Promise<Notification> {
    const channel = params.channel || NotificationChannel.SMS;

    // Look up template in database
    const template = await this.templateRepo.findOne({
      where: { templateKey: params.templateKey, isActive: true },
    });

    let messageBody = '';
    if (template) {
      messageBody = this.renderTemplate(template.messageTemplate, params.variables);
    } else {
      // Fallback default message if template is not yet seeded
      messageBody = `Notification for event ${params.eventType}. Ref: ${params.variables.reference || 'N/A'}`;
    }

    const notification = this.notificationRepo.create({
      templateKey: params.templateKey,
      recipientPhone: params.recipientPhone,
      recipientEmail: params.recipientEmail,
      channel,
      eventType: params.eventType,
      messageBody,
      status: NotificationStatus.QUEUED,
      metadata: params.metadata || {},
    });

    const saved = await this.notificationRepo.save(notification);

    // Non-blocking dispatch: do not fail financial transactions if SMS fails
    if (channel === NotificationChannel.SMS && params.recipientPhone) {
      this.dispatchSmsSafely(saved);
    }

    return saved;
  }

  private renderTemplate(templateStr: string, variables: Record<string, string | number>): string {
    let result = templateStr;
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{${key}}`;
      result = result.split(placeholder).join(String(value));
    }
    return result;
  }

  private async dispatchSmsSafely(notification: Notification): Promise<void> {
    try {
      const result = await smsService.send({
        notificationId: notification.id,
        recipient: notification.recipientPhone!,
        message: notification.messageBody,
      });

      if (result.success) {
        notification.status = NotificationStatus.SENT;
        notification.sentAt = new Date();
        notification.providerMessageId = result.messageId;
      } else {
        notification.status = NotificationStatus.FAILED;
        notification.errorDetails = result.error;
        notification.retryCount += 1;
      }

      await this.notificationRepo.save(notification);
    } catch (err) {
      logger.error({ err, notificationId: notification.id }, 'Background SMS dispatch failed');
      try {
        notification.status = NotificationStatus.FAILED;
        notification.errorDetails = (err as Error).message;
        await this.notificationRepo.save(notification);
      } catch {
        // Prevent secondary unhandled rejections during test teardown or database shutdown
      }
    }
  }

  async getNotifications(params: {
    page?: number;
    limit?: number;
    recipientPhone?: string;
    status?: NotificationStatus;
  }): Promise<{ notifications: Notification[]; total: number }> {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const query = this.notificationRepo.createQueryBuilder('n');
    if (params.recipientPhone) {
      query.andWhere('n.recipientPhone = :phone', { phone: params.recipientPhone });
    }
    if (params.status) {
      query.andWhere('n.status = :status', { status: params.status });
    }

    query.orderBy('n.createdAt', 'DESC').skip(skip).take(limit);

    const [notifications, total] = await query.getManyAndCount();
    return { notifications, total };
  }

  async retryNotification(id: string): Promise<Notification> {
    const notification = await this.notificationRepo.findOne({ where: { id } });
    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.status !== NotificationStatus.FAILED) {
      return notification;
    }

    notification.status = NotificationStatus.QUEUED;
    await this.notificationRepo.save(notification);

    if (notification.channel === NotificationChannel.SMS && notification.recipientPhone) {
      await this.dispatchSmsSafely(notification);
    }

    return notification;
  }
}

export const notificationService = new NotificationService();
