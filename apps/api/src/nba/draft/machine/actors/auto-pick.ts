import { NbaDraftContext, NbaDraftEvent } from '@dribblio/types';
import { fromCallback } from 'xstate';

type AutoPickActorInput = {
  pool: NbaDraftContext['pool'];
  participantId: string;
  round: number;
};

/**
 * Selects a random available entry from the pool for the current participant
 * and immediately sends back an `AUTO_PICK_RESOLVED` event.
 *
 * Invoked when a turn timer expires and the current participant has not made
 * a pick within the allotted time.
 *
 * @example
 * invoke: {
 *   src: 'autoPickActor',
 *   input: ({ context }) => ({
 *     pool: context.pool,
 *     participantId: context.turnOrder[context.currentTurnIndex],
 *     round: context.currentRound,
 *   }),
 * }
 */
export const autoPickActor = fromCallback<NbaDraftEvent, AutoPickActorInput>(
  ({ input, sendBack }) => {
    const { pool, participantId, round } = input;

    const available = pool.filter((entry) => entry.available !== false);

    // Pool should never be empty here — `isPoolEmpty` guard ends the draft
    // before a new turn begins. If it somehow is, skip gracefully.
    if (available.length === 0) {
      return () => {};
    }

    const pick = available[Math.floor(Math.random() * available.length)];

    sendBack({
      type: 'AUTO_PICK_RESOLVED',
      pickRecord: { participantId, entryId: pick.entryId, round },
    });

    return () => {};
  },
);
