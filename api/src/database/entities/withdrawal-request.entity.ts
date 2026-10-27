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
import { Project } from './project.entity';
import { User } from './user.entity';

export enum WithdrawalStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  REJECTED = 'REJECTED',
}

export enum WithdrawalMethod {
  MOBILE_MONEY = 'MOBILE_MONEY',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

@Entity('withdrawal_requests')
export class WithdrawalRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Human-friendly reference, e.g. ZF-WDR-XXXX-XXXX */
  @Column({ unique: true })
  reference: string;

  @Column('uuid')
  @Index('idx_withdrawal_host_id')
  hostId: string;

  @Column('uuid', { nullable: true })
  projectId?: string;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  amount: string;

  @Column({ default: 'GHS', length: 3 })
  currency: string;

  @Column({ type: 'enum', enum: WithdrawalMethod })
  method: WithdrawalMethod;

  @Column()
  recipientName: string;

  /** Mobile money network or bank name */
  @Column()
  institution: string;

  @Column()
  accountNumber: string;

  @Column({ type: 'text' })
  purpose: string;

  @Column({ type: 'enum', enum: WithdrawalStatus, default: WithdrawalStatus.PENDING })
  @Index('idx_withdrawal_status')
  status: WithdrawalStatus;

  @Column({ type: 'text', nullable: true })
  reviewNote?: string;

  @Column('uuid', { nullable: true })
  reviewedById?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  reviewedAt?: Date;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'hostId' })
  host: User;

  @ManyToOne(() => Project, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'projectId' })
  project?: Project;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
