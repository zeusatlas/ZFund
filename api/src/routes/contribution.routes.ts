import { Router } from 'express';
import { authenticate } from '../common/middleware/auth.middleware';
import { contributionController } from '../controllers/contribution.controller';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => contributionController.getContributions(req, res, next));
router.get('/:id', (req, res, next) => contributionController.getContributionById(req, res, next));

export default router;
