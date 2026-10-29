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

export enum PaymentMethodType {
  MOBILE_MONEY = 'MOBILE_MONEY',
  CARD = 'CARD',
}

@Entity('project_payment_methods')
@Index('idx_project_method_unique', ['projectId', 'method'], { unique: true })
export class ProjectPaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  projectId: string;

  @Column({
    type: 'enum',
    enum: PaymentMethodType,
    default: PaymentMethodType.MOBILE_MONEY,
  })
  method: PaymentMethodType;

  @Column({ default: 'ROBSPAY' })
  provider: string;

  @Column({ default: true })
  isEnabled: boolean;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  config?: Record<string, unknown>;

  @ManyToOne(() => Project, (project) => project.paymentMethods, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
