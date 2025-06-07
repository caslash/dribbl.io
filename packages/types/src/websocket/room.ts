import { Actor, AnyStateMachine } from 'xstate';
import { MultiplayerConfig } from '../statemachine/multiplayer/gamemachine.js';
import { SinglePlayerConfig } from '../statemachine/singleplayer/gamemachine.js';

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
