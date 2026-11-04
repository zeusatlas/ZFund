import { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';
import { paymentService } from '../services/payment.service';
import { paystackProvider } from '../services/paystack.provider';

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
   * Handles Paystack webhooks (charge.success / charge.failed) for the USSD experiment
   */
  async handlePaystackWebhook(req: Request, res: Response, _next?: NextFunction): Promise<void> {
    try {
      const signature = req.headers['x-paystack-signature'] as string | undefined;
      const rawBody = req.rawBody;
      if (!rawBody || !signature || !paystackProvider.verifyWebhookSignature(rawBody, signature)) {
        logger.warn('Rejected Paystack webhook with missing or invalid signature');
        res.sendStatus(401);
        return;
      }

      logger.info(
        { event: req.body?.event, reference: req.body?.data?.reference, status: req.body?.data?.status },
        'Received Paystack webhook'
      );
      await paymentService.handlePaystackCallback(req.body);
      res.sendStatus(200);
    } catch (err: any) {
      logger.error({ error: err?.message, stack: err?.stack }, 'Error handling Paystack webhook');
      res.sendStatus(500);
    }
  }
}

export const webhookController = new WebhookController();
