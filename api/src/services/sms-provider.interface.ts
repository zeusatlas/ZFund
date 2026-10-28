export interface SendSmsParams {
  recipient: string | string[]; // e.g. "233XXXXXXXXX" or ["233XXXXXXXXX"]
  message: string;
  senderId?: string;
  isOtp?: boolean;
  smsType?: 'otp' | 'normal';
  skipDeliveryCheck?: boolean;
}

export interface SendSmsResult {
  success: boolean;
  provider: string;
  providerMessageId?: string;
  status: 'sent' | 'delivered' | 'failed' | string;
  creditUsed?: number;
  creditLeft?: number;
  totalSent?: number;
  sender?: string;
  errorMessage?: string;
  rawResponse?: Record<string, unknown>;
}

export interface ISmsProvider {
  readonly code: string;
  sendSms(params: SendSmsParams): Promise<SendSmsResult>;
  sendOTP?(
    recipient: string | string[],
    message: string,
    options?: { senderId?: string; skipDeliveryCheck?: boolean }
  ): Promise<SendSmsResult>;
  sendMessage?(
    recipient: string | string[],
    message: string,
    options?: { senderId?: string; skipDeliveryCheck?: boolean }
  ): Promise<SendSmsResult>;
}
