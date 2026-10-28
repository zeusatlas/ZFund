import { MoneyUtil } from '../common/utils/decimal';
import { Project } from '../database/entities/project.entity';
import { UssdMenuOption } from '../database/entities/ussd-menu-option.entity';
import { UssdSession } from '../database/entities/ussd-session.entity';
import { paymentService } from './payment.service';

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

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

UssdActionRegistry.register('SELECT_PURPOSE', async (ctx) => {
  const cfgPurposeId = ctx.selectedOption?.validationConfig?.purposeId as string | undefined;
  const isCfgUuid = cfgPurposeId && UUID_REGEX.test(cfgPurposeId);
  const isInputUuid = ctx.userInput && UUID_REGEX.test(ctx.userInput.trim());
  const purposeId = isCfgUuid ? cfgPurposeId : isInputUuid ? ctx.userInput.trim() : undefined;
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
  const projectId = ctx.project?.id || ctx.session.projectId;

  if (!projectId) {
    return {
      customMessage: 'Invalid project session. Payment cannot be initiated.',
      terminate: true,
    };
  }

  try {
    const paymentResult = await paymentService.initiateUssdPayment({
      msisdn,
      amount,
      projectId,
      purposeId: ctx.session.contextData.selectedPurposeId as string | undefined,
    });

    const { chargeResult, paymentAttempt } = paymentResult;

    if (chargeResult.requiresOtp || chargeResult.status === 'send_otp') {
      const promptText =
        chargeResult.displayText ||
        (chargeResult.message?.includes('Voucher')
          ? chargeResult.message
          : 'Please enter the OTP/voucher code sent to your phone (or 0 to cancel):');

      return {
        customMessage: promptText,
        nextMenuKey: 'ENTER_PAYMENT_OTP',
        terminate: false,
        contextUpdates: {
          paymentReference: paymentAttempt.reference,
          waitingForPaymentOtp: true,
        },
      };
    }

    if (chargeResult.status === 'success') {
      return {
        customMessage: `Payment of ${currency} ${amount} received successfully! Thank you for supporting ${ctx.project?.name || 'ZFund'}.`,
        terminate: true,
        contextUpdates: {
          paymentReference: paymentAttempt.reference,
          paymentConfirmed: true,
        },
      };
    }

    if (chargeResult.status === 'failed') {
      return {
        customMessage: chargeResult.displayText || chargeResult.message || 'Payment failed. Please try again.',
        terminate: true,
        contextUpdates: {
          paymentReference: paymentAttempt.reference,
          paymentFailed: true,
        },
      };
    }

    // Default 'pay_offline' -> Direct network prompt
    const offlineMsg =
      chargeResult.displayText ||
      `Payment of ${currency} ${amount} initiated for ${msisdn}. Please approve prompt with your MoMo PIN.`;

    return {
      customMessage: offlineMsg,
      terminate: true,
      contextUpdates: {
        paymentReference: paymentAttempt.reference,
        paymentInitiated: true,
        paymentInitiatedAt: new Date().toISOString(),
      },
    };
  } catch (err: any) {
    return {
      customMessage: err?.message || 'Payment initiation error. Please try again.',
      terminate: true,
    };
  }
});

UssdActionRegistry.register('SUBMIT_PAYMENT_OTP', async (ctx) => {
  const userInput = ctx.userInput.trim();
  const paymentReference = ctx.session.contextData.paymentReference as string;

  if (userInput === '0') {
    return {
      customMessage: 'Payment cancelled.',
      terminate: true,
      contextUpdates: {
        waitingForPaymentOtp: false,
        paymentCancelled: true,
      },
    };
  }

  if (!paymentReference) {
    return {
      customMessage: 'Payment session expired. Please start again.',
      terminate: true,
    };
  }

  try {
    const result = await paymentService.submitUssdPaymentOtp({
      reference: paymentReference,
      otp: userInput,
    });

    if (result.status === 'success') {
      return {
        customMessage: result.displayText || 'Payment verified successfully! Thank you for your contribution.',
        terminate: true,
        contextUpdates: {
          waitingForPaymentOtp: false,
          paymentConfirmed: true,
        },
      };
    }

    if (result.status === 'pay_offline') {
      return {
        customMessage:
          result.displayText ||
          result.message ||
          'OTP verified. Please approve the MoMo prompt on your phone to complete.',
        terminate: true,
        contextUpdates: {
          waitingForPaymentOtp: false,
        },
      };
    }

    // Failed OTP -> let the contributor retry or enter 0 to cancel
    return {
      customMessage: `${result.displayText || result.message || 'Invalid OTP code.'}\nPlease enter valid OTP (or 0 to cancel):`,
      nextMenuKey: 'ENTER_PAYMENT_OTP',
      terminate: false,
    };
  } catch (err: any) {
    return {
      customMessage: `${err?.message || 'Verification error.'}\nPlease enter valid OTP (or 0 to cancel):`,
      nextMenuKey: 'ENTER_PAYMENT_OTP',
      terminate: false,
    };
  }
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
