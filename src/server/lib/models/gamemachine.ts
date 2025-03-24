import { Queue } from 'elegant-queue';
import { Actor, AnyStateMachine } from 'xstate';

export type MultiplayerGuess = {
  userId: string;
  guessId: number;
};

export type GameMachine = {
  guessQueue: Queue<MultiplayerGuess> | undefined;
  statemachine: Actor<AnyStateMachine>;
};
