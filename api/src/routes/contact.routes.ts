import { Router } from 'express';
import { contactRateLimiter } from '../common/middleware/rate-limiter.middleware';
import { validate } from '../common/middleware/validate.middleware';
import { contactController } from '../controllers/contact.controller';
import { submitContactSchema } from '../schemas/contact.schemas';

const router = Router();

// Public: the website contact form. Rate-limited per IP to deter spam.
router.post('/', contactRateLimiter, validate({ body: submitContactSchema }), (req, res, next) =>
  contactController.submit(req, res, next)
);

export default router;
