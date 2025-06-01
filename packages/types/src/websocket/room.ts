import { MultiplayerConfig } from '../statemachine/multiplayer/gamemachine.js';
import { SinglePlayerConfig } from '../statemachine/singleplayer/gamemachine.js';
import { Actor, AnyStateMachine } from 'xstate';

export interface Room {
  id: string;
  statemachine: Actor<AnyStateMachine> | undefined;
  users: User[];
  config: SinglePlayerConfig | MultiplayerConfig;
}

export interface User {
  id: string;
  name: string;
}
