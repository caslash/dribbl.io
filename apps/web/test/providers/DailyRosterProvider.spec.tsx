import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DailyRosterProvider } from '@/providers/DailyRosterProvider';
import { useDailyRoster } from '@/hooks/useDailyRoster';

vi.mock('@/config', () => ({
  BACKEND_URL: 'http://test-api',
}));

// ─── Fixtures ────────────────────────────────────────────────────────────────

const CHALLENGE_DATE = '2026-03-22';

const mockChallenge = {
  challengeDate: CHALLENGE_DATE,
  teamId: 1,
  teamFullName: 'Golden State Warriors',
  teamAbbreviation: 'GSW',
  seasonId: '2015-16',
  rosterSize: 14,
};

const mockPlayer = {
  playerId: 23,
  fullName: 'Stephen Curry',
  position: 'PG',
  jerseyNumber: '30',
};

const mockPlayer2 = {
  playerId: 35,
  fullName: 'Kevin Durant',
  position: 'SF',
  jerseyNumber: '35',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function wrapper({ children }: { children: ReactNode }) {
  return <DailyRosterProvider>{children}</DailyRosterProvider>;
}

function setupHook() {
  return renderHook(() => useDailyRoster(), { wrapper });
}

function makeFetchSuccess(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

function makeFetchNetworkError(): Promise<Response> {
  return Promise.reject(new Error('Network error'));
}

/**
 * Builds a PersistedDailyRoster-shaped object and writes it to localStorage
 * under the given date key.
 */
function seedLocalStorage(
  date: string,
  data: {
    namedPlayers?: typeof mockPlayer[];
    lives?: number;
    complete?: boolean;
    won?: boolean;
  },
) {
  const persisted = {
    namedIds: (data.namedPlayers ?? []).map((p) => p.playerId),
    namedPlayers: data.namedPlayers ?? [],
    lives: data.lives ?? 3,
    complete: data.complete ?? false,
    won: data.won ?? false,
  };
  localStorage.setItem(`daily_roster_${date}`, JSON.stringify(persisted));
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('DailyRosterProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // ─── Initial load ──────────────────────────────────────────────────────────

  describe('initial load', () => {
    it('starts with phase "loading" while fetch is in-flight', () => {
      vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}));

      const { result } = setupHook();

      expect(result.current.state.phase).toBe('loading');
    });

    it('transitions to phase "playing" after a successful fetch', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(makeFetchSuccess(mockChallenge));

      const { result } = setupHook();

      await waitFor(() => {
        expect(result.current.state.phase).toBe('playing');
      });
    });

    it('populates challenge fields from the API response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(makeFetchSuccess(mockChallenge));

      const { result } = setupHook();

      await waitFor(() => {
        expect(result.current.state.teamFullName).toBe('Golden State Warriors');
        expect(result.current.state.seasonId).toBe('2015-16');
        expect(result.current.state.rosterSize).toBe(14);
      });
    });

    it('sets error "NO_CHALLENGE" when the API returns 404 with { error: "NO_CHALLENGE" }', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(makeFetchSuccess({}, 404));

      const { result } = setupHook();

      await waitFor(() => {
        expect(result.current.state.error).toBe('NO_CHALLENGE');
      });
    });

    it('sets error "NETWORK_ERROR" on network failure', async () => {
      vi.spyOn(globalThis, 'fetch').mockImplementation(makeFetchNetworkError);

      const { result } = setupHook();

      await waitFor(() => {
        expect(result.current.state.error).toBe('NETWORK_ERROR');
      });
    });

    it('sets error "NETWORK_ERROR" when the response is not ok and not 404', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(makeFetchSuccess({}, 500));

      const { result } = setupHook();

      await waitFor(() => {
        expect(result.current.state.error).toBe('NETWORK_ERROR');
      });
    });

    it('initializes lives to 3 and namedPlayers to empty when there is no saved session', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(makeFetchSuccess(mockChallenge));

      const { result } = setupHook();

      await waitFor(() => {
        expect(result.current.state.lives).toBe(3);
        expect(result.current.state.namedPlayers).toEqual([]);
      });
    });
  });

  // ─── localStorage restore ─────────────────────────────────────────────────

  describe('localStorage restore', () => {
    it('restores phase "complete" immediately when saved session is complete', async () => {
      seedLocalStorage(CHALLENGE_DATE, { complete: true, won: true, lives: 2 });
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(makeFetchSuccess(mockChallenge));

      const { result } = setupHook();

      await waitFor(() => {
        expect(result.current.state.phase).toBe('complete');
        expect(result.current.state.complete).toBe(true);
        expect(result.current.state.won).toBe(true);
      });
    });

    it('restores namedPlayers and lives for an incomplete session', async () => {
      seedLocalStorage(CHALLENGE_DATE, {
        namedPlayers: [mockPlayer],
        lives: 2,
        complete: false,
        won: false,
      });
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(makeFetchSuccess(mockChallenge));

      const { result } = setupHook();

      await waitFor(() => {
        expect(result.current.state.phase).toBe('playing');
        expect(result.current.state.namedPlayers).toEqual([mockPlayer]);
        expect(result.current.state.lives).toBe(2);
      });
    });

    it('ignores a saved session from a different date and starts fresh', async () => {
      seedLocalStorage('2026-03-21', { namedPlayers: [mockPlayer], lives: 1 });
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(makeFetchSuccess(mockChallenge));

      const { result } = setupHook();

      await waitFor(() => {
        expect(result.current.state.namedPlayers).toEqual([]);
        expect(result.current.state.lives).toBe(3);
      });
    });
  });

  // ─── submitGuess: correct ─────────────────────────────────────────────────

  describe('submitGuess — correct', () => {
    it('returns "correct"', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(makeFetchSuccess(mockChallenge))
        .mockResolvedValueOnce(
          makeFetchSuccess({
            correct: true,
            player: mockPlayer,
            namedIds: [mockPlayer.playerId],
            rosterSize: 14,
          }),
        );

      const { result } = setupHook();
      await waitFor(() => expect(result.current.state.phase).toBe('playing'));

      let guessResult: string | undefined;
      await act(async () => {
        guessResult = await result.current.submitGuess(mockPlayer.playerId);
      });

      expect(guessResult).toBe('correct');
    });

    it('adds the player to namedPlayers', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(makeFetchSuccess(mockChallenge))
        .mockResolvedValueOnce(
          makeFetchSuccess({
            correct: true,
            player: mockPlayer,
            namedIds: [mockPlayer.playerId],
            rosterSize: 14,
          }),
        );

      const { result } = setupHook();
      await waitFor(() => expect(result.current.state.phase).toBe('playing'));

      await act(async () => {
        await result.current.submitGuess(mockPlayer.playerId);
      });

      expect(result.current.state.namedPlayers).toHaveLength(1);
      expect(result.current.state.namedPlayers[0].playerId).toBe(mockPlayer.playerId);
    });

    it('persists the updated namedPlayers to localStorage', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(makeFetchSuccess(mockChallenge))
        .mockResolvedValueOnce(
          makeFetchSuccess({
            correct: true,
            player: mockPlayer,
            namedIds: [mockPlayer.playerId],
            rosterSize: 14,
          }),
        );

      const { result } = setupHook();
      await waitFor(() => expect(result.current.state.phase).toBe('playing'));

      await act(async () => {
        await result.current.submitGuess(mockPlayer.playerId);
      });

      const stored = JSON.parse(localStorage.getItem(`daily_roster_${CHALLENGE_DATE}`) ?? '{}');
      expect(stored.namedPlayers).toHaveLength(1);
      expect(stored.namedPlayers[0].playerId).toBe(mockPlayer.playerId);
    });

    it('sets phase "complete" and won to true when all players are named', async () => {
      const smallChallenge = { ...mockChallenge, rosterSize: 1 };
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(makeFetchSuccess(smallChallenge))
        .mockResolvedValueOnce(
          makeFetchSuccess({
            correct: true,
            player: mockPlayer,
            namedIds: [mockPlayer.playerId],
            rosterSize: 1,
          }),
        );

      const { result } = setupHook();
      await waitFor(() => expect(result.current.state.phase).toBe('playing'));

      await act(async () => {
        await result.current.submitGuess(mockPlayer.playerId);
      });

      expect(result.current.state.complete).toBe(true);
      expect(result.current.state.won).toBe(true);
      expect(result.current.state.phase).toBe('complete');
    });

    it('persists complete: true when the roster is fully named', async () => {
      const smallChallenge = { ...mockChallenge, rosterSize: 1 };
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(makeFetchSuccess(smallChallenge))
        .mockResolvedValueOnce(
          makeFetchSuccess({
            correct: true,
            player: mockPlayer,
            namedIds: [mockPlayer.playerId],
            rosterSize: 1,
          }),
        );

      const { result } = setupHook();
      await waitFor(() => expect(result.current.state.phase).toBe('playing'));

      await act(async () => {
        await result.current.submitGuess(mockPlayer.playerId);
      });

      const stored = JSON.parse(localStorage.getItem(`daily_roster_${CHALLENGE_DATE}`) ?? '{}');
      expect(stored.complete).toBe(true);
      expect(stored.won).toBe(true);
    });
  });

  // ─── submitGuess: duplicate ───────────────────────────────────────────────

  describe('submitGuess — duplicate', () => {
    it('returns "duplicate"', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(makeFetchSuccess(mockChallenge))
        .mockResolvedValueOnce(
          makeFetchSuccess({ correct: true, duplicate: true, player: mockPlayer, rosterSize: 14 }),
        );

      const { result } = setupHook();
      await waitFor(() => expect(result.current.state.phase).toBe('playing'));

      let guessResult: string | undefined;
      await act(async () => {
        guessResult = await result.current.submitGuess(mockPlayer.playerId);
      });

      expect(guessResult).toBe('duplicate');
    });

    it('does not change namedPlayers on duplicate', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(makeFetchSuccess(mockChallenge))
        .mockResolvedValueOnce(
          makeFetchSuccess({ correct: true, duplicate: true, player: mockPlayer, rosterSize: 14 }),
        );

      const { result } = setupHook();
      await waitFor(() => expect(result.current.state.phase).toBe('playing'));

      const playersBefore = result.current.state.namedPlayers.length;

      await act(async () => {
        await result.current.submitGuess(mockPlayer.playerId);
      });

      expect(result.current.state.namedPlayers).toHaveLength(playersBefore);
    });

    it('does not change lives on duplicate', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(makeFetchSuccess(mockChallenge))
        .mockResolvedValueOnce(
          makeFetchSuccess({ correct: true, duplicate: true, player: mockPlayer, rosterSize: 14 }),
        );

      const { result } = setupHook();
      await waitFor(() => expect(result.current.state.phase).toBe('playing'));

      const livesBefore = result.current.state.lives;

      await act(async () => {
        await result.current.submitGuess(mockPlayer.playerId);
      });

      expect(result.current.state.lives).toBe(livesBefore);
    });
  });

  // ─── submitGuess: wrong ───────────────────────────────────────────────────

  describe('submitGuess — wrong', () => {
    it('returns "wrong"', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(makeFetchSuccess(mockChallenge))
        .mockResolvedValueOnce(makeFetchSuccess({ correct: false, rosterSize: 14 }));

      const { result } = setupHook();
      await waitFor(() => expect(result.current.state.phase).toBe('playing'));

      let guessResult: string | undefined;
      await act(async () => {
        guessResult = await result.current.submitGuess(999);
      });

      expect(guessResult).toBe('wrong');
    });

    it('decrements lives by 1', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(makeFetchSuccess(mockChallenge))
        .mockResolvedValueOnce(makeFetchSuccess({ correct: false, rosterSize: 14 }));

      const { result } = setupHook();
      await waitFor(() => expect(result.current.state.phase).toBe('playing'));

      await act(async () => {
        await result.current.submitGuess(999);
      });

      expect(result.current.state.lives).toBe(2);
    });

    it('persists the decremented lives to localStorage', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(makeFetchSuccess(mockChallenge))
        .mockResolvedValueOnce(makeFetchSuccess({ correct: false, rosterSize: 14 }));

      const { result } = setupHook();
      await waitFor(() => expect(result.current.state.phase).toBe('playing'));

      await act(async () => {
        await result.current.submitGuess(999);
      });

      const stored = JSON.parse(localStorage.getItem(`daily_roster_${CHALLENGE_DATE}`) ?? '{}');
      expect(stored.lives).toBe(2);
    });

    it('sets complete true and won false when lives reach 0', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(makeFetchSuccess(mockChallenge))
        .mockResolvedValue(makeFetchSuccess({ correct: false, rosterSize: 14 }));

      const { result } = setupHook();
      await waitFor(() => expect(result.current.state.phase).toBe('playing'));

      await act(async () => { await result.current.submitGuess(999); });
      await act(async () => { await result.current.submitGuess(999); });
      await act(async () => { await result.current.submitGuess(999); });

      expect(result.current.state.lives).toBe(0);
      expect(result.current.state.complete).toBe(true);
      expect(result.current.state.won).toBe(false);
      expect(result.current.state.phase).toBe('complete');
    });

    it('persists complete: true to localStorage when lives reach 0', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(makeFetchSuccess(mockChallenge))
        .mockResolvedValue(makeFetchSuccess({ correct: false, rosterSize: 14 }));

      const { result } = setupHook();
      await waitFor(() => expect(result.current.state.phase).toBe('playing'));

      await act(async () => { await result.current.submitGuess(999); });
      await act(async () => { await result.current.submitGuess(999); });
      await act(async () => { await result.current.submitGuess(999); });

      const stored = JSON.parse(localStorage.getItem(`daily_roster_${CHALLENGE_DATE}`) ?? '{}');
      expect(stored.complete).toBe(true);
      expect(stored.won).toBe(false);
    });

    it('sets error "NO_CHALLENGE" when the guess endpoint returns 404', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(makeFetchSuccess(mockChallenge))
        .mockResolvedValueOnce(makeFetchSuccess({}, 404));

      const { result } = setupHook();
      await waitFor(() => expect(result.current.state.phase).toBe('playing'));

      await act(async () => {
        await result.current.submitGuess(999);
      });

      expect(result.current.state.error).toBe('NO_CHALLENGE');
    });

    it('sets error "NO_CHALLENGE" when the guess response body contains an error field', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(makeFetchSuccess(mockChallenge))
        .mockResolvedValueOnce(makeFetchSuccess({ error: 'NO_CHALLENGE' }));

      const { result } = setupHook();
      await waitFor(() => expect(result.current.state.phase).toBe('playing'));

      await act(async () => {
        await result.current.submitGuess(999);
      });

      expect(result.current.state.error).toBe('NO_CHALLENGE');
    });

    it('sets error "NETWORK_ERROR" and returns "wrong" when the fetch throws', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(makeFetchSuccess(mockChallenge))
        .mockImplementationOnce(() => Promise.reject(new Error('Network error')));

      const { result } = setupHook();
      await waitFor(() => expect(result.current.state.phase).toBe('playing'));

      let guessResult: string | undefined;
      await act(async () => {
        guessResult = await result.current.submitGuess(999);
      });

      expect(guessResult).toBe('wrong');
      expect(result.current.state.error).toBe('NETWORK_ERROR');
    });
  });

  // ─── useDailyRoster guard ─────────────────────────────────────────────────

  describe('useDailyRoster', () => {
    it('throws when called outside a DailyRosterProvider', () => {
      expect(() => {
        renderHook(() => useDailyRoster());
      }).toThrow('useDailyRoster must be used inside <DailyRosterProvider>');
    });
  });

  // ─── Render smoke test ────────────────────────────────────────────────────

  describe('provider renders children', () => {
    it('renders child content', () => {
      vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}));

      render(
        <DailyRosterProvider>
          <span>child content</span>
        </DailyRosterProvider>,
      );

      expect(screen.getByText('child content')).toBeInTheDocument();
    });
  });
});
