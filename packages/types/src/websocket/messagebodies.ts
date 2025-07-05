import { MultiplayerConfig } from '../statemachine/multiplayer/gamemachine.js';
import { SinglePlayerConfig } from '../statemachine/singleplayer/gamemachine.js';

export type HostRoomMessageBody = {
  isMulti: boolean;
  userId: string;
  config: MultiplayerConfig | SinglePlayerConfig;
};

export type JoinRoomMessageBody = {
  roomId: string;
  userId: string;
};
