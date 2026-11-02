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

}

export const webhookController = new WebhookController();
