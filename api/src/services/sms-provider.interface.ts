export interface SendSmsParams {
  recipient: string; // e.g. "233XXXXXXXXX"
  message: string;
  senderId?: string;
}

export interface SendSmsResult {
  success: boolean;
  provider: string;
  providerMessageId?: string;
  status: 'sent' | 'delivered' | 'failed';
  errorMessage?: string;
  rawResponse?: Record<string, unknown>;
}

export interface ISmsProvider {
  readonly code: string;
  sendSms(params: SendSmsParams): Promise<SendSmsResult>;
}
