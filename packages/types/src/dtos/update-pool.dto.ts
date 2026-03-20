import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import type { PoolEntry } from '../entities';

/**
 * Request body for partially updating a saved pool.
 * All fields are optional; only provided fields are updated.
 *
 * @example
 * const dto: UpdatePoolDto = { visibility: 'private' };
 */
export class UpdatePoolDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsIn(['public', 'private'])
  visibility?: 'public' | 'private';

  @IsOptional()
  @IsArray()
  entries?: PoolEntry[];
}
