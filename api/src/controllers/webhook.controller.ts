import { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';
import { paymentService } from '../services/payment.service';

export class WebhookController {
  /**
   * Handles RobsPay payment callbacks
   */
  async handleRobspayWebhook(req: Request, res: Response, _next?: NextFunction): Promise<void> {
    try {
      const data = req.body;
      const rawBody = req.rawBody;

      logger.info(
        {
          transactionId: data?.trans_id,
          telcoTransId: data?.telco_tran_id,
          status: data?.status,
          amount: data?.amount,
          customerName: data?.customer_name,
        },
        'Received RobsPay callback'
      );

      await paymentService.handleRobspayCallback(data, rawBody);

      // RobsPay expects 200 OK to acknowledge receipt
      res.sendStatus(200);
    } catch (err: any) {
      logger.error({ error: err?.message, stack: err?.stack }, 'Error handling RobsPay callback');
      res.sendStatus(500);
    }
  }

  /**
   * Handles legacy Paystack webhooks (if enabled)
   */
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
