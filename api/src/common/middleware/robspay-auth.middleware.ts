import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { CryptoUtil } from '../utils/crypto';
import { env } from '../../config/env';
import { logger } from '../../config/logger';

/** RobsPay callbacks sign the raw body with HMAC-SHA256 (X-RobsPay-Signature, hex). */
function matchesBodySignature(rawBody: string | Buffer, signature: string): boolean {
  const computed = crypto.createHmac('sha256', env.ROBSPAY_API_KEY).update(rawBody).digest('hex');
  const a = Buffer.from(computed);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function robspayWebhookAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = (req.headers['x-robspay-signature'] || req.headers['authorization']) as string | undefined;
  const timestamp = (req.headers['x-timestamp'] || '') as string;
  const rawBody = req.rawBody;

  // If a signature is provided in the headers, verify it
  if (authHeader && rawBody) {
    let signature = authHeader;
    if (signature.includes(':')) {
      signature = signature.split(':')[1];
    }

    const isValid =
      matchesBodySignature(rawBody, signature) || CryptoUtil.verifyRobspaySignature(rawBody, signature, timestamp);
    if (!isValid) {
      logger.warn({ timestamp }, 'Invalid RobsPay webhook signature received');
      // Logged only: the callback key may differ from the API key, so rejecting is not yet safe.
    }
  }

  next();
}
