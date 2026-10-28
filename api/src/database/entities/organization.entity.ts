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
import { OrganizationMember } from './organization-member.entity';

export enum OrgVerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  @Index('idx_org_slug')
  slug: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ nullable: true })
  registrationNumber?: string;

  @Column({ nullable: true })
  taxNumber?: string;

  @Column({
    type: 'enum',
    enum: OrgVerificationStatus,
    default: OrgVerificationStatus.PENDING,
  })
  verificationStatus: OrgVerificationStatus;

  @Column({ type: 'timestamp with time zone', nullable: true })
  verifiedAt?: Date;

  @Column({ nullable: true })
  contactEmail?: string;

  @Column({ nullable: true })
  contactPhone?: string;

  @Column({ nullable: true, type: 'text' })
  address?: string;

  @OneToMany(() => OrganizationMember, (member) => member.organization)
  members: OrganizationMember[];

  @OneToMany(() => Project, (project) => project.organization)
  projects: Project[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
