import { NextFunction, Request, Response } from 'express';
import { env } from '../../config/env';
import { UnauthorizedError } from '../errors/app-error';

export function naloAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  // If an auth token is configured for NALO webhook, check header or query
  const naloToken = process.env.NALO_AUTH_TOKEN;
  if (env.NODE_ENV !== 'test' && naloToken && naloToken.trim() !== '') {
    const headerToken = req.headers['x-nalo-token'] || req.query.token;
    if (headerToken !== naloToken) {
      throw new UnauthorizedError('Invalid NALO provider authorization token');
    }
  }

  // Verify USERID matches if configured (case-insensitive comparison)
  if (req.body && req.body.USERID && env.NALO_USER_ID) {
    const receivedId = String(req.body.USERID).trim().toLowerCase();
    const expectedId = env.NALO_USER_ID.trim().toLowerCase();
    if (receivedId !== expectedId && env.NODE_ENV === 'production') {
      throw new UnauthorizedError('Unauthorized NALO provider USERID');
    }
  }

  next();
}
