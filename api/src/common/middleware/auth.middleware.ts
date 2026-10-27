import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/app-error';
import { CryptoUtil } from '../utils/crypto';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authentication token is required');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new UnauthorizedError('Malformed authorization header');
  }

  try {
    const payload = CryptoUtil.verifyAccessToken(token);
    req.user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      organizationId: payload.organizationId,
    };
    next();
  } catch (err: unknown) {
    throw new UnauthorizedError(
      (err as Error).name === 'TokenExpiredError' ? 'Token expired' : 'Invalid authentication token'
    );
  }
}

export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token) return next();

  try {
    const payload = CryptoUtil.verifyAccessToken(token);
    req.user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      organizationId: payload.organizationId,
    };
  } catch {
    // Ignore invalid token in optional authentication
  }
  next();
}
