import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: true })
  @Index('idx_audit_user_id')
  userId?: string;

  @Column('uuid', { nullable: true })
  @Index('idx_audit_org_id')
  organizationId?: string;

  @Column()
  @Index('idx_audit_entity_type')
  entityType: string;

  @Column({ nullable: true })
  @Index('idx_audit_entity_id')
  entityId?: string;

  @Column()
  action: string;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ type: 'jsonb', nullable: true })
  oldValues?: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  newValues?: Record<string, unknown>;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
