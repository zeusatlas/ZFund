import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationChannel } from './notification-template.entity';
import { NotificationDeliveryAttempt } from './notification-delivery-attempt.entity';

export enum NotificationStatus {
  QUEUED = 'QUEUED',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index('idx_notif_template_ref')
  templateKey: string;

  @Column({ nullable: true })
  @Index('idx_notif_phone')
  recipientPhone?: string;

  @Column({ nullable: true })
  recipientEmail?: string;

  @Column({
    type: 'enum',
    enum: NotificationChannel,
    default: NotificationChannel.SMS,
  })
  channel: NotificationChannel;

  @Column()
  eventType: string;

  @Column({ type: 'text' })
  messageBody: string;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.QUEUED,
  })
  status: NotificationStatus;

  @Column({ default: 'MOCK' })
  provider: string;

  @Column({ nullable: true })
  providerMessageId?: string;

  @Column({ nullable: true, type: 'text' })
  errorDetails?: string;

  @Column({ default: 0 })
  retryCount: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  nextRetryAt?: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  sentAt?: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  deliveredAt?: Date;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  metadata?: Record<string, unknown>;

  @OneToMany(() => NotificationDeliveryAttempt, (attempt) => attempt.notification)
  deliveryAttempts: NotificationDeliveryAttempt[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
