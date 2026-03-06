import { CareerPathConfig, Player } from '../entities';

export type NotifyNextRound = {
  type: 'NOTIFY_NEXT_ROUND';
  score: number;
  team_history: string[] | undefined;
  lives: number | undefined;
};

export type NotifyCareerPathConfigSaved = {
  type: 'NOTIFY_CONFIG_SAVED';
  config: CareerPathConfig;
};

export type NotifyCorrectGuess = {
  type: 'NOTIFY_CORRECT_GUESS';
  validAnswers: Player[];
};

export type NotifyIncorrectGuess = {
  type: 'NOTIFY_INCORRECT_GUESS';
  lives: number | undefined;
};

export type NotifySkipRound = {
  type: 'NOTIFY_SKIP_ROUND';
  lives: number | undefined;
};

export type NotifyGameOver = {
  type: 'NOTIFY_GAME_OVER';
};

export type CareerPathSocketEvent =
  | NotifyNextRound
  | NotifyCareerPathConfigSaved
  | NotifyCorrectGuess
  | NotifyIncorrectGuess
  | NotifySkipRound
  | NotifyGameOver;
