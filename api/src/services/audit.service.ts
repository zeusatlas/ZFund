import { AppDataSource } from '../config/database';
import { logger } from '../config/logger';
import { AuditLog } from '../database/entities/audit-log.entity';

export interface CreateAuditLogParams {
  userId?: string;
  organizationId?: string;
  entityType: string;
  entityId?: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
}

export class AuditService {
  private get auditRepo() {
    return AppDataSource.getRepository(AuditLog);
  }

  async log(params: CreateAuditLogParams): Promise<AuditLog | null> {
    try {
      const entry = this.auditRepo.create({
        userId: params.userId,
        organizationId: params.organizationId,
        entityType: params.entityType,
        entityId: params.entityId,
        action: params.action,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        oldValues: params.oldValues,
        newValues: params.newValues,
      });

      return await this.auditRepo.save(entry);
    } catch (err) {
      // Audit failure should not crash business operations, but should be logged
      logger.error({ err, params }, 'Failed to record audit log');
      return null;
    }
  }

  async getLogs(params: {
    entityType?: string;
    entityId?: string;
    userId?: string;
    organizationId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ logs: AuditLog[]; total: number }> {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const query = this.auditRepo.createQueryBuilder('audit');

    if (params.entityType) {
      query.andWhere('audit.entityType = :entityType', { entityType: params.entityType });
    }
    if (params.entityId) {
      query.andWhere('audit.entityId = :entityId', { entityId: params.entityId });
    }
    if (params.userId) {
      query.andWhere('audit.userId = :userId', { userId: params.userId });
    }
    if (params.organizationId) {
      query.andWhere('audit.organizationId = :organizationId', { organizationId: params.organizationId });
    }

    query.orderBy('audit.createdAt', 'DESC').skip(skip).take(limit);

    const [logs, total] = await query.getManyAndCount();
    return { logs, total };
  }
}

export const auditService = new AuditService();
