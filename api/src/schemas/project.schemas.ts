import { z } from 'zod';
import { ProjectStatus } from '../database/entities/project.entity';
import { PaymentMethodType } from '../database/entities/project-payment-method.entity';

export const requestedCodeSchema = z
  .string()
  .trim()
  .regex(/^[0-9]{2,4}$/, 'Campaign code must be 2 to 4 digits');

export const createProjectSchema = z.object({
  name: z.string().min(2, 'Project name is required').trim(),
  description: z.string().optional(),
  organizationId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  eventCode: z
    .string()
    .min(3, 'Event code must be at least 3 digits')
    .max(10, 'Event code max 10 digits')
    .regex(/^[0-9]+$/, 'Event code must contain only digits')
    .optional(),
  requestedCode: requestedCodeSchema.optional(),
  currency: z.string().length(3).default('GHS'),
  targetAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid monetary format').optional(),
  minAmount: z.string().regex(/^\d+(\.\d{1,2})?$/).default('1.00'),
  maxAmount: z.string().regex(/^\d+(\.\d{1,2})?$/).default('10000.00'),
  welcomeMessage: z.string().max(120, 'Welcome message max 120 characters').optional(),
  startDate: z.string().datetime({ message: 'Valid start date is required' }),
  endDate: z.string().datetime().optional(),
  acceptsContributions: z.boolean().default(true),
  commissionPercentage: z
    .union([z.number(), z.string()])
    .transform((val) => String(Number(val).toFixed(2)))
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
      message: 'Commission percentage must be between 0 and 100',
    })
    .optional(),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.PENDING_REVIEW),
});

export const updateProjectSchema = createProjectSchema
  .partial()
  .omit({ eventCode: true, requestedCode: true });

export const codeAvailabilitySchema = z.object({ code: requestedCodeSchema });

/** Admin-created campaign: owned by the chosen host, with an optional hand-picked 2-4 digit code. */
export const adminCreateProjectSchema = createProjectSchema
  .omit({ status: true, requestedCode: true, eventCode: true })
  .extend({
    hostId: z.string().uuid('Select a host for this campaign'),
    eventCode: requestedCodeSchema.optional(),
  });

export const updateProjectStatusSchema = z.object({
  status: z.nativeEnum(ProjectStatus),
  notes: z.string().optional(),
  commissionPercentage: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0 && val <= 100, {
      message: 'Commission percentage must be between 0 and 100',
    })
    .optional(),
});

export const configurePurposesSchema = z.object({
  purposeIds: z.array(
    z.object({
      purposeId: z.string().uuid(),
      customName: z.string().optional(),
      displayOrder: z.number().int().default(1),
      isDefault: z.boolean().default(false),
    })
  ),
});

export const configurePaymentMethodsSchema = z.object({
  methods: z.array(
    z.object({
      method: z.nativeEnum(PaymentMethodType),
      provider: z.string().default('ROBSPAY'),
      isEnabled: z.boolean().default(true),
      config: z.record(z.unknown()).optional(),
    })
  ),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type AdminCreateProjectInput = z.infer<typeof adminCreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type UpdateProjectStatusInput = z.infer<typeof updateProjectStatusSchema>;
export type ConfigurePurposesInput = z.infer<typeof configurePurposesSchema>;
export type ConfigurePaymentMethodsInput = z.infer<typeof configurePaymentMethodsSchema>;
