import { Router } from 'express';
import { authenticate } from '../common/middleware/auth.middleware';
import { requireRole } from '../common/middleware/rbac.middleware';
import { validate } from '../common/middleware/validate.middleware';
import { SystemRole } from '../common/types/auth';
import { withdrawalController } from '../controllers/withdrawal.controller';
import { createWithdrawalSchema } from '../schemas/withdrawal.schemas';

const router = Router();

router.use(authenticate);
router.use(requireRole(SystemRole.ACCOUNT_OWNER));

router.get('/mine', (req, res, next) => withdrawalController.listMine(req, res, next));
router.post('/', validate({ body: createWithdrawalSchema }), (req, res, next) =>
  withdrawalController.create(req, res, next)
);

export default router;
