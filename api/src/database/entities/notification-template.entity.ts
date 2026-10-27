import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum NotificationChannel {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
}

@Entity('notification_templates')
export class NotificationTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Unique template key (e.g. 'CONTRIBUTION_CONFIRMED_CONTRIBUTOR', 'PAYMENT_PENDING_CONTRIBUTOR')
   */
  @Column({ unique: true })
  @Index('idx_notif_template_key')
  templateKey: string;

  @Column({
    type: 'enum',
    enum: NotificationChannel,
    default: NotificationChannel.SMS,
  })
  channel: NotificationChannel;

  @Column()
  eventType: string;

  @Column()
  title: string;

  /**
   * Message template with {placeholders} e.g. "Dear Contributor, payment of {currency} {amount} to {projectName} succeeded. Ref: {reference}"
   */
  @Column({ type: 'text' })
  messageTemplate: string;

  /**
   * List of allowed placeholders (e.g. ["currency", "amount", "projectName", "reference", "purpose"])
   */
  @Column({ type: 'jsonb', default: [] })
  approvedPlaceholders: string[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
