import fs from 'fs';
import { AppDataSource } from '../config/database';
import { BadRequestError, ForbiddenError, NotFoundError } from '../common/errors/app-error';
import { SystemRole } from '../common/types/auth';
import { auditService } from './audit.service';
import {
  DocumentEntityType,
  DocumentRecord,
  DocumentType,
  DocumentVerificationStatus,
} from '../database/entities/document-record.entity';
import { localFileStorage } from './local-file-storage';

export class DocumentService {
  private get docRepo() { return AppDataSource.getRepository(DocumentRecord); }

  async createDocument(
    file: Express.Multer.File,
    params: {
      entityType: DocumentEntityType;
      entityId: string;
      documentType: DocumentType;
      uploadedById: string;
    }
  ): Promise<DocumentRecord> {
    if (!file) {
      throw new BadRequestError('No file provided for upload');
    }

    const { storedFilename, filePath } = await localFileStorage.saveFile(file);

    const doc = this.docRepo.create({
      entityType: params.entityType,
      entityId: params.entityId,
      documentType: params.documentType,
      originalFilename: file.originalname,
      storedFilename,
      mimeType: file.mimetype,
      fileSize: file.size,
      filePath,
      verificationStatus: DocumentVerificationStatus.PENDING,
      uploadedById: params.uploadedById,
    });

    const saved = await this.docRepo.save(doc);

    await auditService.log({
      userId: params.uploadedById,
      entityType: 'DOCUMENT',
      entityId: saved.id,
      action: 'UPLOAD_DOCUMENT',
      newValues: {
        entityType: saved.entityType,
        documentType: saved.documentType,
        filename: saved.originalFilename,
      },
    });

    return saved;
  }

  async getDocuments(params: {
    entityType?: DocumentEntityType;
    entityId?: string;
    verificationStatus?: DocumentVerificationStatus;
    page?: number;
    limit?: number;
  }): Promise<{ documents: DocumentRecord[]; total: number }> {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const query = this.docRepo.createQueryBuilder('doc');

    if (params.entityType) {
      query.andWhere('doc.entityType = :entityType', { entityType: params.entityType });
    }
    if (params.entityId) {
      query.andWhere('doc.entityId = :entityId', { entityId: params.entityId });
    }
    if (params.verificationStatus) {
      query.andWhere('doc.verificationStatus = :status', { status: params.verificationStatus });
    }

    query.orderBy('doc.createdAt', 'DESC').skip(skip).take(limit);

    const [documents, total] = await query.getManyAndCount();
    return { documents, total };
  }

  async getDocumentById(id: string, userId?: string, userRole?: string): Promise<DocumentRecord> {
    const doc = await this.docRepo.findOne({
      where: { id },
      relations: ['uploadedBy', 'reviewer'],
    });

    if (!doc) {
      throw new NotFoundError('Document not found');
    }

    const isPlatformStaff = [
      SystemRole.SUPER_ADMIN,
      SystemRole.PLATFORM_ADMIN,
      SystemRole.VERIFICATION_OFFICER,
      SystemRole.AUDITOR,
    ].includes(userRole as SystemRole);

    if (!isPlatformStaff && userId && doc.uploadedById !== userId) {
      throw new ForbiddenError('You do not have permission to view this private document');
    }

    return doc;
  }

  async reviewDocument(
    id: string,
    status: DocumentVerificationStatus,
    reviewNotes?: string,
    reviewerId?: string
  ): Promise<DocumentRecord> {
    const doc = await this.docRepo.findOne({ where: { id } });
    if (!doc) {
      throw new NotFoundError('Document not found');
    }

    const oldStatus = doc.verificationStatus;
    doc.verificationStatus = status;
    doc.reviewNotes = reviewNotes;
    doc.reviewerId = reviewerId;
    doc.reviewedAt = new Date();

    const saved = await this.docRepo.save(doc);

    await auditService.log({
      userId: reviewerId,
      entityType: 'DOCUMENT',
      entityId: saved.id,
      action: 'REVIEW_DOCUMENT',
      oldValues: { verificationStatus: oldStatus },
      newValues: { verificationStatus: status, reviewNotes },
    });

    return saved;
  }

  async getDocumentFileStream(
    id: string,
    userId?: string,
    userRole?: string
  ): Promise<{ stream: fs.ReadStream; doc: DocumentRecord }> {
    const doc = await this.getDocumentById(id, userId, userRole);

    if (!localFileStorage.fileExists(doc.filePath)) {
      throw new NotFoundError('Underlying document file not found on storage');
    }

    const stream = localFileStorage.getFileStream(doc.filePath);
    return { stream, doc };
  }
}

export const documentService = new DocumentService();
