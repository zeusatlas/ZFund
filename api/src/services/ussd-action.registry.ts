import { MoneyUtil } from '../common/utils/decimal';
import { Project } from '../database/entities/project.entity';
import { UssdMenuOption } from '../database/entities/ussd-menu-option.entity';
import { UssdSession } from '../database/entities/ussd-session.entity';

export interface UssdActionContext {
  session: UssdSession;
  project?: Project | null;
  userInput: string;
  selectedOption?: UssdMenuOption | null;
}

export interface UssdActionResult {
  nextMenuKey?: string;
  customMessage?: string;
  terminate?: boolean;
  contextUpdates?: Record<string, unknown>;
}

export type UssdActionHandler = (context: UssdActionContext) => Promise<UssdActionResult>;

export class UssdActionRegistry {
  private static handlers = new Map<string, UssdActionHandler>();

  static register(name: string, handler: UssdActionHandler): void {
    this.handlers.set(name.toUpperCase(), handler);
  }

  static isApproved(name: string): boolean {
    return this.handlers.has(name.toUpperCase());
  }

  static async execute(name: string, context: UssdActionContext): Promise<UssdActionResult> {
    const handler = this.handlers.get(name.toUpperCase());
    if (!handler) {
      throw new Error(`Unapproved or unknown USSD action: ${name}`);
    }
    return await handler(context);
  }

  static getApprovedActionNames(): string[] {
    return Array.from(this.handlers.keys());
  }
}

// ----------------------------------------------------------------------------
// Built-in Approved Action Handlers (Allowlisted only)
// ----------------------------------------------------------------------------

UssdActionRegistry.register('SELECT_PURPOSE', async (ctx) => {
  const purposeId = (ctx.selectedOption?.validationConfig?.purposeId as string) || ctx.userInput;
  const customName = ctx.selectedOption?.label;

  return {
    nextMenuKey: 'AMOUNT_INPUT',
    contextUpdates: {
      selectedPurposeId: purposeId,
      selectedPurposeName: customName,
    },
  };
});

UssdActionRegistry.register('ENTER_AMOUNT', async (ctx) => {
  const amountStr = ctx.userInput.trim();

  if (!MoneyUtil.isValidAmount(amountStr)) {
    return {
      customMessage: 'Invalid amount. Please enter a valid number (e.g. 10 or 50):',
      nextMenuKey: 'AMOUNT_INPUT',
    };
  }

  const project = ctx.project;
  if (project) {
    if (MoneyUtil.compare(amountStr, project.minAmount) < 0) {
      return {
        customMessage: `Minimum amount is ${project.currency} ${project.minAmount}. Please enter a valid amount:`,
        nextMenuKey: 'AMOUNT_INPUT',
      };
    }
    if (MoneyUtil.compare(amountStr, project.maxAmount) > 0) {
      return {
        customMessage: `Maximum amount is ${project.currency} ${project.maxAmount}. Please enter a valid amount:`,
        nextMenuKey: 'AMOUNT_INPUT',
      };
    }
  }

  return {
    nextMenuKey: 'CONFIRM_PAYMENT',
    contextUpdates: {
      amount: amountStr,
    },
  };
});

UssdActionRegistry.register('CONFIRM_CONTRIBUTION', async (ctx) => {
  const amount = ctx.session.contextData.amount || '0.00';
  const currency = ctx.project?.currency || 'GHS';
  const projectName = ctx.project?.name || 'ZFund';

  return {
    customMessage: `Contribute ${currency} ${amount} to ${projectName}?\n1. Confirm\n2. Cancel`,
    nextMenuKey: 'CONFIRM_PAYMENT',
  };
});

UssdActionRegistry.register('INITIATE_PAYMENT', async (ctx) => {
  const amount = (ctx.session.contextData.amount as string) || '0.00';
  const currency = ctx.project?.currency || 'GHS';
  const msisdn = ctx.session.msisdn;

  // Returning payment prompt instruction for contributor
  return {
    customMessage: `Payment of ${currency} ${amount} initiated for ${msisdn}. Please approve prompt with your MoMo PIN.`,
    terminate: true,
    contextUpdates: {
      paymentInitiated: true,
      paymentInitiatedAt: new Date().toISOString(),
    },
  };
});

UssdActionRegistry.register('LOOKUP_PROJECT_BY_CODE', async (ctx) => {
  const code = ctx.userInput.trim();
  // Handled dynamically in routing service if needed
  return {
    contextUpdates: {
      enteredEventCode: code,
    },
    nextMenuKey: 'WELCOME',
  };
});

UssdActionRegistry.register('VIEW_PROJECT_INFO', async (ctx) => {
  const project = ctx.project;
  const desc = project?.description || project?.name || 'ZFund contribution project.';
  return {
    customMessage: `${desc}\n0. Back`,
    nextMenuKey: 'PROJECT_INFO',
  };
});

UssdActionRegistry.register('EXIT', async () => {
  return {
    customMessage: 'Thank you for using ZFund.',
    terminate: true,
  };
});
