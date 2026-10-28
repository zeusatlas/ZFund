import { Router } from 'express';
import { authenticate } from '../common/middleware/auth.middleware';
import { requireRole } from '../common/middleware/rbac.middleware';
import { validate } from '../common/middleware/validate.middleware';
import { SystemRole } from '../common/types/auth';
import { ussdFlowController } from '../controllers/ussd-flow.controller';
import {
  createFlowSchema,
  createMenuSchema,
  createOptionSchema,
  publishFlowSchema,
  updateMenuSchema,
  updateOptionSchema,
} from '../schemas/ussd-flow.schemas';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => ussdFlowController.getFlows(req, res, next));
router.get('/:id', (req, res, next) => ussdFlowController.getFlowById(req, res, next));

router.post(
  '/',
  validate({ body: createFlowSchema }),
  (req, res, next) => ussdFlowController.createFlow(req, res, next)
);

router.post(
  '/versions/:versionId/menus',
  validate({ body: createMenuSchema }),
  (req, res, next) => ussdFlowController.createMenu(req, res, next)
);

router.put(
  '/menus/:menuId',
  validate({ body: updateMenuSchema }),
  (req, res, next) => ussdFlowController.updateMenu(req, res, next)
);

router.post(
  '/menus/:menuId/options',
  validate({ body: createOptionSchema }),
  (req, res, next) => ussdFlowController.createOption(req, res, next)
);

router.put(
  '/options/:optionId',
  validate({ body: updateOptionSchema }),
  (req, res, next) => ussdFlowController.updateOption(req, res, next)
);

router.get('/versions/:versionId/validate', (req, res, next) =>
  ussdFlowController.validateFlow(req, res, next)
);

router.post(
  '/:id/versions/:versionId/publish',
  requireRole(SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN, SystemRole.ORG_ADMIN, SystemRole.PROJECT_MANAGER),
  validate({ body: publishFlowSchema }),
  (req, res, next) => ussdFlowController.publishFlow(req, res, next)
);

export default router;
