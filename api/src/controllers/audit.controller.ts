import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../common/utils/response';
import { auditService } from '../services/audit.service';

export class AuditController {
  async getLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const entityType = req.query.entityType as string | undefined;
      const entityId = req.query.entityId as string | undefined;
      const userId = req.query.userId as string | undefined;
      const organizationId = req.query.organizationId as string | undefined;

      const result = await auditService.getLogs({
        page,
        limit,
        entityType,
        entityId,
        userId,
        organizationId,
      });

      ApiResponse.paginated(res, result.logs, page, limit, result.total, 'Audit logs retrieved');
    } catch (err) {
      next(err);
    }
  }
}

export const auditController = new AuditController();
