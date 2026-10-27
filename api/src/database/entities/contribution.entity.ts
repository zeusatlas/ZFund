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
import { PaymentAttempt } from './payment-attempt.entity';
import { ContributionPurpose } from './contribution-purpose.entity';
import { Project } from './project.entity';
import { Contributor } from './contributor.entity';

export enum ContributionStatus {
  INITIATED = 'INITIATED',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

@Entity('contributions')
export class Contribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index('idx_contribution_reference')
  reference: string;

  @Column('uuid')
  @Index('idx_contribution_project_id')
  projectId: string;

  @Column('uuid', { nullable: true })
  @Index('idx_contribution_purpose_id')
  purposeId?: string;

  @Column('uuid')
  @Index('idx_contribution_contributor_id')
  contributorId: string;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  amount: string;

  @Column({ default: 'GHS', length: 3 })
  currency: string;

  @Column({
    type: 'enum',
    enum: ContributionStatus,
    default: ContributionStatus.INITIATED,
  })
  status: ContributionStatus;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  metadata?: Record<string, unknown>;

  @ManyToOne(() => Project, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ManyToOne(() => ContributionPurpose, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'purposeId' })
  purpose?: ContributionPurpose;

  @ManyToOne(() => Contributor, (c) => c.contributions, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'contributorId' })
  contributor: Contributor;

  @OneToMany(() => PaymentAttempt, (attempt) => attempt.contribution)
  paymentAttempts: PaymentAttempt[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
