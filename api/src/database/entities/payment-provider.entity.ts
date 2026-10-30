import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment_providers')
export class PaymentProvider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  @Index('idx_payment_provider_code')
  code: string; // e.g. 'ROBSPAY'

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  isDefault: boolean;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  config?: Record<string, unknown>;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
