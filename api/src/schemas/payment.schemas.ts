import { z } from 'zod';
import { PaymentChannel } from '../database/entities/payment-attempt.entity';

export const initiatePaymentSchema = z
  .object({
    projectId: z.string().uuid('Valid project ID is required'),
    purposeId: z.string().uuid().optional(),
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Amount must be valid decimal (e.g. 50.00)'),
    msisdn: z.string().optional(),
    email: z.string().email().optional(),
    name: z.string().optional(),
    isAnonymous: z.boolean().optional().default(false),
    wordsOfSupport: z.string().max(500).optional(),
    comment: z.string().max(500).optional(),
    channel: z.nativeEnum(PaymentChannel).default(PaymentChannel.MOBILE_MONEY),
    callbackUrl: z.string().url().optional(),
  })
  .refine(
    (data) => {
      if (data.channel === PaymentChannel.CARD) {
        return Boolean(data.email && data.email.length > 0);
      }
      return Boolean(data.msisdn && data.msisdn.trim().length >= 9);
    },
    {
      message: 'Valid email is required for card payments, and phone number is required for mobile money.',
      path: ['email'],
    }
  );

export const verifyPaymentSchema = z.object({
  reference: z.string().min(3),
});

export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
