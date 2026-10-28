import { Router } from 'express';
import { optionalAuthenticate } from '../common/middleware/auth.middleware';
import { contributionController } from '../controllers/contribution.controller';

const router = Router();

router.get('/', optionalAuthenticate, (req, res, next) =>
  contributionController.getContributions(req, res, next)
);
router.get('/:id', optionalAuthenticate, (req, res, next) =>
  contributionController.getContributionById(req, res, next)
);

export default router;
