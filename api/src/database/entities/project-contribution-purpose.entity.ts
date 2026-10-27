import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContributionPurpose } from './contribution-purpose.entity';
import { Project } from './project.entity';

@Entity('project_contribution_purposes')
@Index('idx_project_purpose_unique', ['projectId', 'purposeId'], { unique: true })
export class ProjectContributionPurpose {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  projectId: string;

  @Column('uuid')
  purposeId: string;

  /**
   * Optional custom name for this project (e.g. "Harvest Offering" instead of generic "Offering")
   */
  @Column({ nullable: true })
  customName?: string;

  @Column({ default: 1 })
  displayOrder: number;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Project, (project) => project.purposes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ManyToOne(() => ContributionPurpose, (purpose) => purpose.projectPurposes, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'purposeId' })
  purpose: ContributionPurpose;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
