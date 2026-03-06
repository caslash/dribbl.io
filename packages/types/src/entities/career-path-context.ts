import { GameDifficulty } from './game-difficulty';
import { Player } from './player.entity';

export type CareerPathConfig = {
  lives: number | undefined;
  gameDifficulty: GameDifficulty;
};

export type UserGuess = {
  guessId: number;
};

export type CareerPathContext = {
  config: CareerPathConfig;
  gameState: {
    score: number;
    validAnswers: Player[];
    lives: number | undefined;
  };
};
