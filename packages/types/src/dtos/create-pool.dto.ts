import { DraftMode, PoolEntry } from '../entities';

export class CreatePoolDto {
  name: string;
  draftMode: DraftMode;
  visibility: 'public' | 'private';
  entries: PoolEntry[];
}
