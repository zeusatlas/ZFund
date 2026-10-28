export interface InitializePaymentParams {
  reference: string;
  amount: string; // Major currency unit (e.g. "50.00")
  currency: string;
  email: string;
  phone?: string;
  channel?: 'mobile_money' | 'card';
  mobileMoneyProvider?: string; // e.g. 'mtn', 'vod', 'tgo'
  metadata?: Record<string, unknown>;
  callbackUrl?: string;
}

export interface InitializePaymentResult {
  providerReference: string;
  authorizationUrl?: string;
  accessCode?: string;
  status: string;
  rawResponse?: Record<string, unknown>;
}

export interface VerifyTransactionResult {
  reference: string;
  providerReference?: string;
  status: 'success' | 'failed' | 'abandoned' | 'pending';
  amount: string; // Major currency unit
  currency: string;
  fee: string;
  channel: string;
  gatewayResponse: string;
  paidAt?: Date;
  rawResponse?: Record<string, unknown>;
}

export interface InitiateRefundParams {
  transactionReference: string;
  amount?: string; // Major currency unit (if partial refund)
  currency?: string;
  merchantNote?: string;
  customerNote?: string;
}

export interface InitiateRefundResult {
  providerRefundId: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  amount: string;
  currency: string;
  rawResponse?: Record<string, unknown>;
}

export interface ChargeMobileMoneyParams {
  reference: string;
  amount: string; // Major currency unit (e.g. "50.00")
  currency: string;
  email: string;
  phone: string;
  provider?: 'mtn' | 'vod' | 'tgo' | 'atl' | string;
  metadata?: Record<string, unknown>;
}

export interface ChargeMobileMoneyResult {
  reference: string;
  status: 'success' | 'send_otp' | 'pay_offline' | 'pending' | 'failed';
  requiresOtp: boolean;
  message: string;
  displayText?: string;
  gatewayResponse?: string;
  rawResponse?: Record<string, unknown>;
}

export interface SubmitOtpParams {
  reference: string;
  otp: string;
}

export interface SubmitOtpResult {
  reference: string;
  status: 'success' | 'pay_offline' | 'pending' | 'failed';
  message: string;
  displayText?: string;
  rawResponse?: Record<string, unknown>;
}

export interface IPaymentProvider {
  readonly code: string;
  initializePayment(params: InitializePaymentParams): Promise<InitializePaymentResult>;
  verifyTransaction(reference: string): Promise<VerifyTransactionResult>;
  initiateRefund(params: InitiateRefundParams): Promise<InitiateRefundResult>;
  chargeMobileMoney?(params: ChargeMobileMoneyParams): Promise<ChargeMobileMoneyResult>;
  submitOtp?(params: SubmitOtpParams): Promise<SubmitOtpResult>;
}
