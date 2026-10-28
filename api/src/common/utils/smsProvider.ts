import {
  calculateSMSCredits,
  checkDeliveryStatus,
  isUnicode,
  sendMessage,
  sendLowCreditAlert,
  sendOTP,
} from '../../services/mnotify-sms.adapter';
import { SendSmsResult } from '../../services/sms-provider.interface';

/**
 * ZDesk compatibility utility functions for SMS and OTP dispatch.
 */
export async function sendSMS(
  recipient: string | string[],
  message: string,
  options?: { senderId?: string; skipDeliveryCheck?: boolean }
): Promise<SendSmsResult> {
  return sendMessage(recipient, message, options);
}

export {
  sendMessage,
  sendOTP,
  calculateSMSCredits,
  isUnicode,
  checkDeliveryStatus,
  sendLowCreditAlert,
};

