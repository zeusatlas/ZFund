import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../common/errors/app-error';
import { ApiResponse } from '../common/utils/response';
import { ContributionStatus } from '../database/entities/contribution.entity';
import { ProjectStatus } from '../database/entities/project.entity';
import { UserStatus } from '../database/entities/user.entity';
import { adminDashboardService, TrendPeriod } from '../services/admin-dashboard.service';

const pageParams = (req: Request, defaultLimit: number) => ({
  page: parseInt(req.query.page as string, 10) || 1,
  limit: Math.min(parseInt(req.query.limit as string, 10) || defaultLimit, 100),
  search: (req.query.search as string | undefined)?.trim() || undefined,
});

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Treat malformed ids as "not found" instead of letting Postgres reject them. */
const requireId = (id: string, what: string) => {
  if (!UUID.test(id)) throw new NotFoundError(`${what} not found`);
  return id;
};

const oneOf = <T extends string>(values: Record<string, T>, value: unknown): T | undefined =>
  Object.values(values).includes(value as T) ? (value as T) : undefined;

export class AdminController {
  async getOverview(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminDashboardService.getOverview();
      ApiResponse.success(res, data, 'Dashboard overview retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getFundTrend(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const period: TrendPeriod = req.query.period === '30d' ? '30d' : '12m';
      const data = await adminDashboardService.getFundTrend(period);
      ApiResponse.success(res, data, 'Fund trend retrieved');
    } catch (err) {
      next(err);
    }
  }

  /** Short host list for the dashboard card. */
  async getDashboardHosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 5;
      const { items } = await adminDashboardService.getHosts({ limit });
      ApiResponse.success(res, items, 'Host accounts retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getHosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search } = pageParams(req, 10);
      const status = oneOf(UserStatus, req.query.status);
      const result = await adminDashboardService.getHosts({ page, limit, search, status });
      ApiResponse.success(res, result.items, 'Host accounts retrieved', 200, {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit) || 1,
        counts: result.counts,
      });
    } catch (err) {
      next(err);
    }
  }

  async getHostDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminDashboardService.getHostDetail(requireId(req.params.id, 'Host'));
      ApiResponse.success(res, data, 'Host retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getFunds(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search } = pageParams(req, 10);
      const status = oneOf(ProjectStatus, req.query.status);
      const [result, counts] = await Promise.all([
        adminDashboardService.getFunds({ page, limit, search, status }),
        adminDashboardService.getFundCounts(),
      ]);
      ApiResponse.success(res, result.items, 'Funds retrieved', 200, {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit) || 1,
        counts,
      });
    } catch (err) {
      next(err);
    }
  }

  async getFundDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminDashboardService.getFundDetail(requireId(req.params.id, 'Campaign'));
      ApiResponse.success(res, data, 'Campaign retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getFundContributions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search } = pageParams(req, 10);
      const status = oneOf(ContributionStatus, req.query.status);
      const result = await adminDashboardService.getFundContributions(requireId(req.params.id, 'Campaign'), {
        page,
        limit,
        search,
        status,
      });
      ApiResponse.paginated(res, result.items, page, limit, result.total, 'Contributions retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search } = pageParams(req, 10);
      const status = oneOf(ContributionStatus, req.query.status);
      const [result, counts] = await Promise.all([
        adminDashboardService.getTransactions({ page, limit, search, status }),
        adminDashboardService.getTransactionCounts(),
      ]);
      ApiResponse.success(res, result.items, 'Transactions retrieved', 200, {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit) || 1,
        counts,
      });
    } catch (err) {
      next(err);
    }
  }

  async getActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit } = pageParams(req, 10);
      const result = await adminDashboardService.getActivity({ page, limit });
      ApiResponse.paginated(res, result.items, page, limit, result.total, 'Activity retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getRecentActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 4;
      const data = await adminDashboardService.getRecentActivity(limit);
      ApiResponse.success(res, data, 'Recent activity retrieved');
    } catch (err) {
      next(err);
    }
  }
}

export const adminController = new AdminController();
