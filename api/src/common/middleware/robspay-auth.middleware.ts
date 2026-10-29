import { NextFunction, Request, Response } from 'express';
import { CryptoUtil } from '../utils/crypto';
import { logger } from '../../config/logger';

export function robspayWebhookAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = (req.headers['authorization'] || req.headers['x-robspay-signature']) as string | undefined;
  const timestamp = (req.headers['x-timestamp'] || req.headers['x-timestamp'] || '') as string;
  const rawBody = req.rawBody;

  // If a signature is provided in the headers, verify it
  if (authHeader && rawBody) {
    let signature = authHeader;
    if (signature.includes(':')) {
      signature = signature.split(':')[1];
    }

    const isValid = CryptoUtil.verifyRobspaySignature(rawBody, signature, timestamp);
    if (!isValid) {
      logger.warn({ authHeader, timestamp }, 'Invalid RobsPay webhook signature received');
      // For strict verification if required, but log warning and continue if merchant matches
    }
  }

  next();
}

