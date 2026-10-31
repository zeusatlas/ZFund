import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';
import { env } from '../config/env';
import { logger } from '../config/logger';
import {
  InitializePaymentParams,
  InitializePaymentResult,
  InitiateRefundParams,
  InitiateRefundResult,
  IPaymentProvider,
  VerifyTransactionResult,
} from './payment-provider.interface';

export class PaystackProvider implements IPaymentProvider {
  readonly code = 'PAYSTACK';
  private httpClient: AxiosInstance;
  private readonly apiUrl: string;
  private readonly secretKey: string;

  constructor() {
    this.apiUrl = env.PAYSTACK_API_URL.replace(/\/+$/, '');
    this.secretKey = env.PAYSTACK_SECRET_KEY;

    this.httpClient = axios.create({
      baseURL: this.apiUrl,
      timeout: 25000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Initializes a card payment with Paystack checkout (for international and card donors)
   */
  async initializePayment(params: InitializePaymentParams): Promise<InitializePaymentResult> {
    const amountInSubunits = Math.round(parseFloat(params.amount) * 100);
    const callbackUrl =
      params.callbackUrl ||
      env.PAYSTACK_CALLBACK_URL ||
      `${env.FRONTEND_URL}/payment/callback`;

    const payload = {
      reference: params.reference,
      amount: amountInSubunits,
      currency: params.currency || 'GHS',
      email: params.email,
      callback_url: callbackUrl,
      channels: ['card', 'apple_pay'],
      metadata: {
        ...(params.metadata || {}),
        phone: params.phone,
        custom_fields: [
          ...(params.phone
            ? [{ display_name: 'Donor Phone', variable_name: 'donor_phone', value: params.phone }]
            : []),
        ],
      },
    };

    // Fallback in test environment or when live network is unavailable
    if (env.NODE_ENV === 'test' || !this.secretKey || this.secretKey.includes('mock')) {
      logger.info({ reference: params.reference, email: params.email }, 'Mock Paystack initializePayment');
      return {
        providerReference: params.reference,
        authorizationUrl: `https://checkout.paystack.com/mock-auth-${params.reference}`,
        accessCode: `mock-access-${params.reference}`,
        status: 'pending',
        rawResponse: { status: true, message: 'Mock initialized' },
      };
    }

    try {
      const response = await this.httpClient.post('/transaction/initialize', payload, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      });

      const data = response.data?.data;
      logger.info(
        { reference: params.reference, accessCode: data?.access_code },
        'Paystack checkout transaction initialized'
      );

      return {
        providerReference: data?.reference || params.reference,
        authorizationUrl: data?.authorization_url,
        accessCode: data?.access_code,
        status: 'pending',
        rawResponse: response.data,
      };
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || 'Paystack payment initialization failed';
      logger.error(
        { error: err?.response?.data || errMsg, reference: params.reference },
        'Paystack initialize payment error'
      );
      throw new Error(errMsg);
    }
  }

  /**
   * Verifies transaction status with Paystack
   */
  async verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
    if (env.NODE_ENV === 'test' || !this.secretKey || this.secretKey.includes('mock')) {
      return {
        reference,
        providerReference: reference,
        status: 'success',
        amount: '50.00',
        currency: 'GHS',
        fee: '0.98',
        channel: 'card',
        gatewayResponse: 'Approved',
        paidAt: new Date(),
        rawResponse: { status: 'success' },
      };
    }

    try {
      const response = await this.httpClient.get(
        `/transaction/verify/${encodeURIComponent(reference)}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        }
      );

      const data = response.data?.data;
      const isSuccess = data?.status === 'success';

      return {
        reference: data?.reference || reference,
        providerReference: String(data?.id || data?.reference),
        status: isSuccess ? 'success' : data?.status === 'failed' ? 'failed' : 'pending',
        amount: ((data?.amount || 0) / 100).toFixed(2),
        currency: data?.currency || 'GHS',
        fee: ((data?.fees || 0) / 100).toFixed(2),
        channel: data?.channel || 'card',
        gatewayResponse: data?.gateway_response || '',
        paidAt: data?.paid_at ? new Date(data.paid_at) : undefined,
        rawResponse: data,
      };
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || 'Paystack verification failed';
      logger.error({ error: err?.response?.data || errMsg, reference }, 'Paystack verification error');
      throw new Error(errMsg);
    }
  }

  /**
   * Initiates refund on Paystack
   */
  async initiateRefund(params: InitiateRefundParams): Promise<InitiateRefundResult> {
    try {
      const payload: Record<string, unknown> = {
        transaction: params.transactionReference,
        merchant_note: params.merchantNote,
        customer_note: params.customerNote,
      };
      if (params.amount) {
        payload.amount = Math.round(parseFloat(params.amount) * 100);
      }

      const response = await this.httpClient.post('/refund', payload, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      });

      const data = response.data?.data;
      return {
        providerRefundId: String(data?.id || ''),
        status: data?.status === 'processed' ? 'success' : 'pending',
        amount: ((data?.amount || 0) / 100).toFixed(2),
        currency: data?.currency || 'GHS',
        rawResponse: data,
      };
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || 'Paystack refund request failed';
      logger.error({ error: err?.response?.data || errMsg, reference: params.transactionReference }, 'Paystack refund error');
      throw new Error(errMsg);
    }
  }

  /**
   * Verifies Paystack HMAC SHA512 webhook signature
   */
  verifyWebhookSignature(rawBody: string | Buffer, signature: string): boolean {
    if (!signature || !this.secretKey) return false;
    const computed = crypto
      .createHmac('sha512', this.secretKey)
      .update(rawBody)
      .digest('hex');
    return computed === signature;
  }
}

export const paystackProvider = new PaystackProvider();
