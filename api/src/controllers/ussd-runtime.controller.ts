import { NextFunction, Request, Response } from 'express';
import { ussdRuntimeService } from '../services/ussd-runtime.service';
import { ussdSessionService } from '../services/ussd-session.service';

export class UssdRuntimeController {
  async handleNaloRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const naloResponse = await ussdRuntimeService.processRequest(req.body);
      // NALO expects 200 OK with the exact JSON response format
      res.status(200).json(naloResponse);
    } catch (err) {
      next(err);
    }
  }

  async getSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const msisdn = req.query.msisdn as string | undefined;
      const projectId = req.query.projectId as string | undefined;
      const status = req.query.status as any;

      const result = await ussdSessionService.getSessions({ page, limit, msisdn, projectId, status });
      res.status(200).json({
        success: true,
        data: result.sessions,
        total: result.total,
        page,
        limit,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const ussdRuntimeController = new UssdRuntimeController();
