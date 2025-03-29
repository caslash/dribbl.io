import { Actor, AnyStateMachine } from 'xstate';

export interface Room {
  id: string;
  statemachine: Actor<AnyStateMachine> | undefined;
  users: User[];
}

export interface User {
  id: string;
  name: string;
}
