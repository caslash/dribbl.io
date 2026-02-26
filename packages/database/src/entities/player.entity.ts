import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Accolade } from './accolade.entity';
import { Season } from './season.entity';
import { Team } from './team.entity';

@Entity('players')
export class Player {
  @PrimaryColumn({ type: 'bigint', name: 'player_id' })
  playerId: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ default: false, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'date', nullable: true })
  birthdate: string | null;

  @Column({ type: 'varchar', nullable: true })
  school: string | null;

  @Column({ type: 'varchar', nullable: true })
  country: string | null;

  /** Stored as "6-11" per API format */
  @Column({ type: 'varchar', nullable: true })
  height: string | null;

  @Column({ type: 'smallint', nullable: true, name: 'weight_lbs' })
  weightLbs: number | null;

  @Column({ type: 'varchar', nullable: true })
  position: string | null;

  /** TEXT to support "00", "1", etc. */
  @Column({ type: 'text', nullable: true, name: 'jersey_number' })
  jerseyNumber: string | null;

  @Column({ type: 'bigint', nullable: true, name: 'team_id' })
  teamId: number | null;

  @Column({ type: 'smallint', nullable: true, name: 'draft_year' })
  draftYear: number | null;

  @Column({ type: 'smallint', nullable: true, name: 'draft_round' })
  draftRound: number | null;

  @Column({ type: 'smallint', nullable: true, name: 'draft_number' })
  draftNumber: number | null;

  @Column({ type: 'smallint', nullable: true, name: 'from_year' })
  fromYear: number | null;

  @Column({ type: 'smallint', nullable: true, name: 'to_year' })
  toYear: number | null;

  @Column({ default: false, name: 'greatest_75_flag' })
  greatest75Flag: boolean;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Season, (season) => season.player)
  seasons: Season[];

  @OneToMany(() => Accolade, (accolade) => accolade.player)
  accolades: Accolade[];

  @ManyToOne(() => Team, (team) => team.players, { nullable: true })
  @JoinColumn({ name: 'team_id' })
  team: Team | null;
}
