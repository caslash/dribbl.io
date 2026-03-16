import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { io, Socket } from 'socket.io-client';

// ---------------------------------------------------------------------------
// Local types — mirrors @dribblio/types shapes without TypeORM decorators
// ---------------------------------------------------------------------------

/** Lightweight player record used in guess feedback. */
export interface PlayerResult {
  playerId: number;
  fullName: string;
  firstName: string;
  lastName: string;
}

export type GamePhase = 'config' | 'playing' | 'game-over';

export interface CareerPathState {
  phase: GamePhase;
  score: number;
  /** null means infinite lives mode */
  lives: number | null;
  /** Ordered team abbreviation sequence, e.g. ["LAL", "MIA", "CLE"] */
  teamHistory: string[];
  lastResult: 'correct' | 'incorrect' | 'skip' | null;
  /** Populated after a correct guess; contains all players with the same career path */
  validAnswers: PlayerResult[];
}

export interface CareerPathConfig {
  /** Number of lives, or undefined for infinite mode */
  lives: number | undefined;
  /** One of: "firstAllNBA" | "allNBA" | "greatest75" | "allPlayers" */
  gameDifficulty: string;
}

export interface CareerPathContextValue {
  state: CareerPathState;
  saveConfig: (config: CareerPathConfig) => void;
  startGame: () => void;
  submitGuess: (playerId: number) => void;
  skip: () => void;
  /** Clears lastResult so the guess form re-enables after feedback is dismissed. */
  clearFeedback: () => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export const CareerPathContext = createContext<CareerPathContextValue | null>(null);

const initialState: CareerPathState = {
  phase: 'config',
  score: 0,
  lives: null,
  teamHistory: [],
  lastResult: null,
  validAnswers: [],
};

// ---------------------------------------------------------------------------
// Inbound socket event payloads
// ---------------------------------------------------------------------------

interface NotifyNextRound {
  score: number;
  team_history: string[] | undefined;
  lives: number | undefined;
}

interface NotifyCorrectGuess {
  validAnswers: PlayerResult[];
}

interface NotifyIncorrectGuess {
  lives: number | undefined;
}

interface NotifySkipRound {
  lives: number | undefined;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface CareerPathProviderProps {
  children: React.ReactNode;
}

/**
 * Manages the Career Path game session: room creation, socket lifecycle,
 * and all inbound/outbound events.
 *
 * Mount this provider at the route level. Access state and actions via
 * `useCareerPath()`.
 *
 * @example
 * <CareerPathProvider>
 *   <CareerPathPage />
 * </CareerPathProvider>
 */
export function CareerPathProvider({ children }: CareerPathProviderProps) {
  const [state, setState] = useState<CareerPathState>(initialState);
  const socketRef = useRef<Socket | null>(null);

  // Disconnect and notify server on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('PLAYER_DISCONNECTED');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const connectSocket = useCallback((): Socket => {
    // Connect to the /careerpath namespace — no roomId means the server creates a new room
    const socket = io('/careerpath', {
      transports: ['websocket'],
    });

    socket.on('NOTIFY_CONFIG_SAVED', () => {
      // Config acknowledged — start the game
      socket.emit('START_GAME');
    });

    socket.on('NOTIFY_NEXT_ROUND', (payload: NotifyNextRound) => {
      setState((prev) => ({
        ...prev,
        phase: 'playing',
        score: payload.score,
        lives: payload.lives ?? null,
        teamHistory: payload.team_history ?? [],
        lastResult: null,
        validAnswers: [],
      }));
    });

    socket.on('NOTIFY_CORRECT_GUESS', (payload: NotifyCorrectGuess) => {
      setState((prev) => ({
        ...prev,
        lastResult: 'correct',
        validAnswers: payload.validAnswers,
      }));
    });

    socket.on('NOTIFY_INCORRECT_GUESS', (payload: NotifyIncorrectGuess) => {
      setState((prev) => ({
        ...prev,
        lastResult: 'incorrect',
        lives: payload.lives ?? null,
      }));
    });

    socket.on('NOTIFY_SKIP_ROUND', (payload: NotifySkipRound) => {
      setState((prev) => ({
        ...prev,
        lastResult: 'skip',
        lives: payload.lives ?? null,
      }));
    });

    socket.on('NOTIFY_GAME_OVER', () => {
      setState((prev) => ({ ...prev, phase: 'game-over' }));
    });

    socket.on('ERROR', (payload: { message: string }) => {
      toast.error(payload.message);
    });

    return socket;
  }, []);

  const saveConfig = useCallback(
    (config: CareerPathConfig) => {
      // Connect the socket now if not already connected — server creates the room on connection
      if (!socketRef.current) {
        socketRef.current = connectSocket();
      }

      socketRef.current.emit('SAVE_CONFIG', { config });
    },
    [connectSocket],
  );

  const startGame = useCallback(() => {
    // startGame is a no-op here — the server triggers START_GAME automatically
    // after NOTIFY_CONFIG_SAVED is received (handled in the socket listener above)
  }, []);

  const submitGuess = useCallback((playerId: number) => {
    socketRef.current?.emit('USER_GUESS', { guessId: playerId });
  }, []);

  const skip = useCallback(() => {
    socketRef.current?.emit('SKIP');
  }, []);

  const clearFeedback = useCallback(() => {
    setState((prev) => ({ ...prev, lastResult: null, validAnswers: [] }));
  }, []);

  return (
    <CareerPathContext.Provider
      value={{ state, saveConfig, startGame, submitGuess, skip, clearFeedback }}
    >
      {children}
    </CareerPathContext.Provider>
  );
}
