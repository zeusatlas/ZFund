import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { AppError } from '../errors/app-error';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): Response {
  // Operational AppError
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err, correlationId: req.correlationId, path: req.path }, 'Internal server error');
    }
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
      ...(env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
    });
  }

  // Zod Validation Error
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
        code: e.code,
      })),
    });
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: err.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token',
    });
  }

  // Database unique constraint violation (Postgres code 23505)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((err as any).code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'A duplicate record already exists with the provided unique identifier',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      detail: (err as any).detail,
    });
  }

  // Fallback for unhandled unexpected errors
  logger.error(
    {
      err: err.message,
      stack: err.stack,
      correlationId: req.correlationId,
      path: req.path,
      method: req.method,
    },
    'Unhandled Application Error'
  );

  return res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    ...(env.NODE_ENV !== 'production' ? { stack: err.stack, originalMessage: err.message } : {}),
  });
}
