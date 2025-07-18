import { MultiplayerConfig } from '../statemachine/multiplayer/gamemachine.js';

export type HostRoomMessageBody = {
  userId: string;
  config: MultiplayerConfig;
};

export type JoinRoomMessageBody = {
  roomId: string;
  userId: string;
};
