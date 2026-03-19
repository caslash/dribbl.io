import { IsIn, IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import type { DraftMode, DraftOrder } from '../entities';

/**
 * Validated DTO for draft room configuration.
 * Used as a nested object in {@link PreviewPoolDto}.
 */
export class DraftRoomConfigDto {
  /** @example 'mvp' */
  @IsIn(['mvp', 'franchise'])
  draftMode: DraftMode;

  /** @example 'snake' */
  @IsIn(['snake', 'linear'])
  draftOrder: DraftOrder;

  /** Minimum of 1 round required. */
  @IsInt()
  @Min(1)
  maxRounds: number;

  /** Turn duration in seconds. Omit for no timer. */
  @IsOptional()
  @IsInt()
  @IsPositive()
  turnDuration?: number;
}
