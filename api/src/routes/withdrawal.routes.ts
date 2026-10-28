import { Router } from 'express';
import { authenticate, optionalAuthenticate } from '../common/middleware/auth.middleware';
import { validate } from '../common/middleware/validate.middleware';
import { withdrawalController } from '../controllers/withdrawal.controller';
import {
  createWithdrawalSchema,
  updateWithdrawalSchema,
  updateWithdrawalStatusSchema,
} from '../schemas/withdrawal.schemas';

const router = Router();

router.get('/', optionalAuthenticate, (req, res, next) =>
  withdrawalController.list(req, res, next)
);

router.get('/mine', authenticate, (req, res, next) =>
  withdrawalController.listMine(req, res, next)
);

router.get('/:id', optionalAuthenticate, (req, res, next) =>
  withdrawalController.getById(req, res, next)
);

router.post(
  '/',
  authenticate,
  validate({ body: createWithdrawalSchema }),
  (req, res, next) => withdrawalController.create(req, res, next)
);

router.put(
  '/:id',
  authenticate,
  validate({ body: updateWithdrawalSchema }),
  (req, res, next) => withdrawalController.update(req, res, next)
);

router.delete('/:id', authenticate, (req, res, next) =>
  withdrawalController.delete(req, res, next)
);

router.patch(
  '/:id/status',
  authenticate,
  validate({ body: updateWithdrawalStatusSchema }),
  (req, res, next) => withdrawalController.updateStatus(req, res, next)
);

export default router;
