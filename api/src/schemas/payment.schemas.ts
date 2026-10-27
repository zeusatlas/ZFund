import { z } from 'zod';
import { PaymentChannel } from '../database/entities/payment-attempt.entity';

export const initiatePaymentSchema = z.object({
  projectId: z.string().uuid('Valid project ID is required'),
  purposeId: z.string().uuid().optional(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Amount must be valid decimal (e.g. 50.00)'),
  msisdn: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email().optional(),
  name: z.string().optional(),
  channel: z.nativeEnum(PaymentChannel).default(PaymentChannel.MOBILE_MONEY),
  callbackUrl: z.string().url().optional(),
});

export const verifyPaymentSchema = z.object({
  reference: z.string().min(3),
});

export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
