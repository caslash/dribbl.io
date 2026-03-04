import { createDraftMachine } from '@/nba/draft/machine/statemachine';
import type { Participant, PickRecord, PoolEntry, RoomConfig } from '@dribblio/types';

/**
 * The socketActor stub captures every event the machine sends via sendTo('socket', …).
 * vi.hoisted is required so socketState is accessible inside the vi.mock factory,
 * which is hoisted above all imports.
 */
const socketState = vi.hoisted(() => ({
  received: [] as any[],
  sendBack: null as ((e: any) => void) | null,
}));

vi.mock('@/nba/draft/machine/actors/websocket', async () => {
  const { fromCallback } = await import('xstate');
  return {
    socketActor: fromCallback<any, any>(({ sendBack, receive }) => {
      socketState.sendBack = sendBack;
      receive((e: any) => socketState.received.push(e));
      return () => {};
    }),
  };
});

vi.mock('@/nba/draft/machine/actors/timer', async () => {
  const { fromCallback } = await import('xstate');
  return { timerActor: fromCallback(() => () => {}) };
});

// ---------------------------------------------------------------------------
// Helper factories
// ---------------------------------------------------------------------------

const makeParticipant = (id: string, isOrganizer = false): Participant => ({
  id,
  name: `Player ${id}`,
  isOrganizer,
  isConnected: true,
});

const makeConfig = (): RoomConfig => ({
  draftMode: 'mvp',
  draftOrder: 'snake',
  maxRounds: 2,
  turnDuration: 30000,
});

const makeEntry = (id: string, available = true): PoolEntry =>
  ({
    id,
    playerId: `player-${id}`,
    player: { id: `player-${id}`, name: `Player ${id}` },
    season: '2023-24',
    available,
  }) as PoolEntry;

const makePickRecord = (
  participantId: string,
  pick: PoolEntry,
  turnIndex = 0,
  round = 1,
): PickRecord => ({
  participantId,
  pick,
  round,
  turnIndex,
  wasAutoPicked: false,
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('NbaDraftMachine', () => {
  let actor: ReturnType<typeof createDraftMachine>;
  const mockInput = { io: {} as any, roomId: 'TEST1' };

  beforeEach(() => {
    vi.clearAllMocks();
    socketState.received = [];
    socketState.sendBack = null;
  });

  beforeEach(() => {
    actor = createDraftMachine(mockInput);
  });

  afterEach(() => {
    actor.stop();
  });

  // -------------------------------------------------------------------------
  // Setup helpers (used across multiple describe blocks)
  // -------------------------------------------------------------------------

  const addParticipant = (id: string, isOrganizer = false) => {
    actor.send({ type: 'PARTICIPANT_JOINED', participant: makeParticipant(id, isOrganizer) });
  };

  const addTwoParticipants = () => {
    addParticipant('A', true);
    addParticipant('B');
  };

  const startDraft = (pool: PoolEntry[], turnOrder: string[]) => {
    addTwoParticipants();
    actor.send({ type: 'ORGANIZER_START_DRAFT', pool, turnOrder });
  };

  // =========================================================================
  // 1. Initial state
  // =========================================================================

  describe('initial state', () => {
    it('should start in lobby.waitingForPlayers', () => {
      expect(actor.getSnapshot().matches({ lobby: 'waitingForPlayers' })).toBe(true);
    });

    it('should have empty context defaults', () => {
      const { context } = actor.getSnapshot();
      expect(context.participants).toEqual([]);
      expect(context.pool).toEqual([]);
      expect(context.turnOrder).toEqual([]);
      expect(context.pickHistory).toEqual([]);
      expect(context.currentRound).toBe(0);
      expect(context.currentTurnIndex).toBe(0);
    });
  });

  // =========================================================================
  // 2. Lobby — waitingForPlayers
  // =========================================================================

  describe('lobby.waitingForPlayers', () => {
    it('should remain in waitingForPlayers when fewer than 2 participants have joined', () => {
      addParticipant('A', true);

      expect(actor.getSnapshot().matches({ lobby: 'waitingForPlayers' })).toBe(true);
      expect(actor.getSnapshot().context.participants).toHaveLength(1);
    });

    it('should send NOTIFY_PARTICIPANT_JOINED when a participant joins', () => {
      const p = makeParticipant('A', true);
      actor.send({ type: 'PARTICIPANT_JOINED', participant: p });

      expect(socketState.received).toContainEqual({ type: 'NOTIFY_PARTICIPANT_JOINED', participant: p });
    });

    it('should auto-transition to readyToStart and send NOTIFY_READY_TO_START when the second participant joins', () => {
      addParticipant('A', true);
      addParticipant('B');

      expect(actor.getSnapshot().matches({ lobby: 'readyToStart' })).toBe(true);
      expect(socketState.received).toContainEqual({ type: 'NOTIFY_READY_TO_START' });
    });

    it('should remove the participant and send NOTIFY_PARTICIPANT_LEFT on PARTICIPANT_LEFT', () => {
      addParticipant('A', true);
      actor.send({ type: 'PARTICIPANT_LEFT', participantId: 'A' });

      expect(actor.getSnapshot().context.participants).toHaveLength(0);
      expect(socketState.received).toContainEqual({
        type: 'NOTIFY_PARTICIPANT_LEFT',
        participantId: 'A',
      });
    });

    it('should transition to lobby.configuring on ORGANIZER_CONFIGURE', () => {
      actor.send({ type: 'ORGANIZER_CONFIGURE' });

      expect(actor.getSnapshot().matches({ lobby: 'configuring' })).toBe(true);
    });
  });

  // =========================================================================
  // 3. Lobby — configuring
  // =========================================================================

  describe('lobby.configuring', () => {
    beforeEach(() => {
      actor.send({ type: 'ORGANIZER_CONFIGURE' });
      socketState.received = [];
    });

    it('should transition back to waitingForPlayers and update context.config on SAVE_CONFIG', () => {
      const config = makeConfig();
      actor.send({ type: 'SAVE_CONFIG', config });

      expect(actor.getSnapshot().matches({ lobby: 'waitingForPlayers' })).toBe(true);
      expect(actor.getSnapshot().context.config).toEqual(config);
    });

    it('should send NOTIFY_CONFIG_SAVED with the saved config', () => {
      const config = makeConfig();
      actor.send({ type: 'SAVE_CONFIG', config });

      expect(socketState.received).toContainEqual({ type: 'NOTIFY_CONFIG_SAVED', config });
    });
  });

  // =========================================================================
  // 4. Lobby — readyToStart
  // =========================================================================

  describe('lobby.readyToStart', () => {
    beforeEach(() => {
      addTwoParticipants();
      socketState.received = [];
    });

    it('should be in readyToStart after two participants join', () => {
      expect(actor.getSnapshot().matches({ lobby: 'readyToStart' })).toBe(true);
    });

    it('should transition back to waitingForPlayers and remove the participant on PARTICIPANT_LEFT', () => {
      actor.send({ type: 'PARTICIPANT_LEFT', participantId: 'B' });

      expect(actor.getSnapshot().matches({ lobby: 'waitingForPlayers' })).toBe(true);
      expect(actor.getSnapshot().context.participants.find((p) => p.id === 'B')).toBeUndefined();
    });

    it('should transition to lobby.configuring on ORGANIZER_CONFIGURE', () => {
      actor.send({ type: 'ORGANIZER_CONFIGURE' });

      expect(actor.getSnapshot().matches({ lobby: 'configuring' })).toBe(true);
    });
  });

  // =========================================================================
  // 5. Draft — starting (ORGANIZER_START_DRAFT)
  // =========================================================================

  describe('draft starting via ORGANIZER_START_DRAFT', () => {
    const pool = [makeEntry('e1'), makeEntry('e2')];
    const turnOrder = ['A', 'B', 'A', 'B'];

    beforeEach(() => {
      startDraft(pool, turnOrder);
    });

    it('should enter draft.turnInProgress.awaitingPick', () => {
      expect(
        actor.getSnapshot().matches({ draft: { turnInProgress: 'awaitingPick' } }),
      ).toBe(true);
    });

    it('should set pool, turnOrder, currentRound, currentTurnIndex, and reset pickHistory', () => {
      const { context } = actor.getSnapshot();
      expect(context.pool).toEqual(pool);
      expect(context.turnOrder).toEqual(turnOrder);
      expect(context.currentRound).toBe(1);
      expect(context.currentTurnIndex).toBe(0);
      expect(context.pickHistory).toEqual([]);
    });

    it('should send NOTIFY_DRAFT_STARTED with the pool and turn order', () => {
      expect(socketState.received).toContainEqual({
        type: 'NOTIFY_DRAFT_STARTED',
        pool,
        turnOrder,
      });
    });
  });

  // =========================================================================
  // 6. Draft — pick flow (SUBMIT_PICK → POOL_UPDATED)
  // =========================================================================

  describe('draft pick flow', () => {
    const e1 = makeEntry('e1');
    const e2 = makeEntry('e2');
    const pool = [e1, e2];
    const turnOrder = ['A', 'B', 'A', 'B'];

    beforeEach(() => {
      startDraft(pool, turnOrder);
      socketState.received = [];
    });

    it('should enter updatingPool.invalidatingSelections and append the pick after SUBMIT_PICK', () => {
      const pickRecord = makePickRecord('A', e1);
      actor.send({ type: 'SUBMIT_PICK', pickRecord });

      expect(
        actor.getSnapshot().matches({ draft: { updatingPool: 'invalidatingSelections' } }),
      ).toBe(true);
      expect(actor.getSnapshot().context.pickHistory).toHaveLength(1);
      expect(actor.getSnapshot().context.pickHistory[0]).toEqual(pickRecord);
    });

    it('should send NOTIFY_PICK_CONFIRMED after SUBMIT_PICK', () => {
      const pickRecord = makePickRecord('A', e1);
      actor.send({ type: 'SUBMIT_PICK', pickRecord });

      expect(socketState.received).toContainEqual({ type: 'NOTIFY_PICK_CONFIRMED', pickRecord });
    });

    it('should return to awaitingPick after POOL_UPDATED when rounds remain', () => {
      actor.send({ type: 'SUBMIT_PICK', pickRecord: makePickRecord('A', e1) });
      actor.send({ type: 'POOL_UPDATED', invalidatedIds: new Set([e1.id]) });

      expect(
        actor.getSnapshot().matches({ draft: { turnInProgress: 'awaitingPick' } }),
      ).toBe(true);
    });

    it('should mark invalidated entries as unavailable after POOL_UPDATED', () => {
      actor.send({ type: 'SUBMIT_PICK', pickRecord: makePickRecord('A', e1) });
      actor.send({ type: 'POOL_UPDATED', invalidatedIds: new Set([e1.id]) });

      const updatedE1 = actor.getSnapshot().context.pool.find((e) => e.id === e1.id);
      expect(updatedE1?.available).toBe(false);

      const updatedE2 = actor.getSnapshot().context.pool.find((e) => e.id === e2.id);
      expect(updatedE2?.available).toBe(true);
    });

    it('should send NOTIFY_POOL_UPDATED and NOTIFY_TURN_ADVANCED after POOL_UPDATED', () => {
      actor.send({ type: 'SUBMIT_PICK', pickRecord: makePickRecord('A', e1) });
      actor.send({ type: 'POOL_UPDATED', invalidatedIds: new Set([e1.id]) });

      expect(socketState.received).toContainEqual({
        type: 'NOTIFY_POOL_UPDATED',
        invalidatedIds: [e1.id],
      });
      expect(socketState.received).toContainEqual({
        type: 'NOTIFY_TURN_ADVANCED',
        currentTurnIndex: 1,
        currentRound: 1,
        participantId: 'B',
      });
    });

    it('should increment currentTurnIndex to 1 after a pick and pool update', () => {
      actor.send({ type: 'SUBMIT_PICK', pickRecord: makePickRecord('A', e1) });
      actor.send({ type: 'POOL_UPDATED', invalidatedIds: new Set([e1.id]) });

      expect(actor.getSnapshot().context.currentTurnIndex).toBe(1);
    });
  });

  // =========================================================================
  // 7. Draft — timer expiry (TURN_TIMER_EXPIRED → AUTO_PICK_RESOLVED)
  // =========================================================================

  describe('draft timer expiry', () => {
    const e1 = makeEntry('e1');
    const e2 = makeEntry('e2');
    const pool = [e1, e2];
    const turnOrder = ['A', 'B', 'A', 'B'];

    beforeEach(() => {
      startDraft(pool, turnOrder);
      socketState.received = [];
    });

    it('should enter autoPicking on TURN_TIMER_EXPIRED', () => {
      actor.send({ type: 'TURN_TIMER_EXPIRED' });

      expect(
        actor.getSnapshot().matches({ draft: { turnInProgress: 'autoPicking' } }),
      ).toBe(true);
    });

    it('should enter updatingPool.invalidatingSelections and append the pick after AUTO_PICK_RESOLVED', () => {
      const pickRecord = makePickRecord('A', e1);
      actor.send({ type: 'TURN_TIMER_EXPIRED' });
      actor.send({ type: 'AUTO_PICK_RESOLVED', pickRecord });

      expect(
        actor.getSnapshot().matches({ draft: { updatingPool: 'invalidatingSelections' } }),
      ).toBe(true);
      expect(actor.getSnapshot().context.pickHistory[0]).toEqual(pickRecord);
    });

    it('should send NOTIFY_PICK_CONFIRMED after AUTO_PICK_RESOLVED', () => {
      const pickRecord = makePickRecord('A', e1);
      actor.send({ type: 'TURN_TIMER_EXPIRED' });
      actor.send({ type: 'AUTO_PICK_RESOLVED', pickRecord });

      expect(socketState.received).toContainEqual({ type: 'NOTIFY_PICK_CONFIRMED', pickRecord });
    });
  });

  // =========================================================================
  // 8. Draft — global cancel (ORGANIZER_CANCEL_DRAFT)
  // =========================================================================

  describe('draft cancellation', () => {
    const pool = [makeEntry('e1'), makeEntry('e2')];
    const turnOrder = ['A', 'B'];

    beforeEach(() => {
      startDraft(pool, turnOrder);
      socketState.received = [];
    });

    it('should transition back to lobby on ORGANIZER_CANCEL_DRAFT', () => {
      actor.send({ type: 'ORGANIZER_CANCEL_DRAFT' });

      // Participants [A, B] remain in context, so minPlayersMet fires immediately
      // and the machine settles in readyToStart rather than waitingForPlayers.
      expect(actor.getSnapshot().matches('lobby')).toBe(true);
    });

    it('should send NOTIFY_DRAFT_CANCELLED on cancellation', () => {
      actor.send({ type: 'ORGANIZER_CANCEL_DRAFT' });

      expect(socketState.received).toContainEqual({ type: 'NOTIFY_DRAFT_CANCELLED' });
    });
  });

  // =========================================================================
  // 9. Draft — participant disconnect / reconnect
  // =========================================================================

  describe('draft participant disconnect and reconnect', () => {
    const pool = [makeEntry('e1'), makeEntry('e2')];
    const turnOrder = ['A', 'B', 'A', 'B'];

    beforeEach(() => {
      startDraft(pool, turnOrder);
      socketState.received = [];
    });

    it('should set isConnected to false and send NOTIFY_PARTICIPANT_DISCONNECTED', () => {
      actor.send({ type: 'PARTICIPANT_DISCONNECTED', participantId: 'A' });

      const pA = actor.getSnapshot().context.participants.find((p) => p.id === 'A');
      expect(pA?.isConnected).toBe(false);

      const pB = actor.getSnapshot().context.participants.find((p) => p.id === 'B');
      expect(pB?.isConnected).toBe(true);

      expect(socketState.received).toContainEqual({
        type: 'NOTIFY_PARTICIPANT_DISCONNECTED',
        participantId: 'A',
      });
    });

    it('should set isConnected back to true and send NOTIFY_PARTICIPANT_RECONNECTED', () => {
      actor.send({ type: 'PARTICIPANT_DISCONNECTED', participantId: 'A' });
      socketState.received = [];

      actor.send({ type: 'PARTICIPANT_RECONNECTED', participantId: 'A' });

      const pA = actor.getSnapshot().context.participants.find((p) => p.id === 'A');
      expect(pA?.isConnected).toBe(true);

      expect(socketState.received).toContainEqual({
        type: 'NOTIFY_PARTICIPANT_RECONNECTED',
        participantId: 'A',
      });
    });
  });

  // =========================================================================
  // 10. Draft — pool exhaustion triggers draftComplete
  //
  // NOTE: areRoundsRemaining is evaluated BEFORE advanceTurn increments
  // currentTurnIndex. This means on the last pick (index N-1), the guard sees
  // N-1 < N = true, advances the turn to index N, and re-enters awaitingPick
  // with an out-of-bounds participant. The draft therefore cannot end via
  // areRoundsRemaining alone — it ends exclusively via isPoolEmpty (tested
  // here) or ORGANIZER_CANCEL_DRAFT.
  // =========================================================================

  describe('draft completion via pool exhaustion (isPoolEmpty)', () => {
    const e1 = makeEntry('e1');
    const e2 = makeEntry('e2');
    const pool = [e1, e2];
    const turnOrder = ['A', 'B', 'A', 'B'];

    beforeEach(() => {
      startDraft(pool, turnOrder);
      socketState.received = [];
    });

    it('should enter results.viewingTeams when all pool entries are invalidated', () => {
      actor.send({ type: 'SUBMIT_PICK', pickRecord: makePickRecord('A', e1) });
      actor.send({ type: 'POOL_UPDATED', invalidatedIds: new Set([e1.id, e2.id]) });

      expect(actor.getSnapshot().matches({ results: 'viewingTeams' })).toBe(true);
    });

    it('should send NOTIFY_DRAFT_COMPLETE with the full pick history', () => {
      const pickRecord = makePickRecord('A', e1);
      actor.send({ type: 'SUBMIT_PICK', pickRecord });
      actor.send({ type: 'POOL_UPDATED', invalidatedIds: new Set([e1.id, e2.id]) });

      expect(socketState.received).toContainEqual({
        type: 'NOTIFY_DRAFT_COMPLETE',
        pickHistory: [pickRecord],
      });
    });
  });

  // =========================================================================
  // 11. Results → closed
  // =========================================================================

  describe('results to closed', () => {
    const e1 = makeEntry('e1');
    const e2 = makeEntry('e2');
    const pool = [e1, e2];
    const turnOrder = ['A', 'B', 'A', 'B'];

    beforeEach(() => {
      startDraft(pool, turnOrder);
      actor.send({ type: 'SUBMIT_PICK', pickRecord: makePickRecord('A', e1) });
      actor.send({ type: 'POOL_UPDATED', invalidatedIds: new Set([e1.id, e2.id]) });
      socketState.received = [];
    });

    it('should be in results.viewingTeams before ROOM_CLOSED', () => {
      expect(actor.getSnapshot().matches({ results: 'viewingTeams' })).toBe(true);
    });

    it('should enter the closed final state on ROOM_CLOSED and mark the snapshot as done', () => {
      actor.send({ type: 'ROOM_CLOSED' });

      expect(actor.getSnapshot().matches('closed')).toBe(true);
      expect(actor.getSnapshot().status).toBe('done');
    });
  });
});
