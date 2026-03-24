/**
 * Seeded schedule generation script for daily challenges.
 *
 * Iterates a date range and assigns a deterministic team+season pair to each
 * day using a per-date LCG seeded with a djb2 hash. Existing rows marked
 * `curated = TRUE` are never overwritten.
 *
 * @example
 * // Via npm script (from apps/api):
 * // npm run generate-schedule -- --start 2026-01-01 --end 2026-12-31 --game-type roster
 *
 * // Or directly:
 * // npx tsx src/scripts/generate-schedule.ts --start 2026-01-01 --end 2026-12-31 --game-type roster
 */

import { AppDataSource } from '../data-source';
import { dateRange, seededRandom } from '../nba/daily/schedule-utils';

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs(): { start: string; end: string; gameType: string } {
  const args = process.argv.slice(2);
  const get = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : undefined;
  };

  const start = get('--start');
  const end = get('--end');
  const gameType = get('--game-type');

  if (!start || !end || !gameType) {
    console.error(
      'Usage: generate-schedule --start YYYY-MM-DD --end YYYY-MM-DD --game-type <type>',
    );
    process.exit(1);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) {
    console.error('Dates must be in YYYY-MM-DD format.');
    process.exit(1);
  }

  return { start, end, gameType };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

interface Slot {
  team_id: string;
  season_id: string;
}

async function main(): Promise<void> {
  const { start, end, gameType } = parseArgs();

  await AppDataSource.initialize();
  console.log(`Connected. Generating "${gameType}" schedule from ${start} to ${end}...`);

  const slots: Slot[] = await AppDataSource.query<Slot[]>(`
    SELECT DISTINCT team_id::text AS team_id, season_id
    FROM seasons
    WHERE season_type = 'Regular Season'
      AND team_id IS NOT NULL
      AND gp >= 1
    ORDER BY team_id, season_id
  `);

  if (slots.length === 0) {
    console.error('No qualifying (team_id, season_id) pairs found. Aborting.');
    await AppDataSource.destroy();
    process.exit(1);
  }

  console.log(`Found ${slots.length} qualifying team/season slots.`);

  let processed = 0;
  let skipped = 0;

  for (const date of dateRange(start, end)) {
    const rng = seededRandom(date);
    const slot = slots[Math.floor(rng() * slots.length)];

    const result = await AppDataSource.query(
      `
      INSERT INTO daily_challenges (game_type, challenge_date, team_id, season_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (game_type, challenge_date)
      DO UPDATE SET
        team_id   = EXCLUDED.team_id,
        season_id = EXCLUDED.season_id
      WHERE daily_challenges.curated = FALSE
      `,
      [gameType, date, slot.team_id, slot.season_id],
    );

    // rowCount === 0 means the conflict row was curated and left untouched.
    if (result.rowCount === 0) {
      skipped++;
    } else {
      processed++;
    }
  }

  console.log(`Done. Upserted: ${processed}, skipped (curated): ${skipped}.`);
  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error('Schedule generation failed:', err);
  process.exit(1);
});
