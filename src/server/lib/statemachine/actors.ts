import { fromPromise } from 'xstate';

import { getPlayers, getRandomPlayer } from '@/server/actions';
import { Player } from '@prisma/client';
import { GameModes } from '../gamemodes';

type RoundProps = {
  player: Player | undefined;
  validAnswers: Player[];
};

export const generateRound = fromPromise(async (): Promise<RoundProps> => {
  const player = await getRandomPlayer(GameModes.easy.filter);
  const validAnswers = await getPlayers({
    where: { team_history: { equals: player?.team_history } },
  });

  return {
    player,
    validAnswers,
  };
});
