import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { dateRange, seededRandom } from '@/nba/daily/schedule-utils';

interface Slot {
  team_id: string;
  season_id: string;
}

/**
 * Automatically generates the upcoming week's daily challenge schedule.
 *
 * Runs every Sunday at noon (server local time). On each run it computes and
 * upserts the Monday–Sunday challenges for the coming week. Rows already
 * marked `curated = TRUE` in `daily_challenges` are never overwritten.
 *
 * @example
 * // Triggered automatically — no manual invocation needed.
 * // To backfill or seed ahead use the `generate-schedule` npm script instead.
 */
@Injectable()
export class DailyScheduleGeneratorService {
  private readonly logger = new Logger(DailyScheduleGeneratorService.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  /**
   * Runs every Sunday at noon to generate the coming week's roster challenges.
   *
   * Computes the date window [next Monday, next Sunday] relative to the
   * current UTC date, then upserts a deterministic team/season assignment for
   * each day using a seeded PRNG keyed on the date string.
   */
  @Cron('0 0 12 * * 0')
  async generateWeeklyRosterSchedule(): Promise<void> {
    const { start, end } = this.getUpcomingWeekRange();
    this.logger.log(`Generating roster schedule for ${start} → ${end}`);

    const slots = await this.loadSlots();
    if (slots.length === 0) {
      this.logger.error('No qualifying (team_id, season_id) pairs found — skipping generation.');
      return;
    }

    let upserted = 0;
    let skipped = 0;

    for (const date of dateRange(start, end)) {
      const rng = seededRandom(date);
      const slot = slots[Math.floor(rng() * slots.length)];

      const result = await this.dataSource.query(
        `
        INSERT INTO daily_challenges (game_type, challenge_date, team_id, season_id)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (game_type, challenge_date)
        DO UPDATE SET
          team_id   = EXCLUDED.team_id,
          season_id = EXCLUDED.season_id
        WHERE daily_challenges.curated = FALSE
        `,
        ['roster', date, slot.team_id, slot.season_id],
      );

      if (result.rowCount === 0) {
        skipped++;
      } else {
        upserted++;
      }
    }

    this.logger.log(`Done. Upserted: ${upserted}, skipped (curated): ${skipped}.`);
  }

  /**
   * Returns the ISO date strings for the Monday–Sunday of the week following
   * the current UTC date.
   *
   * @example
   * // Called on a Sunday (2026-03-22):
   * // → { start: '2026-03-23', end: '2026-03-29' }
   */
  private getUpcomingWeekRange(): { start: string; end: string } {
    const now = new Date();
    const dayOfWeek = now.getUTCDay(); // 0 = Sunday
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;

    const monday = new Date(now);
    monday.setUTCDate(now.getUTCDate() + daysUntilMonday);

    const sunday = new Date(monday);
    sunday.setUTCDate(monday.getUTCDate() + 6);

    return {
      start: monday.toISOString().slice(0, 10),
      end: sunday.toISOString().slice(0, 10),
    };
  }

  /**
   * Fetches all qualifying (team_id, season_id) pairs from the database —
   * the pool from which each day's challenge is drawn.
   */
  private async loadSlots(): Promise<Slot[]> {
    return this.dataSource.query<Slot[]>(`
      SELECT DISTINCT team_id::text AS team_id, season_id
      FROM seasons
      WHERE season_type = 'Regular Season'
        AND team_id IS NOT NULL
        AND gp >= 1
      ORDER BY team_id, season_id
    `);
  }
}
