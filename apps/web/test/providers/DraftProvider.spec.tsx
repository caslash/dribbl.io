import { DraftProvider, useDraftContext } from '@/providers/DraftProvider';
import type {
  DraftRoomConfig,
  NotifyConfigSaved,
  NotifyDraftComplete,
  NotifyDraftStarted,
  NotifyParticipantJoined,
  NotifyParticipantLeft,
  NotifyPickConfirmed,
  NotifyPoolUpdated,
  NotifyTurnAdvanced,
  Participant,
  PickRecord,
  PoolEntry,
} from '@dribblio/types';
import { act, render, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// ─── Socket mock factory ──────────────────────────────────────────────────────

type EventHandler = (...args: unknown[]) => void;

function createMockSocket() {
  const handlers: Record<string, EventHandler[]> = {};
  const onceHandlers: Record<string, EventHandler[]> = {};

  const socket = {
    emit: vi.fn(),
    on: vi.fn((event: string, handler: EventHandler) => {
      handlers[event] = handlers[event] ?? [];
      handlers[event].push(handler);
      return socket;
    }),
    once: vi.fn((event: string, handler: EventHandler) => {
      onceHandlers[event] = onceHandlers[event] ?? [];
      onceHandlers[event].push(handler);
      return socket;
    }),
    off: vi.fn(),
    disconnect: vi.fn(),
    connected: true,
    /** Test helper: simulate the server emitting an event on this socket. */
    simulateEvent(event: string, payload?: unknown) {
      (handlers[event] ?? []).forEach((h) => h(payload));
    },
    /** Test helper: simulate a one-time event (e.g. ROOM_CREATED). */
    simulateOnce(event: string, payload?: unknown) {
      (onceHandlers[event] ?? []).forEach((h) => h(payload));
    },
  };
  return socket;
}

type MockSocket = ReturnType<typeof createMockSocket>;

// Sockets are shared across the module because vi.mock hoists the factory
// and captures references. We mutate these before each test.
let mockSocketA: MockSocket = createMockSocket();
let mockSocketB: MockSocket = createMockSocket();
let ioCallCount = 0;

vi.mock('socket.io-client', () => ({
  // First io() call → mockSocketA, second → mockSocketB, etc.
  io: vi.fn(() => {
    ioCallCount++;
    return ioCallCount === 1 ? mockSocketA : mockSocketB;
  }),
}));

vi.mock('react-toastify', () => ({
  toast: {
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// ─── Test fixtures ────────────────────────────────────────────────────────────

const mockParticipant: Participant = { participantId: 'p1', name: 'Jordan', isOrganizer: true };
const mockParticipant2: Participant = { participantId: 'p2', name: 'Bird', isOrganizer: false };

const mockConfig: DraftRoomConfig = {
  draftMode: 'mvp',
  draftOrder: 'snake',
  maxRounds: 5,
};

const mockMvpEntry: PoolEntry = {
  entryId: 'entry-1',
  draftMode: 'mvp',
  playerId: 23,
  playerName: 'LeBron James',
  season: '2012-13',
  ptsPg: 27.1,
  astPg: 7.3,
  rebPg: 8.0,
};

const mockPickRecord: PickRecord = {
  participantId: 'p1',
  entryId: 'entry-1',
  round: 1,
  pickNumber: 1,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function wrapper({ children }: { children: ReactNode }) {
  return <DraftProvider>{children}</DraftProvider>;
}

function setupHook() {
  return renderHook(() => useDraftContext(), { wrapper });
}

/**
 * For most tests (joinRoom path), io() is called exactly once, returning mockSocketA.
 * We alias `mainSocket` to mockSocketA for clarity.
 */
function getMainSocket() {
  return mockSocketA;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('DraftProvider', () => {
  beforeEach(() => {
    ioCallCount = 0;
    mockSocketA = createMockSocket();
    mockSocketB = createMockSocket();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ─── Initial state ──────────────────────────────────────────────────────────

  describe('initial state', () => {
    it('starts in the entrance phase', () => {
      const { result } = setupHook();

      expect(result.current.state.phase).toBe('entrance');
    });

    it('has null roomId, participantId, and name', () => {
      const { result } = setupHook();

      expect(result.current.state.roomId).toBeNull();
      expect(result.current.state.myParticipantId).toBeNull();
      expect(result.current.state.myName).toBeNull();
    });

    it('has isOrganizer as false', () => {
      const { result } = setupHook();

      expect(result.current.state.isOrganizer).toBe(false);
    });

    it('has empty participants, pool, turnOrder, and pickHistory', () => {
      const { result } = setupHook();

      expect(result.current.state.participants).toEqual([]);
      expect(result.current.state.pool).toEqual([]);
      expect(result.current.state.turnOrder).toEqual([]);
      expect(result.current.state.pickHistory).toEqual([]);
    });

    it('starts with currentTurnIndex 0 and currentRound 1', () => {
      const { result } = setupHook();

      expect(result.current.state.currentTurnIndex).toBe(0);
      expect(result.current.state.currentRound).toBe(1);
    });

    it('has an empty invalidatedIds Set', () => {
      const { result } = setupHook();

      expect(result.current.state.invalidatedIds.size).toBe(0);
    });

    it('has isMyTurn as false when turnOrder is empty', () => {
      const { result } = setupHook();

      expect(result.current.isMyTurn).toBe(false);
    });

    it('has currentTurnParticipant as null with empty participants', () => {
      const { result } = setupHook();

      expect(result.current.currentTurnParticipant).toBeNull();
    });
  });

  // ─── Reducer: SET_IDENTITY via joinRoom ─────────────────────────────────────

  describe('joinRoom (SET_IDENTITY)', () => {
    it('sets myName, roomId, and isOrganizer: false', () => {
      const { result } = setupHook();

      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      expect(result.current.state.myName).toBe('Bird');
      expect(result.current.state.roomId).toBe('ROOM1');
      expect(result.current.state.isOrganizer).toBe(false);
    });

    it('generates a non-null participantId', () => {
      const { result } = setupHook();

      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      expect(result.current.state.myParticipantId).toBeTruthy();
    });

    it('transitions phase to lobby', () => {
      const { result } = setupHook();

      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      expect(result.current.state.phase).toBe('lobby');
    });
  });

  // ─── Reducer: CONFIG_SAVED ──────────────────────────────────────────────────

  describe('socket event: NOTIFY_CONFIG_SAVED', () => {
    it('updates the config field', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      const payload: NotifyConfigSaved = {
        config: mockConfig,
        pool: [],
        type: 'NOTIFY_CONFIG_SAVED',
      };
      act(() => {
        getMainSocket().simulateEvent('NOTIFY_CONFIG_SAVED', payload);
      });

      expect(result.current.state.config).toEqual(mockConfig);
    });

    it('transitions phase to pool-preview', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      act(() => {
        getMainSocket().simulateEvent('NOTIFY_CONFIG_SAVED', { config: mockConfig });
      });

      expect(result.current.state.phase).toBe('pool-preview');
    });

    it('calls toast.success', async () => {
      const { toast } = await import('react-toastify');
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      act(() => {
        getMainSocket().simulateEvent('NOTIFY_CONFIG_SAVED', { config: mockConfig });
      });

      expect(toast.success).toHaveBeenCalledWith('Draft configuration saved');
    });
  });

  // ─── Reducer: PARTICIPANT_JOINED ────────────────────────────────────────────

  describe('socket event: NOTIFY_PARTICIPANT_JOINED', () => {
    it('replaces the participants array with the payload participants', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      const payload: NotifyParticipantJoined = {
        participant: mockParticipant,
        participants: [mockParticipant, mockParticipant2],
        type: 'NOTIFY_PARTICIPANT_JOINED',
      };
      act(() => {
        getMainSocket().simulateEvent('NOTIFY_PARTICIPANT_JOINED', payload);
      });

      expect(result.current.state.participants).toEqual([mockParticipant, mockParticipant2]);
    });

    it('calls toast.info with the joining participant name', async () => {
      const { toast } = await import('react-toastify');
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      act(() => {
        getMainSocket().simulateEvent('NOTIFY_PARTICIPANT_JOINED', {
          participant: mockParticipant,
          participants: [mockParticipant],
        });
      });

      expect(toast.info).toHaveBeenCalledWith('Jordan joined the room');
    });
  });

  // ─── Reducer: PARTICIPANT_LEFT ──────────────────────────────────────────────

  describe('socket event: NOTIFY_PARTICIPANT_LEFT', () => {
    it('filters out the participant with the matching participantId', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      act(() => {
        getMainSocket().simulateEvent('NOTIFY_PARTICIPANT_JOINED', {
          participant: mockParticipant,
          participants: [mockParticipant, mockParticipant2],
        });
      });

      const leftPayload: NotifyParticipantLeft = {
        participantId: 'p1',
        type: 'NOTIFY_PARTICIPANT_LEFT',
      };
      act(() => {
        getMainSocket().simulateEvent('NOTIFY_PARTICIPANT_LEFT', leftPayload);
      });

      expect(result.current.state.participants).toEqual([mockParticipant2]);
    });

    it('leaves the array unchanged when the participantId is not found', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      act(() => {
        getMainSocket().simulateEvent('NOTIFY_PARTICIPANT_JOINED', {
          participant: mockParticipant,
          participants: [mockParticipant],
        });
      });

      act(() => {
        getMainSocket().simulateEvent('NOTIFY_PARTICIPANT_LEFT', { participantId: 'unknown' });
      });

      expect(result.current.state.participants).toEqual([mockParticipant]);
    });
  });

  // ─── Reducer: DRAFT_STARTED ─────────────────────────────────────────────────

  describe('socket event: NOTIFY_DRAFT_STARTED', () => {
    it('sets pool and turnOrder from the payload', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      const payload: NotifyDraftStarted = {
        pool: [mockMvpEntry],
        turnOrder: ['p1', 'p2'],
        type: 'NOTIFY_DRAFT_STARTED',
      };
      act(() => {
        getMainSocket().simulateEvent('NOTIFY_DRAFT_STARTED', payload);
      });

      expect(result.current.state.pool).toEqual([mockMvpEntry]);
      expect(result.current.state.turnOrder).toEqual(['p1', 'p2']);
    });

    it('transitions phase to drafting', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      act(() => {
        getMainSocket().simulateEvent('NOTIFY_DRAFT_STARTED', {
          pool: [mockMvpEntry],
          turnOrder: ['p1'],
        });
      });

      expect(result.current.state.phase).toBe('drafting');
    });

    it('resets currentTurnIndex to 0 and currentRound to 1', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      act(() => {
        getMainSocket().simulateEvent('NOTIFY_TURN_ADVANCED', {
          currentTurnIndex: 3,
          currentRound: 2,
          participantId: 'p1',
        });
      });

      act(() => {
        getMainSocket().simulateEvent('NOTIFY_DRAFT_STARTED', {
          pool: [mockMvpEntry],
          turnOrder: ['p1'],
        });
      });

      expect(result.current.state.currentTurnIndex).toBe(0);
      expect(result.current.state.currentRound).toBe(1);
    });

    it('resets pickHistory and invalidatedIds', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      act(() => {
        getMainSocket().simulateEvent('NOTIFY_PICK_CONFIRMED', { pickRecord: mockPickRecord });
      });
      act(() => {
        getMainSocket().simulateEvent('NOTIFY_POOL_UPDATED', { invalidatedIds: ['entry-1'] });
      });

      act(() => {
        getMainSocket().simulateEvent('NOTIFY_DRAFT_STARTED', {
          pool: [mockMvpEntry],
          turnOrder: ['p1'],
        });
      });

      expect(result.current.state.pickHistory).toEqual([]);
      expect(result.current.state.invalidatedIds.size).toBe(0);
    });

    it('calls toast.success', async () => {
      const { toast } = await import('react-toastify');
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      act(() => {
        getMainSocket().simulateEvent('NOTIFY_DRAFT_STARTED', {
          pool: [mockMvpEntry],
          turnOrder: ['p1'],
        });
      });

      expect(toast.success).toHaveBeenCalledWith('Draft started!');
    });
  });

  // ─── Reducer: PICK_CONFIRMED ────────────────────────────────────────────────

  describe('socket event: NOTIFY_PICK_CONFIRMED', () => {
    it('appends the pickRecord to pickHistory', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      const payload: NotifyPickConfirmed = {
        pickRecord: mockPickRecord,
        type: 'NOTIFY_PICK_CONFIRMED',
      };
      act(() => {
        getMainSocket().simulateEvent('NOTIFY_PICK_CONFIRMED', payload);
      });

      expect(result.current.state.pickHistory).toEqual([mockPickRecord]);
    });

    it('accumulates multiple picks in order', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      const pick2: PickRecord = {
        participantId: 'p2',
        entryId: 'entry-2',
        round: 1,
        pickNumber: 2,
      };

      act(() => {
        getMainSocket().simulateEvent('NOTIFY_PICK_CONFIRMED', { pickRecord: mockPickRecord });
      });
      act(() => {
        getMainSocket().simulateEvent('NOTIFY_PICK_CONFIRMED', { pickRecord: pick2 });
      });

      expect(result.current.state.pickHistory).toEqual([mockPickRecord, pick2]);
    });
  });

  // ─── Reducer: POOL_UPDATED ──────────────────────────────────────────────────

  describe('socket event: NOTIFY_POOL_UPDATED', () => {
    it('adds invalidated IDs to the Set without removing existing ones', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      const payload1: NotifyPoolUpdated = {
        invalidatedIds: ['entry-1', 'entry-2'],
        type: 'NOTIFY_POOL_UPDATED',
      };
      act(() => {
        getMainSocket().simulateEvent('NOTIFY_POOL_UPDATED', payload1);
      });

      const payload2: NotifyPoolUpdated = {
        invalidatedIds: ['entry-3'],
        type: 'NOTIFY_POOL_UPDATED',
      };
      act(() => {
        getMainSocket().simulateEvent('NOTIFY_POOL_UPDATED', payload2);
      });

      expect(result.current.state.invalidatedIds.has('entry-1')).toBe(true);
      expect(result.current.state.invalidatedIds.has('entry-2')).toBe(true);
      expect(result.current.state.invalidatedIds.has('entry-3')).toBe(true);
    });
  });

  // ─── Reducer: TURN_ADVANCED ─────────────────────────────────────────────────

  describe('socket event: NOTIFY_TURN_ADVANCED', () => {
    it('updates currentTurnIndex and currentRound', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      const payload: NotifyTurnAdvanced = {
        currentTurnIndex: 2,
        currentRound: 2,
        participantId: 'p1',
        type: 'NOTIFY_TURN_ADVANCED',
      };
      act(() => {
        getMainSocket().simulateEvent('NOTIFY_TURN_ADVANCED', payload);
      });

      expect(result.current.state.currentTurnIndex).toBe(2);
      expect(result.current.state.currentRound).toBe(2);
    });
  });

  // ─── Reducer: DRAFT_COMPLETE ────────────────────────────────────────────────

  describe('socket event: NOTIFY_DRAFT_COMPLETE', () => {
    it('transitions phase to results', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      const payload: NotifyDraftComplete = {
        pickHistory: [mockPickRecord],
        type: 'NOTIFY_DRAFT_COMPLETE',
      };
      act(() => {
        getMainSocket().simulateEvent('NOTIFY_DRAFT_COMPLETE', payload);
      });

      expect(result.current.state.phase).toBe('results');
    });

    it('sets pickHistory from the payload', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      const payload: NotifyDraftComplete = {
        pickHistory: [mockPickRecord],
        type: 'NOTIFY_DRAFT_COMPLETE',
      };
      act(() => {
        getMainSocket().simulateEvent('NOTIFY_DRAFT_COMPLETE', payload);
      });

      expect(result.current.state.pickHistory).toEqual([mockPickRecord]);
    });

    it('calls toast.success', async () => {
      const { toast } = await import('react-toastify');
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      act(() => {
        getMainSocket().simulateEvent('NOTIFY_DRAFT_COMPLETE', { pickHistory: [] });
      });

      expect(toast.success).toHaveBeenCalledWith('Draft complete!');
    });
  });

  // ─── Reducer: RESET ─────────────────────────────────────────────────────────

  describe('leave (RESET)', () => {
    it('returns state to the initial shape after leave', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      act(() => {
        result.current.leave();
      });

      expect(result.current.state.phase).toBe('entrance');
      expect(result.current.state.roomId).toBeNull();
      expect(result.current.state.myParticipantId).toBeNull();
    });
  });

  // ─── Outbound socket emissions ──────────────────────────────────────────────

  describe('saveConfig', () => {
    it('emits ORGANIZER_CONFIGURE before SAVE_CONFIG', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      act(() => {
        result.current.saveConfig(mockConfig);
      });

      const calls = getMainSocket().emit.mock.calls;
      const configureIdx = calls.findIndex(([ev]) => ev === 'ORGANIZER_CONFIGURE');
      const saveIdx = calls.findIndex(([ev]) => ev === 'SAVE_CONFIG');

      expect(configureIdx).toBeGreaterThanOrEqual(0);
      expect(saveIdx).toBeGreaterThanOrEqual(0);
      expect(configureIdx).toBeLessThan(saveIdx);
    });

    it('emits SAVE_CONFIG with the config wrapped in { config }', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      act(() => {
        result.current.saveConfig(mockConfig);
      });

      expect(getMainSocket().emit).toHaveBeenCalledWith('SAVE_CONFIG', { config: mockConfig });
    });
  });

  describe('startDraft', () => {
    it('emits ORGANIZER_START_DRAFT', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      act(() => {
        result.current.startDraft();
      });

      expect(getMainSocket().emit).toHaveBeenCalledWith('ORGANIZER_START_DRAFT');
    });
  });

  describe('submitPick', () => {
    it('emits SUBMIT_PICK with participantId, entryId, and round', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      const myId = result.current.state.myParticipantId!;

      act(() => {
        result.current.submitPick('entry-abc');
      });

      expect(getMainSocket().emit).toHaveBeenCalledWith('SUBMIT_PICK', {
        pickRecord: {
          participantId: myId,
          entryId: 'entry-abc',
          round: 1,
        },
      });
    });

    it('does not emit when myParticipantId is null', () => {
      const { result } = setupHook();

      act(() => {
        result.current.submitPick('entry-abc');
      });

      expect(getMainSocket().emit).not.toHaveBeenCalledWith('SUBMIT_PICK', expect.anything());
    });

    it('uses the current round from state', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      act(() => {
        getMainSocket().simulateEvent('NOTIFY_TURN_ADVANCED', {
          currentTurnIndex: 2,
          currentRound: 3,
          participantId: 'p1',
        });
      });

      act(() => {
        result.current.submitPick('entry-xyz');
      });

      expect(getMainSocket().emit).toHaveBeenCalledWith(
        'SUBMIT_PICK',
        expect.objectContaining({
          pickRecord: expect.objectContaining({ round: 3 }),
        }),
      );
    });
  });

  describe('notifyTimerExpired', () => {
    it('emits TURN_TIMER_EXPIRED', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      act(() => {
        result.current.notifyTimerExpired();
      });

      expect(getMainSocket().emit).toHaveBeenCalledWith('TURN_TIMER_EXPIRED');
    });
  });

  describe('leave', () => {
    it('emits PARTICIPANT_LEFT with participantId', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      const myId = result.current.state.myParticipantId!;

      act(() => {
        result.current.leave();
      });

      expect(getMainSocket().emit).toHaveBeenCalledWith('PARTICIPANT_LEFT', {
        participantId: myId,
      });
    });

    it('calls socket.disconnect', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      act(() => {
        result.current.leave();
      });

      expect(getMainSocket().disconnect).toHaveBeenCalled();
    });

    it('does not emit PARTICIPANT_LEFT when myParticipantId is null', () => {
      const { result } = setupHook();

      act(() => {
        result.current.leave();
      });

      expect(getMainSocket().emit).not.toHaveBeenCalledWith('PARTICIPANT_LEFT', expect.anything());
    });
  });

  // ─── Derived values ─────────────────────────────────────────────────────────

  describe('isMyTurn', () => {
    it('is true when turnOrder[currentTurnIndex] matches myParticipantId', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Jordan');
      });

      const myId = result.current.state.myParticipantId!;

      act(() => {
        getMainSocket().simulateEvent('NOTIFY_DRAFT_STARTED', {
          pool: [],
          turnOrder: [myId, 'p2'],
        });
      });

      expect(result.current.isMyTurn).toBe(true);
    });

    it('is false when turnOrder[currentTurnIndex] is a different participant', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Jordan');
      });

      act(() => {
        getMainSocket().simulateEvent('NOTIFY_DRAFT_STARTED', {
          pool: [],
          turnOrder: ['other-id', result.current.state.myParticipantId!],
        });
      });

      expect(result.current.isMyTurn).toBe(false);
    });

    it('is false when turnOrder is empty', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Jordan');
      });

      expect(result.current.isMyTurn).toBe(false);
    });
  });

  describe('currentTurnParticipant', () => {
    it('returns the participant matching turnOrder[currentTurnIndex]', () => {
      const { result } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Jordan');
      });

      act(() => {
        getMainSocket().simulateEvent('NOTIFY_PARTICIPANT_JOINED', {
          participant: mockParticipant2,
          participants: [mockParticipant, mockParticipant2],
        });
      });

      act(() => {
        getMainSocket().simulateEvent('NOTIFY_DRAFT_STARTED', {
          pool: [],
          turnOrder: ['p2', 'p1'],
        });
      });

      expect(result.current.currentTurnParticipant).toEqual(mockParticipant2);
    });

    it('returns null when turnOrder is empty', () => {
      const { result } = setupHook();

      expect(result.current.currentTurnParticipant).toBeNull();
    });
  });

  // ─── createRoom ─────────────────────────────────────────────────────────────

  describe('createRoom', () => {
    /**
     * createRoom flow:
     *   io() call #1 → mockSocketA (temp socket, no roomId)
     *   io() call #2 → mockSocketB (real socket, with roomId)
     */

    it('dispatches SET_IDENTITY with isOrganizer: true after ROOM_CREATED fires', async () => {
      const { result } = setupHook();

      let createPromise: Promise<void>;
      act(() => {
        createPromise = result.current.createRoom('Jordan');
      });

      // Temp socket receives ROOM_CREATED
      act(() => {
        mockSocketA.simulateOnce('ROOM_CREATED', { roomId: 'ROOM9' });
      });

      await act(async () => {
        await createPromise!;
      });

      expect(result.current.state.isOrganizer).toBe(true);
      expect(result.current.state.roomId).toBe('ROOM9');
      expect(result.current.state.myName).toBe('Jordan');
    });

    it('disconnects the temp socket after ROOM_CREATED', async () => {
      const { result } = setupHook();

      let createPromise: Promise<void>;
      act(() => {
        createPromise = result.current.createRoom('Jordan');
      });

      act(() => {
        mockSocketA.simulateOnce('ROOM_CREATED', { roomId: 'ROOM9' });
      });

      await act(async () => {
        await createPromise!;
      });

      expect(mockSocketA.disconnect).toHaveBeenCalled();
    });

    it('emits PARTICIPANT_JOINED on the real socket with isOrganizer: true', async () => {
      const { result } = setupHook();

      let createPromise: Promise<void>;
      act(() => {
        createPromise = result.current.createRoom('Jordan');
      });

      act(() => {
        mockSocketA.simulateOnce('ROOM_CREATED', { roomId: 'ROOM9' });
      });

      await act(async () => {
        await createPromise!;
      });

      expect(mockSocketB.emit).toHaveBeenCalledWith(
        'PARTICIPANT_JOINED',
        expect.objectContaining({
          participant: expect.objectContaining({ name: 'Jordan', isOrganizer: true }),
        }),
      );
    });

    it('calls toast.error and rejects when connect_error fires', async () => {
      const { toast } = await import('react-toastify');
      const { result } = setupHook();

      let createPromise: Promise<void>;
      act(() => {
        createPromise = result.current.createRoom('Jordan');
      });

      act(() => {
        mockSocketA.simulateOnce('connect_error', undefined);
      });

      await expect(
        act(async () => {
          await createPromise!;
        }),
      ).rejects.toThrow();

      expect(toast.error).toHaveBeenCalledWith('Failed to create room. Please try again.');
    });
  });

  // ─── joinRoom ───────────────────────────────────────────────────────────────

  describe('joinRoom', () => {
    it('emits PARTICIPANT_JOINED with isOrganizer: false', () => {
      const { result } = setupHook();

      act(() => {
        result.current.joinRoom('ROOM5', 'Bird');
      });

      const myId = result.current.state.myParticipantId!;

      expect(getMainSocket().emit).toHaveBeenCalledWith('PARTICIPANT_JOINED', {
        participant: { participantId: myId, name: 'Bird', isOrganizer: false },
      });
    });

    it('sets isOrganizer to false', () => {
      const { result } = setupHook();

      act(() => {
        result.current.joinRoom('ROOM5', 'Bird');
      });

      expect(result.current.state.isOrganizer).toBe(false);
    });
  });

  // ─── Cleanup ────────────────────────────────────────────────────────────────

  describe('cleanup', () => {
    it('disconnects the socket on unmount', () => {
      const { result, unmount } = setupHook();
      act(() => {
        result.current.joinRoom('ROOM1', 'Bird');
      });

      unmount();

      expect(getMainSocket().disconnect).toHaveBeenCalled();
    });
  });

  // ─── useDraftContext guard ──────────────────────────────────────────────────

  describe('useDraftContext', () => {
    it('throws when called outside a DraftProvider', () => {
      expect(() => {
        renderHook(() => useDraftContext());
      }).toThrow('useDraftContext must be used within a DraftProvider');
    });
  });

  // ─── Provider with initialRoomId prop ──────────────────────────────────────

  describe('DraftProvider with roomId prop', () => {
    it('connects immediately to the given roomId on mount', async () => {
      const { io } = await import('socket.io-client');

      render(
        <DraftProvider roomId="INITIAL_ROOM">
          <div>child</div>
        </DraftProvider>,
      );

      await waitFor(() => {
        expect(io).toHaveBeenCalledWith(
          '/draft',
          expect.objectContaining({ query: { roomId: 'INITIAL_ROOM' } }),
        );
      });
    });
  });
});
