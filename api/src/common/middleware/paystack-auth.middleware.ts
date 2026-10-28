import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/app-error';
import { CryptoUtil } from '../utils/crypto';

export function paystackWebhookAuth(req: Request, _res: Response, next: NextFunction): void {
  const signature = req.headers['x-paystack-signature'] as string;

  if (!signature) {
    throw new UnauthorizedError('Missing x-paystack-signature header');
  }

  // Raw body must have been captured by express.json({ verify: ... })
  const rawBody = req.rawBody;
  if (!rawBody) {
    throw new UnauthorizedError('Unable to verify webhook signature: raw body unavailable');
  }

  const isValid = CryptoUtil.verifyPaystackSignature(rawBody, signature);
  if (!isValid) {
    throw new UnauthorizedError('Invalid Paystack webhook signature');
  }

  next();
}
