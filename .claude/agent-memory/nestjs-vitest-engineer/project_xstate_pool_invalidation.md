---
name: XState pool invalidation — auto-transition pattern
description: invalidatingSelections now auto-advances via always; POOL_UPDATED event removed; test helper patterns for shared-playerId pool exhaustion
type: project
---

The `updatingPool.invalidatingSelections` state runs `invalidatePool` and `notifyPoolUpdated` as entry actions, then immediately auto-advances via an `always` transition to `done`. There is no external `POOL_UPDATED` event — the machine is fully self-driven after `SUBMIT_PICK`.

**Why:** Refactor to make pool invalidation a pure server-side derived computation rather than a client-triggered event, preventing desync.

**How to apply:**
- Never send `{ type: 'POOL_UPDATED', ... }` in tests — that event type is gone from the system.
- After a `SUBMIT_PICK`, the machine synchronously races through `pickMade` → `updatingPool.invalidatingSelections` → `updatingPool.done` → `checkingDraftEnd` → `advancingTurn` (or `draftComplete`) → back to `turnInProgress.awaitingPick`. All of this is observable in the same tick.
- `notifyPoolUpdated` calls `computeInvalidatedIds` on the **post-`invalidatePool`** context — entries are already marked `available: false` in the pool when the notification fires, but they're still in the pool array so `computeInvalidatedIds` still finds and returns their IDs.
- `makeEntry` must use `parseInt(id.replace(/\D/g, ''), 10) || 1` so `'e1'` → playerId 1, `'e2'` → 2, etc. The original `parseInt(id, 10) || 1` returned NaN for letter-prefixed IDs and gave every entry playerId 1.
- For pool-exhaustion tests (isPoolEmpty), override playerIds on the test entries to force shared-player invalidation: `const e1 = { ...makeEntry('e1'), playerId: 99 }; const e2 = { ...makeEntry('e2'), playerId: 99 }`.
- The `makePick` helper in `round and pickNumber computation` should only send `SUBMIT_PICK` — no `POOL_UPDATED` send.
