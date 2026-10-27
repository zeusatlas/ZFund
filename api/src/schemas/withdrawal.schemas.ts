import { z } from 'zod';
import { WithdrawalMethod, WithdrawalStatus } from '../database/entities/withdrawal-request.entity';

export const createWithdrawalSchema = z
  .object({
    projectId: z.string().uuid().optional(),
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter an amount with up to two decimal places'),
    method: z.nativeEnum(WithdrawalMethod),
    recipientName: z.string().trim().min(3, 'Enter the recipient name').max(100),
    institution: z.string().trim().min(2, 'Enter the network or bank name').max(100),
    accountNumber: z.string().trim().min(1, 'Enter the destination number'),
    purpose: z.string().trim().min(10, 'Describe how the funds will be used').max(500),
  })
  .superRefine((data, ctx) => {
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

export const updateWithdrawalStatusSchema = z.object({
  status: z.nativeEnum(WithdrawalStatus).refine((s) => s !== WithdrawalStatus.PENDING, {
    message: 'A request cannot be moved back to pending',
  }),
  note: z.string().trim().max(500).optional(),
});

export type CreateWithdrawalInput = z.infer<typeof createWithdrawalSchema>;
export type UpdateWithdrawalStatusInput = z.infer<typeof updateWithdrawalStatusSchema>;
