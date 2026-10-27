import { Router } from 'express';
import { authenticate } from '../common/middleware/auth.middleware';
import { requireRole } from '../common/middleware/rbac.middleware';
import { SystemRole } from '../common/types/auth';
import { auditController } from '../controllers/audit.controller';

const router = Router();

router.use(authenticate);
router.use(requireRole(SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN, SystemRole.AUDITOR));

router.get('/', (req, res, next) => auditController.getLogs(req, res, next));

export default router;
