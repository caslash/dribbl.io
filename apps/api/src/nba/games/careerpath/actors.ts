import { fromPromise } from 'xstate';

import { GameDifficulty } from '@dribblio/types';
import { Player } from '@dribblio/database';
import { GameService } from './game.service';

type RoundInput = {
  input: {
    difficulty: GameDifficulty;
    gameService: GameService;
  };
};

export type RoundProps = {
  validAnswers: Player[];
  players: Player[];
};

export const generateRound = fromPromise(
  async ({ input }: RoundInput): Promise<RoundProps> => {
    const { difficulty, gameService } = input;
    return await gameService.generateRound(difficulty);
  },
);
