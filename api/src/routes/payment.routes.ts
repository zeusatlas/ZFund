import { Router } from 'express';
import { authenticate } from '../common/middleware/auth.middleware';
import { robspayWebhookAuth } from '../common/middleware/robspay-auth.middleware';
import { validate } from '../common/middleware/validate.middleware';
import { paymentController } from '../controllers/payment.controller';
import { initiatePaymentSchema } from '../schemas/payment.schemas';
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
 * Dedicated RobsPay Webhook & Callback endpoints
 */
router.post(
  '/webhook/robspay',
  robspayWebhookAuth,
  (req, res, next) => webhookController.handleRobspayWebhook(req, res, next)
);

router.post(
  '/callback/robspay',
  robspayWebhookAuth,
  (req, res, next) => webhookController.handleRobspayWebhook(req, res, next)
);

router.post(
  '/trial-callback',
  robspayWebhookAuth,
  (req, res, next) => webhookController.handleRobspayWebhook(req, res, next)
);



export default router;
