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
import { Contribution } from './contribution.entity';
import { PaymentAttempt } from './payment-attempt.entity';
import { User } from './user.entity';

export enum RefundStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('refunds')
export class Refund {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Unique refund reference (e.g. ZF-REF-XXXXXXXX)
   */
  @Column({ unique: true })
  @Index('idx_refund_reference')
  refundReference: string;

  @Column('uuid')
  @Index('idx_refund_contribution_id')
  contributionId: string;

  @Column('uuid', { nullable: true })
  @Index('idx_refund_payment_attempt_id')
  paymentAttemptId?: string;

  @Column('uuid')
  @Index('idx_refund_requested_by')
  requestedById: string;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  amount: string;

  @Column({ default: 'GHS', length: 3 })
  currency: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({
    type: 'enum',
    enum: RefundStatus,
    default: RefundStatus.REQUESTED,
  })
  status: RefundStatus;

  @Column({ nullable: true })
  providerRefundId?: string;

  @Column({ nullable: true, type: 'text' })
  approvalNotes?: string;

  @Column('uuid', { nullable: true })
  reviewedById?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  reviewedAt?: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  processedAt?: Date;

  @ManyToOne(() => Contribution, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'contributionId' })
  contribution: Contribution;

  @ManyToOne(() => PaymentAttempt, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'paymentAttemptId' })
  paymentAttempt?: PaymentAttempt;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'requestedById' })
  requestedBy: User;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'reviewedById' })
  reviewedBy?: User;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
