import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Player } from './player.entity';

@Entity('teams')
export class Team {
  @PrimaryColumn({ type: 'bigint', name: 'team_id' })
  teamId: number;

  @Column({ type: 'varchar', length: 10 })
  abbreviation: string;

  @Column({ type: 'text' })
  nickname: string;

  @Column({ type: 'text' })
  city: string;

  @Column({ type: 'text', nullable: true })
  state: string | null;

  @Column({ type: 'text', name: 'full_name' })
  fullName: string;

  @Column({ type: 'smallint', nullable: true, name: 'year_founded' })
  yearFounded: number | null;

  @OneToMany(() => Player, (player) => player.team)
  players: Player[];
}
