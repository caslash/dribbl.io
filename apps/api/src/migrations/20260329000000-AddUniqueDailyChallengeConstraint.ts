import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds the `uq_daily_challenge_type_date` unique constraint to the
 * `daily_challenges` table if it does not already exist.
 *
 * This constraint is required for the ON CONFLICT upsert logic in the
 * schedule generation script and the `DailyScheduleGeneratorService`.
 * It was declared in the original `CreateDailyChallengesTable` migration
 * but may be absent on databases where the table was created manually or
 * the migration was not applied.
 */
export class AddUniqueDailyChallengeConstraint20260329000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'uq_daily_challenge_type_date'
        ) THEN
          ALTER TABLE daily_challenges
            ADD CONSTRAINT uq_daily_challenge_type_date
            UNIQUE (game_type, challenge_date);
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE daily_challenges
        DROP CONSTRAINT IF EXISTS uq_daily_challenge_type_date
    `);
  }
}
