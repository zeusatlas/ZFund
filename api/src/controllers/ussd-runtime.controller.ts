import { NextFunction, Request, Response } from 'express';
import { ussdRuntimeService } from '../services/ussd-runtime.service';

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
}

export const ussdRuntimeController = new UssdRuntimeController();
