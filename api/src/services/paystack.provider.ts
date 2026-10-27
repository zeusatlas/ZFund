import axios, { AxiosInstance } from 'axios';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { MoneyUtil } from '../common/utils/decimal';
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

  constructor() {
    this.httpClient = axios.create({
      baseURL: env.PAYSTACK_BASE_URL,
      headers: {
        Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });
  }

  async initializePayment(params: InitializePaymentParams): Promise<InitializePaymentResult> {
    try {
      // Paystack requires amount in pesewas / minor currency units
      const amountInMinor = MoneyUtil.toMinorUnit(params.amount);

      const payload: Record<string, unknown> = {
        reference: params.reference,
        amount: amountInMinor,
        currency: params.currency || 'GHS',
        email: params.email,
        metadata: {
          ...params.metadata,
          phone: params.phone,
        },
      };

      if (params.channel === 'mobile_money') {
        payload.channels = ['mobile_money'];
      }

      if (params.callbackUrl) {
        payload.callback_url = params.callbackUrl;
      }

      const response = await this.httpClient.post('/transaction/initialize', payload);

      if (!response.data || !response.data.status) {
        throw new Error(response.data?.message || 'Paystack initialization failed');
      }

      const data = response.data.data;
      return {
        providerReference: data.reference || params.reference,
        authorizationUrl: data.authorization_url,
        accessCode: data.access_code,
        status: 'pending',
        rawResponse: response.data,
      };
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosErr = err as any;
      logger.error(
        {
          error: axiosErr.response?.data || axiosErr.message,
          reference: params.reference,
        },
        'Paystack initialize transaction failed'
      );
      throw new Error(
        axiosErr.response?.data?.message || axiosErr.message || 'Payment provider communication error'
      );
    }
  }

  async verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
    try {
      const response = await this.httpClient.get(`/transaction/verify/${encodeURIComponent(reference)}`);

      if (!response.data || !response.data.status) {
        throw new Error(response.data?.message || 'Paystack verification failed');
      }

      const data = response.data.data;
      const amountInMajor = MoneyUtil.fromMinorUnit(data.amount);
      const feeInMajor = data.fees ? MoneyUtil.fromMinorUnit(data.fees) : '0.00';

      let normalizedStatus: 'success' | 'failed' | 'abandoned' | 'pending';
      if (data.status === 'success') {
        normalizedStatus = 'success';
      } else if (data.status === 'failed') {
        normalizedStatus = 'failed';
      } else if (data.status === 'abandoned') {
        normalizedStatus = 'abandoned';
      } else {
        normalizedStatus = 'pending';
      }

      return {
        reference: data.reference,
        providerReference: String(data.id || data.reference),
        status: normalizedStatus,
        amount: amountInMajor,
        currency: data.currency || 'GHS',
        fee: feeInMajor,
        channel: data.channel || 'mobile_money',
        gatewayResponse: data.gateway_response || '',
        paidAt: data.paid_at ? new Date(data.paid_at) : undefined,
        rawResponse: response.data,
      };
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosErr = err as any;
      logger.error(
        {
          error: axiosErr.response?.data || axiosErr.message,
          reference,
        },
        'Paystack verify transaction failed'
      );
      throw new Error(
        axiosErr.response?.data?.message || axiosErr.message || 'Payment provider verification failed'
      );
    }
  }

  async initiateRefund(params: InitiateRefundParams): Promise<InitiateRefundResult> {
    try {
      const payload: Record<string, unknown> = {
        transaction: params.transactionReference,
        merchant_note: params.merchantNote,
        customer_note: params.customerNote,
      };

      if (params.amount) {
        payload.amount = MoneyUtil.toMinorUnit(params.amount);
      }
      if (params.currency) {
        payload.currency = params.currency;
      }

      const response = await this.httpClient.post('/refund', payload);

      if (!response.data || !response.data.status) {
        throw new Error(response.data?.message || 'Paystack refund request failed');
      }

      const data = response.data.data;
      const refundedAmount = data.amount ? MoneyUtil.fromMinorUnit(data.amount) : params.amount || '0.00';

      return {
        providerRefundId: String(data.id || data.reference || 'refund_id'),
        status: data.status === 'processed' ? 'success' : 'processing',
        amount: refundedAmount,
        currency: data.currency || params.currency || 'GHS',
        rawResponse: response.data,
      };
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosErr = err as any;
      logger.error(
        {
          error: axiosErr.response?.data || axiosErr.message,
          params,
        },
        'Paystack refund failed'
      );
      throw new Error(
        axiosErr.response?.data?.message || axiosErr.message || 'Payment provider refund request failed'
      );
    }
  }
}

export const paystackProvider = new PaystackProvider();
