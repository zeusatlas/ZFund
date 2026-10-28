import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../common/utils/response';
import { userService } from '../services/user.service';

export class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const role = req.query.role as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = req.query.status as any;
      const search = req.query.search as string;

      const result = await userService.getUsers({ page, limit, role, status, search });
      ApiResponse.paginated(res, result.users, page, limit, result.total, 'Users retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getUserById(req.params.id);
      ApiResponse.success(res, user, 'User retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, smsSent } = await userService.createUser(req.body, req.user?.id);
      ApiResponse.success(res, { ...user, smsSent }, 'User created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.updateUser(req.params.id, req.body, req.user?.id);
      ApiResponse.success(res, user, 'User updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.updateUserRole(req.params.id, req.body.role, req.user?.id);
      ApiResponse.success(res, user, 'User role updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.updateUserStatus(req.params.id, req.body.status, req.user?.id);
      ApiResponse.success(res, user, 'User status updated successfully');
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
