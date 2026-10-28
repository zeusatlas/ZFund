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
import { Organization } from './organization.entity';
import { User } from './user.entity';
import { ProjectCategory } from './project-category.entity';
import { ProjectContributionPurpose } from './project-contribution-purpose.entity';
import { ProjectMember } from './project-member.entity';
import { ProjectPaymentMethod } from './project-payment-method.entity';
import { ProjectSetting } from './project-setting.entity';

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  SUSPENDED = 'SUSPENDED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column('uuid', { nullable: true })
  @Index('idx_project_organization_id')
  organizationId?: string;

  @Column('uuid')
  @Index('idx_project_owner_id')
  ownerId: string;

  @Column('uuid', { nullable: true })
  @Index('idx_project_category_id')
  categoryId?: string;

  /**
   * Unique USSD Event Code (e.g. 1001 for dial format *920*969*1001#)
   */
  @Column({ unique: true })
  @Index('idx_project_event_code')
  eventCode: string;

  @Column({ default: 'GHS', length: 3 })
  currency: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
  targetAmount?: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: '1.00' })
  minAmount: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: '10000.00' })
  maxAmount: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.DRAFT,
  })
  status: ProjectStatus;

  @Column({ default: true })
  acceptsContributions: boolean;

  @Column({ nullable: true, length: 120 })
  welcomeMessage?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  startDate?: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  endDate?: Date;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  settings?: Record<string, unknown>;

  @ManyToOne(() => Organization, (org) => org.projects, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'organizationId' })
  organization?: Organization;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @ManyToOne(() => ProjectCategory, (category) => category.projects, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category?: ProjectCategory;

  @OneToMany(() => ProjectMember, (member) => member.project)
  members: ProjectMember[];

  @OneToMany(() => ProjectContributionPurpose, (pcp) => pcp.project)
  purposes: ProjectContributionPurpose[];

  @OneToMany(() => ProjectPaymentMethod, (ppm) => ppm.project)
  paymentMethods: ProjectPaymentMethod[];

  @OneToMany(() => ProjectSetting, (ps) => ps.project)
  projectSettings: ProjectSetting[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
