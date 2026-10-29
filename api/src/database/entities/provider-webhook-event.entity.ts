import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('provider_webhook_events')
export class ProviderWebhookEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'ROBSPAY' })
  provider: string;

  @Column()
  @Index('idx_webhook_event_type')
  eventType: string;

  @Column({ nullable: true })
  @Index('idx_webhook_event_id')
  eventId?: string;

  @Column({ nullable: true })
  @Index('idx_webhook_reference')
  reference?: string;

  @Column({ type: 'jsonb' })
  rawPayload: Record<string, unknown>;

  @Column({ nullable: true })
  signature?: string;

  @Column({ default: false })
  isProcessed: boolean;

  @Column({ nullable: true, type: 'text' })
  processingResult?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  processedAt?: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
