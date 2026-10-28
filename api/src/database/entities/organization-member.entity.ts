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
import { User } from './user.entity';
import { Organization } from './organization.entity';

export enum OrgMemberRole {
  ORG_ADMIN = 'ORG_ADMIN',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  FINANCE_OFFICER = 'FINANCE_OFFICER',
  MEMBER = 'MEMBER',
}

@Entity('organization_members')
@Index('idx_org_user_unique', ['organizationId', 'userId'], { unique: true })
export class OrganizationMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  organizationId: string;

  @Column('uuid')
  userId: string;

  @Column({
    type: 'enum',
    enum: OrgMemberRole,
    default: OrgMemberRole.MEMBER,
  })
  role: OrgMemberRole;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Organization, (org) => org.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @ManyToOne(() => User, (user) => user.memberships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
