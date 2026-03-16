import type {
  DraftPhase,
  DraftRoomConfig,
  NotifyConfigSavedPayload,
  NotifyDraftCompletePayload,
  NotifyDraftStartedPayload,
  NotifyParticipantJoinedPayload,
  NotifyParticipantLeftPayload,
  NotifyPickConfirmedPayload,
  NotifyPoolUpdatedPayload,
  NotifyTurnAdvancedPayload,
  Participant,
  PickRecord,
  PoolEntry,
} from '@/components/draft/types';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { toast } from 'react-toastify';
import { io, Socket } from 'socket.io-client';

// ─── State ────────────────────────────────────────────────────────────────────

interface DraftState {
  phase: DraftPhase;
  roomId: string | null;
  myParticipantId: string | null;
  myName: string | null;
  isOrganizer: boolean;
  participants: Participant[];
  config: DraftRoomConfig | null;
  pool: PoolEntry[];
  /** Ordered list of participantIds — the pre-expanded turn sequence. */
  turnOrder: string[];
  currentTurnIndex: number;
  currentRound: number;
  pickHistory: PickRecord[];
  /** Entry IDs that have been invalidated after a pick. */
  invalidatedIds: Set<string>;
}

const initialState: DraftState = {
  phase: 'entrance',
  roomId: null,
  myParticipantId: null,
  myName: null,
  isOrganizer: false,
  participants: [],
  config: null,
  pool: [],
  turnOrder: [],
  currentTurnIndex: 0,
  currentRound: 1,
  pickHistory: [],
  invalidatedIds: new Set(),
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

type DraftAction =
  | {
      type: 'SET_IDENTITY';
      participantId: string;
      name: string;
      roomId: string;
      isOrganizer: boolean;
    }
  | { type: 'SET_PHASE'; phase: DraftPhase }
  | { type: 'PARTICIPANT_JOINED'; participant: Participant; participants: Participant[] }
  | { type: 'PARTICIPANT_LEFT'; participantId: string }
  | { type: 'CONFIG_SAVED'; config: DraftRoomConfig }
  | { type: 'DRAFT_STARTED'; pool: PoolEntry[]; turnOrder: string[] }
  | { type: 'PICK_CONFIRMED'; pickRecord: PickRecord }
  | { type: 'POOL_UPDATED'; invalidatedIds: string[] }
  | { type: 'TURN_ADVANCED'; currentTurnIndex: number; currentRound: number }
  | { type: 'DRAFT_COMPLETE'; pickHistory: PickRecord[] }
  | { type: 'RESET' };

function draftReducer(state: DraftState, action: DraftAction): DraftState {
  switch (action.type) {
    case 'SET_IDENTITY':
      return {
        ...state,
        myParticipantId: action.participantId,
        myName: action.name,
        roomId: action.roomId,
        isOrganizer: action.isOrganizer,
        phase: 'lobby',
      };
    case 'SET_PHASE':
      return { ...state, phase: action.phase };
    case 'PARTICIPANT_JOINED':
      return { ...state, participants: action.participants };
    case 'PARTICIPANT_LEFT':
      return {
        ...state,
        participants: state.participants.filter((p) => p.participantId !== action.participantId),
      };
    case 'CONFIG_SAVED':
      return { ...state, config: action.config };
    case 'DRAFT_STARTED':
      return {
        ...state,
        pool: action.pool,
        turnOrder: action.turnOrder,
        phase: 'drafting',
        currentTurnIndex: 0,
        currentRound: 1,
        pickHistory: [],
        invalidatedIds: new Set(),
      };
    case 'PICK_CONFIRMED':
      return { ...state, pickHistory: [...state.pickHistory, action.pickRecord] };
    case 'POOL_UPDATED': {
      const updated = new Set(state.invalidatedIds);
      action.invalidatedIds.forEach((id) => updated.add(id));
      return { ...state, invalidatedIds: updated };
    }
    case 'TURN_ADVANCED':
      return {
        ...state,
        currentTurnIndex: action.currentTurnIndex,
        currentRound: action.currentRound,
      };
    case 'DRAFT_COMPLETE':
      return { ...state, phase: 'results', pickHistory: action.pickHistory };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// ─── Context type ─────────────────────────────────────────────────────────────

interface DraftContextValue {
  state: DraftState;
  /** Whether it is the current user's turn to pick. */
  isMyTurn: boolean;
  /** The participant whose turn it currently is. */
  currentTurnParticipant: Participant | null;
  createRoom: (name: string) => Promise<void>;
  joinRoom: (roomId: string, name: string) => void;
  saveConfig: (config: DraftRoomConfig) => void;
  startDraft: () => void;
  submitPick: (entryId: string) => void;
  /** Notifies the server that the client-side turn timer expired. */
  notifyTimerExpired: () => void;
  leave: () => void;
}

const DraftContext = createContext<DraftContextValue | null>(null);

/**
 * Returns the current value of the DraftContext.
 * Throws if called outside of a DraftProvider.
 */
export function useDraftContext(): DraftContextValue {
  const ctx = useContext(DraftContext);
  if (!ctx) {
    throw new Error('useDraftContext must be used within a DraftProvider');
  }
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface DraftProviderProps {
  children: ReactNode;
  /**
   * When provided, the provider connects to this room on mount.
   * Used by DraftRoomPage to reconnect when navigating directly to a room URL.
   */
  roomId?: string;
}

/**
 * Provides real-time NBA All-Time Draft state to descendant components.
 *
 * Manages the Socket.io connection lifecycle, handles all inbound server events,
 * and exposes actions for room creation, joining, configuring, and drafting.
 *
 * @example
 * <DraftProvider>
 *   <DraftLobbyPage />
 * </DraftProvider>
 *
 * @example
 * <DraftProvider roomId={roomId}>
 *   <DraftRoomPage />
 * </DraftProvider>
 */
export function DraftProvider({ children, roomId: initialRoomId }: DraftProviderProps) {
  const [state, dispatch] = useReducer(draftReducer, initialState);
  const socketRef = useRef<Socket | null>(null);

  const connectSocket = useCallback((roomId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.disconnect();
    }

    const socket = io('/draft', {
      query: { roomId },
      transports: ['websocket'],
    });

    socket.on(
      'NOTIFY_PARTICIPANT_JOINED',
      ({ participant, participants }: NotifyParticipantJoinedPayload) => {
        dispatch({ type: 'PARTICIPANT_JOINED', participant, participants });
        toast.info(`${participant.name} joined the room`);
      },
    );

    socket.on('NOTIFY_PARTICIPANT_LEFT', ({ participantId }: NotifyParticipantLeftPayload) => {
      dispatch({ type: 'PARTICIPANT_LEFT', participantId });
    });

    socket.on('NOTIFY_CONFIG_SAVED', ({ config }: NotifyConfigSavedPayload) => {
      dispatch({ type: 'CONFIG_SAVED', config });
      dispatch({ type: 'SET_PHASE', phase: 'pool-preview' });
      toast.success('Draft configuration saved');
    });

    socket.on('NOTIFY_DRAFT_STARTED', ({ pool, turnOrder }: NotifyDraftStartedPayload) => {
      dispatch({ type: 'DRAFT_STARTED', pool, turnOrder });
      toast.success('Draft started!');
    });

    socket.on('NOTIFY_PICK_CONFIRMED', ({ pickRecord }: NotifyPickConfirmedPayload) => {
      dispatch({ type: 'PICK_CONFIRMED', pickRecord });
    });

    socket.on('NOTIFY_POOL_UPDATED', ({ invalidatedIds }: NotifyPoolUpdatedPayload) => {
      dispatch({ type: 'POOL_UPDATED', invalidatedIds });
    });

    socket.on(
      'NOTIFY_TURN_ADVANCED',
      ({ currentTurnIndex, currentRound }: NotifyTurnAdvancedPayload) => {
        dispatch({ type: 'TURN_ADVANCED', currentTurnIndex, currentRound });
      },
    );

    socket.on('NOTIFY_DRAFT_COMPLETE', ({ pickHistory }: NotifyDraftCompletePayload) => {
      dispatch({ type: 'DRAFT_COMPLETE', pickHistory });
      toast.success('Draft complete!');
    });

    socketRef.current = socket;
  }, []);

  // Disconnect on unmount
  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Connect immediately if a roomId is passed as a prop (direct URL navigation)
  useEffect(() => {
    if (initialRoomId) {
      connectSocket(initialRoomId);
    }
  }, [initialRoomId, connectSocket]);

  const createRoom = useCallback(
    async (name: string) => {
      // Connecting without a roomId causes the gateway to create a new room
      // and emit ROOM_CREATED back with the generated roomId.
      const tempSocket = io('/draft', { transports: ['websocket'] });

      const roomId = await new Promise<string>((resolve, reject) => {
        tempSocket.once('ROOM_CREATED', ({ roomId: id }: { roomId: string }) => resolve(id));
        tempSocket.once('connect_error', () => {
          tempSocket.disconnect();
          reject(new Error('Failed to create draft room'));
        });
      }).catch(() => {
        toast.error('Failed to create room. Please try again.');
        throw new Error('Failed to create draft room');
      });

      // Disconnect the bootstrap socket; connectSocket opens the real one with roomId
      tempSocket.disconnect();
      connectSocket(roomId);

      const participantId = crypto.randomUUID();

      dispatch({
        type: 'SET_IDENTITY',
        participantId,
        name,
        roomId,
        isOrganizer: true,
      });

      socketRef.current?.emit('PARTICIPANT_JOINED', {
        participant: { participantId, name, isOrganizer: true },
      });
    },
    [connectSocket],
  );

  const joinRoom = useCallback(
    (roomId: string, name: string) => {
      const participantId = crypto.randomUUID();

      connectSocket(roomId);

      dispatch({
        type: 'SET_IDENTITY',
        participantId,
        name,
        roomId,
        isOrganizer: false,
      });

      socketRef.current?.emit('PARTICIPANT_JOINED', {
        participant: { participantId, name, isOrganizer: false },
      });
    },
    [connectSocket],
  );

  const saveConfig = useCallback((config: DraftRoomConfig) => {
    dispatch({ type: 'SET_PHASE', phase: 'configuring' });
    socketRef.current?.emit('ORGANIZER_CONFIGURE');
    socketRef.current?.emit('SAVE_CONFIG', { config });
  }, []);

  const startDraft = useCallback(() => {
    socketRef.current?.emit('ORGANIZER_START_DRAFT');
  }, []);

  const submitPick = useCallback(
    (entryId: string) => {
      if (!state.myParticipantId) return;
      socketRef.current?.emit('SUBMIT_PICK', {
        pickRecord: {
          participantId: state.myParticipantId,
          entryId,
          round: state.currentRound,
        },
      });
    },
    [state.myParticipantId, state.currentRound],
  );

  const notifyTimerExpired = useCallback(() => {
    socketRef.current?.emit('TURN_TIMER_EXPIRED');
  }, []);

  const leave = useCallback(() => {
    if (state.myParticipantId) {
      socketRef.current?.emit('PARTICIPANT_LEFT', { participantId: state.myParticipantId });
    }
    socketRef.current?.disconnect();
    dispatch({ type: 'RESET' });
  }, [state.myParticipantId]);

  const isMyTurn = useMemo(
    () =>
      state.turnOrder.length > 0 &&
      state.turnOrder[state.currentTurnIndex] === state.myParticipantId,
    [state.turnOrder, state.currentTurnIndex, state.myParticipantId],
  );

  const currentTurnParticipant = useMemo(
    () =>
      state.participants.find((p) => p.participantId === state.turnOrder[state.currentTurnIndex]) ??
      null,
    [state.participants, state.turnOrder, state.currentTurnIndex],
  );

  const value = useMemo(
    () => ({
      state,
      isMyTurn,
      currentTurnParticipant,
      createRoom,
      joinRoom,
      saveConfig,
      startDraft,
      submitPick,
      notifyTimerExpired,
      leave,
    }),
    [
      state,
      isMyTurn,
      currentTurnParticipant,
      createRoom,
      joinRoom,
      saveConfig,
      startDraft,
      submitPick,
      notifyTimerExpired,
      leave,
    ],
  );

  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}
