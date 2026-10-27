import { NextFunction, Request, Response } from 'express';
import { env } from '../../config/env';
import { UnauthorizedError } from '../errors/app-error';

export function naloAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  // If an auth token is configured for NALO webhook, check header or query
  if (env.NODE_ENV !== 'test' && env.NALO_AUTH_TOKEN && env.NALO_AUTH_TOKEN.trim() !== '') {
    const headerToken = req.headers['x-nalo-token'] || req.query.token;
    if (headerToken !== env.NALO_AUTH_TOKEN) {
      throw new UnauthorizedError('Invalid NALO provider authorization token');
    }
  }

  // Verify USERID matches if configured
  if (req.body && req.body.USERID && env.NALO_USER_ID) {
    if (req.body.USERID !== env.NALO_USER_ID && env.NODE_ENV === 'production') {
      throw new UnauthorizedError('Unauthorized NALO provider USERID');
    }
  }

  next();
}
