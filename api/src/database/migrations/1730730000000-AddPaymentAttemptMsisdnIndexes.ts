import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPaymentAttemptMsisdnIndexes1730730000000 implements MigrationInterface {
  name = 'AddPaymentAttemptMsisdnIndexes1730730000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_payment_attempt_msisdn" ON "payment_attempts" ("msisdn")`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_payment_attempt_msisdn_status" ON "payment_attempts" ("msisdn", "status")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_payment_attempt_msisdn_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_payment_attempt_msisdn"`);
  }
}

