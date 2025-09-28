import { users } from '@dribblio/database';
import { Actor, AnyStateMachine } from 'xstate';
import { MultiplayerConfig, SinglePlayerConfig } from '../dtos/gameconfigs.js';

export type Room = {
  id: string;
  statemachine: Actor<AnyStateMachine> | undefined;
  users: users.users[];
  config: SinglePlayerConfig | MultiplayerConfig;
  isMulti: boolean;
};
