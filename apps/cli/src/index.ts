import ora from 'ora';
import { fetchTeams } from './api.js';
import { runGameLoop } from './game.js';
import { promptConfig, promptPlayAgain, promptReady } from './prompts.js';
import { connectSocket, createSocket } from './socket.js';
import { banner, C, renderInstructions, renderResults } from './ui.js';

async function main(): Promise<void> {
  console.clear();
  banner();

  // Pre-fetch teams for display
  const teamsSpinner = ora({ text: C.muted('Loading team data…'), spinner: 'dots' }).start();
  let teamMap = {};
  try {
    teamMap = await fetchTeams();
    teamsSpinner.succeed(C.muted('Team data loaded.'));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    teamsSpinner.warn(C.muted(`Could not load teams (${msg}). Team IDs will be shown instead.`));
  }

  console.log();

  const config = await promptConfig();

  console.log();
  console.log(C.muted('  Connecting to server…'));

  const socket = createSocket();

  try {
    await connectSocket(socket);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(C.wrong(`\n  ${msg}\n`));
    process.exit(1);
  }

  console.log(C.muted('  Connected!'));

  // Send config and wait for acknowledgement
  socket.emit('SAVE_CONFIG', {
    config: {
      lives: config.lives,
      gameDifficulty: config.gameDifficulty,
    },
  });

  await new Promise<void>((resolve) => {
    socket.once('NOTIFY_CONFIG_SAVED', resolve);
  });

  console.log();
  renderInstructions();

  const ready = await promptReady();
  if (!ready) {
    socket.disconnect();
    console.log(C.muted('\n  Goodbye!\n'));
    process.exit(0);
  }

  const { score, quit } = await runGameLoop(socket, teamMap, config);

  socket.disconnect();
  renderResults(score, quit);

  const again = await promptPlayAgain();
  if (again) {
    await main();
  } else {
    console.log(C.muted('  Thanks for playing dribbl.io!\n'));
    process.exit(0);
  }
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(C.wrong(`\n  Fatal error: ${msg}\n`));
  process.exit(1);
});
