import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../common/utils/response';
import { ussdFlowService } from '../services/ussd-flow.service';

export class UssdFlowController {
  async createFlow(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const flow = await ussdFlowService.createFlow(req.body, req.user?.id);
      ApiResponse.success(res, flow, 'USSD Flow created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async getFlows(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = req.query.projectId as string | undefined;
      const flows = await ussdFlowService.getFlows(projectId);
      ApiResponse.success(res, flows, 'USSD Flows retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getFlowById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const flow = await ussdFlowService.getFlowById(req.params.id);
      ApiResponse.success(res, flow, 'USSD Flow retrieved');
    } catch (err) {
      next(err);
    }
  }

  async createMenu(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const menu = await ussdFlowService.createMenu(req.params.versionId, req.body);
      ApiResponse.success(res, menu, 'Menu created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async updateMenu(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const menu = await ussdFlowService.updateMenu(req.params.menuId, req.body);
      ApiResponse.success(res, menu, 'Menu updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async createOption(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const option = await ussdFlowService.createOption(req.params.menuId, req.body);
      ApiResponse.success(res, option, 'Menu option created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async updateOption(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const option = await ussdFlowService.updateOption(req.params.optionId, req.body);
      ApiResponse.success(res, option, 'Menu option updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async validateFlow(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await ussdFlowService.validateFlow(req.params.versionId);
      ApiResponse.success(res, result, result.valid ? 'Flow configuration is valid' : 'Flow validation failed');
    } catch (err) {
      next(err);
    }
  }

  async publishFlow(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const flow = await ussdFlowService.publishFlow(
        req.params.id,
        req.params.versionId,
        req.body,
        req.user?.id
      );
      ApiResponse.success(res, flow, 'USSD Flow published successfully');
    } catch (err) {
      next(err);
    }
  }
}

export const ussdFlowController = new UssdFlowController();
