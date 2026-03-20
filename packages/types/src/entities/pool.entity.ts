import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DraftMode, PoolEntry } from './draft-context';

@Entity('pools')
export class SavedPool {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'draft_mode', type: 'enum', enum: ['mvp', 'franchise', 'custom'] })
  draftMode: DraftMode | 'custom';

  @Column({ type: 'enum', enum: ['public', 'private'] })
  visibility: 'public' | 'private';

  @Column({ type: 'jsonb' })
  entries: PoolEntry[];

  @Column({ name: 'created_by', type: 'text', nullable: true })
  createdBy: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
