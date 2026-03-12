'use client';

import { useDraftContext } from '@/context/draftcontext';

/**
 * Exposes the full NBA All-Time Draft context: current state, computed helpers,
 * and all action callbacks.
 *
 * Must be used within a `DraftProvider` — throws otherwise.
 *
 * @returns The current draft state along with `isMyTurn`, `currentTurnParticipant`,
 *   and action functions: `createRoom`, `joinRoom`, `saveConfig`, `startDraft`,
 *   `submitPick`, and `leave`.
 *
 * @example
 * const { state, isMyTurn, submitPick } = useDraft();
 *
 * if (isMyTurn) {
 *   submitPick(entry.entryId);
 * }
 */
export function useDraft() {
  return useDraftContext();
}
