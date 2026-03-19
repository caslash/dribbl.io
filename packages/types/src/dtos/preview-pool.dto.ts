import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { DraftRoomConfigDto } from './draft-room-config.dto';

/**
 * Request body for previewing the pool that would be generated for a given config.
 *
 * @example
 * const dto: PreviewPoolDto = {
 *   config: { draftMode: 'mvp', draftOrder: 'snake', maxRounds: 5 },
 * };
 */
export class PreviewPoolDto {
  @ValidateNested()
  @Type(() => DraftRoomConfigDto)
  config: DraftRoomConfigDto;
}
