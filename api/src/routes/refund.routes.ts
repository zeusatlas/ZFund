import { Router } from 'express';
import { authenticate } from '../common/middleware/auth.middleware';
import { requireRole } from '../common/middleware/rbac.middleware';
import { validate } from '../common/middleware/validate.middleware';
import { SystemRole } from '../common/types/auth';
import { refundController } from '../controllers/refund.controller';
import { createRefundRequestSchema, reviewRefundSchema } from '../schemas/refund.schemas';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => refundController.getRefunds(req, res, next));

router.post(
  '/',
  validate({ body: createRefundRequestSchema }),
  (req, res, next) => refundController.requestRefund(req, res, next)
);

router.patch(
  '/:id/review',
  requireRole(SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN, SystemRole.FINANCE_OFFICER),
  validate({ body: reviewRefundSchema }),
  (req, res, next) => refundController.reviewRefund(req, res, next)
);

router.post(
  '/:id/process',
  requireRole(SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN, SystemRole.FINANCE_OFFICER),
  (req, res, next) => refundController.processRefund(req, res, next)
);

export default router;
