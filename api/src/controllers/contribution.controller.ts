import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../common/utils/response';
import { contributionService } from '../services/contribution.service';

export class ContributionController {
  async getContributions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const projectId =
        (req.query.projectId as string) || (req.query.campaignId as string) || undefined;
      const contributorId = req.query.contributorId as string | undefined;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = req.query.status as any;
      const search = req.query.search as string | undefined;
      const from = req.query.from as string | undefined;
      const to = req.query.to as string | undefined;

      const result = await contributionService.getContributions({
        userId: req.user?.id,
        userRole: req.user?.role,
        projectId,
        contributorId,
        status,
        search,
        from,
        to,
        page,
        limit,
      });

      ApiResponse.paginated(
        res,
        result.contributions,
        page,
        limit,
        result.total,
        'Contributions retrieved',
        result.summary
      );
    } catch (err) {
      next(err);
    }
  }

  async getContributionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const contribution = await contributionService.getContributionById(req.params.id);
      ApiResponse.success(res, contribution, 'Contribution retrieved');
    } catch (err) {
      next(err);
    }
  }
}

export const contributionController = new ContributionController();
