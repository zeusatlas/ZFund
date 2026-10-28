import { z } from 'zod';
import { ProjectStatus } from '../database/entities/project.entity';
import { PaymentMethodType } from '../database/entities/project-payment-method.entity';

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
  currency: z.string().length(3).default('GHS'),
  targetAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid monetary format').optional(),
  minAmount: z.string().regex(/^\d+(\.\d{1,2})?$/).default('1.00'),
  maxAmount: z.string().regex(/^\d+(\.\d{1,2})?$/).default('10000.00'),
  welcomeMessage: z.string().max(120, 'Welcome message max 120 characters').optional(),
  startDate: z.string().datetime({ message: 'Valid start date is required' }),
  endDate: z.string().datetime().optional(),
  acceptsContributions: z.boolean().default(true),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.PENDING_REVIEW),
});

export const updateProjectSchema = createProjectSchema.partial().omit({ eventCode: true });

export const updateProjectStatusSchema = z.object({
  status: z.nativeEnum(ProjectStatus),
  notes: z.string().optional(),
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
      provider: z.string().default('PAYSTACK'),
      isEnabled: z.boolean().default(true),
      config: z.record(z.unknown()).optional(),
    })
  ),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type UpdateProjectStatusInput = z.infer<typeof updateProjectStatusSchema>;
export type ConfigurePurposesInput = z.infer<typeof configurePurposesSchema>;
export type ConfigurePaymentMethodsInput = z.infer<typeof configurePaymentMethodsSchema>;
