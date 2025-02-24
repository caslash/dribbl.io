import { Prisma } from '@prisma/client';

const easyGameMode: Prisma.PlayerWhereInput = {
  AND: [
    {
      team_history: {
        contains: ',',
      },
    },
    {
      from_year: {
        gte: 1980,
      },
    },
    {
      OR: [
        {
          player_accolades: {
            accolades: {
              path: ['PlayerAwards'],
              array_contains: [
                {
                  SUBTYPE2: 'KIANT',
                  ALL_NBA_TEAM_NUMBER: '1',
                },
              ],
            },
          },
        },
      ],
    },
  ],
};

export class GameDifficulties {
  static easy: GameDifficulty = {
    name: 'easy',
    display_name: 'Easy',
    filter: easyGameMode,
  };
  static allModes: GameDifficulty[] = [GameDifficulties.easy];
}

interface GameDifficulty {
  name: string;
  display_name: string;
  filter: Prisma.PlayerWhereInput;
}
