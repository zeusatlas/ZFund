import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../common/utils/response';
import { projectService } from '../services/project.service';

export class PublicController {
  /**
   * GET /api/v1/public/campaigns/:hostSlug/:campaignSlug
   * Fetches public campaign information for the web donation portal
   */
  async getPublicCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { hostSlug, campaignSlug } = req.params;
      const campaign = await projectService.getPublicCampaignBySlugs(hostSlug, campaignSlug);
      ApiResponse.success(res, campaign, 'Campaign details retrieved');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/public/campaigns/code/:identifier
   * Fetches public campaign by USSD event code (e.g. '1001') or project UUID
   */
  async getPublicCampaignByCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { identifier } = req.params;
      const campaign = await projectService.getPublicCampaignByIdOrCode(identifier);
      ApiResponse.success(res, campaign, 'Campaign details retrieved');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/public/hosts/:hostSlug
   * Fetches public host profile and their active public campaigns
   */
  async getPublicHost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { hostSlug } = req.params;
      const hostData = await projectService.getPublicHostBySlug(hostSlug);
      ApiResponse.success(res, hostData, 'Host profile retrieved');
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/public/campaigns/:projectId/support-words
   * Adds an encouraging comment / words of support to a campaign
   */
  async addWordOfSupport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const { name, message, isAnonymous } = req.body;
      const comment = await projectService.addWordOfSupport(projectId, {
        name,
        message,
        isAnonymous,
      });
      ApiResponse.success(res, comment, 'Words of support added successfully', 201);
    } catch (err) {
      next(err);
    }
  }
}

export const publicController = new PublicController();

