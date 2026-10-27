import { z } from 'zod';
import {
  DocumentEntityType,
  DocumentType,
  DocumentVerificationStatus,
} from '../database/entities/document-record.entity';

export const uploadDocumentMetadataSchema = z.object({
  entityType: z.nativeEnum(DocumentEntityType),
  entityId: z.string().uuid(),
  documentType: z.nativeEnum(DocumentType),
});

export const reviewDocumentSchema = z.object({
  status: z.nativeEnum(DocumentVerificationStatus),
  reviewNotes: z.string().optional(),
});

export type UploadDocumentMetadataInput = z.infer<typeof uploadDocumentMetadataSchema>;
export type ReviewDocumentInput = z.infer<typeof reviewDocumentSchema>;
