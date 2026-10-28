import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../common/utils/response';
import { projectService } from '../services/project.service';

export class ProjectController {
  async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await projectService.createProject(req.body, req.user!.id);
      ApiResponse.success(res, project, 'Project created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await projectService.getCategories();
      ApiResponse.success(res, categories, 'Categories retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const organizationId = req.query.organizationId as string | undefined;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = req.query.status as any;
      const search = req.query.search as string | undefined;

      const result = await projectService.getProjects({
        userId: req.user?.id,
        userRole: req.user?.role,
        organizationId,
        status,
        search,
        page,
        limit,
      });

      ApiResponse.paginated(res, result.projects, page, limit, result.total, 'Projects retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getProjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await projectService.getProjectById(
        req.params.id,
        req.user?.id,
        req.user?.role
      );
      ApiResponse.success(res, project, 'Project retrieved');
    } catch (err) {
      next(err);
    }
  }

  async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await projectService.updateProject(
        req.params.id,
        req.body,
        req.user!.id,
        req.user!.role
      );
      ApiResponse.success(res, project, 'Project updated');
    } catch (err) {
      next(err);
    }
  }

  async updateProjectStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await projectService.updateProjectStatus(
        req.params.id,
        req.body,
        req.user!.id,
        req.user!.role
      );
      ApiResponse.success(res, project, 'Project status updated');
    } catch (err) {
      next(err);
    }
  }

  async configurePurposes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const purposes = await projectService.configurePurposes(
        req.params.id,
        req.body,
        req.user!.id,
        req.user!.role
      );
      ApiResponse.success(res, purposes, 'Project contribution purposes configured');
    } catch (err) {
      next(err);
    }
  }

  async configurePaymentMethods(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const methods = await projectService.configurePaymentMethods(
        req.params.id,
        req.body,
        req.user!.id,
        req.user!.role
      );
      ApiResponse.success(res, methods, 'Project payment methods configured');
    } catch (err) {
      next(err);
    }
  }
}

export const projectController = new ProjectController();
