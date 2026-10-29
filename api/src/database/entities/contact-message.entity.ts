import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ContactMessageStatus {
  NEW = 'NEW',
  READ = 'READ',
  RESOLVED = 'RESOLVED',
}

/** A message submitted through the public website contact form. */
@Entity('contact_messages')
export class ContactMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  @Index('idx_contact_message_email')
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone?: string | null;

  @Column()
  topic: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'enum', enum: ContactMessageStatus, default: ContactMessageStatus.NEW })
  @Index('idx_contact_message_status')
  status: ContactMessageStatus;

  /** Whether the notification email to the support inbox was sent successfully. */
  @Column({ default: false })
  emailSent: boolean;

  @Column({ type: 'varchar', nullable: true })
  ipAddress?: string | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
