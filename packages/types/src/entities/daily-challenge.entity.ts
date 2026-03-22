import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Team } from './team.entity';

/**
 * One scheduled daily challenge row.
 *
 * Each row pairs a specific team + season with a calendar date for a given
 * game type. The `curated` flag marks rows that were hand-picked and must
 * not be overwritten by the schedule generation script.
 */
@Entity('daily_challenges')
export class DailyChallenge {
  /** Auto-generated UUID primary key. */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Discriminator for the game type this challenge belongs to.
   * e.g. `'roster'`
   */
  @Column({ name: 'game_type', type: 'text' })
  gameType: string;

  /**
   * The calendar date this challenge is active for.
   * TypeORM returns `DATE` columns as `"YYYY-MM-DD"` strings.
   */
  @Column({ name: 'challenge_date', type: 'date' })
  challengeDate: string;

  /** Foreign key to `teams.team_id`. */
  @Column({ name: 'team_id', type: 'bigint' })
  teamId: number;

  /** e.g. `"2023-24"` */
  @Column({ name: 'season_id', type: 'varchar', length: 7 })
  seasonId: string;

  /**
   * When true, this row was hand-curated and the schedule script must not
   * overwrite it on conflict.
   */
  @Column({ type: 'boolean', default: false })
  curated: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * The team associated with this challenge.
   * Not loaded by default — join explicitly when needed.
   */
  @ManyToOne(() => Team)
  @JoinColumn({ name: 'team_id' })
  team: Team;
}
