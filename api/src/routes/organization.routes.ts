import { Router } from 'express';
import { authenticate } from '../common/middleware/auth.middleware';
import { requireRole } from '../common/middleware/rbac.middleware';
import { validate } from '../common/middleware/validate.middleware';
import { SystemRole } from '../common/types/auth';
import { organizationController } from '../controllers/organization.controller';
import {
  addMemberSchema,
  createOrganizationSchema,
  updateOrganizationSchema,
  verifyOrganizationSchema,
} from '../schemas/organization.schemas';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => organizationController.getOrganizations(req, res, next));

router.get('/:id', (req, res, next) =>
  organizationController.getOrganizationById(req, res, next)
);

router.post(
  '/',
  validate({ body: createOrganizationSchema }),
  (req, res, next) => organizationController.createOrganization(req, res, next)
);

router.put(
  '/:id',
  validate({ body: updateOrganizationSchema }),
  (req, res, next) => organizationController.updateOrganization(req, res, next)
);

router.patch(
  '/:id/verify',
  requireRole(SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN, SystemRole.VERIFICATION_OFFICER),
  validate({ body: verifyOrganizationSchema }),
  (req, res, next) => organizationController.verifyOrganization(req, res, next)
);

router.post(
  '/:id/members',
  validate({ body: addMemberSchema }),
  (req, res, next) => organizationController.addMember(req, res, next)
);

router.delete('/:id/members/:userId', (req, res, next) =>
  organizationController.removeMember(req, res, next)
);

export default router;
