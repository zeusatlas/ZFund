import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity('project_categories')
export class ProjectCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  @Index('idx_project_category_slug')
  slug: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Project, (project) => project.category)
  projects: Project[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
