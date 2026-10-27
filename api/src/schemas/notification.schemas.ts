import { z } from 'zod';
import { NotificationChannel } from '../database/entities/notification-template.entity';

export const createNotificationTemplateSchema = z.object({
  templateKey: z.string().min(3).regex(/^[A-Z0-9_]+$/),
  channel: z.nativeEnum(NotificationChannel).default(NotificationChannel.SMS),
  eventType: z.string().min(2),
  title: z.string().min(2),
  messageTemplate: z.string().min(5),
  approvedPlaceholders: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

export const updateNotificationTemplateSchema = createNotificationTemplateSchema.partial();

export const testSmsSchema = z.object({
  recipient: z.string().min(10, 'Valid phone number is required'),
  message: z.string().min(1).max(160, 'Max 160 characters for single SMS test'),
});

export type CreateNotificationTemplateInput = z.infer<typeof createNotificationTemplateSchema>;
export type UpdateNotificationTemplateInput = z.infer<typeof updateNotificationTemplateSchema>;
export type TestSmsInput = z.infer<typeof testSmsSchema>;
