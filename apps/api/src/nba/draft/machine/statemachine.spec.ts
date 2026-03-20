import { createDraftMachine } from '@/nba/draft/machine/statemachine';
import type {
  DraftRoomConfig,
  MvpPoolEntry,
  Participant,
  PickRecord,
  PoolEntry,
} from '@dribblio/types';

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

vi.mock('@/nba/draft/machine/actors/auto-pick', async () => {
  const { fromCallback } = await import('xstate');
  return { autoPickActor: fromCallback(() => () => {}) };
});

// ---------------------------------------------------------------------------
// Helper factories
// ---------------------------------------------------------------------------

const makeParticipant = (id: string, isOrganizer = false): Participant => ({
  participantId: id,
  name: `Player ${id}`,
  isOrganizer,
  isConnected: true,
});

const makeConfig = (): DraftRoomConfig => ({
  draftMode: 'mvp',
  draftOrder: 'snake',
  maxRounds: 2,
});

const makeEntry = (id: string, available = true): MvpPoolEntry => ({
  entryId: id,
  draftMode: 'mvp',
  playerId: parseInt(id.replace(/\D/g, ''), 10) || 1,
  playerName: `Player ${id}`,
  season: '2023-24',
  ptsPg: null,
  astPg: null,
  rebPg: null,
  available,
});

const makePickRecord = (
  participantId: string,
  entry: MvpPoolEntry,
  pickNumber = 1,
  round = 1,
): PickRecord => ({
  participantId,
  entryId: entry.entryId,
  round,
  pickNumber,
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
    actor.send({
      type: 'PARTICIPANT_JOINED',
      participant: makeParticipant(id, isOrganizer),
    });
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
      expect(actor.getSnapshot().matches({ lobby: 'waitingForPlayers' })).toBe(
        true,
      );
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

      expect(actor.getSnapshot().matches({ lobby: 'waitingForPlayers' })).toBe(
        true,
      );
      expect(actor.getSnapshot().context.participants).toHaveLength(1);
    });

    it('should send NOTIFY_PARTICIPANT_JOINED when a participant joins', () => {
      const p = makeParticipant('A', true);
      actor.send({ type: 'PARTICIPANT_JOINED', participant: p });

      expect(socketState.received).toContainEqual({
        type: 'NOTIFY_PARTICIPANT_JOINED',
        participant: p,
        participants: [p],
      });
    });

    it('should auto-transition to readyToStart and send NOTIFY_READY_TO_START when the second participant joins', () => {
      addParticipant('A', true);
      addParticipant('B');

      expect(actor.getSnapshot().matches({ lobby: 'readyToStart' })).toBe(true);
      expect(socketState.received).toContainEqual({
        type: 'NOTIFY_READY_TO_START',
      });
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
      const pool = [makeEntry('e1')];
      actor.send({ type: 'SAVE_CONFIG', config, pool });

      expect(actor.getSnapshot().matches({ lobby: 'waitingForPlayers' })).toBe(
        true,
      );
      expect(actor.getSnapshot().context.config).toEqual(config);
    });

    it('should send NOTIFY_CONFIG_SAVED with the saved config and pool', () => {
      const config = makeConfig();
      const pool = [makeEntry('e1')];
      actor.send({ type: 'SAVE_CONFIG', config, pool });

      expect(socketState.received).toContainEqual({
        type: 'NOTIFY_CONFIG_SAVED',
        config,
        pool,
      });
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

    it('should remove the participant from context on PARTICIPANT_LEFT without transitioning state', () => {
      actor.send({ type: 'PARTICIPANT_LEFT', participantId: 'B' });

      // Global PARTICIPANT_LEFT has no target — machine stays in readyToStart
      // with the participant removed. The always guard in waitingForPlayers is
      // not re-evaluated because the machine never enters that state.
      expect(actor.getSnapshot().matches({ lobby: 'readyToStart' })).toBe(true);
      expect(
        actor
          .getSnapshot()
          .context.participants.find((p) => p.participantId === 'B'),
      ).toBeUndefined();
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
        actor
          .getSnapshot()
          .matches({ draft: { turnInProgress: 'awaitingPick' } }),
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
  // 6. Draft — pick flow (SUBMIT_PICK auto-advances through updatingPool)
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

    it('should be in awaitingPick with pickHistory length 1 after SUBMIT_PICK', () => {
      actor.send({
        type: 'SUBMIT_PICK',
        pickRecord: { participantId: 'A', entryId: e1.entryId, round: 1 },
      });

      expect(
        actor
          .getSnapshot()
          .matches({ draft: { turnInProgress: 'awaitingPick' } }),
      ).toBe(true);
      expect(actor.getSnapshot().context.pickHistory).toHaveLength(1);
      expect(actor.getSnapshot().context.pickHistory[0].entryId).toBe(e1.entryId);
    });

    it('should send NOTIFY_PICK_CONFIRMED after SUBMIT_PICK', () => {
      actor.send({
        type: 'SUBMIT_PICK',
        pickRecord: { participantId: 'A', entryId: e1.entryId, round: 1 },
      });

      expect(socketState.received).toContainEqual({
        type: 'NOTIFY_PICK_CONFIRMED',
        pickRecord: {
          participantId: 'A',
          entryId: e1.entryId,
          round: 1,
          pickNumber: 1,
        },
      });
    });

    it('should return to awaitingPick after SUBMIT_PICK when rounds remain', () => {
      actor.send({
        type: 'SUBMIT_PICK',
        pickRecord: { participantId: 'A', entryId: e1.entryId, round: 1 },
      });

      expect(
        actor
          .getSnapshot()
          .matches({ draft: { turnInProgress: 'awaitingPick' } }),
      ).toBe(true);
    });

    it('should mark the picked entry as unavailable after SUBMIT_PICK', () => {
      actor.send({
        type: 'SUBMIT_PICK',
        pickRecord: { participantId: 'A', entryId: e1.entryId, round: 1 },
      });

      const updatedE1 = actor
        .getSnapshot()
        .context.pool.find((e) => e.entryId === e1.entryId);
      expect(updatedE1?.available).toBe(false);

      const updatedE2 = actor
        .getSnapshot()
        .context.pool.find((e) => e.entryId === e2.entryId);
      expect(updatedE2?.available).toBe(true);
    });

    it('should send NOTIFY_POOL_UPDATED and NOTIFY_TURN_ADVANCED after SUBMIT_PICK', () => {
      actor.send({
        type: 'SUBMIT_PICK',
        pickRecord: { participantId: 'A', entryId: e1.entryId, round: 1 },
      });

      expect(socketState.received).toContainEqual({
        type: 'NOTIFY_POOL_UPDATED',
        invalidatedIds: [e1.entryId],
      });
      expect(socketState.received).toContainEqual({
        type: 'NOTIFY_TURN_ADVANCED',
        currentTurnIndex: 1,
        currentRound: 1,
        participantId: 'B',
      });
    });

    it('should increment currentTurnIndex to 1 after SUBMIT_PICK', () => {
      actor.send({
        type: 'SUBMIT_PICK',
        pickRecord: { participantId: 'A', entryId: e1.entryId, round: 1 },
      });

      expect(actor.getSnapshot().context.currentTurnIndex).toBe(1);
    });
  });

  // =========================================================================
  // 7. Draft — round and pickNumber are computed server-side
  // =========================================================================

  describe('round and pickNumber computation', () => {
    const e1 = makeEntry('e1');
    const e2 = makeEntry('e2');
    const e3 = makeEntry('e3');
    const e4 = makeEntry('e4');
    // 2-participant, 2-round draft: indices 0-1 = round 1, indices 2-3 = round 2
    const pool = [e1, e2, e3, e4];
    const turnOrder = ['A', 'B', 'B', 'A'];

    beforeEach(() => {
      startDraft(pool, turnOrder);
      socketState.received = [];
    });

    const makePick = (participantId: string, entryId: string) => {
      actor.send({ type: 'SUBMIT_PICK', pickRecord: { participantId, entryId, round: 0 } });
    };

    it('should assign round 1 pick 1 to the first pick (index 0)', () => {
      actor.send({ type: 'SUBMIT_PICK', pickRecord: { participantId: 'A', entryId: e1.entryId, round: 0 } });

      expect(socketState.received).toContainEqual({
        type: 'NOTIFY_PICK_CONFIRMED',
        pickRecord: { participantId: 'A', entryId: e1.entryId, round: 1, pickNumber: 1 },
      });
    });

    it('should assign round 1 pick 2 to the second pick (index 1)', () => {
      makePick('A', e1.entryId);
      actor.send({ type: 'SUBMIT_PICK', pickRecord: { participantId: 'B', entryId: e2.entryId, round: 0 } });

      expect(socketState.received).toContainEqual({
        type: 'NOTIFY_PICK_CONFIRMED',
        pickRecord: { participantId: 'B', entryId: e2.entryId, round: 1, pickNumber: 2 },
      });
    });

    it('should assign round 2 pick 1 to the third pick (index 2)', () => {
      makePick('A', e1.entryId);
      makePick('B', e2.entryId);
      actor.send({ type: 'SUBMIT_PICK', pickRecord: { participantId: 'B', entryId: e3.entryId, round: 0 } });

      expect(socketState.received).toContainEqual({
        type: 'NOTIFY_PICK_CONFIRMED',
        pickRecord: { participantId: 'B', entryId: e3.entryId, round: 2, pickNumber: 1 },
      });
    });

    it('should send NOTIFY_TURN_ADVANCED with round 2 after the second pick crosses the round boundary', () => {
      makePick('A', e1.entryId);
      actor.send({ type: 'SUBMIT_PICK', pickRecord: { participantId: 'B', entryId: e2.entryId, round: 0 } });

      expect(socketState.received).toContainEqual({
        type: 'NOTIFY_TURN_ADVANCED',
        currentTurnIndex: 2,
        currentRound: 2,
        participantId: 'B',
      });
    });
  });

  // =========================================================================
  // 8. Draft — timer expiry (TURN_TIMER_EXPIRED → AUTO_PICK_RESOLVED)
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
        actor
          .getSnapshot()
          .matches({ draft: { turnInProgress: 'autoPicking' } }),
      ).toBe(true);
    });

    it('should be in awaitingPick with pickHistory length 1 after AUTO_PICK_RESOLVED', () => {
      actor.send({ type: 'TURN_TIMER_EXPIRED' });
      actor.send({
        type: 'AUTO_PICK_RESOLVED',
        pickRecord: { participantId: 'A', entryId: e1.entryId, round: 1 },
      });

      expect(
        actor
          .getSnapshot()
          .matches({ draft: { turnInProgress: 'awaitingPick' } }),
      ).toBe(true);
      expect(actor.getSnapshot().context.pickHistory[0].entryId).toBe(e1.entryId);
    });

    it('should send NOTIFY_PICK_CONFIRMED after AUTO_PICK_RESOLVED', () => {
      actor.send({ type: 'TURN_TIMER_EXPIRED' });
      actor.send({
        type: 'AUTO_PICK_RESOLVED',
        pickRecord: { participantId: 'A', entryId: e1.entryId, round: 1 },
      });

      expect(socketState.received).toContainEqual({
        type: 'NOTIFY_PICK_CONFIRMED',
        pickRecord: {
          participantId: 'A',
          entryId: e1.entryId,
          round: 1,
          pickNumber: 1,
        },
      });
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

      expect(socketState.received).toContainEqual({
        type: 'NOTIFY_DRAFT_CANCELLED',
      });
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

      const pA = actor
        .getSnapshot()
        .context.participants.find((p) => p.participantId === 'A');
      expect(pA?.isConnected).toBe(false);

      const pB = actor
        .getSnapshot()
        .context.participants.find((p) => p.participantId === 'B');
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

      const pA = actor
        .getSnapshot()
        .context.participants.find((p) => p.participantId === 'A');
      expect(pA?.isConnected).toBe(true);

      expect(socketState.received).toContainEqual({
        type: 'NOTIFY_PARTICIPANT_RECONNECTED',
        participantId: 'A',
      });
    });
  });

  // =========================================================================
  // 10. Draft completion
  //
  // The draft ends when either all rounds are exhausted (areRoundsRemaining)
  // or the pool is empty (isPoolEmpty). areRoundsRemaining checks
  // currentTurnIndex + 1 < turnOrder.length so that the final pick (index
  // N-1) correctly routes to draftComplete rather than advancingTurn.
  // =========================================================================

  describe('draft completion via rounds exhausted (areRoundsRemaining)', () => {
    const e1 = makeEntry('e1');
    const e2 = makeEntry('e2');
    const e3 = makeEntry('e3');
    // 2-participant, 1-round draft: turnOrder has 2 slots (indices 0 and 1)
    const pool = [e1, e2, e3];
    const turnOrder = ['A', 'B'];

    beforeEach(() => {
      startDraft(pool, turnOrder);
      socketState.received = [];
    });

    it('should enter results.viewingTeams after the last pick when rounds are exhausted', () => {
      // Pick 1 (index 0) — pool still has entries left
      actor.send({ type: 'SUBMIT_PICK', pickRecord: { participantId: 'A', entryId: e1.entryId, round: 1 } });
      // Pick 2 (index 1, final) — rounds exhausted
      actor.send({ type: 'SUBMIT_PICK', pickRecord: { participantId: 'B', entryId: e2.entryId, round: 1 } });

      expect(actor.getSnapshot().matches({ results: 'viewingTeams' })).toBe(true);
    });

    it('should send NOTIFY_DRAFT_COMPLETE with the full pick history after rounds exhausted', () => {
      actor.send({ type: 'SUBMIT_PICK', pickRecord: { participantId: 'A', entryId: e1.entryId, round: 1 } });
      actor.send({ type: 'SUBMIT_PICK', pickRecord: { participantId: 'B', entryId: e2.entryId, round: 1 } });

      expect(socketState.received).toContainEqual({
        type: 'NOTIFY_DRAFT_COMPLETE',
        pickHistory: [
          { participantId: 'A', entryId: e1.entryId, round: 1, pickNumber: 1 },
          { participantId: 'B', entryId: e2.entryId, round: 1, pickNumber: 2 },
        ],
      });
    });
  });

  describe('draft completion via pool exhaustion (isPoolEmpty)', () => {
    // Both entries share the same playerId so picking e1 invalidates both,
    // exhausting the pool after a single pick.
    const e1 = { ...makeEntry('e1'), playerId: 99 };
    const e2 = { ...makeEntry('e2'), playerId: 99 };
    const pool = [e1, e2];
    const turnOrder = ['A', 'B', 'A', 'B'];

    beforeEach(() => {
      startDraft(pool, turnOrder);
      socketState.received = [];
    });

    it('should enter results.viewingTeams when all pool entries are invalidated', () => {
      actor.send({
        type: 'SUBMIT_PICK',
        pickRecord: { participantId: 'A', entryId: e1.entryId, round: 1 },
      });

      expect(actor.getSnapshot().matches({ results: 'viewingTeams' })).toBe(
        true,
      );
    });

    it('should send NOTIFY_DRAFT_COMPLETE with the full pick history', () => {
      actor.send({
        type: 'SUBMIT_PICK',
        pickRecord: { participantId: 'A', entryId: e1.entryId, round: 1 },
      });

      expect(socketState.received).toContainEqual({
        type: 'NOTIFY_DRAFT_COMPLETE',
        pickHistory: [
          {
            participantId: 'A',
            entryId: e1.entryId,
            round: 1,
            pickNumber: 1,
          },
        ],
      });
    });
  });

  // =========================================================================
  // 11. Results → closed
  // =========================================================================

  describe('results to closed', () => {
    // Both entries share the same playerId so picking e1 exhausts the pool.
    const e1 = { ...makeEntry('e1'), playerId: 99 };
    const e2 = { ...makeEntry('e2'), playerId: 99 };
    const pool = [e1, e2];
    const turnOrder = ['A', 'B', 'A', 'B'];

    beforeEach(() => {
      startDraft(pool, turnOrder);
      actor.send({
        type: 'SUBMIT_PICK',
        pickRecord: { participantId: 'A', entryId: e1.entryId, round: 1 },
      });
      socketState.received = [];
    });

    it('should be in results.viewingTeams before ROOM_CLOSED', () => {
      expect(actor.getSnapshot().matches({ results: 'viewingTeams' })).toBe(
        true,
      );
    });

    it('should enter the closed final state on ROOM_CLOSED and mark the snapshot as done', () => {
      actor.send({ type: 'ROOM_CLOSED' });

      expect(actor.getSnapshot().matches('closed')).toBe(true);
      expect(actor.getSnapshot().status).toBe('done');
    });
  });
});
