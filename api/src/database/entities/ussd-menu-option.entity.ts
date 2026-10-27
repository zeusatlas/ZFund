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
import { UssdMenu } from './ussd-menu.entity';

export enum UssdOptionType {
  NAVIGATION = 'NAVIGATION', // Navigates to another menuKey
  ACTION = 'ACTION',         // Executes an approved action from registry
  DYNAMIC = 'DYNAMIC',       // Populated dynamically from project purposes
}

@Entity('ussd_menu_options')
@Index('idx_menu_option_key_unique', ['menuId', 'optionKey'], { unique: true })
export class UssdMenuOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index('idx_option_menu_id')
  menuId: string;

  @Column({ default: 1 })
  displayOrder: number;

  /**
   * The key dialed by contributor (e.g. '1', '2', '0', '#')
   */
  @Column()
  optionKey: string;

  /**
   * The label shown to contributor (e.g. 'Offering', 'Tithe', 'Back', 'Exit')
   */
  @Column()
  label: string;

  @Column({
    type: 'enum',
    enum: UssdOptionType,
    default: UssdOptionType.NAVIGATION,
  })
  optionType: UssdOptionType;

  /**
   * Target menu key to navigate to when selected (e.g. 'AMOUNT_INPUT', 'WELCOME')
   */
  @Column({ nullable: true })
  targetMenuKey?: string;

  /**
   * Allowlisted business action reference (e.g. 'SELECT_PURPOSE', 'ENTER_AMOUNT', 'INITIATE_PAYMENT', 'TERMINATE')
   */
  @Column({ nullable: true })
  actionReference?: string;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  validationConfig?: Record<string, unknown>;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => UssdMenu, (menu) => menu.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menuId' })
  menu: UssdMenu;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
