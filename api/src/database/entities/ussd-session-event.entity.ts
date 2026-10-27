import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UssdSession } from './ussd-session.entity';

@Entity('ussd_session_events')
export class UssdSessionEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index('idx_session_event_session_id')
  ussdSessionId: string;

  @Column()
  msisdn: string;

  @Column({ default: 1 })
  stepNumber: number;

  @Column()
  menuKey: string;

  @Column({ nullable: true })
  userInput?: string;

  @Column({ type: 'text' })
  renderedMessage: string;

  @Column({ nullable: true })
  actionExecuted?: string;

  @Column({ default: true })
  msgType: boolean;

  @ManyToOne(() => UssdSession, (s) => s.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ussdSessionId' })
  session: UssdSession;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
