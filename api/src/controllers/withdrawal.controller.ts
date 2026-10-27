import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../common/utils/response';
import { WithdrawalStatus } from '../database/entities/withdrawal-request.entity';
import { withdrawalService } from '../services/withdrawal.service';

const pageParams = (req: Request) => ({
  page: parseInt(req.query.page as string, 10) || 1,
  limit: Math.min(parseInt(req.query.limit as string, 10) || 10, 100),
  search: (req.query.search as string | undefined)?.trim() || undefined,
  status: Object.values(WithdrawalStatus).includes(req.query.status as WithdrawalStatus)
    ? (req.query.status as WithdrawalStatus)
    : undefined,
});

export class WithdrawalController {
  /** Host: submit a new withdrawal request. */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const request = await withdrawalService.create(req.user!.id, req.body);
      ApiResponse.success(res, request, 'Withdrawal request submitted', 201);
    } catch (err) {
      next(err);
    }
  }

  /** Host: own requests and the balance still available. */
  async listMine(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = pageParams(req);
      const [result, balance] = await Promise.all([
        withdrawalService.list({ ...params, hostId: req.user!.id }),
        withdrawalService.getAvailable(req.user!.id),
      ]);
      ApiResponse.success(res, result.items, 'Withdrawal requests retrieved', 200, {
        page: params.page,
        limit: params.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / params.limit) || 1,
        balance,
      });
    } catch (err) {
      next(err);
    }
  }

  /** Admin: every request, with stat counts. */
  async listAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = pageParams(req);
      const [result, counts] = await Promise.all([
        withdrawalService.list(params),
        withdrawalService.getCounts(),
      ]);
      ApiResponse.success(res, result.items, 'Withdrawal requests retrieved', 200, {
        page: params.page,
        limit: params.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / params.limit) || 1,
        counts,
      });
    } catch (err) {
      next(err);
    }
  }

  /** Admin: move a request along (processing, done or rejected). */
  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const view = await withdrawalService.updateStatus(req.params.id, req.body.status, req.body.note, req.user!.id);
      ApiResponse.success(res, view, 'Withdrawal request updated');
    } catch (err) {
      next(err);
    }
  }
}

export const withdrawalController = new WithdrawalController();
