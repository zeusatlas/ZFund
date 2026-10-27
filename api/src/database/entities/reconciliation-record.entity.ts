import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReconciliationRun } from './reconciliation-run.entity';

export enum ReconciliationRecordStatus {
  MATCHED = 'MATCHED',
  DISCREPANCY = 'DISCREPANCY',
  MISSING_INTERNAL = 'MISSING_INTERNAL',
  MISSING_PROVIDER = 'MISSING_PROVIDER',
}

@Entity('reconciliation_records')
export class ReconciliationRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index('idx_recon_record_run_id')
  runId: string;

  @Column({ nullable: true })
  @Index('idx_recon_provider_ref')
  providerReference?: string;

  @Column({ nullable: true })
  @Index('idx_recon_internal_ref')
  internalReference?: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
  providerAmount?: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
  internalAmount?: string;

  @Column({
    type: 'enum',
    enum: ReconciliationRecordStatus,
    default: ReconciliationRecordStatus.MATCHED,
  })
  status: ReconciliationRecordStatus;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  details?: Record<string, unknown>;

  @ManyToOne(() => ReconciliationRun, (run) => run.records, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'runId' })
  run: ReconciliationRun;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
