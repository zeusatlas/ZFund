import { Router } from 'express';
import { authenticate } from '../common/middleware/auth.middleware';
import { validate } from '../common/middleware/validate.middleware';
import { updateUserSettingsSchema } from '../schemas/settings.schemas';
import { settingsController } from '../controllers/settings.controller';

const router = Router();

router.get('/fees', (req, res) => settingsController.getFees(req, res));

router.use(authenticate);

router.get('/', (req, res, next) => settingsController.getSettings(req, res, next));
router.put('/', validate({ body: updateUserSettingsSchema }), (req, res, next) =>
  settingsController.updateSettings(req, res, next)
);

export default router;

