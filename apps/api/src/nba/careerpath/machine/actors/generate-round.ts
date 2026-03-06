import { GameDifficulty, Player } from '@dribblio/types';
import { fromPromise } from 'xstate';

export type RoundProps = {
  validAnswers: Player[];
};

type RoundInput = {
  input: {
    difficulty: GameDifficulty;
    generateRound: (difficulty: GameDifficulty) => Promise<RoundProps>;
  };
};

export const generateRoundActor = fromPromise(
  async ({ input }: RoundInput): Promise<RoundProps> => {
    return input.generateRound(input.difficulty);
  },
);
