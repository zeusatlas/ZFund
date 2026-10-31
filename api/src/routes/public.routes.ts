import { Router } from 'express';
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

export default router;

