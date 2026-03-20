import { IsArray, IsIn, IsNotEmpty, IsString } from 'class-validator';
import type { DraftMode, PoolEntry } from '../entities';

/**
 * Request body for creating a new saved pool.
 *
 * @example
 * const dto: CreatePoolDto = {
 *   name: 'My MVP Pool',
 *   draftMode: 'mvp',
 *   visibility: 'public',
 *   entries: [],
 * };
 */
export class CreatePoolDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(['mvp', 'franchise'])
  draftMode: DraftMode;

  @IsIn(['public', 'private'])
  visibility: 'public' | 'private';

  @IsArray()
  entries: PoolEntry[];
}
