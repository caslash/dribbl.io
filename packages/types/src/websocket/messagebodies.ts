import { MultiplayerConfig } from '../statemachine/multiplayer/gamemachine.js';
import { SinglePlayerConfig } from '../statemachine/singleplayer/gamemachine.js';

export interface HostRoomMessageBody {
  isMulti: boolean;
  userName: string;
  config: MultiplayerConfig | SinglePlayerConfig;
}

export interface JoinRoomMessageBody {
  roomId: string;
  userName: string;
}
