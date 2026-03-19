import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Creates the `pools` table and its dependent enum types.
 *
 * Uses `IF NOT EXISTS` guards so the migration is safe to run against a
 * database where the table was already created by the Python pipeline.
 */
export class CreatePoolsTable20260319000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE draft_mode_enum AS ENUM ('mvp', 'franchise', 'custom');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      DO $$ BEGIN
        CREATE TYPE visibility_enum AS ENUM ('public', 'private');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      CREATE TABLE IF NOT EXISTS pools (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name        TEXT NOT NULL,
        draft_mode  draft_mode_enum NOT NULL,
        visibility  visibility_enum NOT NULL,
        entries     JSONB NOT NULL,
        created_by  TEXT,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS pools`);
    await queryRunner.query(`DROP TYPE IF EXISTS visibility_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS draft_mode_enum`);
  }
}
