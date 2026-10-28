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
import { UssdFlow } from './ussd-flow.entity';
import { UssdMenu } from './ussd-menu.entity';

export enum UssdFlowVersionStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

@Entity('ussd_flow_versions')
@Index('idx_flow_version_number_unique', ['flowId', 'versionNumber'], { unique: true })
export class UssdFlowVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index('idx_ussd_version_flow_id')
  flowId: string;

  @Column({ type: 'int', default: 1 })
  versionNumber: number;

  @Column({
    type: 'enum',
    enum: UssdFlowVersionStatus,
    default: UssdFlowVersionStatus.DRAFT,
  })
  status: UssdFlowVersionStatus;

  @Column({ type: 'timestamp with time zone', nullable: true })
  publishedAt?: Date;

  @Column('uuid', { nullable: true })
  publishedById?: string;

  @Column({ nullable: true })
  notes?: string;

  @ManyToOne(() => UssdFlow, (flow) => flow.versions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flowId' })
  flow: UssdFlow;

  @OneToMany(() => UssdMenu, (menu) => menu.flowVersion)
  menus: UssdMenu[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
