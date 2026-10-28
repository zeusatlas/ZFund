import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UssdSessionEvent } from './ussd-session-event.entity';

export enum UssdSessionStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
}

@Entity('ussd_sessions')
export class UssdSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Unique provider session identifier from NALO (e.g. '16590115252429751')
   */
  @Column({ unique: true })
  @Index('idx_ussd_session_id')
  sessionId: string;

  /**
   * Contributor mobile phone number in string format
   */
  @Column()
  @Index('idx_ussd_session_msisdn')
  msisdn: string;

  @Column({ nullable: true })
  network?: string;

  @Column({ default: 'NALO' })
  provider: string;

  @Column('uuid', { nullable: true })
  @Index('idx_ussd_session_project_id')
  projectId?: string;

  @Column('uuid', { nullable: true })
  flowId?: string;

  @Column('uuid', { nullable: true })
  flowVersionId?: string;

  @Column({ default: 'WELCOME' })
  currentMenuKey: string;

  /**
   * Stack of previous menu keys for Back navigation
   */
  @Column({ type: 'jsonb', default: [] })
  navigationHistory: string[];

  /**
   * Session state data (e.g. selectedPurposeId, amount, contributorPhone, paymentAttemptId)
   */
  @Column({ type: 'jsonb', default: {} })
  contextData: Record<string, unknown>;

  @Column({
    type: 'enum',
    enum: UssdSessionStatus,
    default: UssdSessionStatus.ACTIVE,
  })
  status: UssdSessionStatus;

  @Column({ type: 'timestamp with time zone' })
  expiresAt: Date;

  @OneToMany(() => UssdSessionEvent, (event) => event.session)
  events: UssdSessionEvent[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
