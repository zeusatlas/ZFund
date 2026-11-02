import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import { CAMPAIGN_IMAGE_DIR } from '../common/middleware/upload.middleware';
import { publicController } from '../controllers/public.controller';

const router = Router();

/**
 * GET /api/v1/public/campaigns/code/:identifier
 * Fast lookup by USSD event code (e.g. '1001') or project UUID
 */
router.get('/campaigns/code/:identifier', (req, res, next) =>
  publicController.getPublicCampaignByCode(req, res, next)
);

/**
 * GET /api/v1/public/campaigns/:hostSlug/:campaignSlug
 * Full public campaign details for raisefundz.com/[host-slug]/[campaign-slug]
 */
router.get('/campaigns/:hostSlug/:campaignSlug', (req, res, next) =>
  publicController.getPublicCampaign(req, res, next)
);

/**
 * GET /api/v1/public/hosts/:hostSlug
 * Public host profile and active campaign listings
 */
router.get('/hosts/:hostSlug', (req, res, next) =>
  publicController.getPublicHost(req, res, next)
);

/**
 * POST /api/v1/public/campaigns/:projectId/support-words
 * Post an encouraging message / words of support
 */
router.post('/campaigns/:projectId/support-words', (req, res, next) =>
  publicController.addWordOfSupport(req, res, next)
);

/**
 * GET /api/v1/public/campaign-images/:filename
 * Campaign cover images shown on public campaign pages
 */
router.get('/campaign-images/:filename', (req, res) => {
  const filename = path.basename(req.params.filename);
  const file = path.join(CAMPAIGN_IMAGE_DIR, filename);
  if (!/^[\w.-]+$/.test(filename) || !fs.existsSync(file)) {
    res.sendStatus(404);
    return;
  }
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.sendFile(file);
});

export default router;

