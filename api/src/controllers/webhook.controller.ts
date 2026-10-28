import { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';
import { paymentService } from '../services/payment.service';

export class WebhookController {
  async handlePaystackWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawBody = req.rawBody;
      const eventPayload = req.body;

      if (!rawBody) {
        res.status(400).send('Raw body unavailable');
        return;
      }

      logger.info(
        {
          event: eventPayload.event,
          reference: eventPayload.data?.reference,
        },
        'Received verified Paystack webhook'
      );

      await paymentService.handleWebhook(rawBody, eventPayload);

      // Paystack expects 200 OK to acknowledge receipt
      res.status(200).send('Webhook processed');
    } catch (err) {
      logger.error({ err }, 'Error handling Paystack webhook');
      next(err);
    }
  }
}

export const webhookController = new WebhookController();
