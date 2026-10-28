import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../common/utils/response';
import { WithdrawalStatus } from '../database/entities/withdrawal-request.entity';
import { withdrawalService } from '../services/withdrawal.service';

const pageParams = (req: Request) => {
  const rawStatus = (req.query.status as string | undefined)?.trim();
  let status: WithdrawalStatus | undefined = undefined;

  if (rawStatus && rawStatus !== 'All') {
    if (rawStatus === 'In review' || rawStatus === WithdrawalStatus.PENDING) {
      status = WithdrawalStatus.PENDING;
    } else if (rawStatus === 'Processing' || rawStatus === WithdrawalStatus.PROCESSING) {
      status = WithdrawalStatus.PROCESSING;
    } else if (rawStatus === 'Paid' || rawStatus === WithdrawalStatus.DONE) {
      status = WithdrawalStatus.DONE;
    } else if (rawStatus === 'Rejected' || rawStatus === WithdrawalStatus.REJECTED) {
      status = WithdrawalStatus.REJECTED;
    }
  }

  return {
    page: parseInt(req.query.page as string, 10) || 1,
    limit: Math.min(parseInt(req.query.limit as string, 10) || 10, 100),
    search: (req.query.search as string | undefined)?.trim() || undefined,
    status,
  };
};

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
      const projectId =
        (req.query.projectId as string) || (req.query.campaignId as string) || undefined;
      const result = await withdrawalService.list({
        ...params,
        hostId: req.user?.id,
        projectId,
      });
      ApiResponse.success(res, result.items, 'Withdrawal requests retrieved', 200, {
        page: params.page,
        limit: params.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / params.limit) || 1,
        balance: result.balance,
      });
    } catch (err) {
      next(err);
    }
  }

  /** General list: supports host or optional auth scoping. */
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = pageParams(req);
      const projectId =
        (req.query.projectId as string) || (req.query.campaignId as string) || undefined;
      const result = await withdrawalService.list({
        ...params,
        hostId: req.user?.id,
        projectId,
      });
      ApiResponse.success(res, result.items, 'Withdrawal requests retrieved', 200, {
        page: params.page,
        limit: params.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / params.limit) || 1,
        balance: result.balance,
      });
    } catch (err) {
      next(err);
    }
  }

  /** Get single withdrawal request by ID or reference. */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const view = await withdrawalService.getById(req.params.id);
      ApiResponse.success(res, view, 'Withdrawal request retrieved');
    } catch (err) {
      next(err);
    }
  }

  /** Host: update a pending withdrawal request. */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const view = await withdrawalService.update(req.params.id, req.body, req.user?.id);
      ApiResponse.success(res, view, 'Withdrawal request updated successfully');
    } catch (err) {
      next(err);
    }
  }

  /** Host: cancel/delete a pending withdrawal request. */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await withdrawalService.delete(req.params.id, req.user?.id);
      ApiResponse.success(res, null, 'Withdrawal request cancelled successfully');
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
      const view = await withdrawalService.updateStatus(
        req.params.id,
        req.body.status,
        req.body.note,
        req.user!.id
      );
      ApiResponse.success(res, view, 'Withdrawal request updated');
    } catch (err) {
      next(err);
    }
  }
}

export const withdrawalController = new WithdrawalController();
