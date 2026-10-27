import { Router } from 'express';
import { authenticate } from '../common/middleware/auth.middleware';
import { requireRole } from '../common/middleware/rbac.middleware';
import { documentUpload } from '../common/middleware/upload.middleware';
import { validate } from '../common/middleware/validate.middleware';
import { SystemRole } from '../common/types/auth';
import { documentController } from '../controllers/document.controller';
import { reviewDocumentSchema, uploadDocumentMetadataSchema } from '../schemas/document.schemas';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => documentController.getDocuments(req, res, next));
router.get('/:id', (req, res, next) => documentController.getDocumentById(req, res, next));
router.get('/:id/download', (req, res, next) => documentController.downloadDocument(req, res, next));

router.post(
  '/upload',
  documentUpload.single('file'),
  validate({ body: uploadDocumentMetadataSchema }),
  (req, res, next) => documentController.uploadDocument(req, res, next)
);

router.patch(
  '/:id/review',
  requireRole(SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN, SystemRole.VERIFICATION_OFFICER),
  validate({ body: reviewDocumentSchema }),
  (req, res, next) => documentController.reviewDocument(req, res, next)
);

export default router;
