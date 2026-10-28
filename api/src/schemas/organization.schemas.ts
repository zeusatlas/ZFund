import { z } from 'zod';
import { OrgMemberRole } from '../database/entities/organization-member.entity';
import { OrgVerificationStatus } from '../database/entities/organization.entity';

export const createOrganizationSchema = z.object({
  name: z.string().min(2, 'Organization name is required').trim(),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase alphanumeric characters and hyphens')
    .optional(),
  description: z.string().optional(),
  registrationNumber: z.string().optional(),
  taxNumber: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

export const verifyOrganizationSchema = z.object({
  status: z.nativeEnum(OrgVerificationStatus),
});

export const addMemberSchema = z.object({
  userId: z.string().uuid(),
  role: z.nativeEnum(OrgMemberRole).optional().default(OrgMemberRole.MEMBER),
});

export const updateMemberRoleSchema = z.object({
  role: z.nativeEnum(OrgMemberRole),
});

export type CreateOrgInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrgInput = z.infer<typeof updateOrganizationSchema>;
export type VerifyOrgInput = z.infer<typeof verifyOrganizationSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
