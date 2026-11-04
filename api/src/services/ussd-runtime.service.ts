import { AppDataSource } from '../config/database';
import { logger } from '../config/logger';
import { Contributor } from '../database/entities/contributor.entity';
import { OrgVerificationStatus } from '../database/entities/organization.entity';
import { Project, ProjectStatus } from '../database/entities/project.entity';
import { UserStatus } from '../database/entities/user.entity';
import { auditService } from './audit.service';
import { projectService } from './project.service';
import { paymentService } from './payment.service';
import { PaymentStatus } from '../database/entities/payment-attempt.entity';
import { UssdFlowVersion } from '../database/entities/ussd-flow-version.entity';
import { UssdMenuOption, UssdOptionType } from '../database/entities/ussd-menu-option.entity';
import { UssdMenu, UssdMenuType } from '../database/entities/ussd-menu.entity';
import { UssdSession, UssdSessionStatus } from '../database/entities/ussd-session.entity';
import { InternalUssdRequest, InternalUssdResponse, NaloAdapter, NaloRawRequest, NaloRawResponse } from './nalo.adapter';
import { UssdActionRegistry } from './ussd-action.registry';
import { ussdFlowService } from './ussd-flow.service';
import { ussdRoutingService } from './ussd-routing.service';
import { ussdSessionService } from './ussd-session.service';

export class UssdRuntimeService {
  private get versionRepo() { return AppDataSource.getRepository(UssdFlowVersion); }
  private get contributorRepo() { return AppDataSource.getRepository(Contributor); }

  /**
   * Automatically records any caller who dials the USSD into the contributors table,
   * ensuring that everyone who dials is tracked whether they donate or not.
   */
  private async recordCaller(msisdn: string): Promise<void> {
    try {
      const normalizedPhone = msisdn.trim();
      const existing = await this.contributorRepo.findOne({ where: { msisdn: normalizedPhone } });
      if (!existing) {
        const caller = this.contributorRepo.create({ msisdn: normalizedPhone });
        await this.contributorRepo.save(caller);
        logger.info({ msisdn: normalizedPhone }, 'New caller registered as contributor on USSD dial');
      }
    } catch (err) {
      // Non-blocking write to avoid failing USSD flow if already exists or db glitch
      logger.error({ err, msisdn }, 'Failed to record caller in contributors on USSD dial');
    }
  }

  async processRequest(rawBody: NaloRawRequest): Promise<NaloRawResponse> {
    const request = NaloAdapter.parseRequest(rawBody);

    logger.info(
      {
        msisdn: request.msisdn,
        network: request.network,
        sessionId: request.sessionId,
        userInput: request.userInput,
        isInitialRequest: request.isInitialRequest,
      },
      `USSD request received from ${request.msisdn}`
    );

    try {
      const response = await this.executeTurn(request);
      return NaloAdapter.formatResponse(request, response);
    } catch (err) {
      logger.error(
        { err, msisdn: request.msisdn, sessionId: request.sessionId },
        'Error executing USSD turn'
      );
      return NaloAdapter.formatResponse(request, {
        message: 'A temporary service error occurred. Please try again later.',
        continueSession: false,
      });
    }
  }

  private async executeTurn(request: InternalUssdRequest): Promise<InternalUssdResponse> {
    // 1. Resolve active session:
    // If request has explicit sessionId use it, otherwise resolve active session by MSISDN (NALO standard)
    let session = request.sessionId
      ? await ussdSessionService.getSession(request.sessionId)
      : await ussdSessionService.getActiveSessionByMsisdn(request.msisdn);

    // Initial dial detection:
    // A request is an initial dial if:
    // 1. No active session exists, OR
    // 2. The user dialed a new USSD string starting with '*' (e.g. *920*969#)
    // If an active session exists and input is menu selection (e.g. '1', '50'), treat as continuation
    const isNewDialCode = request.userInput.startsWith('*');
    const isInitial = !session || isNewDialCode || (request.isInitialRequest && !session);

    // Track every caller in contributors table whether they end up donating or not
    await this.recordCaller(request.msisdn);

    // Audit log every incoming dial or turn
    const isOtpInput = session?.currentMenuKey === 'ENTER_PAYMENT_OTP';
    const safeUserInput = isOtpInput ? '******' : request.userInput;

    auditService.log({
      entityType: 'USSD_DIAL',
      entityId: request.sessionId || `ussd_${request.msisdn}_${Date.now()}`,
      action: isInitial ? 'USSD_DIAL_INITIAL' : 'USSD_TURN_INPUT',
      newValues: {
        msisdn: request.msisdn,
        network: request.network,
        userInput: safeUserInput,
        provider: request.provider,
        sessionId: request.sessionId,
        isInitial,
      },
    }).catch(() => {});

    const lockIdentifier = session?.sessionId || request.sessionId || `nalo_${request.msisdn}`;
    const lockAcquired = await ussdSessionService.acquireLock(lockIdentifier);
    if (!lockAcquired) {
      return {
        message: 'Request in progress. Please wait...',
        continueSession: true,
      };
    }

    try {
      // Handle Initial Request (New Session)
      if (isInitial) {
        // -------------------------------------------------------------
        // Payment Recovery Check: Identify outstanding pending payments
        // -------------------------------------------------------------
        const pendingPayments = await paymentService.getPendingPaymentsForMsisdn(request.msisdn);

        if (pendingPayments.length > 0) {
          const newSessionId = request.sessionId || `nalo_${request.msisdn}_${Date.now()}`;

          if (pendingPayments.length === 1) {
            const pending = pendingPayments[0];
            const isOtpRequired =
              pending.providerStatus === 'OTP_REQUIRED' ||
              pending.metadata?.authorizationState === 'OTP_REQUIRED';
            const projectName = pending.contribution?.project?.name || 'this campaign';
            const currency = pending.currency || 'GHS';
            const amount = pending.amount;

            let promptText = '';
            if (isOtpRequired) {
              promptText = `You have a pending payment of ${currency} ${amount} for ${projectName}.\n1. Enter OTP to authorize\n2. Check payment status\n3. Start new transaction`;
            } else {
              promptText = `You have a pending payment of ${currency} ${amount} for ${projectName}.\n1. Check payment status\n2. Start new transaction`;
            }

            session = await ussdSessionService.createSession({
              sessionId: newSessionId,
              msisdn: request.msisdn,
              network: request.network,
              provider: request.provider,
              projectId: pending.contribution?.projectId,
              initialMenuKey: 'PENDING_PAYMENT_MENU',
              contextData: {
                pendingPaymentId: pending.id,
                paymentReference: pending.reference,
                pendingPaymentReference: pending.reference,
                pendingAmount: amount,
                pendingCurrency: currency,
                pendingProjectName: projectName,
                pendingProviderStatus: pending.providerStatus,
                isOtpRequired,
                dialedCode: request.userInput,
              },
            });

            await ussdSessionService.recordEvent({
              ussdSessionId: session.id,
              msisdn: request.msisdn,
              stepNumber: 1,
              menuKey: 'PENDING_PAYMENT_MENU',
              userInput: request.userInput,
              renderedMessage: promptText,
              msgType: true,
            });

            return {
              message: promptText,
              continueSession: true,
            };
          } else {
            // Multiple pending payments: present selection so customer can select which to manage
            const lines = pendingPayments
              .map((p, idx) => `${idx + 1}. ${p.currency} ${p.amount} (${p.contribution?.project?.name || 'Campaign'})`)
              .join('\n');
            const promptText = `You have multiple pending payments:\n${lines}\nSelect payment (or 0 to start new):`;

            session = await ussdSessionService.createSession({
              sessionId: newSessionId,
              msisdn: request.msisdn,
              network: request.network,
              provider: request.provider,
              initialMenuKey: 'SELECT_PENDING_PAYMENT',
              contextData: {
                pendingPaymentList: pendingPayments.map((p) => ({
                  id: p.id,
                  reference: p.reference,
                  amount: p.amount,
                  currency: p.currency,
                  projectName: p.contribution?.project?.name || 'RaiseFunds',
                  providerStatus: p.providerStatus,
                  isOtpRequired:
                    p.providerStatus === 'OTP_REQUIRED' ||
                    p.metadata?.authorizationState === 'OTP_REQUIRED',
                  projectId: p.contribution?.projectId,
                })),
                dialedCode: request.userInput,
              },
            });

            await ussdSessionService.recordEvent({
              ussdSessionId: session.id,
              msisdn: request.msisdn,
              stepNumber: 1,
              menuKey: 'SELECT_PENDING_PAYMENT',
              userInput: request.userInput,
              renderedMessage: promptText,
              msgType: true,
            });

            return {
              message: promptText,
              continueSession: true,
            };
          }
        }

        // Check for recent successful payment confirmation on redial (e.g. within 5 minutes)
        if (!request.eventCodeExtracted) {
          const recentSuccess = await paymentService.getRecentSuccessfulPaymentForMsisdn(request.msisdn, 5);
          if (recentSuccess) {
            const newSessionId = request.sessionId || `nalo_${request.msisdn}_${Date.now()}`;
            const projName = recentSuccess.contribution?.project?.name || 'RaiseFunds';
            const promptText = `Your payment of ${recentSuccess.currency} ${recentSuccess.amount} for ${projName} was successful!\nRef: ${recentSuccess.reference}\n1. Start new transaction\n2. Exit`;

            session = await ussdSessionService.createSession({
              sessionId: newSessionId,
              msisdn: request.msisdn,
              network: request.network,
              provider: request.provider,
              projectId: recentSuccess.contribution?.projectId,
              initialMenuKey: 'RECENT_PAYMENT_CONFIRMATION',
              contextData: {
                recentPaymentRef: recentSuccess.reference,
                dialedCode: request.userInput,
              },
            });

            await ussdSessionService.recordEvent({
              ussdSessionId: session.id,
              msisdn: request.msisdn,
              stepNumber: 1,
              menuKey: 'RECENT_PAYMENT_CONFIRMATION',
              userInput: request.userInput,
              renderedMessage: promptText,
              msgType: true,
            });

            return {
              message: promptText,
              continueSession: true,
            };
          }
        }
        const resolved = await ussdRoutingService.resolveFlow(request);
        if (resolved.rejectionMessage) {
          // Log rejected dial in ussd_sessions and ussd_session_events so there is a permanent record
          const rejectedSessionId = request.sessionId || `nalo_rej_${request.msisdn}_${Date.now()}`;
          const rejectedSession = await ussdSessionService.createSession({
            sessionId: rejectedSessionId,
            msisdn: request.msisdn,
            network: request.network,
            provider: request.provider,
            projectId: resolved.project?.id,
            flowId: resolved.flow?.id,
            flowVersionId: resolved.version?.id,
            initialMenuKey: 'REJECTED',
            contextData: {
              dialedCode: request.userInput,
              rejectionReason: resolved.rejectionMessage,
            },
          });
          await ussdSessionService.recordEvent({
            ussdSessionId: rejectedSession.id,
            msisdn: request.msisdn,
            stepNumber: 1,
            menuKey: 'REJECTED',
            userInput: request.userInput,
            renderedMessage: resolved.rejectionMessage,
            msgType: false,
          });
          await ussdSessionService.endSession(rejectedSession.sessionId, UssdSessionStatus.FAILED);

          return {
            message: resolved.rejectionMessage,
            continueSession: false,
          };
        }
        if (!resolved.flow || !resolved.version) {
          const unavailMsg = 'Welcome to RaiseFunds. No active USSD service is currently available. Please contact support.';
          const unavailSessionId = request.sessionId || `nalo_unavail_${request.msisdn}_${Date.now()}`;
          const unavailSession = await ussdSessionService.createSession({
            sessionId: unavailSessionId,
            msisdn: request.msisdn,
            network: request.network,
            provider: request.provider,
            projectId: resolved.project?.id,
            initialMenuKey: 'UNAVAILABLE',
            contextData: {
              dialedCode: request.userInput,
              reason: 'No active flow or version found',
            },
          });
          await ussdSessionService.recordEvent({
            ussdSessionId: unavailSession.id,
            msisdn: request.msisdn,
            stepNumber: 1,
            menuKey: 'UNAVAILABLE',
            userInput: request.userInput,
            renderedMessage: unavailMsg,
            msgType: false,
          });
          await ussdSessionService.endSession(unavailSession.sessionId, UssdSessionStatus.FAILED);

          return {
            message: unavailMsg,
            continueSession: false,
          };
        }

        const newSessionId = request.sessionId || `nalo_${request.msisdn}_${Date.now()}`;

        session = await ussdSessionService.createSession({
          sessionId: newSessionId,
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

      // Handle Continuing Session (session is guaranteed here)
      const version = await this.versionRepo.findOne({
        where: { id: session!.flowVersionId },
        relations: ['menus', 'menus.options'],
      });

      if (!version) {
        await ussdSessionService.endSession(session!.sessionId, UssdSessionStatus.FAILED);
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

      const project = session!.projectId ? await projectService.getProjectById(session!.projectId) : null;
      const userInput = request.userInput.trim();

      // -------------------------------------------------------------
      // Special Handler: Pending Payment Continuation (SELECT_PENDING_PAYMENT)
      // -------------------------------------------------------------
      if (session!.currentMenuKey === 'SELECT_PENDING_PAYMENT') {
        const userInput = request.userInput.trim();
        if (userInput === '0') {
          return await this.renderNormalInitialFlow(session!, request);
        }

        const idx = parseInt(userInput, 10) - 1;
        const list = (session!.contextData.pendingPaymentList as any[]) || [];
        const chosen = list[idx];

        if (!chosen) {
          const lines = list
            .map((p, i) => `${i + 1}. ${p.currency} ${p.amount} (${p.projectName})`)
            .join('\n');
          return {
            message: `Invalid choice.\nPending payments:\n${lines}\nSelect payment (or 0 to start new):`,
            continueSession: true,
          };
        }

        session!.contextData = {
          ...session!.contextData,
          pendingPaymentId: chosen.id,
          paymentReference: chosen.reference,
          pendingPaymentReference: chosen.reference,
          pendingAmount: chosen.amount,
          pendingCurrency: chosen.currency,
          pendingProjectName: chosen.projectName,
          pendingProviderStatus: chosen.providerStatus,
          isOtpRequired: chosen.isOtpRequired,
          projectId: chosen.projectId,
        };
        session!.currentMenuKey = 'PENDING_PAYMENT_MENU';
        await ussdSessionService.updateSession(session!);

        let promptText = '';
        if (chosen.isOtpRequired) {
          promptText = `Pending payment: ${chosen.currency} ${chosen.amount} (${chosen.projectName})\n1. Enter OTP to authorize\n2. Check payment status\n3. Start new transaction`;
        } else {
          promptText = `Pending payment: ${chosen.currency} ${chosen.amount} (${chosen.projectName})\n1. Check payment status\n2. Start new transaction`;
        }

        await ussdSessionService.recordEvent({
          ussdSessionId: session!.id,
          msisdn: request.msisdn,
          stepNumber: (session!.navigationHistory?.length || 0) + 1,
          menuKey: 'PENDING_PAYMENT_MENU',
          userInput: request.userInput,
          renderedMessage: promptText,
          msgType: true,
        });

        return { message: promptText, continueSession: true };
      }

      // -------------------------------------------------------------
      // Special Handler: Pending Payment Menu (PENDING_PAYMENT_MENU)
      // -------------------------------------------------------------
      if (session!.currentMenuKey === 'PENDING_PAYMENT_MENU') {
        const userInput = request.userInput.trim();
        const isOtpRequired = Boolean(session!.contextData.isOtpRequired);
        const paymentRef =
          (session!.contextData.paymentReference as string) ||
          (session!.contextData.pendingPaymentReference as string);
        const amount = session!.contextData.pendingAmount || '0.00';
        const currency = session!.contextData.pendingCurrency || 'GHS';
        const projectName = session!.contextData.pendingProjectName || 'RaiseFunds';

        if (isOtpRequired) {
          if (userInput === '1') {
            // Option 1: Enter OTP to authorize
            session!.currentMenuKey = 'ENTER_PAYMENT_OTP';
            await ussdSessionService.updateSession(session!);

            const promptMsg = 'Please enter the OTP sent to your phone via SMS (or 0 to cancel):';
            await ussdSessionService.recordEvent({
              ussdSessionId: session!.id,
              msisdn: request.msisdn,
              stepNumber: (session!.navigationHistory?.length || 0) + 1,
              menuKey: 'ENTER_PAYMENT_OTP',
              userInput: request.userInput,
              renderedMessage: promptMsg,
              msgType: true,
            });

            return { message: promptMsg, continueSession: true };
          } else if (userInput === '2') {
            // Option 2: Check payment status
            return await this.handleCheckPaymentStatus(session!, paymentRef, amount, currency, projectName);
          } else if (userInput === '3' || userInput === '0') {
            // Option 3: Start new transaction
            return await this.renderNormalInitialFlow(session!, request);
          } else {
            return {
              message: `Invalid choice.\nPending payment of ${currency} ${amount} for ${projectName}.\n1. Enter OTP to authorize\n2. Check payment status\n3. Start new transaction`,
              continueSession: true,
            };
          }
        } else {
          // Normal pending Mobile Money authorization
          if (userInput === '1') {
            // Option 1: Check payment status
            return await this.handleCheckPaymentStatus(session!, paymentRef, amount, currency, projectName);
          } else if (userInput === '2' || userInput === '0') {
            // Option 2: Start new transaction
            return await this.renderNormalInitialFlow(session!, request);
          } else {
            return {
              message: `Invalid choice.\nPending payment of ${currency} ${amount} for ${projectName}.\n1. Check payment status\n2. Start new transaction`,
              continueSession: true,
            };
          }
        }
      }

      // -------------------------------------------------------------
      // Special Handler: Recent Successful Payment Confirmation
      // -------------------------------------------------------------
      if (session!.currentMenuKey === 'RECENT_PAYMENT_CONFIRMATION') {
        const userInput = request.userInput.trim();
        if (userInput === '1') {
          return await this.renderNormalInitialFlow(session!, request);
        }
        await ussdSessionService.endSession(session!.sessionId, UssdSessionStatus.COMPLETED);
        return {
          message: 'Thank you for using RaiseFunds.',
          continueSession: false,
        };
      }

      // Special Interceptor: Contributor is entering payment OTP/voucher
      if (session!.currentMenuKey === 'ENTER_PAYMENT_OTP') {
        const actionResult = await UssdActionRegistry.execute('SUBMIT_PAYMENT_OTP', {
          session: session!,
          project,
          userInput,
        });

        if (actionResult.contextUpdates) {
          session!.contextData = { ...session!.contextData, ...actionResult.contextUpdates };
        }

        if (actionResult.terminate) {
          await ussdSessionService.endSession(session!.sessionId, UssdSessionStatus.COMPLETED);
          return {
            message: actionResult.customMessage || 'Thank you for using RaiseFunds.',
            continueSession: false,
          };
        }

        session!.currentMenuKey = actionResult.nextMenuKey || 'ENTER_PAYMENT_OTP';
        await ussdSessionService.updateSession(session!);

        const msg = actionResult.customMessage || 'Please enter the OTP/voucher code:';
        await ussdSessionService.recordEvent({
          ussdSessionId: session!.id,
          msisdn: request.msisdn,
          stepNumber: (session!.navigationHistory?.length || 0) + 1,
          menuKey: session!.currentMenuKey,
          userInput: '******',
          renderedMessage: msg,
          msgType: true,
        });

        return {
          message: msg,
          continueSession: true,
        };
      }

      // -------------------------------------------------------------
      // Special Handler: Dynamic General Navigation (SELECT_HOST)
      // -------------------------------------------------------------
      if (session!.currentMenuKey === 'SELECT_HOST') {
        const userInput = request.userInput.trim();

        if (userInput === '0') {
          const generalFlow = await ussdRoutingService.resolveFlow(request);
          const welcomeMenu = generalFlow.version?.menus.find((m) => m.menuKey === 'WELCOME');
          session!.currentMenuKey = 'WELCOME';
          session!.navigationHistory = [];
          await ussdSessionService.updateSession(session!);

          const msg = welcomeMenu
            ? this.renderMenu(welcomeMenu, null, session!)
            : 'Welcome to your number one Fund Raising platform';

          return { message: msg, continueSession: true };
        }

        const hostIndex = parseInt(userInput, 10) - 1;
        const hostList = (session!.contextData.hostList as Array<{ id: string; name: string }>) || [];
        const selectedHost = hostList[hostIndex];

        if (!selectedHost) {
          const hosts = await this.getActiveHostsWithProjects();
          const lines = hosts.map((h, i) => `${i + 1}. ${h.name}`).join('\n');
          return {
            message: `Invalid choice.\nSelect Host:\n${lines}\n0. Back`,
            continueSession: true,
          };
        }

        const projectsByHost = (session!.contextData.projectsByHost as Record<string, Array<{ id: string; name: string; eventCode: string }>>) || {};
        const projects = projectsByHost[selectedHost.id] || [];

        if (projects.length === 0) {
          return {
            message: 'No active campaigns found for this host.\n0. Back',
            continueSession: true,
          };
        }

        session!.contextData = {
          ...session!.contextData,
          selectedHostId: selectedHost.id,
          selectedHostName: selectedHost.name,
          currentCampaignList: projects,
        };
        session!.currentMenuKey = 'SELECT_CAMPAIGN';
        session!.navigationHistory = ['SELECT_HOST'];
        await ussdSessionService.updateSession(session!);

        const lines = projects.map((p, i) => `${i + 1}. ${p.name}`).join('\n');
        const rendered = `Select Campaign:\n${lines}\n0. Back`;

        await ussdSessionService.recordEvent({
          ussdSessionId: session!.id,
          msisdn: request.msisdn,
          stepNumber: (session!.navigationHistory?.length || 0) + 1,
          menuKey: 'SELECT_CAMPAIGN',
          userInput: request.userInput,
          renderedMessage: rendered,
          msgType: true,
        });

        return { message: rendered, continueSession: true };
      }

      // -------------------------------------------------------------
      // Special Handler: Dynamic General Navigation (SELECT_CAMPAIGN)
      // -------------------------------------------------------------
      if (session!.currentMenuKey === 'SELECT_CAMPAIGN') {
        const userInput = request.userInput.trim();

        if (userInput === '0') {
          return await this.renderHostList(session!, request);
        }

        const campaignIndex = parseInt(userInput, 10) - 1;
        const campaignList = (session!.contextData.currentCampaignList as Array<{ id: string; name: string; eventCode: string }>) || [];
        const chosenProjectSummary = campaignList[campaignIndex];

        if (!chosenProjectSummary) {
          const lines = campaignList.map((p, i) => `${i + 1}. ${p.name}`).join('\n');
          return {
            message: `Invalid choice.\nSelect Campaign:\n${lines}\n0. Back`,
            continueSession: true,
          };
        }

        // Project chosen: Transition into campaign's custom flow
        const project = await projectService.getProjectById(chosenProjectSummary.id);
        if (!project) {
          return { message: 'Campaign not found. Please try again.', continueSession: false };
        }

        const projectFlow = await ussdFlowService.getProjectPublishedFlow(project.id);
        if (!projectFlow || !projectFlow.version) {
          return {
            message: `Welcome to ${project.name}.\nThis campaign is not yet configured for USSD contributions.\n0. Back`,
            continueSession: true,
          };
        }

        session!.projectId = project.id;
        session!.flowId = projectFlow.flow.id;
        session!.flowVersionId = projectFlow.version.id;

        const sortedMenus = [...projectFlow.version.menus].sort((a, b) => a.displayOrder - b.displayOrder);
        const rootMenu = sortedMenus[0];
        if (!rootMenu) {
          return { message: 'Campaign flow error. Initial menu missing.', continueSession: false };
        }

        session!.currentMenuKey = rootMenu.menuKey;
        session!.navigationHistory = ['SELECT_CAMPAIGN'];
        await ussdSessionService.updateSession(session!);

        const rendered = this.renderMenu(rootMenu, project, session!);
        await ussdSessionService.recordEvent({
          ussdSessionId: session!.id,
          msisdn: request.msisdn,
          stepNumber: (session!.navigationHistory?.length || 0) + 1,
          menuKey: rootMenu.menuKey,
          userInput: request.userInput,
          renderedMessage: rendered,
          msgType: true,
        });

        return { message: rendered, continueSession: true };
      }

      const currentMenu = version.menus.find((m) => m.menuKey === session!.currentMenuKey);
      if (!currentMenu) {
        await ussdSessionService.endSession(session!.sessionId, UssdSessionStatus.FAILED);
        return {
          message: 'Menu state error. Session ended.',
          continueSession: false,
        };
      }

      // State transition variables
      let targetMenuKey: string | null = null;
      let customDisplayMessage: string | null = null;
      let terminateSession = false;

      // Handle universal Back (0) navigation if previous history exists
      if (userInput === '0' && session!.navigationHistory && session!.navigationHistory.length > 0) {
        targetMenuKey = session!.navigationHistory.pop()!;
      } else if (currentMenu.menuType === UssdMenuType.INPUT) {
        // Execute input handler (e.g. ENTER_AMOUNT)
        const inputAction = currentMenu.menuKey === 'DONOR_NAME' ? 'ENTER_DONOR_NAME' : 'ENTER_AMOUNT';
        const actionResult = await UssdActionRegistry.execute(inputAction, {
          session: session!,
          project,
          userInput,
        });

        if (actionResult.contextUpdates) {
          session!.contextData = { ...session!.contextData, ...actionResult.contextUpdates };
        }

        if (actionResult.customMessage) {
          customDisplayMessage = actionResult.customMessage;
          targetMenuKey = actionResult.nextMenuKey || currentMenu.menuKey;
        } else {
          session!.navigationHistory.push(currentMenu.menuKey);
          targetMenuKey = actionResult.nextMenuKey || 'CONFIRM_PAYMENT';
          // Hosts can opt in to asking for the donor's name right after the amount.
          if (
            inputAction === 'ENTER_AMOUNT' &&
            targetMenuKey === 'CONFIRM_PAYMENT' &&
            version.menus.some((m) => m.menuKey === 'DONOR_NAME' && m.isActive)
          ) {
            targetMenuKey = 'DONOR_NAME';
          }
        }
      } else {
        // SELECT menu type: match userInput against active options
        const activeOptions = currentMenu.options.filter((o) => o.isActive);
        const matchedOption = activeOptions.find((o) => o.optionKey === userInput);

        if (!matchedOption) {
          // Re-render current menu with error prefix
          const reRendered = `Invalid choice.\n${this.renderMenu(currentMenu, project, session!)}`;
          return {
            message: reRendered,
            continueSession: true,
          };
        }

        if (matchedOption.optionType === UssdOptionType.NAVIGATION) {
          session!.navigationHistory.push(currentMenu.menuKey);
          targetMenuKey = matchedOption.targetMenuKey || 'WELCOME';
        } else if (matchedOption.optionType === UssdOptionType.ACTION && matchedOption.actionReference) {
          const actionResult = await UssdActionRegistry.execute(matchedOption.actionReference, {
            session: session!,
            project,
            userInput,
            selectedOption: matchedOption,
          });

          if (actionResult.contextUpdates) {
            session!.contextData = { ...session!.contextData, ...actionResult.contextUpdates };
          }

          if (actionResult.terminate) {
            terminateSession = true;
            customDisplayMessage = actionResult.customMessage || 'Thank you for using RaiseFunds.';
          } else {
            if (actionResult.customMessage) {
              customDisplayMessage = actionResult.customMessage;
            }
            if (actionResult.nextMenuKey) {
              session!.navigationHistory.push(currentMenu.menuKey);
              targetMenuKey = actionResult.nextMenuKey;
            }
          }
        }
      }

      // If action requested termination
      if (terminateSession) {
        await ussdSessionService.endSession(session!.sessionId, UssdSessionStatus.COMPLETED);
        return {
          message: customDisplayMessage || 'Thank you for using RaiseFunds.',
          continueSession: false,
        };
      }

      // If next step is selecting host (from SUPPORT_PROJECT action)
      if (targetMenuKey === 'SELECT_HOST') {
        return await this.renderHostList(session!, request);
      }

      // If next step is awaiting payment OTP
      if (targetMenuKey === 'ENTER_PAYMENT_OTP') {
        session!.currentMenuKey = 'ENTER_PAYMENT_OTP';
        await ussdSessionService.updateSession(session!);

        const renderedMessage =
          customDisplayMessage || 'Please enter the OTP/voucher code sent to your phone (or 0 to cancel):';

        await ussdSessionService.recordEvent({
          ussdSessionId: session!.id,
          msisdn: request.msisdn,
          stepNumber: (session!.navigationHistory?.length || 0) + 1,
          menuKey: 'ENTER_PAYMENT_OTP',
          userInput: request.userInput,
          renderedMessage,
          msgType: true,
        });

        return {
          message: renderedMessage,
          continueSession: true,
        };
      }

      // Resolve and render the next menu from DB
      const nextMenu = version.menus.find((m) => m.menuKey === targetMenuKey);
      if (!nextMenu) {
        if (customDisplayMessage) {
          return {
            message: customDisplayMessage,
            continueSession: false,
          };
        }
        await ussdSessionService.endSession(session!.sessionId, UssdSessionStatus.COMPLETED);
        return {
          message: 'Thank you for using RaiseFunds.',
          continueSession: false,
        };
      }

      session!.currentMenuKey = nextMenu.menuKey;
      await ussdSessionService.updateSession(session!);

      const renderedMessage = customDisplayMessage || this.renderMenu(nextMenu, project, session!);
      const continueSession = nextMenu.menuType !== UssdMenuType.TERMINAL;

      if (!continueSession) {
        await ussdSessionService.endSession(session!.sessionId, UssdSessionStatus.COMPLETED);
      }

      await ussdSessionService.recordEvent({
        ussdSessionId: session!.id,
        msisdn: request.msisdn,
        stepNumber: (session!.navigationHistory?.length || 0) + 1,
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
      await ussdSessionService.releaseLock(lockIdentifier);
    }
  }

  private async getActiveHostsWithProjects(): Promise<
    Array<{ id: string; name: string; projects: Array<{ id: string; name: string; eventCode: string }> }>
  > {
    const projectRepo = AppDataSource.getRepository(Project);
    const projects = await projectRepo.find({
      where: {
        status: ProjectStatus.PUBLISHED,
        acceptsContributions: true,
      },
      relations: ['organization', 'owner'],
      order: { createdAt: 'DESC' },
    });

    const now = new Date();
    const validProjects = projects.filter((p) => {
      if (p.endDate && new Date(p.endDate) < now) return false;
      const isOwnerActive = p.owner && p.owner.status === UserStatus.ACTIVE;
      const isOrgValid = !p.organization || p.organization.verificationStatus === OrgVerificationStatus.VERIFIED;
      return isOwnerActive && isOrgValid;
    });

    const hostMap = new Map<string, { id: string; name: string; projects: Array<{ id: string; name: string; eventCode: string }> }>();
    for (const p of validProjects) {
      const hostId = p.organization?.id || p.ownerId;
      const hostName = p.organization?.name || `${p.owner?.firstName} ${p.owner?.lastName}`.trim() || 'Host';

      if (!hostMap.has(hostId)) {
        hostMap.set(hostId, {
          id: hostId,
          name: hostName,
          projects: [],
        });
      }

      hostMap.get(hostId)!.projects.push({
        id: p.id,
        name: p.name,
        eventCode: p.eventCode,
      });
    }

    return Array.from(hostMap.values());
  }

  private async renderHostList(session: UssdSession, request: InternalUssdRequest): Promise<InternalUssdResponse> {
    const hosts = await this.getActiveHostsWithProjects();
    if (hosts.length === 0) {
      return {
        message: 'No active hosts found at the moment.\n0. Back',
        continueSession: true,
      };
    }

    session.contextData = {
      ...session.contextData,
      hostList: hosts.map((h) => ({ id: h.id, name: h.name })),
      projectsByHost: Object.fromEntries(hosts.map((h) => [h.id, h.projects])),
    };
    session.currentMenuKey = 'SELECT_HOST';
    session.navigationHistory = ['WELCOME'];
    await ussdSessionService.updateSession(session);

    const lines = hosts.map((h, i) => `${i + 1}. ${h.name}`).join('\n');
    const rendered = `Select Host:\n${lines}\n0. Back`;

    await ussdSessionService.recordEvent({
      ussdSessionId: session.id,
      msisdn: request.msisdn,
      stepNumber: (session.navigationHistory?.length || 0) + 1,
      menuKey: 'SELECT_HOST',
      userInput: request.userInput,
      renderedMessage: rendered,
      msgType: true,
    });

    return { message: rendered, continueSession: true };
  }

  /**
   * Dynamically renders prompt and active options loaded directly from the database
   */
  private async handleCheckPaymentStatus(
    session: UssdSession,
    paymentRef: string,
    amount: any,
    currency: any,
    projectName: any
  ): Promise<InternalUssdResponse> {
    try {
      const verified = await paymentService.verifyPayment(paymentRef);
      if (verified.status === PaymentStatus.SUCCESSFUL) {
        await ussdSessionService.endSession(session.sessionId, UssdSessionStatus.COMPLETED);
        return {
          message: `Payment of ${currency} ${amount} for ${projectName} is confirmed! Thank you for your contribution.\nRef: ${paymentRef}`,
          continueSession: false,
        };
      }
      if (verified.status === PaymentStatus.FAILED) {
        await ussdSessionService.endSession(session.sessionId, UssdSessionStatus.COMPLETED);
        return {
          message: `Payment of ${currency} ${amount} was not completed (${verified.providerStatus || 'Failed'}). You may start a new transaction.`,
          continueSession: false,
        };
      }
      // Still pending
      await ussdSessionService.endSession(session.sessionId, UssdSessionStatus.COMPLETED);
      return {
        message: `Payment of ${currency} ${amount} is pending. Please authorize with your Mobile Money PIN on your phone or check back shortly.`,
        continueSession: false,
      };
    } catch (err: any) {
      await ussdSessionService.endSession(session.sessionId, UssdSessionStatus.COMPLETED);
      return {
        message: `Payment of ${currency} ${amount} is currently being processed. Please check back shortly.`,
        continueSession: false,
      };
    }
  }

  private async renderNormalInitialFlow(session: UssdSession, request: InternalUssdRequest): Promise<InternalUssdResponse> {
    const resolved = await ussdRoutingService.resolveFlow(request);
    if (resolved.rejectionMessage) {
      await ussdSessionService.endSession(session.sessionId, UssdSessionStatus.FAILED);
      return { message: resolved.rejectionMessage, continueSession: false };
    }
    if (!resolved.flow || !resolved.version) {
      await ussdSessionService.endSession(session.sessionId, UssdSessionStatus.FAILED);
      return {
        message: 'Welcome to RaiseFunds. No active USSD service is currently available. Please contact support.',
        continueSession: false,
      };
    }

    session.projectId = resolved.project?.id;
    session.flowId = resolved.flow.id;
    session.flowVersionId = resolved.version.id;
    session.currentMenuKey = 'WELCOME';
    session.navigationHistory = [];
    session.contextData = {
      dialedCode: request.userInput,
      eventCode: resolved.directEventCodeUsed,
    };
    await ussdSessionService.updateSession(session);

    const welcomeMenu = resolved.version.menus.find((m) => m.menuKey === 'WELCOME');
    if (!welcomeMenu) {
      await ussdSessionService.endSession(session.sessionId, UssdSessionStatus.FAILED);
      return { message: 'Menu configuration error. Initial menu not found.', continueSession: false };
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

    return { message: rendered, continueSession: true };
  }

  private renderMenu(menu: UssdMenu, project: Project | null, session: UssdSession): string {
    let prompt = menu.prompt;

    const selectedStep =
      (session.contextData.selectedPurposeName as string) ||
      (session.contextData.purpose as string) ||
      (session.contextData.targetName as string) ||
      project?.name ||
      'this campaign';

    // Replace dynamic placeholders in prompt
    prompt = prompt.replace(/{purpose}/g, selectedStep);
    prompt = prompt.replace(/{subStep}/g, selectedStep);
    prompt = prompt.replace(/{target}/g, selectedStep);
    prompt = prompt.replace(/{targetName}/g, selectedStep);
    prompt = prompt.replace(/{step}/g, selectedStep);

    if (menu.menuKey === 'CONFIRM_PAYMENT') {
      prompt = prompt.replace(/{projectName}/g, selectedStep);
      if (project?.name) {
        const escaped = project.name.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
        prompt = prompt.replace(new RegExp(`to\\s+${escaped}\\?`, 'gi'), `to ${selectedStep}?`);
        prompt = prompt.replace(new RegExp(escaped, 'g'), selectedStep);
      }
    } else {
      prompt = prompt.replace(/{projectName}/g, project?.name || 'RaiseFunds');
    }

    prompt = prompt.replace(/{campaignName}/g, project?.name || 'RaiseFunds');
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
