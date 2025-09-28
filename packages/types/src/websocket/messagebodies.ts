import { MultiplayerConfig } from '../dtos/gameconfigs.js';

export type HostRoomMessageBody = {
  userId: string;
  config: MultiplayerConfig;
};

export type JoinRoomMessageBody = {
  roomId: string;
  userId: string;
};
