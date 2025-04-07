import { fromPromise } from 'xstate';

import { getPlayers, getRandomPlayer } from '@/server/actions';
import { GameDifficulty } from '@/server/lib/models/gamedifficulties';
import { Player } from '@prisma/client';

type RoundInput = {
  input: {
    difficulty: GameDifficulty;
  };
};

type RoundProps = {
  validAnswers: Player[];
  players: Player[];
};

export const generateRound = fromPromise(async ({ input }: RoundInput): Promise<RoundProps> => {
  const { difficulty } = input;
  const player = await getRandomPlayer(difficulty.filter);
  const validAnswers = await getPlayers({
    where: { team_history: { equals: player?.team_history } },
  });
  const players = (await getPlayers()).sort((a, b) => a.last_name!.localeCompare(b.last_name!));

  return {
    validAnswers,
    players,
  };
});
