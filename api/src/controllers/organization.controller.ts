import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../common/utils/response';
import { organizationService } from '../services/organization.service';

export class OrganizationController {
  async createOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const org = await organizationService.createOrganization(req.body, req.user!.id);
      ApiResponse.success(res, org, 'Organization created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async getOrganizations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const verificationStatus = req.query.verificationStatus as any;
      const search = req.query.search as string;

      const result = await organizationService.getOrganizations({
        userId: req.user!.id,
        userRole: req.user!.role,
        page,
        limit,
        verificationStatus,
        search,
      });

      ApiResponse.paginated(res, result.organizations, page, limit, result.total, 'Organizations retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getOrganizationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const org = await organizationService.getOrganizationById(
        req.params.id,
        req.user!.id,
        req.user!.role
      );
      ApiResponse.success(res, org, 'Organization retrieved');
    } catch (err) {
      next(err);
    }
  }

  async updateOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const org = await organizationService.updateOrganization(
        req.params.id,
        req.body,
        req.user!.id,
        req.user!.role
      );
      ApiResponse.success(res, org, 'Organization updated');
    } catch (err) {
      next(err);
    }
  }

  async verifyOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const org = await organizationService.verifyOrganization(
        req.params.id,
        req.body,
        req.user!.id
      );
      ApiResponse.success(res, org, 'Organization verification updated');
    } catch (err) {
      next(err);
    }
  }

  async addMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const member = await organizationService.addMember(
        req.params.id,
        req.body,
        req.user!.id,
        req.user!.role
      );
      ApiResponse.success(res, member, 'Member added to organization', 201);
    } catch (err) {
      next(err);
    }
  }

  async removeMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await organizationService.removeMember(
        req.params.id,
        req.params.userId,
        req.user!.id,
        req.user!.role
      );
      ApiResponse.success(res, null, 'Member removed from organization');
    } catch (err) {
      next(err);
    }
  }
}

export const organizationController = new OrganizationController();
