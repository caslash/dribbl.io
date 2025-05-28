import { fromPromise } from 'xstate';

import { GameDifficulty } from './gamedifficulties.js';
import { Player } from '@dribblio/database';

type RoundInput = {
  input: {
    difficulty: GameDifficulty;
  };
};

type RoundProps = {
  validAnswers: Player[];
  players: Player[];
};

// TODO: Refactor to use /players endpoint
export const generateRound = fromPromise(async ({ input }: RoundInput): Promise<RoundProps> => {
  // const { difficulty } = input;
  // const player = await getRandomPlayer(difficulty.filter);
  // const validAnswers = await getPlayers({
  //   where: { team_history: { equals: player?.team_history } },
  // });
  // const players = (await getPlayers()).sort((a, b) => a.last_name!.localeCompare(b.last_name!));

  // return {
  //   validAnswers,
  //   players,
  // };
  return {
    validAnswers: [],
    players: [],
  };
});
