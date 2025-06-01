import { fromPromise } from 'xstate';

import { GameDifficulty } from './gamedifficulties.js';
import { Player } from '@dribblio/database';
import { BaseGameService } from './gameservice.js';

type RoundInput = {
  input: {
    difficulty: GameDifficulty;
    gameService: BaseGameService;
  };
};

export type RoundProps = {
  validAnswers: Player[];
  players: Player[];
};

export const generateRound = fromPromise(async ({ input }: RoundInput): Promise<RoundProps> => {
  const { difficulty, gameService } = input;
  return await gameService.generateRound(difficulty);
});
