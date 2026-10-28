import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../common/utils/response';
import { refundService } from '../services/refund.service';

export class RefundController {
  async requestRefund(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refund = await refundService.requestRefund(req.body, req.user!.id);
      ApiResponse.success(res, refund, 'Refund request submitted', 201);
    } catch (err) {
      next(err);
    }
  }

  async reviewRefund(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refund = await refundService.reviewRefund(req.params.id, req.body, req.user!.id);
      ApiResponse.success(res, refund, `Refund request ${req.body.status.toLowerCase()}`);
    } catch (err) {
      next(err);
    }
  }

  async processRefund(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refund = await refundService.processRefund(req.params.id, req.user!.id);
      ApiResponse.success(res, refund, 'Refund processed successfully');
    } catch (err) {
      next(err);
    }
  }

  async getRefunds(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const contributionId = req.query.contributionId as string | undefined;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = req.query.status as any;

      const result = await refundService.getRefunds({
        contributionId,
        status,
        page,
        limit,
      });

      ApiResponse.paginated(res, result.refunds, page, limit, result.total, 'Refunds retrieved');
    } catch (err) {
      next(err);
    }
  }
}

export const refundController = new RefundController();
