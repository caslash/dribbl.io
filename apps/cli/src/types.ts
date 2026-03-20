// ─── Entities (lightweight mirrors of @dribblio/types) ───────────────────────
// We intentionally avoid importing @dribblio/types directly because it pulls
// in TypeORM, reflect-metadata, and other backend-only dependencies.

export interface Team {
  teamId: number;
  abbreviation: string;
  nickname: string;
  city: string;
  state: string | null;
  fullName: string;
  yearFounded: number | null;
}

export interface Player {
  playerId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  isActive: boolean;
  fromYear: number | null;
  toYear: number | null;
  teamId: number | null;
}

// ─── Inbound events (Client → Server) ────────────────────────────────────────

export interface StartGameEvent {
  type: 'START_GAME';
}

export interface SaveConfigEvent {
  type: 'SAVE_CONFIG';
  config: {
    lives: number | undefined;
    gameDifficulty: string;
  };
}

export interface UserGuessEvent {
  type: 'USER_GUESS';
  guess: { guessId: number };
}

export interface SkipEvent {
  type: 'SKIP';
}

export interface PlayerDisconnectedEvent {
  type: 'PLAYER_DISCONNECTED';
}

// ─── Outbound events (Server → Client) ───────────────────────────────────────

export interface NotifyNextRound {
  type: 'NOTIFY_NEXT_ROUND';
  score: number;
  team_history: string[] | undefined;
  lives: number | undefined;
}

export interface NotifyConfigSaved {
  type: 'NOTIFY_CONFIG_SAVED';
}

export interface NotifyCorrectGuess {
  type: 'NOTIFY_CORRECT_GUESS';
  validAnswers: Player[];
}

export interface NotifyIncorrectGuess {
  type: 'NOTIFY_INCORRECT_GUESS';
  lives: number | undefined;
}

export interface NotifySkipRound {
  type: 'NOTIFY_SKIP_ROUND';
  lives: number | undefined;
}

export interface NotifyGameOver {
  type: 'NOTIFY_GAME_OVER';
}

export type ServerEvent =
  | NotifyNextRound
  | NotifyConfigSaved
  | NotifyCorrectGuess
  | NotifyIncorrectGuess
  | NotifySkipRound
  | NotifyGameOver;

// ─── Game config ──────────────────────────────────────────────────────────────

export interface GameConfig {
  gameDifficulty: string;
  lives: number | undefined;
}

export interface Difficulty {
  name: string;
  value: string;
}

export type TeamMap = Record<string, Team>;
