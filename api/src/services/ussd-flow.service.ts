import { IsNull } from 'typeorm';
import { AppDataSource } from '../config/database';
import { cache } from '../config/redis';
import { BadRequestError, NotFoundError } from '../common/errors/app-error';
import { auditService } from './audit.service';
import { Project } from '../database/entities/project.entity';
import { UssdFlowVersion, UssdFlowVersionStatus } from '../database/entities/ussd-flow-version.entity';
import { UssdFlow, UssdFlowStatus } from '../database/entities/ussd-flow.entity';
import { UssdMenuOption, UssdOptionType } from '../database/entities/ussd-menu-option.entity';
import { UssdMenu, UssdMenuType } from '../database/entities/ussd-menu.entity';
import { UssdActionRegistry } from './ussd-action.registry';
import {
  CreateFlowInput,
  CreateMenuInput,
  CreateOptionInput,
  InitializeProjectFlowInput,
  PublishFlowInput,
  UpdateMenuInput,
  UpdateOptionInput,
} from '../schemas/ussd-flow.schemas';

export class UssdFlowService {
  private get flowRepo() { return AppDataSource.getRepository(UssdFlow); }
  private get versionRepo() { return AppDataSource.getRepository(UssdFlowVersion); }
  private get menuRepo() { return AppDataSource.getRepository(UssdMenu); }
  private get optionRepo() { return AppDataSource.getRepository(UssdMenuOption); }
  private get projectRepo() { return AppDataSource.getRepository(Project); }

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

  /**
   * One-click initialization: Auto-configures and publishes a complete 4-step dynamic USSD flow
   * for any project/campaign (Welcome with purposes, Amount input, Confirmation, Payment OTP).
   */
  async initializeProjectFlow(
    projectId: string,
    input?: InitializeProjectFlowInput,
    actorId?: string
  ): Promise<UssdFlow> {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['purposes', 'purposes.purpose'],
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    let flow = await this.flowRepo.findOne({ where: { projectId: project.id } });
    if (!flow) {
      flow = await this.flowRepo.save(
        this.flowRepo.create({
          name: `${project.name} USSD Flow`,
          description: `USSD donation flow for ${project.name} (*920*969*${project.eventCode}#)`,
          projectId: project.id,
          status: UssdFlowStatus.DRAFT,
        })
      );
    }

    const versionCount = await this.versionRepo.count({ where: { flowId: flow.id } });
    const version = await this.versionRepo.save(
      this.versionRepo.create({
        flowId: flow.id,
        versionNumber: (versionCount || 0) + 1,
        status: UssdFlowVersionStatus.DRAFT,
        notes: 'Initial automated campaign flow setup',
      })
    );

    // 1. Welcome Menu
    const welcomePrompt =
      input?.welcomePrompt ||
      project.welcomeMessage ||
      `Welcome to ${project.name}.\nSelect:`;

    // Persist welcome message to project entity
    project.welcomeMessage = welcomePrompt.slice(0, 120);
    await this.projectRepo.save(project);

    const welcomeMenu = await this.menuRepo.save(
      this.menuRepo.create({
        flowVersionId: version.id,
        menuKey: 'WELCOME',
        title: `${project.name} Menu`,
        prompt: welcomePrompt.slice(0, 120),
        menuType: UssdMenuType.SELECT,
        displayOrder: 1,
        isActive: true,
      })
    );

    // Options from input or project.purposes
    const purposeList: Array<{ label: string; purposeId?: string; subSteps?: string[] }> =
      input?.purposes && input.purposes.length > 0
        ? input.purposes
        : project.purposes && project.purposes.length > 0
        ? project.purposes.map((p) => ({
            label: p.customName || p.purpose?.name || 'Contribution',
            purposeId: p.purposeId,
          }))
        : [
            { label: 'General Donation' },
            { label: 'Building Fund' },
            { label: 'Welfare' },
          ];

    let optionOrder = 1;
    for (const p of purposeList) {
      const hasSubSteps = Array.isArray(p.subSteps) && p.subSteps.length > 0;
      const subMenuKey = `SUB_PURPOSE_${optionOrder}`;
      const targetMenuKey = hasSubSteps ? subMenuKey : 'AMOUNT_INPUT';

      await this.optionRepo.save(
        this.optionRepo.create({
          menuId: welcomeMenu.id,
          displayOrder: optionOrder,
          optionKey: String(optionOrder),
          label: p.label.slice(0, 50),
          optionType: hasSubSteps ? UssdOptionType.NAVIGATION : UssdOptionType.ACTION,
          actionReference: hasSubSteps ? undefined : 'SELECT_PURPOSE',
          targetMenuKey,
          validationConfig: p.purposeId ? { purposeId: p.purposeId } : {},
          isActive: true,
        })
      );

      if (hasSubSteps && p.subSteps) {
        const subMenu = await this.menuRepo.save(
          this.menuRepo.create({
            flowVersionId: version.id,
            menuKey: subMenuKey,
            title: `${p.label} Submenu`,
            prompt: `Select ${p.label.slice(0, 30)}:\n`.slice(0, 120),
            menuType: UssdMenuType.SELECT,
            displayOrder: 2,
            isActive: true,
          })
        );

        let subOrder = 1;
        for (const sub of p.subSteps) {
          await this.optionRepo.save(
            this.optionRepo.create({
              menuId: subMenu.id,
              displayOrder: subOrder,
              optionKey: String(subOrder),
              label: sub.slice(0, 50),
              optionType: UssdOptionType.ACTION,
              actionReference: 'SELECT_SUB_PURPOSE',
              targetMenuKey: 'AMOUNT_INPUT',
              validationConfig: {
                parentPurpose: p.label,
                subPurpose: sub,
                purposeId: p.purposeId,
              },
              isActive: true,
            })
          );
          subOrder++;
        }

        // Back navigation option
        await this.optionRepo.save(
          this.optionRepo.create({
            menuId: subMenu.id,
            displayOrder: subOrder,
            optionKey: String(subOrder),
            label: 'Back',
            optionType: UssdOptionType.NAVIGATION,
            targetMenuKey: 'WELCOME',
            isActive: true,
          })
        );
      }

      optionOrder++;
    }

    // Exit option
    await this.optionRepo.save(
      this.optionRepo.create({
        menuId: welcomeMenu.id,
        displayOrder: optionOrder,
        optionKey: String(optionOrder),
        label: 'Exit',
        optionType: UssdOptionType.ACTION,
        actionReference: 'EXIT',
        isActive: true,
      })
    );

    // 2. Amount Input Menu
    const amountPrompt =
      input?.amountPrompt ||
      `Enter Amount in ${input?.currency || project.currency || 'GHS'}:`;
    await this.menuRepo.save(
      this.menuRepo.create({
        flowVersionId: version.id,
        menuKey: 'AMOUNT_INPUT',
        title: 'Enter Amount',
        prompt: amountPrompt.slice(0, 120),
        menuType: UssdMenuType.INPUT,
        displayOrder: 2,
        isActive: true,
      })
    );

    // 3. Confirm Payment Menu
    const confirmPrompt =
      input?.confirmPrompt ||
      `Contribute ${input?.currency || project.currency || 'GHS'} {amount} to {purpose}?`;
    const confirmMenu = await this.menuRepo.save(
      this.menuRepo.create({
        flowVersionId: version.id,
        menuKey: 'CONFIRM_PAYMENT',
        title: 'Confirm Contribution',
        prompt: confirmPrompt.slice(0, 120),
        menuType: UssdMenuType.SELECT,
        displayOrder: 3,
        isActive: true,
      })
    );

    await this.optionRepo.save([
      this.optionRepo.create({
        menuId: confirmMenu.id,
        displayOrder: 1,
        optionKey: '1',
        label: 'Confirm',
        optionType: UssdOptionType.ACTION,
        actionReference: 'INITIATE_PAYMENT',
        isActive: true,
      }),
      this.optionRepo.create({
        menuId: confirmMenu.id,
        displayOrder: 2,
        optionKey: '2',
        label: 'Cancel',
        optionType: UssdOptionType.ACTION,
        actionReference: 'EXIT',
        isActive: true,
      }),
    ]);

    // 4. Enter Payment OTP Menu
    const otpPrompt =
      input?.otpPrompt ||
      'Enter the OTP/voucher code sent to your phone (or 0 to cancel):';
    await this.menuRepo.save(
      this.menuRepo.create({
        flowVersionId: version.id,
        menuKey: 'ENTER_PAYMENT_OTP',
        title: 'Enter Payment OTP',
        prompt: otpPrompt.slice(0, 120),
        menuType: UssdMenuType.INPUT,
        displayOrder: 4,
        isActive: true,
      })
    );

    // Publish flow immediately
    return await this.publishFlow(
      flow.id,
      version.id,
      { notes: 'Auto-configured initial version' },
      actorId
    );
  }
}

export const ussdFlowService = new UssdFlowService();
