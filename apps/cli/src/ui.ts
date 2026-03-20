import chalk from 'chalk';
import figlet from 'figlet';
import type { TeamMap } from './types.js';

// ─── Colour palette ───────────────────────────────────────────────────────────

export const C = {
  title: chalk.bold.hex('#F97316'),
  dim: chalk.dim,
  label: chalk.bold.white,
  team: chalk.bold.cyan,
  correct: chalk.bold.green,
  wrong: chalk.bold.red,
  info: chalk.bold.yellow,
  muted: chalk.gray,
  arrow: chalk.bold.hex('#F97316')('→'),
} as const;

// ─── Primitive helpers ────────────────────────────────────────────────────────

export function hr(char = '─', len = 60): string {
  return C.dim(char.repeat(len));
}

export function banner(): void {
  const art = figlet.textSync('dribbl.io', { font: 'Slant' });
  console.log(C.title(art));
  console.log(C.muted('  NBA Career Path Game  •  CLI Edition'));
  console.log();
}

export function livesDisplay(lives: number | undefined): string {
  if (lives === undefined) return C.muted('∞');
  const full = '❤️ '.repeat(lives);
  const empty = '🖤 '.repeat(Math.max(0, 3 - lives));
  return full + empty;
}

export function renderHistory(teamHistory: string[] | undefined, teamMap: TeamMap): string {
  if (!teamHistory || teamHistory.length === 0) {
    return C.muted('  (no team history available)');
  }

  const resolved = teamHistory.map((id) => {
    const team = teamMap[id];
    return team ? team.abbreviation : `#${id}`;
  });

  const line = resolved.map((t) => C.team(t)).join(C.dim(' → '));
  return `  ${line}`;
}

export function renderRoundHeader(round: number, score: number, lives: number | undefined): void {
  console.log();
  console.log(hr());
  console.log(
    `  ${C.label(`Round ${round}`)}` +
      `   Score: ${C.info(score)}` +
      `   Lives: ${livesDisplay(lives)}`,
  );
  console.log(hr());
}

export function renderResults(score: number, quit: boolean): void {
  console.log();
  console.log(hr('═'));
  console.log();

  if (quit) {
    console.log(C.muted('  You quit the game.'));
  } else {
    const medal = score >= 20 ? '🥇' : score >= 10 ? '🥈' : score >= 5 ? '🥉' : '💀';
    console.log(`  ${medal}  ${C.label('Final Score:')} ${C.info(score)}`);
  }

  console.log();
  console.log(hr('═'));
  console.log();
}

export function renderInstructions(): void {
  console.log(C.label('  How to play:'));
  console.log(C.muted("  You'll see a sequence of NBA team abbreviations — that's a"));
  console.log(C.muted("  player's career path. Guess which player(s) match it."));
  console.log();
}
