import { Router } from 'express';
import { authenticate } from '../common/middleware/auth.middleware';
import { requireRole } from '../common/middleware/rbac.middleware';
import { SystemRole } from '../common/types/auth';
import { financialController } from '../controllers/financial.controller';

const router = Router();

router.use(authenticate);

router.get(
  '/summary',
  (req, res, next) => financialController.getSummary(req, res, next)
);

router.get(
  '/ledger',
  requireRole(SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN, SystemRole.FINANCE_OFFICER, SystemRole.AUDITOR),
  (req, res, next) => financialController.getLedgerEntries(req, res, next)
);

export default router;
