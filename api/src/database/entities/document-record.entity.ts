import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum DocumentEntityType {
  ORGANIZATION = 'ORGANIZATION',
  USER = 'USER',
  PROJECT = 'PROJECT',
}

export enum DocumentType {
  NATIONAL_ID = 'NATIONAL_ID',
  CERTIFICATE_OF_INCORPORATION = 'CERTIFICATE_OF_INCORPORATION',
  TAX_CLEARANCE = 'TAX_CLEARANCE',
  PROOF_OF_ADDRESS = 'PROOF_OF_ADDRESS',
  OTHER = 'OTHER',
}

export enum DocumentVerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

@Entity('document_records')
export class DocumentRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: DocumentEntityType,
    default: DocumentEntityType.ORGANIZATION,
  })
  entityType: DocumentEntityType;

  @Column('uuid')
  @Index('idx_doc_entity_id')
  entityId: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
    default: DocumentType.OTHER,
  })
  documentType: DocumentType;

  @Column()
  originalFilename: string;

  @Column({ unique: true })
  @Index('idx_doc_stored_filename')
  storedFilename: string;

  @Column()
  mimeType: string;

  @Column({ type: 'bigint' })
  fileSize: number;

  @Column()
  filePath: string;

  @Column({
    type: 'enum',
    enum: DocumentVerificationStatus,
    default: DocumentVerificationStatus.PENDING,
  })
  verificationStatus: DocumentVerificationStatus;

  @Column({ nullable: true, type: 'text' })
  reviewNotes?: string;

  @Column('uuid', { nullable: true })
  reviewerId?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  reviewedAt?: Date;

  @Column('uuid')
  @Index('idx_doc_uploaded_by')
  uploadedById: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy: User;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'reviewerId' })
  reviewer?: User;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
