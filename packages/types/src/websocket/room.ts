import { users } from '@dribblio/database';
import { Actor, AnyStateMachine } from 'xstate';
import { MultiplayerConfig } from '../statemachine/multiplayer/gamemachine.js';
import { SinglePlayerConfig } from '../statemachine/singleplayer/gamemachine.js';

export interface Room {
  id: string;
  statemachine: Actor<AnyStateMachine> | undefined;
  users: users.User[];
  config: SinglePlayerConfig | MultiplayerConfig;
  isMulti: boolean;
}
