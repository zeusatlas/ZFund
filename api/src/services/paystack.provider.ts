import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { detectGhanaNetwork, normalizeGhanaPhone } from '../common/utils/phone';
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

/**
 * Paystack permanent payment provider for USSD mobile money and card transactions.
 */
export class PaystackProvider implements IPaymentProvider {
  readonly code = 'PAYSTACK';
  public httpClient: AxiosInstance;
  private readonly secretKey: string;
  private simulateOverride?: boolean;

  constructor() {
    this.secretKey = env.PAYSTACK_SECRET_KEY;
    this.httpClient = axios.create({
      baseURL: env.PAYSTACK_API_URL.replace(/\/+$/, ''),
      timeout: 25000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  setSimulated(simulated: boolean): void {
    this.simulateOverride = simulated;
  }

  get isSimulated(): boolean {
    if (this.simulateOverride !== undefined) {
      return this.simulateOverride;
    }
    return !this.secretKey || this.secretKey.includes('mock');
  }

  private get authHeaders() {
    return { Authorization: `Bearer ${this.secretKey}` };
  }

  /** Paystack Ghana mobile money provider codes: mtn, vod (Telecel), atl (AT). */
  static mobileMoneyProvider(phone: string): 'mtn' | 'vod' | 'atl' {
    return detectGhanaNetwork(phone);
  }

  /** Web checkout initialization */
  async initializePayment(params: InitializePaymentParams): Promise<InitializePaymentResult> {
    if (this.isSimulated) {
      return {
        providerReference: params.reference,
        authorizationUrl: `https://checkout.paystack.com/${params.reference}`,
        status: 'pending',
      };
    }

    const response = await this.httpClient.post(
      '/transaction/initialize',
      {
        email: params.email,
        amount: Math.round(parseFloat(params.amount) * 100),
        currency: params.currency || 'GHS',
        reference: params.reference,
        callback_url: params.callbackUrl,
        metadata: params.metadata,
      },
      { headers: this.authHeaders }
    );

    const data = response.data?.data || {};
    return {
      providerReference: String(data.id || params.reference),
      authorizationUrl: data.authorization_url,
      status: 'pending',
      rawResponse: response.data,
    };
  }

  /**
   * Direct mobile money charge (POST /charge).
   * Paystack statuses: pay_offline, send_otp, pending, success, failed, timeout.
   */
  async chargeMobileMoney(params: ChargeMobileMoneyParams): Promise<ChargeMobileMoneyResult> {
    const phone = normalizeGhanaPhone(params.phone);
    const provider = params.provider || PaystackProvider.mobileMoneyProvider(phone);

    if (this.isSimulated) {
      logger.info({ reference: params.reference, phone }, '[Simulated] Paystack mobile money charge');
      return {
        reference: params.reference,
        status: 'pay_offline',
        requiresOtp: false,
        message: 'Charge initiated (simulated)',
        displayText: 'Approve the prompt on your phone.',
        rawResponse: { status: true, data: { status: 'pay_offline', reference: params.reference } },
      };
    }

    try {
      const response = await this.httpClient.post(
        '/charge',
        {
          email: params.email,
          amount: Math.round(parseFloat(params.amount) * 100),
          currency: params.currency || 'GHS',
          reference: params.reference,
          mobile_money: { phone, provider },
          metadata: params.metadata,
        },
        { headers: this.authHeaders }
      );

      const body = response.data;
      const data = body?.data || {};
      const status = String(data.status || '').toLowerCase();
      logger.info(
        { reference: params.reference, paystackStatus: status, display: data.display_text, message: body?.message },
        'Paystack mobile money charge response'
      );

      const display = data.display_text || body?.message;
      if (status === 'success') {
        return {
          reference: data.reference || params.reference,
          status: 'success',
          requiresOtp: false,
          message: display,
          displayText: display,
          rawResponse: body,
        };
      }
      if (status === 'send_otp') {
        return {
          reference: data.reference || params.reference,
          status: 'send_otp',
          requiresOtp: true,
          message: display,
          displayText: display,
          rawResponse: body,
        };
      }
      if (status === 'failed') {
        return {
          reference: data.reference || params.reference,
          status: 'failed',
          requiresOtp: false,
          message: data.gateway_response || display,
          displayText: data.gateway_response || display,
          rawResponse: body,
        };
      }
      if (status === 'timeout') {
        return {
          reference: data.reference || params.reference,
          status: 'timeout',
          requiresOtp: false,
          message: display || 'Payment request timed out.',
          displayText: display || 'Payment request timed out. Please check your phone or dial again to check status.',
          rawResponse: body,
        };
      }

      // pay_offline / pending / other
      return {
        reference: data.reference || params.reference,
        status: status === 'pay_offline' ? 'pay_offline' : 'pending',
        requiresOtp: false,
        message: display,
        displayText: display,
        gatewayResponse: data.gateway_response,
        rawResponse: body,
      };
    } catch (err: any) {
      const isTimeout =
        err?.code === 'ECONNABORTED' ||
        err?.message?.toLowerCase().includes('timeout') ||
        err?.response?.status === 408 ||
        err?.response?.status === 504;

      if (isTimeout) {
        logger.warn({ reference: params.reference, phone }, 'Paystack charge request timed out');
        return {
          reference: params.reference,
          status: 'timeout',
          requiresOtp: false,
          message: 'Payment request timed out. Status will be verified.',
          displayText: 'Payment request timed out. Please check your phone or dial again to check status.',
        };
      }

      const msg = err?.response?.data?.message || err?.message || 'Paystack mobile money charge failed';
      logger.error({ error: err?.response?.data || msg, reference: params.reference, phone }, 'Paystack charge error');
      return {
        reference: params.reference,
        status: 'failed',
        requiresOtp: false,
        message: msg,
        displayText: msg,
        rawResponse: err?.response?.data,
      };
    }
  }

  /**
   * Submits OTP to Paystack: POST https://api.paystack.co/charge/submit_otp
   * Payload: { "otp": "...", "reference": "..." }
   * Note: OTP is never logged.
   */
  async submitOtp(params: SubmitOtpParams): Promise<SubmitOtpResult> {
    logger.info({ reference: params.reference }, 'Submitting OTP to Paystack');

    if (this.isSimulated) {
      return { reference: params.reference, status: 'success', message: 'Payment confirmed (simulated).' };
    }

    try {
      const response = await this.httpClient.post(
        '/charge/submit_otp',
        { otp: params.otp, reference: params.reference },
        { headers: this.authHeaders }
      );
      const data = response.data?.data || {};
      const status = String(data.status || '').toLowerCase();
      const message = data.display_text || response.data?.message || '';

      if (status === 'success') {
        return { reference: params.reference, status: 'success', message, rawResponse: response.data };
      }
      if (status === 'failed') {
        return {
          reference: params.reference,
          status: 'failed',
          message: data.gateway_response || message,
          rawResponse: response.data,
        };
      }
      if (status === 'send_otp') {
        return { reference: params.reference, status: 'send_otp', message, displayText: message, rawResponse: response.data };
      }

      return {
        reference: params.reference,
        status: status === 'pay_offline' ? 'pay_offline' : 'pending',
        message,
        displayText: message,
        rawResponse: response.data,
      };
    } catch (err: any) {
      const isTimeout = err?.code === 'ECONNABORTED' || err?.message?.toLowerCase().includes('timeout');
      if (isTimeout) {
        return { reference: params.reference, status: 'pending', message: 'OTP verification timed out. Please check status.' };
      }
      const msg = err?.response?.data?.message || err?.message || 'OTP submission failed';
      logger.warn({ error: msg, reference: params.reference }, 'Paystack submitOtp error response');
      return { reference: params.reference, status: 'failed', message: msg, rawResponse: err?.response?.data };
    }
  }

  /**
   * Verifies transaction with Paystack: GET /transaction/verify/:reference
   */
  async verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
    if (this.isSimulated) {
      return {
        reference,
        providerReference: reference,
        status: 'pending',
        amount: '0.00',
        currency: 'GHS',
        fee: '0.00',
        channel: 'mobile_money',
        gatewayResponse: 'Simulated',
      };
    }

    try {
      const response = await this.httpClient.get(`/transaction/verify/${encodeURIComponent(reference)}`, {
        headers: this.authHeaders,
      });
      const data = response.data?.data;
      const status = data?.status;
      return {
        reference: data?.reference || reference,
        providerReference: String(data?.id || data?.reference || reference),
        status:
          status === 'success'
            ? 'success'
            : status === 'failed'
            ? 'failed'
            : status === 'abandoned'
            ? 'abandoned'
            : 'pending',
        amount: ((data?.amount || 0) / 100).toFixed(2),
        currency: data?.currency || 'GHS',
        fee: ((data?.fees || 0) / 100).toFixed(2),
        channel: data?.channel || 'mobile_money',
        gatewayResponse: data?.gateway_response || '',
        paidAt: data?.paid_at ? new Date(data.paid_at) : undefined,
        rawResponse: data ? { status: true, data } : undefined,
      };
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Paystack verification failed';
      logger.error({ error: err?.response?.data || msg, reference }, 'Paystack verify error');
      throw new Error(msg);
    }
  }

  async initiateRefund(params: InitiateRefundParams): Promise<InitiateRefundResult> {
    const payload: Record<string, unknown> = {
      transaction: params.transactionReference,
      merchant_note: params.merchantNote,
      customer_note: params.customerNote,
    };
    if (params.amount) payload.amount = Math.round(parseFloat(params.amount) * 100);
    const response = await this.httpClient.post('/refund', payload, { headers: this.authHeaders });
    const data = response.data?.data;
    return {
      providerRefundId: String(data?.id || ''),
      status: data?.status === 'processed' ? 'success' : 'pending',
      amount: ((data?.amount || 0) / 100).toFixed(2),
      currency: data?.currency || 'GHS',
      rawResponse: data,
    };
  }

  /** Paystack signs the raw webhook body with HMAC-SHA512 using the secret key (x-paystack-signature). */
  verifyWebhookSignature(rawBody: string | Buffer, signature: string): boolean {
    if (this.isSimulated) return true;
    if (!signature || !this.secretKey) return false;
    const computed = crypto.createHmac('sha512', this.secretKey).update(rawBody).digest('hex');
    const a = Buffer.from(computed);
    const b = Buffer.from(signature);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }
}

export const paystackProvider = new PaystackProvider();
