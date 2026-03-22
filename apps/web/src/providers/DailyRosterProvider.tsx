import { createContext, useCallback, useEffect, useState } from 'react';
import { BACKEND_URL } from '@/config';

// ---------------------------------------------------------------------------
// Local types — mirrors @dribblio/types shapes without TypeORM decorators
// ---------------------------------------------------------------------------

/** A player that has been successfully named in the current session. */
export interface NamedPlayer {
  playerId: number;
  fullName: string;
  position: string | null;
  jerseyNumber: string | null;
}

export type DailyPhase = 'loading' | 'playing' | 'complete';

export interface DailyRosterState {
  phase: DailyPhase;
  challengeDate: string;
  teamId: number;
  teamFullName: string;
  teamAbbreviation: string;
  seasonId: string;
  rosterSize: number;
  namedPlayers: NamedPlayer[];
  /** Always starts at 3. */
  lives: number;
  complete: boolean;
  won: boolean;
  error: 'NO_CHALLENGE' | 'NETWORK_ERROR' | null;
}

export interface DailyRosterContextValue {
  state: DailyRosterState;
  /**
   * Submits a player guess to the server.
   *
   * @param playerId - The ID of the player being guessed.
   * @returns A discriminated result: 'correct', 'wrong', or 'duplicate'.
   */
  submitGuess: (playerId: number) => Promise<'correct' | 'wrong' | 'duplicate'>;
}

// ---------------------------------------------------------------------------
// API response shapes
// ---------------------------------------------------------------------------

interface DailyChallengeDto {
  challengeDate: string;
  teamId: number;
  teamFullName: string;
  teamAbbreviation: string;
  seasonId: string;
  rosterSize: number;
}

interface RosterGuessPlayerDto {
  playerId: number;
  fullName: string;
  position: string | null;
  jerseyNumber: string | null;
}

type RosterGuessResponseDto =
  | { correct: true; duplicate: true; player: RosterGuessPlayerDto; rosterSize: number }
  | { correct: true; duplicate?: false; player: RosterGuessPlayerDto; namedIds: number[]; rosterSize: number }
  | { correct: false; rosterSize: number }
  | { error: 'NO_CHALLENGE' };

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

interface PersistedDailyRoster {
  namedIds: number[];
  namedPlayers: NamedPlayer[];
  lives: number;
  complete: boolean;
  won: boolean;
}

function getTodayKey(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `daily_roster_${yyyy}-${mm}-${dd}`;
}

function loadPersistedSession(key: string): PersistedDailyRoster | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedDailyRoster;
  } catch {
    return null;
  }
}

function persistSession(key: string, data: PersistedDailyRoster): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // localStorage may be unavailable in some environments — fail silently
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export const DailyRosterContext = createContext<DailyRosterContextValue | null>(null);

const initialState: DailyRosterState = {
  phase: 'loading',
  challengeDate: '',
  teamId: 0,
  teamFullName: '',
  teamAbbreviation: '',
  seasonId: '',
  rosterSize: 0,
  namedPlayers: [],
  lives: 3,
  complete: false,
  won: false,
  error: null,
};

interface DailyRosterProviderProps {
  children: React.ReactNode;
}

/**
 * Manages the Daily Roster Challenge session: fetches today's challenge,
 * restores or initializes localStorage state, and exposes `submitGuess`.
 *
 * Mount this provider at the route level. Access state and actions via
 * `useDailyRoster()`.
 *
 * @example
 * <DailyRosterProvider>
 *   <DailyRosterContent />
 * </DailyRosterProvider>
 */
export function DailyRosterProvider({ children }: DailyRosterProviderProps) {
  const [state, setState] = useState<DailyRosterState>(initialState);
  // Key is computed once on mount so all reads/writes use the same date
  const [storageKey] = useState(() => getTodayKey());

  useEffect(() => {
    async function fetchChallenge() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/daily/roster/today`);

        if (res.status === 404) {
          setState((prev) => ({ ...prev, phase: 'playing', error: 'NO_CHALLENGE' }));
          return;
        }

        if (!res.ok) throw new Error('Network error');

        const challenge = (await res.json()) as DailyChallengeDto;
        const persisted = loadPersistedSession(storageKey);

        if (persisted) {
          const isComplete = persisted.complete;
          setState({
            phase: isComplete ? 'complete' : 'playing',
            challengeDate: challenge.challengeDate,
            teamId: challenge.teamId,
            teamFullName: challenge.teamFullName,
            teamAbbreviation: challenge.teamAbbreviation,
            seasonId: challenge.seasonId,
            rosterSize: challenge.rosterSize,
            namedPlayers: persisted.namedPlayers,
            lives: persisted.lives,
            complete: persisted.complete,
            won: persisted.won,
            error: null,
          });
        } else {
          setState({
            phase: 'playing',
            challengeDate: challenge.challengeDate,
            teamId: challenge.teamId,
            teamFullName: challenge.teamFullName,
            teamAbbreviation: challenge.teamAbbreviation,
            seasonId: challenge.seasonId,
            rosterSize: challenge.rosterSize,
            namedPlayers: [],
            lives: 3,
            complete: false,
            won: false,
            error: null,
          });
        }
      } catch {
        setState((prev) => ({ ...prev, phase: 'playing', error: 'NETWORK_ERROR' }));
      }
    }

    void fetchChallenge();
  }, [storageKey]);

  const submitGuess = useCallback(
    async (playerId: number): Promise<'correct' | 'wrong' | 'duplicate'> => {
      const namedIds = state.namedPlayers.map((p) => p.playerId);

      let res: Response;
      try {
        res = await fetch(`${BACKEND_URL}/api/daily/roster/guess`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ guessId: playerId, namedIds }),
        });
      } catch {
        setState((prev) => ({ ...prev, error: 'NETWORK_ERROR' }));
        return 'wrong';
      }

      if (res.status === 404) {
        setState((prev) => ({ ...prev, error: 'NO_CHALLENGE' }));
        return 'wrong';
      }

      const data = (await res.json()) as RosterGuessResponseDto;

      if ('error' in data) {
        setState((prev) => ({ ...prev, error: 'NO_CHALLENGE' }));
        return 'wrong';
      }

      if (data.correct && 'duplicate' in data && data.duplicate) {
        return 'duplicate';
      }

      if (data.correct) {
        setState((prev) => {
          const updatedPlayers = [...prev.namedPlayers, data.player];
          const won = updatedPlayers.length === prev.rosterSize;
          const next: DailyRosterState = {
            ...prev,
            namedPlayers: updatedPlayers,
            complete: won,
            won,
            phase: won ? 'complete' : prev.phase,
          };
          persistSession(storageKey, {
            namedIds: updatedPlayers.map((p) => p.playerId),
            namedPlayers: updatedPlayers,
            lives: prev.lives,
            complete: won,
            won,
          });
          return next;
        });
        return 'correct';
      }

      // Wrong guess
      setState((prev) => {
        const newLives = prev.lives - 1;
        const lost = newLives <= 0;
        const next: DailyRosterState = {
          ...prev,
          lives: newLives,
          complete: lost,
          won: false,
          // Phase stays 'playing' — the page component drives the reveal animation
          // before transitioning to 'complete' via the timer it owns.
          phase: lost ? 'complete' : prev.phase,
        };
        persistSession(storageKey, {
          namedIds: prev.namedPlayers.map((p) => p.playerId),
          namedPlayers: prev.namedPlayers,
          lives: newLives,
          complete: lost,
          won: false,
        });
        return next;
      });
      return 'wrong';
    },
    [state.namedPlayers, storageKey],
  );

  return (
    <DailyRosterContext.Provider value={{ state, submitGuess }}>
      {children}
    </DailyRosterContext.Provider>
  );
}
