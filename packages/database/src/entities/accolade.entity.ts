import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Player } from './player.entity';

@Entity('accolades')
export class Accolade {
  @PrimaryColumn({ type: 'bigint', name: 'player_id' })
  playerId: number;

  /** e.g. "2023-24" */
  @PrimaryColumn({ type: 'varchar', length: 7 })
  season: string;

  /** e.g. "NBA All-Star", "All-NBA First Team" */
  @PrimaryColumn({ type: 'text' })
  description: string;

  @Column({ type: 'text', default: '' })
  type: string;

  /** Team abbreviation or conference */
  @Column({ type: 'text', nullable: true })
  team: string | null;

  /** e.g. All-NBA team number as string */
  @Column({ type: 'text', nullable: true })
  subtype: string | null;

  @PrimaryColumn({ type: 'text', default: '' })
  month: string;

  @PrimaryColumn({ type: 'text', default: '' })
  week: string;

  @ManyToOne(() => Player, (player) => player.accolades)
  @JoinColumn({ name: 'player_id' })
  player: Player;
}
