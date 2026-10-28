import { IsNull } from 'typeorm';
import { AppDataSource } from '../config/database';
import { cache } from '../config/redis';
import { BadRequestError, NotFoundError } from '../common/errors/app-error';
import { auditService } from './audit.service';
import { UssdFlowVersion, UssdFlowVersionStatus } from '../database/entities/ussd-flow-version.entity';
import { UssdFlow, UssdFlowStatus } from '../database/entities/ussd-flow.entity';
import { UssdMenuOption, UssdOptionType } from '../database/entities/ussd-menu-option.entity';
import { UssdMenu, UssdMenuType } from '../database/entities/ussd-menu.entity';
import { UssdActionRegistry } from './ussd-action.registry';
import {
  CreateFlowInput,
  CreateMenuInput,
  CreateOptionInput,
  PublishFlowInput,
  UpdateMenuInput,
  UpdateOptionInput,
} from '../schemas/ussd-flow.schemas';

export class UssdFlowService {
  private get flowRepo() { return AppDataSource.getRepository(UssdFlow); }
  private get versionRepo() { return AppDataSource.getRepository(UssdFlowVersion); }
  private get menuRepo() { return AppDataSource.getRepository(UssdMenu); }
  private get optionRepo() { return AppDataSource.getRepository(UssdMenuOption); }

  async createFlow(input: CreateFlowInput, actorId?: string): Promise<UssdFlow> {
    const flow = this.flowRepo.create({
      name: input.name,
      description: input.description,
      projectId: input.projectId,
      status: UssdFlowStatus.DRAFT,
    });

    const savedFlow = await this.flowRepo.save(flow);

    // Create initial Version 1 in DRAFT
    const version = this.versionRepo.create({
      flowId: savedFlow.id,
      versionNumber: 1,
      status: UssdFlowVersionStatus.DRAFT,
    });

    await this.versionRepo.save(version);

    await auditService.log({
      userId: actorId,
      entityType: 'USSD_FLOW',
      entityId: savedFlow.id,
      action: 'CREATE_FLOW',
      newValues: { name: savedFlow.name, projectId: savedFlow.projectId },
    });

    return savedFlow;
  }

  async getFlows(projectId?: string): Promise<UssdFlow[]> {
    const where = projectId ? { projectId } : {};
    return this.flowRepo.find({
      where,
      relations: ['versions'],
      order: { createdAt: 'DESC' },
    });
  }

  async getFlowById(id: string): Promise<UssdFlow> {
    const flow = await this.flowRepo.findOne({
      where: { id },
      relations: [
        'versions',
        'versions.menus',
        'versions.menus.options',
      ],
    });

    if (!flow) {
      throw new NotFoundError('USSD Flow not found');
    }

    return flow;
  }

  async createMenu(versionId: string, input: CreateMenuInput): Promise<UssdMenu> {
    const version = await this.versionRepo.findOne({ where: { id: versionId } });
    if (!version) {
      throw new NotFoundError('Flow version not found');
    }

    const existing = await this.menuRepo.findOne({
      where: { flowVersionId: versionId, menuKey: input.menuKey },
    });
    if (existing) {
      throw new BadRequestError(`Menu key '${input.menuKey}' already exists in this flow version`);
    }

    const menu = this.menuRepo.create({
      flowVersionId: versionId,
      menuKey: input.menuKey,
      title: input.title,
      prompt: input.prompt,
      menuType: input.menuType,
      displayOrder: input.displayOrder,
      validationRules: input.validationRules || {},
      isActive: input.isActive,
    });

    return await this.menuRepo.save(menu);
  }

  async updateMenu(menuId: string, input: UpdateMenuInput): Promise<UssdMenu> {
    const menu = await this.menuRepo.findOne({ where: { id: menuId } });
    if (!menu) {
      throw new NotFoundError('Menu not found');
    }

    Object.assign(menu, input);
    return await this.menuRepo.save(menu);
  }

  async createOption(menuId: string, input: CreateOptionInput): Promise<UssdMenuOption> {
    const menu = await this.menuRepo.findOne({ where: { id: menuId } });
    if (!menu) {
      throw new NotFoundError('Menu not found');
    }

    const existing = await this.optionRepo.findOne({
      where: { menuId, optionKey: input.optionKey },
    });
    if (existing) {
      throw new BadRequestError(`Option key '${input.optionKey}' already exists in this menu`);
    }

    if (input.optionType === UssdOptionType.ACTION && input.actionReference) {
      if (!UssdActionRegistry.isApproved(input.actionReference)) {
        throw new BadRequestError(
          `Unapproved action reference '${input.actionReference}'. Approved actions: [${UssdActionRegistry.getApprovedActionNames().join(', ')}]`
        );
      }
    }

    const option = this.optionRepo.create({
      menuId,
      displayOrder: input.displayOrder,
      optionKey: input.optionKey,
      label: input.label,
      optionType: input.optionType,
      targetMenuKey: input.targetMenuKey,
      actionReference: input.actionReference,
      validationConfig: input.validationConfig || {},
      isActive: input.isActive,
    });

    return await this.optionRepo.save(option);
  }

  async updateOption(optionId: string, input: UpdateOptionInput): Promise<UssdMenuOption> {
    const option = await this.optionRepo.findOne({ where: { id: optionId } });
    if (!option) {
      throw new NotFoundError('Menu option not found');
    }

    if (input.actionReference && !UssdActionRegistry.isApproved(input.actionReference)) {
      throw new BadRequestError(
        `Unapproved action reference '${input.actionReference}'. Approved actions: [${UssdActionRegistry.getApprovedActionNames().join(', ')}]`
      );
    }

    Object.assign(option, input);
    return await this.optionRepo.save(option);
  }

  /**
   * Validates flow configuration completeness before publication
   */
  async validateFlow(versionId: string): Promise<{ valid: boolean; errors: string[] }> {
    const version = await this.versionRepo.findOne({
      where: { id: versionId },
      relations: ['menus', 'menus.options'],
    });

    if (!version) {
      return { valid: false, errors: ['Flow version does not exist'] };
    }

    const errors: string[] = [];
    const menus = version.menus || [];

    // Check WELCOME menu exists
    const welcomeMenu = menus.find((m) => m.menuKey === 'WELCOME' && m.isActive);
    if (!welcomeMenu) {
      errors.push("Missing active initial menu with menuKey 'WELCOME'");
    }

    const menuKeySet = new Set(menus.map((m) => m.menuKey));

    for (const menu of menus) {
      // Check prompt length
      if (menu.prompt.length > 120) {
        errors.push(`Menu '${menu.menuKey}' prompt exceeds 120 characters (${menu.prompt.length})`);
      }

      // Check unique option keys
      const optionKeys = new Set<string>();
      for (const opt of menu.options || []) {
        if (!opt.isActive) continue;

        if (optionKeys.has(opt.optionKey)) {
          errors.push(`Menu '${menu.menuKey}' has duplicate option key '${opt.optionKey}'`);
        }
        optionKeys.add(opt.optionKey);

        // Check target menu exists
        if (opt.optionType === UssdOptionType.NAVIGATION && opt.targetMenuKey) {
          if (!menuKeySet.has(opt.targetMenuKey)) {
            errors.push(
              `Option '${opt.optionKey}' in menu '${menu.menuKey}' references non-existent targetMenuKey '${opt.targetMenuKey}'`
            );
          }
        }

        // Check action is allowlisted
        if (opt.optionType === UssdOptionType.ACTION && opt.actionReference) {
          if (!UssdActionRegistry.isApproved(opt.actionReference)) {
            errors.push(
              `Option '${opt.optionKey}' in menu '${menu.menuKey}' references unapproved action '${opt.actionReference}'`
            );
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Publishes a validated flow version without disrupting active sessions
   */
  async publishFlow(
    flowId: string,
    versionId: string,
    input?: PublishFlowInput,
    actorId?: string
  ): Promise<UssdFlow> {
    const flow = await this.getFlowById(flowId);
    const version = await this.versionRepo.findOne({
      where: { id: versionId, flowId },
      relations: ['menus', 'menus.options'],
    });

    if (!version) {
      throw new NotFoundError('Flow version to publish not found');
    }

    const validation = await this.validateFlow(versionId);
    if (!validation.valid) {
      throw new BadRequestError(`Cannot publish flow due to validation errors: ${validation.errors.join('; ')}`);
    }

    // Archive previous published versions
    await this.versionRepo.update(
      { flowId, status: UssdFlowVersionStatus.PUBLISHED },
      { status: UssdFlowVersionStatus.ARCHIVED }
    );

    // Mark current version published
    version.status = UssdFlowVersionStatus.PUBLISHED;
    version.publishedAt = new Date();
    version.publishedById = actorId;
    if (input?.notes) version.notes = input.notes;
    await this.versionRepo.save(version);

    flow.status = UssdFlowStatus.PUBLISHED;
    flow.activeVersionId = version.id;
    const savedFlow = await this.flowRepo.save(flow);

    // Invalidate Redis cache for this flow so runtime picks up published changes instantly
    await cache.del(`ussd:flow:published:${flow.id}`);
    if (flow.projectId) {
      await cache.del(`ussd:flow:project:${flow.projectId}`);
    } else {
      await cache.del('ussd:flow:general');
    }

    await auditService.log({
      userId: actorId,
      entityType: 'USSD_FLOW',
      entityId: flow.id,
      action: 'PUBLISH_FLOW',
      newValues: { activeVersionId: version.id, versionNumber: version.versionNumber },
    });

    return savedFlow;
  }

  /**
   * Retrieves active published flow for general code *920*969#
   */
  async getGeneralPublishedFlow(): Promise<{ flow: UssdFlow; version: UssdFlowVersion } | null> {
    const flow = await this.flowRepo.findOne({
      where: { projectId: IsNull(), status: UssdFlowStatus.PUBLISHED },
    });

    if (!flow || !flow.activeVersionId) return null;

    const version = await this.versionRepo.findOne({
      where: { id: flow.activeVersionId },
      relations: ['menus', 'menus.options'],
    });

    if (!version) return null;

    // Sort menus and options by displayOrder
    version.menus.sort((a, b) => a.displayOrder - b.displayOrder);
    for (const menu of version.menus) {
      menu.options.sort((a, b) => a.displayOrder - b.displayOrder);
    }

    return { flow, version };
  }

  /**
   * Retrieves active published flow for a project
   */
  async getProjectPublishedFlow(projectId: string): Promise<{ flow: UssdFlow; version: UssdFlowVersion } | null> {
    const flow = await this.flowRepo.findOne({
      where: { projectId, status: UssdFlowStatus.PUBLISHED },
    });

    if (!flow || !flow.activeVersionId) return null;

    const version = await this.versionRepo.findOne({
      where: { id: flow.activeVersionId },
      relations: ['menus', 'menus.options'],
    });

    if (!version) return null;

    version.menus.sort((a, b) => a.displayOrder - b.displayOrder);
    for (const menu of version.menus) {
      menu.options.sort((a, b) => a.displayOrder - b.displayOrder);
    }

    return { flow, version };
  }
}

export const ussdFlowService = new UssdFlowService();
