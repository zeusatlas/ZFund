import { z } from 'zod';
import { WithdrawalMethod, WithdrawalStatus } from '../database/entities/withdrawal-request.entity';

export const createWithdrawalSchema = z
  .object({
    projectId: z.string().optional(),
    campaignId: z.string().optional(),
    amount: z
      .union([z.string(), z.number()])
      .transform((val) => (typeof val === 'number' ? val.toFixed(2) : String(val).trim()))
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
        message: 'Enter an amount with up to two decimal places',
      }),
    method: z
      .union([z.nativeEnum(WithdrawalMethod), z.enum(['Mobile money', 'Bank transfer'])])
      .transform((val) =>
        val === 'Mobile money'
          ? WithdrawalMethod.MOBILE_MONEY
          : val === 'Bank transfer'
            ? WithdrawalMethod.BANK_TRANSFER
            : val
      ),
    recipientName: z.string().trim().min(3, 'Enter the recipient name').max(100).optional(),
    recipient: z.string().trim().min(3, 'Enter the recipient name').max(100).optional(),
    institution: z.string().trim().min(2, 'Enter the network or bank name').max(100),
    accountNumber: z.string().trim().min(1, 'Enter the destination number').optional(),
    account: z.string().trim().min(1, 'Enter the destination number').optional(),
    purpose: z
      .string()
      .trim()
      .max(500)
      .optional()
      .transform((val) => (val && val.length > 0 ? val : 'Standard withdrawal request')),
  })
  .transform((data) => ({
    projectId: data.projectId || data.campaignId,
    amount: data.amount,
    method: data.method,
    recipientName: data.recipientName || data.recipient || '',
    institution: data.institution,
    accountNumber: data.accountNumber || data.account || '',
    purpose: data.purpose,
  }))
  .superRefine((data, ctx) => {
    if (!data.recipientName || data.recipientName.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['recipientName'],
        message: 'Enter the recipient name',
      });
    }
    const number = data.accountNumber.replace(/[\s-]/g, '');
    const valid =
      data.method === WithdrawalMethod.MOBILE_MONEY
        ? /^(0\d{9}|\+233\d{9})$/.test(number)
        : /^\d{6,24}$/.test(number);
    if (!valid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['accountNumber'],
        message:
          data.method === WithdrawalMethod.MOBILE_MONEY
            ? 'Enter a 10-digit Ghana mobile number, or +233 followed by 9 digits'
            : 'Enter a bank account number containing 6 to 24 digits',
      });
    }
  });

export const updateWithdrawalSchema = z
  .object({
    amount: z
      .union([z.string(), z.number()])
      .transform((val) => (typeof val === 'number' ? val.toFixed(2) : String(val).trim()))
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
        message: 'Enter an amount with up to two decimal places',
      })
      .optional(),
    method: z
      .union([z.nativeEnum(WithdrawalMethod), z.enum(['Mobile money', 'Bank transfer'])])
      .transform((val) =>
        val === 'Mobile money'
          ? WithdrawalMethod.MOBILE_MONEY
          : val === 'Bank transfer'
            ? WithdrawalMethod.BANK_TRANSFER
            : val
      )
      .optional(),
    recipientName: z.string().trim().min(3).max(100).optional(),
    recipient: z.string().trim().min(3).max(100).optional(),
    institution: z.string().trim().min(2).max(100).optional(),
    accountNumber: z.string().trim().min(1).optional(),
    account: z.string().trim().min(1).optional(),
    purpose: z.string().trim().min(10).max(500).optional(),
  })
  .transform((data) => ({
    amount: data.amount,
    method: data.method,
    recipientName: data.recipientName || data.recipient,
    institution: data.institution,
    accountNumber: data.accountNumber || data.account,
    purpose: data.purpose,
  }));

export const updateWithdrawalStatusSchema = z.object({
  status: z.nativeEnum(WithdrawalStatus).refine((s) => s !== WithdrawalStatus.PENDING, {
    message: 'A request cannot be moved back to pending',
  }),
  note: z.string().trim().max(500).optional(),
});

export type CreateWithdrawalInput = z.infer<typeof createWithdrawalSchema>;
export type UpdateWithdrawalInput = z.infer<typeof updateWithdrawalSchema>;
export type UpdateWithdrawalStatusInput = z.infer<typeof updateWithdrawalStatusSchema>;
