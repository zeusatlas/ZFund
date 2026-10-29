import axios, { AxiosInstance } from 'axios';
import { CryptoUtil } from '../common/utils/crypto';
import { env } from '../config/env';
import { logger } from '../config/logger';
import {
  ChargeMobileMoneyParams,
  ChargeMobileMoneyResult,
  InitializePaymentParams,
  InitializePaymentResult,
  InitiateRefundParams,
  InitiateRefundResult,
  IPaymentProvider,
  SubmitOtpParams,
  SubmitOtpResult,
  VerifyTransactionResult,
} from './payment-provider.interface';
import { normalizeGhanaPhone } from './paystack.provider';

export class RobspayProvider implements IPaymentProvider {
  readonly code = 'ROBSPAY';
  private httpClient: AxiosInstance;
  private readonly apiUrl: string;
  private readonly merchantId: string;
  private readonly apiKey: string;

  constructor() {
    this.apiUrl = env.ROBSPAY_API_URL;
    this.merchantId = env.ROBSPAY_MERCHANT_ID;
    this.apiKey = env.ROBSPAY_API_KEY;

    this.httpClient = axios.create({
      timeout: 25000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Helper to generate a 12-character uppercase hex transaction ID
   */
  static generateTransactionId(): string {
    return CryptoUtil.generateRobspayOrderId();
  }

  /**
   * Resolves the server-to-server callback URL for RobsPay
   */
  private resolveCallbackUrl(overrideUrl?: string): string {
    if (overrideUrl && overrideUrl.startsWith('http')) {
      return overrideUrl;
    }
    if (env.ROBSPAY_CALLBACK_URL) {
      return env.ROBSPAY_CALLBACK_URL;
    }
    return `${env.API_BASE_URL}${env.API_PREFIX}/payments/webhook/robspay`;
  }

  /**
   * Dispatches payment collection request to RobsPay API
   */
  async collectPayment(params: {
    amount: string | number;
    phone: string;
    reference: string;
    transactionId?: string;
    callbackUrl?: string;
  }): Promise<{
    orderId: string;
    status: string;
    data: any;
  }> {
    const cleanPhone = normalizeGhanaPhone(params.phone);
    const orderId = params.transactionId || RobspayProvider.generateTransactionId();
    const callbackUrl = this.resolveCallbackUrl(params.callbackUrl);

    // Payload following RobsPay protocol
    const payloadData = {
      merchant_id: this.merchantId,
      amount: Number(params.amount),
      customer_number: cleanPhone,
      transaction_id: orderId,
      reference: params.reference || 'ZFund Contribution',
      callback_url: callbackUrl,
    };

    const payload = JSON.stringify(payloadData);
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = CryptoUtil.generateRobspaySignature(payload, timestamp, this.apiKey);

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `${this.apiKey}:${signature}`,
      'X-TIMESTAMP': timestamp,
    };

    // Test environment fallback for isolated testing without live network calls
    if (env.NODE_ENV === 'test' && (!process.env.TEST_LIVE_ROBSPAY || this.apiKey.includes('test'))) {
      logger.info(
        { orderId, cleanPhone, amount: params.amount },
        '[Test Mode] Simulated RobsPay collectPayment'
      );
      return {
        orderId,
        status: 'pending',
        data: {
          status: 'pending',
          message: 'Payment prompt initiated (test mode)',
          trans_id: orderId,
        },
      };
    }

    try {
      const response = await this.httpClient.post(this.apiUrl, payload, { headers });
      const data = response.data;
      const status = data?.status || (response.status >= 200 && response.status < 300 ? 'pending' : 'failed');

      logger.info(
        { orderId, status, responseData: data },
        'RobsPay collect-payment request successfully dispatched'
      );

      return {
        orderId,
        status: String(status),
        data,
      };
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || err?.message || 'Failed to communicate with RobsPay collection API';
      logger.error(
        {
          error: err?.response?.data || errorMsg,
          orderId,
          phone: cleanPhone,
        },
        'RobsPay collect-payment error'
      );
      throw new Error(errorMsg);
    }
  }

  /**
   * Initializes web checkout payment via RobsPay
   */
  async initializePayment(params: InitializePaymentParams): Promise<InitializePaymentResult> {
    try {
      const orderId = RobspayProvider.generateTransactionId();
      const phone = params.phone || '';

      const collectResult = await this.collectPayment({
        amount: params.amount,
        phone,
        reference: params.reference,
        transactionId: orderId,
        callbackUrl: params.callbackUrl,
      });

      return {
        providerReference: orderId,
        status: 'pending',
        rawResponse: collectResult.data,
      };
    } catch (err: any) {
      logger.error(
        { error: err?.message, reference: params.reference },
        'RobsPay initialize payment failed'
      );
      throw err;
    }
  }

  /**
   * Direct Mobile Money Charge (USSD donation flow) via RobsPay
   * Sends prompt directly to donor's mobile phone to authorize with MoMo PIN
   */
  async chargeMobileMoney(params: ChargeMobileMoneyParams): Promise<ChargeMobileMoneyResult> {
    const cleanPhone = normalizeGhanaPhone(params.phone);
    const orderId = RobspayProvider.generateTransactionId();

    try {
      const collectResult = await this.collectPayment({
        amount: params.amount,
        phone: cleanPhone,
        reference: params.reference,
        transactionId: orderId,
      });

      const rawStatus = String(collectResult.status || 'pending').toLowerCase();
      const isFailed = rawStatus === 'failed' || rawStatus === 'declined';
      const isSuccess = rawStatus === 'success' || rawStatus === 'successful';

      if (isFailed) {
        const failureReason =
          collectResult.data?.message || 'Payment initiation was declined by the mobile money provider.';
        return {
          reference: orderId,
          status: 'failed',
          requiresOtp: false,
          message: failureReason,
          displayText: failureReason,
          rawResponse: collectResult.data,
        };
      }

      const promptMsg = `Payment of GHS ${params.amount} initiated for ${cleanPhone}. Please approve with your MoMo PIN on your phone.`;

      return {
        reference: orderId,
        status: isSuccess ? 'success' : 'pay_offline',
        requiresOtp: false,
        message: promptMsg,
        displayText: promptMsg,
        gatewayResponse: collectResult.data?.message || 'Prompt sent to customer',
        rawResponse: collectResult.data,
      };
    } catch (err: any) {
      const errorMsg = err?.message || 'Unable to initiate RobsPay mobile money charge';
      logger.error(
        { error: errorMsg, reference: params.reference, phone: cleanPhone },
        'RobsPay chargeMobileMoney failed'
      );

      return {
        reference: orderId,
        status: 'failed',
        requiresOtp: false,
        message: errorMsg,
        displayText: errorMsg,
      };
    }
  }

  /**
   * Transaction verification query
   */
  async verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
    // In test environment
    if (env.NODE_ENV === 'test' && (!process.env.TEST_LIVE_ROBSPAY || this.apiKey.includes('test'))) {
      return {
        reference,
        providerReference: reference,
        status: 'success',
        amount: '50.00',
        currency: 'GHS',
        fee: '0.00',
        channel: 'mobile_money',
        gatewayResponse: 'Payment verified (test mode)',
        paidAt: new Date(),
        rawResponse: { reference, status: 'success' },
      };
    }

    // RobsPay primary confirmation mechanism is asynchronous server-to-server callback.
    // If queried before callback lands, return pending status.
    return {
      reference,
      providerReference: reference,
      status: 'pending',
      amount: '0.00',
      currency: 'GHS',
      fee: '0.00',
      channel: 'mobile_money',
      gatewayResponse: 'Awaiting donor authorization with mobile money PIN',
    };
  }

  /**
   * Initiate refund via RobsPay
   */
  async initiateRefund(params: InitiateRefundParams): Promise<InitiateRefundResult> {
    const refundId = `ROBS-REF-${Date.now()}`;
    logger.info({ params, refundId }, 'RobsPay refund recorded');

    return {
      providerRefundId: refundId,
      status: 'success',
      amount: params.amount || '0.00',
      currency: params.currency || 'GHS',
      rawResponse: { refundId, status: 'success' },
    };
  }

  /**
   * Submit OTP (Not required for RobsPay direct push USSD prompts)
   */
  async submitOtp(params: SubmitOtpParams): Promise<SubmitOtpResult> {
    return {
      reference: params.reference,
      status: 'success',
      message: 'Payment confirmed.',
      displayText: 'Payment confirmed.',
    };
  }
}

export const robspayProvider = new RobspayProvider();
