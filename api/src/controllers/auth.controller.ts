import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import { ApiResponse } from '../common/utils/response';
import { authService } from '../services/auth.service';

export class AuthController {
  async requestOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.requestOtp(req.body, req.ip, req.headers['user-agent']);
      ApiResponse.success(res, null, 'If the details match an account, a code has been sent by SMS');
    } catch (err) {
      next(err);
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.verifyOtp(req.body, req.ip, req.headers['user-agent']);

      // Set refresh token in secure HttpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: env.COOKIE_SECURE,
        sameSite: env.COOKIE_SAME_SITE,
        domain: env.COOKIE_DOMAIN,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      ApiResponse.success(
        res,
        {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          user: result.user,
        },
        'Login successful'
      );
    } catch (err) {
      next(err);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies?.refreshToken || req.body?.refreshToken;
      const result = await authService.refreshToken(token, req.ip, req.headers['user-agent']);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: env.COOKIE_SECURE,
        sameSite: env.COOKIE_SAME_SITE,
        domain: env.COOKIE_DOMAIN,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      ApiResponse.success(
        res,
        {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          user: result.user,
        },
        'Token refreshed successfully'
      );
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies?.refreshToken || req.body?.refreshToken;
      if (token) {
        await authService.logout(token);
      }

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: env.COOKIE_SECURE,
        sameSite: env.COOKIE_SAME_SITE,
        domain: env.COOKIE_DOMAIN,
      });

      ApiResponse.success(res, null, 'Logged out successfully');
    } catch (err) {
      next(err);
    }
  }

  async logoutAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.revokeAllTokens(req.user!.id);
      res.clearCookie('refreshToken');
      ApiResponse.success(res, null, 'All sessions revoked successfully');
    } catch (err) {
      next(err);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.changePassword(req.user!.id, req.body);
      ApiResponse.success(res, null, 'Password changed successfully. Please log in again.');
    } catch (err) {
      next(err);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.forgotPassword(req.body);
      ApiResponse.success(
        res,
        env.NODE_ENV !== 'production' ? { resetToken: result.resetToken } : null,
        'If an account with that email exists, password reset instructions have been sent.'
      );
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.resetPassword(req.body);
      ApiResponse.success(res, null, 'Password has been reset successfully. You may now log in.');
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.getProfile(req.user!.id);
      ApiResponse.success(res, user, 'Profile retrieved successfully');
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
