import { Router } from 'express';
import { authenticate, optionalAuthenticate } from '../common/middleware/auth.middleware';
import { validate } from '../common/middleware/validate.middleware';
import { projectController } from '../controllers/project.controller';
import {
  configurePaymentMethodsSchema,
  configurePurposesSchema,
  createProjectSchema,
  updateProjectSchema,
  updateProjectStatusSchema,
} from '../schemas/project.schemas';

const router = Router();

router.get('/', optionalAuthenticate, (req, res, next) =>
  projectController.getProjects(req, res, next)
);

router.get('/categories', optionalAuthenticate, (req, res, next) =>
  projectController.getCategories(req, res, next)
);

router.get('/:id', optionalAuthenticate, (req, res, next) =>
  projectController.getProjectById(req, res, next)
);

router.post(
  '/',
  authenticate,
  validate({ body: createProjectSchema }),
  (req, res, next) => projectController.createProject(req, res, next)
);

router.put(
  '/:id',
  authenticate,
  validate({ body: updateProjectSchema }),
  (req, res, next) => projectController.updateProject(req, res, next)
);

router.patch(
  '/:id/status',
  authenticate,
  validate({ body: updateProjectStatusSchema }),
  (req, res, next) => projectController.updateProjectStatus(req, res, next)
);

router.post(
  '/:id/purposes',
  authenticate,
  validate({ body: configurePurposesSchema }),
  (req, res, next) => projectController.configurePurposes(req, res, next)
);

router.post(
  '/:id/payment-methods',
  authenticate,
  validate({ body: configurePaymentMethodsSchema }),
  (req, res, next) => projectController.configurePaymentMethods(req, res, next)
);

export default router;
