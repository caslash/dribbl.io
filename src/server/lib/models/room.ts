import { Actor, AnyStateMachine } from 'xstate';

export type Room = {
  id: string;
  stateMachine: Actor<AnyStateMachine>;
  users: User[];
};

export type User = {
  id: string;
  name: string;
};
