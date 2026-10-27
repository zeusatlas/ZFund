import { z } from 'zod';
import { RefundStatus } from '../database/entities/refund.entity';

export const createRefundRequestSchema = z.object({
  contributionId: z.string().uuid(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Valid decimal amount is required'),
  reason: z.string().min(5, 'Detailed reason for refund is required').trim(),
});

export const reviewRefundSchema = z.object({
  status: z.enum([RefundStatus.APPROVED, RefundStatus.REJECTED]),
  approvalNotes: z.string().optional(),
});

export type CreateRefundInput = z.infer<typeof createRefundRequestSchema>;
export type ReviewRefundInput = z.infer<typeof reviewRefundSchema>;
