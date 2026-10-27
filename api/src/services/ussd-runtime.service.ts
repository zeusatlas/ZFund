import { AppDataSource } from '../config/database';
import { logger } from '../config/logger';
import { Project } from '../database/entities/project.entity';
import { projectService } from './project.service';
import { UssdFlowVersion } from '../database/entities/ussd-flow-version.entity';
import { UssdMenuOption, UssdOptionType } from '../database/entities/ussd-menu-option.entity';
import { UssdMenu, UssdMenuType } from '../database/entities/ussd-menu.entity';
import { UssdSession, UssdSessionStatus } from '../database/entities/ussd-session.entity';
import { InternalUssdRequest, InternalUssdResponse, NaloAdapter, NaloRawRequest, NaloRawResponse } from './nalo.adapter';
import { UssdActionRegistry } from './ussd-action.registry';
import { ussdRoutingService } from './ussd-routing.service';
import { ussdSessionService } from './ussd-session.service';

export class UssdRuntimeService {
  private get versionRepo() { return AppDataSource.getRepository(UssdFlowVersion); }

  async processRequest(rawBody: NaloRawRequest): Promise<NaloRawResponse> {
    const request = NaloAdapter.parseRequest(rawBody);

    try {
      const response = await this.executeTurn(request);
      return NaloAdapter.formatResponse(request, response);
    } catch (err) {
      logger.error({ err, sessionId: request.sessionId }, 'Error executing USSD turn');
      return NaloAdapter.formatResponse(request, {
        message: 'A temporary service error occurred. Please try again later.',
        continueSession: false,
      });
    }
  }

  private async executeTurn(request: InternalUssdRequest): Promise<InternalUssdResponse> {
    const lockAcquired = await ussdSessionService.acquireLock(request.sessionId);
    if (!lockAcquired) {
      return {
        message: 'Request in progress. Please wait...',
        continueSession: true,
      };
    }

    try {
      let session = await ussdSessionService.getSession(request.sessionId);

      // Handle Initial Request (New Session)
      if (request.isInitialRequest || !session) {
        const resolved = await ussdRoutingService.resolveFlow(request);
        if (!resolved.flow || !resolved.version) {
          return {
            message: 'Welcome to ZFund. No active USSD service is currently available. Please contact support.',
            continueSession: false,
          };
        }

        session = await ussdSessionService.createSession({
          sessionId: request.sessionId,
          msisdn: request.msisdn,
          network: request.network,
          provider: request.provider,
          projectId: resolved.project?.id,
          flowId: resolved.flow.id,
          flowVersionId: resolved.version.id,
          initialMenuKey: 'WELCOME',
          contextData: {
            dialedCode: request.userInput,
            eventCode: resolved.directEventCodeUsed,
          },
        });

        const welcomeMenu = resolved.version.menus.find((m) => m.menuKey === 'WELCOME');
        if (!welcomeMenu) {
          return {
            message: 'Menu configuration error. Initial menu not found.',
            continueSession: false,
          };
        }

        const rendered = this.renderMenu(welcomeMenu, resolved.project, session);

        await ussdSessionService.recordEvent({
          ussdSessionId: session.id,
          msisdn: request.msisdn,
          stepNumber: 1,
          menuKey: 'WELCOME',
          userInput: request.userInput,
          renderedMessage: rendered,
          msgType: true,
        });

        return {
          message: rendered,
          continueSession: true,
        };
      }

      // Handle Continuing Session
      const version = await this.versionRepo.findOne({
        where: { id: session.flowVersionId },
        relations: ['menus', 'menus.options'],
      });

      if (!version) {
        await ussdSessionService.endSession(session.sessionId, UssdSessionStatus.FAILED);
        return {
          message: 'Session flow configuration unavailable. Session ended.',
          continueSession: false,
        };
      }

      // Sort menus and options by displayOrder
      version.menus.sort((a, b) => a.displayOrder - b.displayOrder);
      for (const m of version.menus) {
        m.options.sort((a, b) => a.displayOrder - b.displayOrder);
      }

      const currentMenu = version.menus.find((m) => m.menuKey === session!.currentMenuKey);
      if (!currentMenu) {
        await ussdSessionService.endSession(session.sessionId, UssdSessionStatus.FAILED);
        return {
          message: 'Menu state error. Session ended.',
          continueSession: false,
        };
      }

      const project = session.projectId ? await projectService.getProjectById(session.projectId) : null;
      const userInput = request.userInput.trim();

      // State transition variables
      let targetMenuKey: string | null = null;
      let customDisplayMessage: string | null = null;
      let terminateSession = false;

      // Handle universal Back (0) navigation if previous history exists
      if (userInput === '0' && session.navigationHistory && session.navigationHistory.length > 0) {
        targetMenuKey = session.navigationHistory.pop()!;
      } else if (currentMenu.menuType === UssdMenuType.INPUT) {
        // Execute input handler (e.g. ENTER_AMOUNT)
        const actionResult = await UssdActionRegistry.execute('ENTER_AMOUNT', {
          session,
          project,
          userInput,
        });

        if (actionResult.contextUpdates) {
          session.contextData = { ...session.contextData, ...actionResult.contextUpdates };
        }

        if (actionResult.customMessage) {
          customDisplayMessage = actionResult.customMessage;
          targetMenuKey = actionResult.nextMenuKey || currentMenu.menuKey;
        } else {
          session.navigationHistory.push(currentMenu.menuKey);
          targetMenuKey = actionResult.nextMenuKey || 'CONFIRM_PAYMENT';
        }
      } else {
        // SELECT menu type: match userInput against active options
        const activeOptions = currentMenu.options.filter((o) => o.isActive);
        const matchedOption = activeOptions.find((o) => o.optionKey === userInput);

        if (!matchedOption) {
          // Re-render current menu with error prefix
          const reRendered = `Invalid choice.\n${this.renderMenu(currentMenu, project, session)}`;
          return {
            message: reRendered,
            continueSession: true,
          };
        }

        if (matchedOption.optionType === UssdOptionType.NAVIGATION) {
          session.navigationHistory.push(currentMenu.menuKey);
          targetMenuKey = matchedOption.targetMenuKey || 'WELCOME';
        } else if (matchedOption.optionType === UssdOptionType.ACTION && matchedOption.actionReference) {
          const actionResult = await UssdActionRegistry.execute(matchedOption.actionReference, {
            session,
            project,
            userInput,
            selectedOption: matchedOption,
          });

          if (actionResult.contextUpdates) {
            session.contextData = { ...session.contextData, ...actionResult.contextUpdates };
          }

          if (actionResult.terminate) {
            terminateSession = true;
            customDisplayMessage = actionResult.customMessage || 'Thank you for using ZFund.';
          } else {
            if (actionResult.customMessage) {
              customDisplayMessage = actionResult.customMessage;
            }
            if (actionResult.nextMenuKey) {
              session.navigationHistory.push(currentMenu.menuKey);
              targetMenuKey = actionResult.nextMenuKey;
            }
          }
        }
      }

      // If action requested termination
      if (terminateSession) {
        await ussdSessionService.endSession(session.sessionId, UssdSessionStatus.COMPLETED);
        return {
          message: customDisplayMessage || 'Thank you for using ZFund.',
          continueSession: false,
        };
      }

      // Resolve and render the next menu from DB
      const nextMenu = version.menus.find((m) => m.menuKey === targetMenuKey);
      if (!nextMenu) {
        // If target menu not found, render custom message or finish
        if (customDisplayMessage) {
          return {
            message: customDisplayMessage,
            continueSession: false,
          };
        }
        await ussdSessionService.endSession(session.sessionId, UssdSessionStatus.COMPLETED);
        return {
          message: 'Thank you for using ZFund.',
          continueSession: false,
        };
      }

      session.currentMenuKey = nextMenu.menuKey;
      await ussdSessionService.updateSession(session);

      const renderedMessage = customDisplayMessage || this.renderMenu(nextMenu, project, session);
      const continueSession = nextMenu.menuType !== UssdMenuType.TERMINAL;

      if (!continueSession) {
        await ussdSessionService.endSession(session.sessionId, UssdSessionStatus.COMPLETED);
      }

      await ussdSessionService.recordEvent({
        ussdSessionId: session.id,
        msisdn: request.msisdn,
        stepNumber: (session.navigationHistory?.length || 0) + 1,
        menuKey: nextMenu.menuKey,
        userInput: request.userInput,
        renderedMessage,
        msgType: continueSession,
      });

      return {
        message: renderedMessage,
        continueSession,
      };
    } finally {
      await ussdSessionService.releaseLock(request.sessionId);
    }
  }

  /**
   * Dynamically renders prompt and active options loaded directly from the database
   */
  private renderMenu(menu: UssdMenu, project: Project | null, session: UssdSession): string {
    let prompt = menu.prompt;

    // Replace dynamic placeholders in prompt
    prompt = prompt.replace(/{projectName}/g, project?.name || 'ZFund');
    prompt = prompt.replace(/{currency}/g, project?.currency || 'GHS');
    prompt = prompt.replace(/{amount}/g, String(session.contextData.amount || '0.00'));
    prompt = prompt.replace(/{minAmount}/g, project?.minAmount || '1.00');
    prompt = prompt.replace(/{maxAmount}/g, project?.maxAmount || '10000.00');
    prompt = prompt.replace(/{phone}/g, session.msisdn);

    const activeOptions = (menu.options || []).filter((o) => o.isActive);
    if (activeOptions.length === 0) {
      return prompt;
    }

    const optionsText = activeOptions.map((o) => `${o.optionKey}. ${o.label}`).join('\n');
    return `${prompt}\n${optionsText}`;
  }
}

export const ussdRuntimeService = new UssdRuntimeService();
