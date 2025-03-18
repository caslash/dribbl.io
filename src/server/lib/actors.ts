import { fromPromise } from 'xstate';

import { getPlayers, getRandomPlayer } from '@/server/actions';
import { GameDifficulties } from '@/server/lib/models/gamedifficulties';
import { Player } from '@prisma/client';

type RoundProps = {
  player: Player | undefined;
  validAnswers: Player[];
  players: Player[];
};

export const generateRound = fromPromise(async (): Promise<RoundProps> => {
  const player = await getRandomPlayer(GameDifficulties.firstAllNBA.filter);
  const validAnswers = await getPlayers({
    where: { team_history: { equals: player?.team_history } },
  });
  const players = (await getPlayers()).sort((a, b) => a.last_name!.localeCompare(b.last_name!));

  return {
    player,
    validAnswers,
    players,
  };
});
