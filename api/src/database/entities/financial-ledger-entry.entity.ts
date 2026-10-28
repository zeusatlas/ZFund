import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('financial_ledger_entries')
export class FinancialLedgerEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Unique ledger transaction reference (e.g. ZF-LED-XXXXXXXX)
   */
  @Column({ unique: true })
  @Index('idx_ledger_entry_ref')
  entryReference: string;

  @Column('uuid', { nullable: true })
  @Index('idx_ledger_contribution_id')
  contributionId?: string;

  @Column('uuid', { nullable: true })
  @Index('idx_ledger_refund_id')
  refundId?: string;

  @Column()
  debitAccount: string;

  @Column()
  creditAccount: string;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  amount: string;

  @Column({ default: 'GHS', length: 3 })
  currency: string;

  @Column()
  description: string;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  metadata?: Record<string, unknown>;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
