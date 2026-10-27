import { Router } from 'express';
import { authenticate } from '../common/middleware/auth.middleware';
import { authRateLimiter } from '../common/middleware/rate-limiter.middleware';
import { validate } from '../common/middleware/validate.middleware';
import { authController } from '../controllers/auth.controller';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordSchema,
} from '../schemas/auth.schemas';

const router = Router();

router.post(
  '/register',
  authRateLimiter,
  validate({ body: registerSchema }),
  (req, res, next) => authController.register(req, res, next)
);

router.post(
  '/login',
  authRateLimiter,
  validate({ body: loginSchema }),
  (req, res, next) => authController.login(req, res, next)
);

router.post(
  '/refresh-token',
  validate({ body: refreshTokenSchema }),
  (req, res, next) => authController.refreshToken(req, res, next)
);

router.post('/logout', (req, res, next) => authController.logout(req, res, next));

router.post('/logout-all', authenticate, (req, res, next) =>
  authController.logoutAll(req, res, next)
);

router.post(
  '/change-password',
  authenticate,
  validate({ body: changePasswordSchema }),
  (req, res, next) => authController.changePassword(req, res, next)
);

router.post(
  '/forgot-password',
  authRateLimiter,
  validate({ body: forgotPasswordSchema }),
  (req, res, next) => authController.forgotPassword(req, res, next)
);

router.post(
  '/reset-password',
  authRateLimiter,
  validate({ body: resetPasswordSchema }),
  (req, res, next) => authController.resetPassword(req, res, next)
);

router.get('/profile', authenticate, (req, res, next) =>
  authController.getProfile(req, res, next)
);

export default router;
