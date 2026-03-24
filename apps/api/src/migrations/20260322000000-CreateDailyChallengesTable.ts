import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Creates the `daily_challenges` table for the Daily Roster Challenge feature.
 *
 * Uses `IF NOT EXISTS` guard so the migration is safe to re-run.
 * The `uq_daily_challenge_type_date` constraint ensures at most one challenge
 * per game type per calendar day, which the schedule generation script relies
 * on for its upsert behaviour.
 */
export class CreateDailyChallengesTable20260322000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS daily_challenges (
        id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        game_type      TEXT NOT NULL,
        challenge_date DATE NOT NULL,
        team_id        BIGINT NOT NULL,
        season_id      VARCHAR(7) NOT NULL,
        curated        BOOLEAN NOT NULL DEFAULT FALSE,
        created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT fk_daily_challenges_team FOREIGN KEY (team_id) REFERENCES teams(team_id),
        CONSTRAINT uq_daily_challenge_type_date UNIQUE (game_type, challenge_date)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS daily_challenges`);
  }
}
