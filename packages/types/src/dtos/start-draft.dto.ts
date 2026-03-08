import { DraftRoomConfig } from '../entities';

export class StartDraftDto {
  config: DraftRoomConfig;
  savedPoolId?: string;
}
