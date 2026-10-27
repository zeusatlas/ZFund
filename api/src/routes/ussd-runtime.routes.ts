import { Router } from 'express';
import { naloAuthMiddleware } from '../common/middleware/nalo-auth.middleware';
import { ussdRateLimiter } from '../common/middleware/rate-limiter.middleware';
import { ussdRuntimeController } from '../controllers/ussd-runtime.controller';

const router = Router();

/**
 * Public NALO USSD Gateway Callback Endpoint
 * Receives POST requests from NALO USSD Gateway
 */
router.post(
  '/nalo',
  ussdRateLimiter,
  naloAuthMiddleware,
  (req, res, next) => ussdRuntimeController.handleNaloRequest(req, res, next)
);

export default router;
