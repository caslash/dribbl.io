import ora from 'ora';
import { searchPlayers } from './api.js';
import { promptPlayerSearch, promptSelectPlayer, promptTurnAction } from './prompts.js';
import type { GameSocket } from './socket.js';
import { waitForEvent } from './socket.js';
import type { GameConfig, TeamMap } from './types.js';
import { C, renderHistory, renderRoundHeader } from './ui.js';

export interface GameResult {
  score: number;
  quit: boolean;
}

export async function runGameLoop(
  socket: GameSocket,
  teamMap: TeamMap,
  config: GameConfig,
): Promise<GameResult> {
  let score = 0;
  let lives = config.lives;
  let round = 0;

  socket.emit('START_GAME');

  while (true) {
    round++;

    // ── Wait for server to generate a round ──────────────────────────────────
    const spinner = ora({ text: C.muted('Generating round…'), spinner: 'dots' }).start();
    const roundEvent = await waitForEvent(socket, 'NOTIFY_NEXT_ROUND', 'NOTIFY_GAME_OVER');
    spinner.stop();

    if (roundEvent.type === 'NOTIFY_GAME_OVER') break;

    score = roundEvent.score;
    if (roundEvent.lives !== undefined) lives = roundEvent.lives;

    renderRoundHeader(round, score, lives);
    console.log();
    console.log(`  ${C.label('Career Path:')}`);
    console.log(renderHistory(roundEvent.team_history, teamMap));
    console.log();

    // ── Turn loop — repeat until round resolves ───────────────────────────────
    let roundDone = false;
    while (!roundDone) {
      const action = await promptTurnAction();

      if (action === 'quit') {
        socket.emit('PLAYER_DISCONNECTED');
        return { score, quit: true };
      }

      if (action === 'skip') {
        socket.emit('SKIP');
        const skipEvent = await waitForEvent(socket, 'NOTIFY_SKIP_ROUND', 'NOTIFY_GAME_OVER');

        if (skipEvent.type === 'NOTIFY_GAME_OVER') {
          console.log();
          console.log(C.wrong('  💀 Game over! No lives remaining.'));
          return { score, quit: false };
        }

        if (skipEvent.lives !== undefined) lives = skipEvent.lives;
        console.log(C.muted(`  Skipped. Lives remaining: ${skipEvent.lives ?? '∞'}`));
        roundDone = true;
        continue;
      }

      // ── Guess flow ──────────────────────────────────────────────────────────
      const query = await promptPlayerSearch();

      const searchSpinner = ora({ text: C.muted('Searching…'), spinner: 'dots' }).start();
      let matches;
      try {
        matches = await searchPlayers(query);
      } catch (e) {
        searchSpinner.stop();
        const msg = e instanceof Error ? e.message : String(e);
        console.log(C.wrong(`  Error: ${msg}`));
        continue;
      }
      searchSpinner.stop();

      if (matches.length === 0) {
        console.log(C.muted('  No players found. Try again.'));
        continue;
      }

      const selected = await promptSelectPlayer(matches);
      if (!selected || selected === 'back') continue;

      socket.emit('USER_GUESS', { guessId: selected.playerId });

      const guessSpinner = ora({ text: C.muted('Checking…'), spinner: 'dots' }).start();
      const guessEvent = await waitForEvent(
        socket,
        'NOTIFY_CORRECT_GUESS',
        'NOTIFY_INCORRECT_GUESS',
        'NOTIFY_GAME_OVER',
      );
      guessSpinner.stop();
      console.log();

      if (guessEvent.type === 'NOTIFY_CORRECT_GUESS') {
        score++;
        console.log(C.correct('  ✅ Correct! Well done!'));

        const others = guessEvent.validAnswers.filter((p) => p.playerId !== selected.playerId);
        if (others.length > 0) {
          console.log(
            C.muted(`  Other valid answers: ${others.map((p) => p.fullName).join(', ')}`),
          );
        }
        roundDone = true;
      } else if (guessEvent.type === 'NOTIFY_GAME_OVER') {
        console.log(C.wrong('  ❌ Wrong — and no lives left. Game over!'));
        return { score, quit: false };
      } else {
        // NOTIFY_INCORRECT_GUESS
        if (guessEvent.lives !== undefined) lives = guessEvent.lives;
        console.log(C.wrong(`  ❌ Wrong. Lives remaining: ${guessEvent.lives ?? '∞'}`));

        if (lives !== undefined && lives <= 0) {
          roundDone = true;
        }
      }
    }
  }

  return { score, quit: false };
}
