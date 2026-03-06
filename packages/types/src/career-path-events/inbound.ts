import { CareerPathConfig, UserGuess } from '../entities/career-path-context';

export type StartGameEvent = {
  type: 'START_GAME';
};

export type SaveCareerPathConfigEvent = {
  type: 'SAVE_CONFIG';
  config: CareerPathConfig;
};

export type UserGuessEvent = {
  type: 'USER_GUESS';
  guess: UserGuess;
};

export type SkipEvent = {
  type: 'SKIP';
};

export type PlayerDisconnectedEvent = {
  type: 'PLAYER_DISCONNECTED';
};

export type CareerPathEvent =
  | SaveCareerPathConfigEvent
  | StartGameEvent
  | UserGuessEvent
  | SkipEvent
  | PlayerDisconnectedEvent;
