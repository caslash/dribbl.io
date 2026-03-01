import { NbaDraftContext } from '@/nba/draft/entities/machine/context';
import { NbaDraftEvent } from '@/nba/draft/entities/machine/events/inbound';
import type { GuardArgs } from 'xstate';

type DraftGuardArgs = GuardArgs<NbaDraftContext, NbaDraftEvent>;

const areRoundsRemaining = ({ context }: DraftGuardArgs): boolean => {
  return context.currentTurnIndex < context.turnOrder.length;
};

const isPoolEmpty = ({ context }: DraftGuardArgs): boolean => {
  return context.pool.every((entry) => !entry.available);
};

const minPlayersMet = ({ context }: DraftGuardArgs): boolean => {
  return context.participants.length >= 2;
};

export const guards = { areRoundsRemaining, isPoolEmpty, minPlayersMet };
