import { IsOptional, IsUUID } from 'class-validator';

/**
 * Optional body for the `ORGANIZER_START_DRAFT` WebSocket event.
 * If `savedPoolId` is provided, the draft loads that pool instead of generating one.
 *
 * @example
 * const dto: StartDraftDto = { savedPoolId: 'a1b2c3d4-...' };
 */
export class StartDraftDto {
  @IsOptional()
  @IsUUID()
  savedPoolId?: string;
}
