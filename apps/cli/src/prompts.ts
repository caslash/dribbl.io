import inquirer from 'inquirer';
import { DIFFICULTIES, MAX_PLAYER_SEARCH_RESULTS } from './config.js';
import type { GameConfig, Player } from './types.js';
import { C } from './ui.js';
// inquirer v9 ESM: Separator lives on the default export
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Separator = (inquirer as any).Separator as new () => unknown;

export async function promptConfig(): Promise<GameConfig> {
  const { difficulty } = await inquirer.prompt<{ difficulty: string }>([
    {
      type: 'list',
      name: 'difficulty',
      message: 'Choose difficulty (player pool):',
      choices: DIFFICULTIES,
      default: 'greatest75',
    },
  ]);

  const { livesMode } = await inquirer.prompt<{ livesMode: string }>([
    {
      type: 'list',
      name: 'livesMode',
      message: 'Lives mode:',
      choices: [
        { name: '∞  Unlimited lives (endless mode)', value: 'unlimited' },
        { name: '3  Lives', value: '3' },
        { name: '5  Lives', value: '5' },
        { name: '1  Life (one-shot mode)', value: '1' },
      ],
    },
  ]);

  return {
    gameDifficulty: difficulty,
    lives: livesMode === 'unlimited' ? undefined : parseInt(livesMode, 10),
  };
}

export type TurnAction = 'guess' | 'skip' | 'quit';

export async function promptTurnAction(): Promise<TurnAction> {
  const { action } = await inquirer.prompt<{ action: TurnAction }>([
    {
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        { name: '🎯  Make a guess', value: 'guess' },
        { name: '⏭️   Skip this round', value: 'skip' },
        { name: '🚪  Quit game', value: 'quit' },
      ],
    },
  ]);
  return action;
}

export async function promptPlayerSearch(): Promise<string> {
  const { query } = await inquirer.prompt<{ query: string }>([
    {
      type: 'input',
      name: 'query',
      message: 'Search player name:',
      validate: (v: string) => v.trim().length >= 2 || 'Enter at least 2 characters',
    },
  ]);
  return query.trim();
}

export type PlayerSelection = Player | 'back' | null;

export async function promptSelectPlayer(matches: Player[]): Promise<PlayerSelection> {
  const overflow = matches.length > MAX_PLAYER_SEARCH_RESULTS;
  const visible = matches.slice(0, MAX_PLAYER_SEARCH_RESULTS);

  type ChoiceValue = Player | 'back' | null;

  const choices: Array<{ name: string; value: ChoiceValue; short?: string } | unknown> =
    visible.map((p) => ({
      name: `${p.fullName}${p.fromYear ? C.muted(` (${p.fromYear}–${p.toYear ?? 'present'})`) : ''}`,
      value: p as ChoiceValue,
      short: p.fullName,
    }));

  if (overflow) {
    choices.push({
      name: C.muted(
        `  … and ${matches.length - MAX_PLAYER_SEARCH_RESULTS} more. Refine your search.`,
      ),
      value: null,
    });
  }

  choices.push(new Separator());
  choices.push({ name: C.muted('↩  Back'), value: 'back' });

  const { selected } = await inquirer.prompt<{ selected: ChoiceValue }>([
    {
      type: 'list',
      name: 'selected',
      message: 'Select a player:',
      choices,
      pageSize: 12,
    },
  ]);

  return selected;
}

export async function promptReady(): Promise<boolean> {
  const { ready } = await inquirer.prompt<{ ready: boolean }>([
    {
      type: 'confirm',
      name: 'ready',
      message: 'Ready to play?',
      default: true,
    },
  ]);
  return ready;
}

export async function promptPlayAgain(): Promise<boolean> {
  const { again } = await inquirer.prompt<{ again: boolean }>([
    {
      type: 'confirm',
      name: 'again',
      message: 'Play again?',
      default: true,
    },
  ]);
  return again;
}
