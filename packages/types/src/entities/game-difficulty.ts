import { SelectQueryBuilder } from 'typeorm';
import { Player } from './player.entity';

export type DifficultyFilter = (qb: SelectQueryBuilder<Player>) => SelectQueryBuilder<Player>;

export class GameDifficulties {
  public static readonly firstAllNBA: GameDifficulty = {
    name: 'firstallnba',
    display_name: 'First Team All-NBA Players',
    description: 'Every player that has appeared in the All-NBA First Team',
    filter: (qb) =>
      qb
        .innerJoin('player.accolades', 'accolade')
        .andWhere('accolade.description ILIKE :desc', {
          desc: '%All-NBA%',
        })
        .andWhere('subtype ILIKE :team', {
          team: '1',
        })
        .distinct(true),
  };

  public static readonly allNBA: GameDifficulty = {
    name: 'allnba',
    display_name: 'All-NBA Players',
    description: 'Every player that has appeared in any All-NBA team',
    filter: (qb) =>
      qb
        .innerJoin('player.accolades', 'accolade')
        .andWhere('accolade.description ILIKE :desc', {
          desc: '%All-NBA%',
        })
        .distinct(true),
  };

  public static readonly greatest75: GameDifficulty = {
    name: 'greatest75',
    display_name: 'Greatest 75',
    description: "Players named to the NBA's Greatest 75 list",
    filter: (qb) => qb.andWhere('player.greatest75Flag = :flag', { flag: true }),
  };

  public static readonly allPlayers: GameDifficulty = {
    name: 'allplayers',
    display_name: 'All Players',
    description: 'Every. Single. Player. Ever.',
    filter: (qb) => qb,
  };

  public static readonly allModes: GameDifficulty[] = [
    this.firstAllNBA,
    this.allNBA,
    this.greatest75,
    this.allPlayers,
  ];
}

export interface GameDifficulty {
  name: string;
  display_name: string;
  description: string;
  filter: DifficultyFilter;
}
