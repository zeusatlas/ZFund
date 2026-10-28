import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Contribution } from './contribution.entity';
import { ProviderTransaction } from './provider-transaction.entity';

export enum PaymentStatus {
  INITIATED = 'INITIATED',
  PENDING = 'PENDING',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentChannel {
  MOBILE_MONEY = 'mobile_money',
  CARD = 'card',
}

@Entity('payment_attempts')
export class PaymentAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Unique internal payment reference (e.g. ZF-PAY-XXXXXXXX)
   */
  @Column({ unique: true })
  @Index('idx_payment_attempt_reference')
  reference: string;

  @Column('uuid')
  @Index('idx_payment_attempt_contribution_id')
  contributionId: string;

  @Column({ default: 'PAYSTACK' })
  provider: string;

  @Column({
    type: 'enum',
    enum: PaymentChannel,
    default: PaymentChannel.MOBILE_MONEY,
  })
  channel: PaymentChannel;

  @Column()
  msisdn: string;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  amount: string;

  @Column({ default: 'GHS', length: 3 })
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.INITIATED,
  })
  status: PaymentStatus;

  /**
   * External reference or transaction ID returned by provider (e.g. Paystack reference)
   */
  @Column({ nullable: true })
  @Index('idx_payment_provider_ref')
  providerReference?: string;

  @Column({ nullable: true })
  providerStatus?: string;

  @Column({ nullable: true, type: 'text' })
  authorizationUrl?: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: '0.00' })
  fee: string;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  metadata?: Record<string, unknown>;

  @Column({ type: 'timestamp with time zone', nullable: true })
  completedAt?: Date;

  @ManyToOne(() => Contribution, (c) => c.paymentAttempts, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'contributionId' })
  contribution: Contribution;

  @OneToMany(() => ProviderTransaction, (pt) => pt.paymentAttempt)
  transactions: ProviderTransaction[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
