import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Player } from './player.entity';
import { Team } from './team.entity';

export type SeasonType = 'Regular Season' | 'Playoffs';

/**
 * Per-game averages for one player/season/team/season-type combination.
 * TOT rows (multi-team seasons) have teamId=null and teamAbbreviation='TOT'.
 */
@Entity('seasons')
export class Season {
  @PrimaryColumn({ type: 'bigint', name: 'player_id' })
  playerId: number;

  /** e.g. "2023-24" */
  @PrimaryColumn({ type: 'varchar', length: 7, name: 'season_id' })
  seasonId: string;

  /** "LAL" or "TOT" for multi-team seasons */
  @PrimaryColumn({ type: 'varchar', length: 10, name: 'team_abbreviation' })
  teamAbbreviation: string;

  @PrimaryColumn({ type: 'varchar', name: 'season_type' })
  seasonType: SeasonType;

  @Column({ type: 'bigint', nullable: true, name: 'team_id' })
  teamId: number | null;

  @Column({ type: 'float', nullable: true, name: 'player_age' })
  playerAge: number | null;

  @Column({ type: 'smallint', nullable: true })
  gp: number | null;

  @Column({ type: 'smallint', nullable: true })
  gs: number | null;

  // --- Per-game averages ---

  @Column({ type: 'float', nullable: true, name: 'min_pg' })
  minPg: number | null;

  @Column({ type: 'float', nullable: true, name: 'fgm_pg' })
  fgmPg: number | null;

  @Column({ type: 'float', nullable: true, name: 'fga_pg' })
  fgaPg: number | null;

  @Column({ type: 'float', nullable: true, name: 'fg3m_pg' })
  fg3mPg: number | null;

  @Column({ type: 'float', nullable: true, name: 'fg3a_pg' })
  fg3aPg: number | null;

  @Column({ type: 'float', nullable: true, name: 'ftm_pg' })
  ftmPg: number | null;

  @Column({ type: 'float', nullable: true, name: 'fta_pg' })
  ftaPg: number | null;

  @Column({ type: 'float', nullable: true, name: 'oreb_pg' })
  orebPg: number | null;

  @Column({ type: 'float', nullable: true, name: 'dreb_pg' })
  drebPg: number | null;

  @Column({ type: 'float', nullable: true, name: 'reb_pg' })
  rebPg: number | null;

  @Column({ type: 'float', nullable: true, name: 'ast_pg' })
  astPg: number | null;

  @Column({ type: 'float', nullable: true, name: 'stl_pg' })
  stlPg: number | null;

  @Column({ type: 'float', nullable: true, name: 'blk_pg' })
  blkPg: number | null;

  @Column({ type: 'float', nullable: true, name: 'tov_pg' })
  tovPg: number | null;

  @Column({ type: 'float', nullable: true, name: 'pf_pg' })
  pfPg: number | null;

  @Column({ type: 'float', nullable: true, name: 'pts_pg' })
  ptsPg: number | null;

  // --- Shooting percentages ---

  @Column({ type: 'float', nullable: true, name: 'fg_pct' })
  fgPct: number | null;

  @Column({ type: 'float', nullable: true, name: 'fg3_pct' })
  fg3Pct: number | null;

  @Column({ type: 'float', nullable: true, name: 'ft_pct' })
  ftPct: number | null;

  @ManyToOne(() => Player, (player) => player.seasons)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @ManyToOne(() => Team, { nullable: true, eager: false })
  @JoinColumn({ name: 'team_id' })
  team: Team | null;
}
