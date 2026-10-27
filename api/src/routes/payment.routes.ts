import { Router } from 'express';
import { authenticate } from '../common/middleware/auth.middleware';
import { paystackWebhookAuth } from '../common/middleware/paystack-auth.middleware';
import { validate } from '../common/middleware/validate.middleware';
import { paymentController } from '../controllers/payment.controller';
import { initiatePaymentSchema, verifyPaymentSchema } from '../schemas/payment.schemas';
import { webhookController } from '../controllers/webhook.controller';

const router = Router();

/**
 * Public or authenticated payment initiation
 */
router.post(
  '/initiate',
  validate({ body: initiatePaymentSchema }),
  (req, res, next) => paymentController.initiatePayment(req, res, next)
);

/**
 * Transaction verification by reference
 */
router.get(
  '/verify/:reference',
  (req, res, next) => paymentController.verifyPayment(req, res, next)
);

/**
 * Authenticated transaction listing
 */
router.get(
  '/',
  authenticate,
  (req, res, next) => paymentController.getPayments(req, res, next)
);

/**
 * Dedicated Paystack Webhook endpoint (Signature verified via HMAC SHA512)
 */
router.post(
  '/webhook/paystack',
  paystackWebhookAuth,
  (req, res, next) => webhookController.handlePaystackWebhook(req, res, next)
);

export default router;
