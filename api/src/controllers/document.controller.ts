import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../common/utils/response';
import { documentService } from '../services/document.service';
import { DocumentEntityType, DocumentType } from '../database/entities/document-record.entity';

export class DocumentController {
  async uploadDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file;
      const { entityType, entityId, documentType } = req.body;

      const doc = await documentService.createDocument(file!, {
        entityType: entityType as DocumentEntityType,
        entityId,
        documentType: documentType as DocumentType,
        uploadedById: req.user!.id,
      });

      // Remove sensitive internal server storage path from client serialization
      const { filePath, ...safeDoc } = doc;
      ApiResponse.success(res, safeDoc, 'Document uploaded successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async getDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const entityType = req.query.entityType as any;
      const entityId = req.query.entityId as string | undefined;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const verificationStatus = req.query.verificationStatus as any;

      const result = await documentService.getDocuments({
        entityType,
        entityId,
        verificationStatus,
        page,
        limit,
      });

      const sanitizedDocs = result.documents.map(({ filePath, ...rest }) => rest);
      ApiResponse.paginated(res, sanitizedDocs, page, limit, result.total, 'Documents retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getDocumentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const doc = await documentService.getDocumentById(
        req.params.id,
        req.user?.id,
        req.user?.role
      );
      const { filePath, ...safeDoc } = doc;
      ApiResponse.success(res, safeDoc, 'Document details retrieved');
    } catch (err) {
      next(err);
    }
  }

  async reviewDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const doc = await documentService.reviewDocument(
        req.params.id,
        req.body.status,
        req.body.reviewNotes,
        req.user!.id
      );
      const { filePath, ...safeDoc } = doc;
      ApiResponse.success(res, safeDoc, 'Document review completed');
    } catch (err) {
      next(err);
    }
  }

  async downloadDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { stream, doc } = await documentService.getDocumentFileStream(
        req.params.id,
        req.user?.id,
        req.user?.role
      );

      res.setHeader('Content-Type', doc.mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${doc.originalFilename}"`);
      stream.pipe(res);
    } catch (err) {
      next(err);
    }
  }
}

export const documentController = new DocumentController();
