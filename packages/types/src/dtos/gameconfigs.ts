import { nba } from '@dribblio/database';
import { IsNumber, IsOptional } from 'class-validator';
import { Server, Socket } from 'socket.io';
import { XOR } from '../utils/xor.js';
import { Room } from '../websocket/room.js';
import { GameDifficulty } from './gamedifficulties.js';
import { UserGameInfo } from './user.js';

export type GameState = {
  roundActive: boolean;
  timeLeft: number;
  currentRound: number;
  users: UserGameInfo[];
  validAnswers: nba.Player[];
};

export type MultiplayerContext = {
  io: Server;
  room: Room;
  config: MultiplayerConfig;
  gameState: GameState;
};

export type SinglePlayerContext = {
  socket: Socket;
  config: SinglePlayerConfig;
  gameState: {
    score: number;
    validAnswers: nba.Player[];
    lives: number | undefined;
  };
};

export class SinglePlayerConfig {
  @IsOptional()
  @IsNumber()
  lives: number | undefined;

  gameDifficulty!: GameDifficulty;
}

type ScoreLimitConfig = {
  scoreLimit: number;
  roundTimeLimit: number;
  gameDifficulty: GameDifficulty;
};

type RoundLimitConfig = {
  roundLimit: number;
  roundTimeLimit: number;
  gameDifficulty: GameDifficulty;
};

export type MultiplayerConfig = XOR<ScoreLimitConfig, RoundLimitConfig>;
