import { NextFunction, Request, Response } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors/app-error';
import { PermissionCode, SystemRole } from '../types/auth';

/**
 * Ensures user has one of the required roles
 */
export function requireRole(...allowedRoles: (SystemRole | string)[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    // Super Admin has all privileges across the platform
    if (req.user.role === SystemRole.SUPER_ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(
        `Insufficient privileges. Requires one of roles: [${allowedRoles.join(', ')}]`
      );
    }

    next();
  };
}

/**
 * Ensures user has specific permission code
 */
export function requirePermission(...requiredPermissions: PermissionCode[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    // Super Admin bypasses permission checks
    if (req.user.role === SystemRole.SUPER_ADMIN) {
      return next();
    }

    const userPermissions = req.user.permissions || [];
    const hasPermission = requiredPermissions.some((perm) => userPermissions.includes(perm));

    if (!hasPermission) {
      throw new ForbiddenError(
        `Access denied. Missing required permission: [${requiredPermissions.join(', ')}]`
      );
    }

    next();
  };
}
