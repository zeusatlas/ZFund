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
import { UssdFlowVersion } from './ussd-flow-version.entity';
import { UssdMenuOption } from './ussd-menu-option.entity';

export enum UssdMenuType {
  SELECT = 'SELECT', // Numeric selection (1. Tithe, 2. Offering)
  INPUT = 'INPUT',   // Contributor types input (e.g. amount)
  DISPLAY = 'DISPLAY', // Read-only information prompt
  TERMINAL = 'TERMINAL', // Final message, terminates session (MSGTYPE = false)
}

@Entity('ussd_menus')
@Index('idx_menu_version_key_unique', ['flowVersionId', 'menuKey'], { unique: true })
export class UssdMenu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index('idx_menu_version_id')
  flowVersionId: string;

  /**
   * Menu identifier within the flow (e.g. 'WELCOME', 'PURPOSES', 'AMOUNT_INPUT', 'CONFIRMATION')
   */
  @Column()
  menuKey: string;

  @Column()
  title: string;

  /**
   * Prompt template displayed to user (e.g. "Select Contribution Purpose:\n" or "Enter Amount (GHS):")
   */
  @Column({ type: 'text' })
  prompt: string;

  @Column({
    type: 'enum',
    enum: UssdMenuType,
    default: UssdMenuType.SELECT,
  })
  menuType: UssdMenuType;

  @Column({ default: 1 })
  displayOrder: number;

  /**
   * Optional validation rules (e.g. { min: 1, max: 5000, regex: "^[0-9]+$" })
   */
  @Column({ type: 'jsonb', nullable: true, default: {} })
  validationRules?: Record<string, unknown>;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => UssdFlowVersion, (version) => version.menus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flowVersionId' })
  flowVersion: UssdFlowVersion;

  @OneToMany(() => UssdMenuOption, (opt) => opt.menu)
  options: UssdMenuOption[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
