import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../common/utils/response';
import { financialService } from '../services/financial.service';
import { reportingService } from '../services/reporting.service';

export class FinancialController {
  async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = req.query.projectId as string | undefined;
      const organizationId = req.query.organizationId as string | undefined;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

      const summary = await reportingService.getFinancialSummary({
        projectId,
        organizationId,
        startDate,
        endDate,
      });

      ApiResponse.success(res, summary, 'Financial summary report generated');
    } catch (err) {
      next(err);
    }
  }

  async getLedgerEntries(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const contributionId = req.query.contributionId as string | undefined;
      const refundId = req.query.refundId as string | undefined;

      const result = await financialService.getLedgerEntries({
        contributionId,
        refundId,
        page,
        limit,
      });

      ApiResponse.paginated(res, result.entries, page, limit, result.total, 'Ledger entries retrieved');
    } catch (err) {
      next(err);
    }
  }
}

export const financialController = new FinancialController();
