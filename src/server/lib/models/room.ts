import { MultiplayerConfig } from '@/server/lib/statemachines/multiplayer/gamemachine';
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
