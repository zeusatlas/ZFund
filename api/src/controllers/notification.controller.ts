import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../common/utils/response';
import { notificationService } from '../services/notification.service';
import { smsService } from '../services/sms.service';

export class NotificationController {
  async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const recipientPhone = req.query.recipientPhone as string | undefined;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = req.query.status as any;

      const result = await notificationService.getNotifications({
        page,
        limit,
        recipientPhone,
        status,
      });

      ApiResponse.paginated(res, result.notifications, page, limit, result.total, 'Notifications retrieved');
    } catch (err) {
      next(err);
    }
  }

  async retryNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const notification = await notificationService.retryNotification(req.params.id);
      ApiResponse.success(res, notification, 'Notification re-queued for delivery');
    } catch (err) {
      next(err);
    }
  }

  async testSms(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { recipient, message } = req.body;
      const result = await smsService.send({
        recipient,
        message,
      });

      ApiResponse.success(
        res,
        result,
        result.success ? 'Test SMS sent successfully' : 'SMS provider dispatch failed',
        result.success ? 200 : 502
      );
    } catch (err) {
      next(err);
    }
  }
}

export const notificationController = new NotificationController();
