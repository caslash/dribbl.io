---
name: XState global on-handler with no target stays in current state
description: A root-level on handler with no target performs actions in-place; always guards in sibling states are not re-evaluated
type: project
---

The draft machine's global `on.PARTICIPANT_LEFT` handler has no `target` property — it only runs `removeParticipant` and `notifyParticipantLeft` in place. The machine does not transition; it stays in whatever state it was in.

**Why this matters for tests:** From `readyToStart`, sending `PARTICIPANT_LEFT` leaves the machine in `readyToStart` even if the participant count drops below 2. The `always` guard `minPlayersMet` lives in `waitingForPlayers`, not `readyToStart`, so it is never re-evaluated.

**How to apply:** When testing global on-handlers without a target, assert the machine stays in its current state (e.g., `{ lobby: 'readyToStart' }`), not a state that would only be reached via an `always` guard transition in a different sibling state.
