import { z } from 'zod';

export const CONTACT_TOPICS = [
  'Hosting a campaign',
  'Donations & USSD',
  'Withdrawals & payouts',
  'Account & login',
  'Partnerships',
  'Something else',
] as const;

export const submitContactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(100),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address').max(160),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[+\d\s()-]*$/, 'Phone number may only contain digits, spaces, + ( ) -')
    .optional()
    .transform((v) => (v ? v : undefined)),
  topic: z.enum(CONTACT_TOPICS).default('Something else'),
  message: z.string().trim().min(10, 'Please tell us a little more (at least 10 characters)').max(4000),
  /** Honeypot: real visitors never see or fill this field. */
  website: z.string().optional(),
});

export type SubmitContactInput = z.infer<typeof submitContactSchema>;
