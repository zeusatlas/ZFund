import { z } from 'zod';

export const userSettingsSchema = z.object({
  preferredPayout: z.enum(['Mobile money', 'Bank transfer']).default('Mobile money'),
  defaultInstitution: z.string().trim().max(100).default('MTN Mobile Money'),
  defaultBranch: z.string().trim().max(100).optional().default(''),
  defaultRecipient: z.string().trim().max(100).default(''),
  defaultAccount: z.string().trim().max(50).default(''),
  contributionAlerts: z.boolean().default(true),
  withdrawalUpdates: z.boolean().default(true),
  campaignDigest: z.boolean().default(false),
});

export const updateUserSettingsSchema = userSettingsSchema.partial();

export type UserSettingsInput = z.infer<typeof userSettingsSchema>;
export type UpdateUserSettingsInput = z.infer<typeof updateUserSettingsSchema>;

