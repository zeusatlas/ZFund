import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../common/utils/response';
import { settingsService } from '../services/settings.service';

export class SettingsController {
  async getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetUserId = req.params.id || req.user!.id;
      const settings = await settingsService.getUserSettings(targetUserId);
      const fees = settingsService.getPlatformFeeSettings();
      ApiResponse.success(res, { settings, fees }, 'Settings retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetUserId = req.params.id || req.user!.id;
      const settings = await settingsService.updateUserSettings(targetUserId, req.body, req.user!.id);
      ApiResponse.success(res, settings, 'Settings updated successfully');
    } catch (err) {
      next(err);
    }
  }

  getFees(_req: Request, res: Response): void {
    const fees = settingsService.getPlatformFeeSettings();
    ApiResponse.success(res, fees, 'Platform fee structure retrieved successfully');
  }
}

export const settingsController = new SettingsController();

