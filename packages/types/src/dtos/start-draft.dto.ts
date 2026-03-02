import { RoomConfig } from '../entities';

export class StartDraftDto {
  config: RoomConfig;
  savedPoolId?: string;
}
