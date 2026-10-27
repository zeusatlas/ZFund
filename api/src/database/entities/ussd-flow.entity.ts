import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { UssdFlowVersion } from './ussd-flow-version.entity';

export enum UssdFlowStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  DISABLED = 'DISABLED',
}

@Entity('ussd_flows')
export class UssdFlow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * If null, this flow represents the general platform flow (*920*969#).
   * If set, it represents a project-specific flow (*920*969*<EVENT_CODE>#).
   */
  @Column('uuid', { nullable: true })
  @Index('idx_ussd_flow_project_id')
  projectId?: string;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({
    type: 'enum',
    enum: UssdFlowStatus,
    default: UssdFlowStatus.DRAFT,
  })
  status: UssdFlowStatus;

  @Column('uuid', { nullable: true })
  activeVersionId?: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'projectId' })
  project?: Project;

  @OneToMany(() => UssdFlowVersion, (version) => version.flow)
  versions: UssdFlowVersion[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
