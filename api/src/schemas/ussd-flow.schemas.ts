import { z } from 'zod';
import { UssdMenuType } from '../database/entities/ussd-menu.entity';
import { UssdOptionType } from '../database/entities/ussd-menu-option.entity';

export const createFlowSchema = z.object({
  name: z.string().min(2).trim(),
  description: z.string().optional(),
  projectId: z.string().uuid().optional(),
});

export const createMenuSchema = z.object({
  menuKey: z
    .string()
    .min(2)
    .max(30)
    .regex(/^[A-Z0-9_]+$/, 'Menu key must be uppercase alphanumeric with underscores (e.g. WELCOME)'),
  title: z.string().min(2),
  prompt: z.string().min(1).max(120, 'Prompt must be 120 characters or fewer for USSD compatibility'),
  menuType: z.nativeEnum(UssdMenuType).default(UssdMenuType.SELECT),
  displayOrder: z.number().int().default(1),
  validationRules: z.record(z.unknown()).optional(),
  isActive: z.boolean().default(true),
});

export const updateMenuSchema = createMenuSchema.partial();

export const createOptionSchema = z.object({
  displayOrder: z.number().int().default(1),
  optionKey: z.string().min(1).max(5),
  label: z.string().min(1).max(50),
  optionType: z.nativeEnum(UssdOptionType).default(UssdOptionType.NAVIGATION),
  targetMenuKey: z.string().optional(),
  actionReference: z.string().optional(),
  validationConfig: z.record(z.unknown()).optional(),
  isActive: z.boolean().default(true),
});

export const updateOptionSchema = createOptionSchema.partial();

export const publishFlowSchema = z.object({
  notes: z.string().optional(),
});

export const initializeProjectFlowSchema = z.object({
  welcomePrompt: z.string().max(120).optional(),
  amountPrompt: z.string().max(120).optional(),
  confirmPrompt: z.string().max(120).optional(),
  otpPrompt: z.string().max(120).optional(),
  allowDirectAmount: z.boolean().optional(),
  currency: z.string().length(3).optional(),
  purposes: z
    .array(
      z.object({
        label: z.string().min(1).max(50),
        purposeId: z.string().uuid().optional(),
        subSteps: z.array(z.string().min(1).max(50)).optional(),
      })
    )
    .optional(),
});

export type CreateFlowInput = z.infer<typeof createFlowSchema>;
export type CreateMenuInput = z.infer<typeof createMenuSchema>;
export type UpdateMenuInput = z.infer<typeof updateMenuSchema>;
export type CreateOptionInput = z.infer<typeof createOptionSchema>;
export type UpdateOptionInput = z.infer<typeof updateOptionSchema>;
export type PublishFlowInput = z.infer<typeof publishFlowSchema>;
export type InitializeProjectFlowInput = z.infer<typeof initializeProjectFlowSchema>;
