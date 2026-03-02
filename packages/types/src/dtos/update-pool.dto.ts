import { PoolEntry } from '../entities';

export class UpdatePoolDto {
  name?: string;
  visibility?: 'public' | 'private';
  entries?: PoolEntry[];
}
