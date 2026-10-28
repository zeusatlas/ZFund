import { Router } from 'express';
import { authenticate } from '../common/middleware/auth.middleware';
import { requireRole } from '../common/middleware/rbac.middleware';
import { validate } from '../common/middleware/validate.middleware';
import { SystemRole } from '../common/types/auth';
import { userController } from '../controllers/user.controller';
import {
  createUserSchema,
  updateUserRoleSchema,
  updateUserSchema,
  updateUserStatusSchema,
} from '../schemas/user.schemas';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  requireRole(SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN, SystemRole.AUDITOR),
  (req, res, next) => userController.getUsers(req, res, next)
);

router.get('/:id', (req, res, next) => userController.getUserById(req, res, next));

router.post(
  '/',
  requireRole(SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN),
  validate({ body: createUserSchema }),
  (req, res, next) => userController.createUser(req, res, next)
);

router.put(
  '/:id',
  validate({ body: updateUserSchema }),
  (req, res, next) => userController.updateUser(req, res, next)
);

router.patch(
  '/:id/role',
  requireRole(SystemRole.SUPER_ADMIN),
  validate({ body: updateUserRoleSchema }),
  (req, res, next) => userController.updateUserRole(req, res, next)
);

router.patch(
  '/:id/status',
  requireRole(SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN),
  validate({ body: updateUserStatusSchema }),
  (req, res, next) => userController.updateUserStatus(req, res, next)
);

export default router;
