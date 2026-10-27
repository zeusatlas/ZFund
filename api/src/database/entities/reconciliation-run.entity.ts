import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReconciliationRecord } from './reconciliation-record.entity';

export enum ReconciliationStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DISCREPANCY_FOUND = 'DISCREPANCY_FOUND',
  FAILED = 'FAILED',
}

@Entity('reconciliation_runs')
export class ReconciliationRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index('idx_recon_run_ref')
  runReference: string;

  @Column({ default: 'PAYSTACK' })
  provider: string;

  @Column({ type: 'timestamp with time zone' })
  startDate: Date;

  @Column({ type: 'timestamp with time zone' })
  endDate: Date;

  @Column({ default: 0 })
  totalTransactions: number;

  @Column({ default: 0 })
  matchedCount: number;

  @Column({ default: 0 })
  mismatchedCount: number;

  @Column({
    type: 'enum',
    enum: ReconciliationStatus,
    default: ReconciliationStatus.IN_PROGRESS,
  })
  status: ReconciliationStatus;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  summary?: Record<string, unknown>;

  @OneToMany(() => ReconciliationRecord, (rec) => rec.run)
  records: ReconciliationRecord[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
