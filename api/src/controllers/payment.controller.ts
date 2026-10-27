import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../common/utils/response';
import { paymentService } from '../services/payment.service';

export class PaymentController {
  async initiatePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await paymentService.initiatePayment(req.body);
      ApiResponse.success(res, result, 'Payment initiated successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reference = req.params.reference || req.query.reference as string;
      const payment = await paymentService.verifyPayment(reference);
      ApiResponse.success(res, payment, 'Payment verification completed');
    } catch (err) {
      next(err);
    }
  }

  async getPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const projectId = req.query.projectId as string | undefined;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = req.query.status as any;
      const msisdn = req.query.msisdn as string | undefined;

      const result = await paymentService.getPayments({
        projectId,
        status,
        msisdn,
        page,
        limit,
      });

      ApiResponse.paginated(res, result.payments, page, limit, result.total, 'Payments retrieved');
    } catch (err) {
      next(err);
    }
  }
}

export const paymentController = new PaymentController();
