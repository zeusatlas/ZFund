import { Router } from 'express';
import { authenticate } from '../common/middleware/auth.middleware';
import { requireRole } from '../common/middleware/rbac.middleware';
import { SystemRole } from '../common/types/auth';
import { adminController } from '../controllers/admin.controller';

const router = Router();

router.use(authenticate);
router.use(requireRole(SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN));

// Dashboard widgets
router.get('/dashboard/overview', (req, res, next) => adminController.getOverview(req, res, next));
router.get('/dashboard/fund-trend', (req, res, next) => adminController.getFundTrend(req, res, next));
router.get('/dashboard/hosts', (req, res, next) => adminController.getDashboardHosts(req, res, next));
router.get('/dashboard/recent-activity', (req, res, next) =>
  adminController.getRecentActivity(req, res, next)
);

// Paginated admin lists
router.get('/hosts', (req, res, next) => adminController.getHosts(req, res, next));
router.get('/hosts/:id', (req, res, next) => adminController.getHostDetail(req, res, next));
router.get('/funds', (req, res, next) => adminController.getFunds(req, res, next));
router.get('/transactions', (req, res, next) => adminController.getTransactions(req, res, next));

export default router;
