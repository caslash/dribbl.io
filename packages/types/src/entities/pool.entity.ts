import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DraftMode, PoolEntry } from './context';

@Entity()
export class SavedPool {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ['mvp', 'franchise', 'custom'] })
  draftMode: DraftMode | 'custom';

  @Column({ type: 'enum', enum: ['public', 'private'] })
  visibility: 'public' | 'private';

  @Column({ type: 'jsonb' })
  entries: PoolEntry[];

  @Column({ nullable: true })
  createdBy: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
