import { fromPromise } from 'xstate';

import { nba } from '@dribblio/database';
import { GameDifficulty } from '@dribblio/types/src/dtos/gamedifficulties';
import { BaseGameService } from './gameservice';

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
