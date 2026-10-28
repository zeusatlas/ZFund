import { Router } from 'express';
import { authenticate } from '../common/middleware/auth.middleware';
import { requireRole } from '../common/middleware/rbac.middleware';
import { validate } from '../common/middleware/validate.middleware';
import { SystemRole } from '../common/types/auth';
import { notificationController } from '../controllers/notification.controller';
import { testSmsSchema } from '../schemas/notification.schemas';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  requireRole(SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN, SystemRole.AUDITOR),
  (req, res, next) => notificationController.getNotifications(req, res, next)
);

router.post(
  '/:id/retry',
  requireRole(SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN),
  (req, res, next) => notificationController.retryNotification(req, res, next)
);

router.post(
  '/test-sms',
  requireRole(SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN),
  validate({ body: testSmsSchema }),
  (req, res, next) => notificationController.testSms(req, res, next)
);

export default router;
