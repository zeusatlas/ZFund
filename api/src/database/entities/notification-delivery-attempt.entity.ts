import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Notification } from './notification.entity';

@Entity('notification_delivery_attempts')
export class NotificationDeliveryAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index('idx_delivery_attempt_notif_id')
  notificationId: string;

  @Column({ default: 1 })
  attemptNumber: number;

  @Column()
  provider: string;

  @Column()
  status: string;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  responseData?: Record<string, unknown>;

  @Column({ nullable: true, type: 'text' })
  errorMessage?: string;

  @ManyToOne(() => Notification, (n) => n.deliveryAttempts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'notificationId' })
  notification: Notification;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
