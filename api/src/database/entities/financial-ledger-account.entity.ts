import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
}

@Entity('financial_ledger_accounts')
export class FinancialLedgerAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index('idx_ledger_account_code')
  code: string; // e.g. '1000' (Cash), '2000' (Contributions Payable), '4000' (Platform Fee Revenue)

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: AccountType,
  })
  type: AccountType;

  @Column({ type: 'numeric', precision: 16, scale: 2, default: '0.00' })
  balance: string;

  @Column({ default: 'GHS', length: 3 })
  currency: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
