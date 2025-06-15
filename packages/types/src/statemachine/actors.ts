import { fromPromise } from 'xstate';

import { nba } from '@dribblio/database';
import { GameDifficulty } from './gamedifficulties.js';
import { BaseGameService } from './gameservice.js';

type RoundInput = {
  input: {
    difficulty: GameDifficulty;
    gameService: BaseGameService;
  };
};

export type RoundProps = {
  validAnswers: nba.Player[];
  players: nba.Player[];
};

export const generateRound = fromPromise(async ({ input }: RoundInput): Promise<RoundProps> => {
  const { difficulty, gameService } = input;
  return await gameService.generateRound(difficulty);
});
