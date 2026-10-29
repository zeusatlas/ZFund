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
import { PaymentAttempt } from './payment-attempt.entity';

@Entity('provider_transactions')
export class ProviderTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index('idx_provider_tx_attempt_id')
  paymentAttemptId: string;

  @Column({ default: 'ROBSPAY' })
  provider: string;

  @Column({ nullable: true })
  @Index('idx_provider_tx_provider_id')
  providerTransactionId?: string;

  @Column()
  @Index('idx_provider_tx_reference')
  reference: string;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  amount: string;

  @Column({ default: 'GHS', length: 3 })
  currency: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: '0.00' })
  fee: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  gatewayResponse?: string;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  rawPayload?: Record<string, unknown>;

  @ManyToOne(() => PaymentAttempt, (pa) => pa.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'paymentAttemptId' })
  paymentAttempt: PaymentAttempt;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
