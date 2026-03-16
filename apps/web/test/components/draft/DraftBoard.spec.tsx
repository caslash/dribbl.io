import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DraftBoard } from '@/components/draft/DraftBoard';
import type { DraftRoomConfig, Participant, PickRecord, PoolEntry } from '@dribblio/types';

// TurnTimer uses framer-motion and real timers — stub it so DraftBoard tests stay unit-level
vi.mock('../../../src/components/draft/TurnTimer', () => ({
  TurnTimer: ({ durationSeconds, onExpire }: { durationSeconds: number; onExpire: () => void }) => (
    <button onClick={onExpire} data-testid="turn-timer">
      {durationSeconds}s
    </button>
  ),
}));

vi.mock('react-toastify', () => ({
  toast: {
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// ─── Per-test mock state ───────────────────────────────────────────────────────

interface MockDraftContext {
  pool: PoolEntry[];
  participants: Participant[];
  invalidatedIds: Set<string>;
  pickHistory: PickRecord[];
  currentRound: number;
  config: DraftRoomConfig | null;
  myParticipantId: string;
  isMyTurn: boolean;
  currentTurnParticipant: Participant | null;
}

let mockCtx: MockDraftContext = {
  pool: [],
  participants: [],
  invalidatedIds: new Set(),
  pickHistory: [],
  currentRound: 1,
  config: null,
  myParticipantId: 'p1',
  isMyTurn: false,
  currentTurnParticipant: null,
};

const mockSubmitPick = vi.fn();
const mockNotifyTimerExpired = vi.fn();

vi.mock('@/hooks/useDraft', () => ({
  useDraft: () => ({
    state: {
      pool: mockCtx.pool,
      participants: mockCtx.participants,
      invalidatedIds: mockCtx.invalidatedIds,
      pickHistory: mockCtx.pickHistory,
      currentRound: mockCtx.currentRound,
      config: mockCtx.config,
      myParticipantId: mockCtx.myParticipantId,
    },
    isMyTurn: mockCtx.isMyTurn,
    currentTurnParticipant: mockCtx.currentTurnParticipant,
    submitPick: mockSubmitPick,
    notifyTimerExpired: mockNotifyTimerExpired,
    saveConfig: vi.fn(),
    createRoom: vi.fn(),
    joinRoom: vi.fn(),
    startDraft: vi.fn(),
    leave: vi.fn(),
  }),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const p1: Participant = { participantId: 'p1', name: 'Jordan', isOrganizer: true };
const p2: Participant = { participantId: 'p2', name: 'Bird', isOrganizer: false };

const mvpEntry: PoolEntry = {
  entryId: 'entry-1',
  draftMode: 'mvp',
  playerId: 23,
  playerName: 'LeBron James',
  season: '2012-13',
};

const mvpEntry2: PoolEntry = {
  entryId: 'entry-2',
  draftMode: 'mvp',
  playerId: 33,
  playerName: "Shaquille O'Neal",
  season: '1999-00',
};

const pick1: PickRecord = { participantId: 'p1', entryId: 'entry-1', round: 1, pickNumber: 1 };

// ─── Helpers ──────────────────────────────────────────────────────────────────

type SetupOptions = Partial<MockDraftContext>;

function setup({
  pool = [mvpEntry],
  participants = [p1, p2],
  isMyTurn = false,
  currentTurnParticipant = p1 as Participant | null,
  invalidatedIds = new Set<string>(),
  pickHistory = [] as PickRecord[],
  currentRound = 1,
  config = null as DraftRoomConfig | null,
  myParticipantId = 'p1',
}: SetupOptions = {}) {
  mockCtx = { pool, participants, isMyTurn, currentTurnParticipant, invalidatedIds, pickHistory, currentRound, config, myParticipantId };

  const user = userEvent.setup();
  render(<DraftBoard />);
  return { user };
}

afterEach(() => {
  vi.clearAllMocks();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('DraftBoard', () => {
  describe('current turn banner', () => {
    it('shows the current round number', () => {
      setup({ currentRound: 3 });

      expect(screen.getByText('Round 3')).toBeInTheDocument();
    });

    it("shows \"It's your turn!\" when it is the current user's turn", () => {
      setup({ isMyTurn: true, currentTurnParticipant: p1 });

      expect(screen.getByText("It's your turn!")).toBeInTheDocument();
    });

    it("shows the participant name + \"'s turn\" when it is not the current user's turn", () => {
      setup({ isMyTurn: false, currentTurnParticipant: p2 });

      expect(screen.getByText("Bird's turn")).toBeInTheDocument();
    });

    it('shows "Waiting…" when there is no current turn participant', () => {
      setup({ currentTurnParticipant: null });

      expect(screen.getByText('Waiting…')).toBeInTheDocument();
    });
  });

  describe('pool grid', () => {
    it('renders all pool entries', () => {
      setup({ pool: [mvpEntry, mvpEntry2] });

      expect(screen.getByText('LeBron James')).toBeInTheDocument();
      expect(screen.getByText("Shaquille O'Neal")).toBeInTheDocument();
    });

    it('shows "No entries match." when the filter finds nothing', async () => {
      const { user } = setup({ pool: [mvpEntry] });

      await user.type(screen.getByPlaceholderText('Filter by player…'), 'zzz');

      expect(screen.getByText('No entries match.')).toBeInTheDocument();
    });

    it('filters pool entries by player name (case-insensitive)', async () => {
      const { user } = setup({ pool: [mvpEntry, mvpEntry2] });

      await user.type(screen.getByPlaceholderText('Filter by player…'), 'lebron');

      expect(screen.getByText('LeBron James')).toBeInTheDocument();
      expect(screen.queryByText("Shaquille O'Neal")).not.toBeInTheDocument();
    });
  });

  describe('picking', () => {
    it("calls submitPick with the entryId when it is the user's turn and the entry is available", async () => {
      const { user } = setup({ isMyTurn: true, invalidatedIds: new Set() });

      await user.click(screen.getByRole('button', { name: /Pick LeBron James$/i }));

      expect(mockSubmitPick).toHaveBeenCalledWith('entry-1');
    });

    it("does not call submitPick when it is not the user's turn (button is disabled)", async () => {
      setup({ isMyTurn: false });

      const pickButton = screen.getByRole('button', { name: /Pick LeBron James/i });
      expect(pickButton).toBeDisabled();
      expect(mockSubmitPick).not.toHaveBeenCalled();
    });

    it('renders invalidated entries with the unavailable aria-label', () => {
      setup({
        isMyTurn: true,
        invalidatedIds: new Set(['entry-1']),
      });

      expect(
        screen.getByRole('button', { name: /LeBron James \(unavailable\)/i }),
      ).toBeInTheDocument();
    });

    it("does not call submitPick for an invalidated entry even when it is the user's turn", () => {
      setup({
        isMyTurn: true,
        invalidatedIds: new Set(['entry-1']),
      });

      const pickButton = screen.getByRole('button', { name: /LeBron James \(unavailable\)/i });
      expect(pickButton).toBeDisabled();
      expect(mockSubmitPick).not.toHaveBeenCalled();
    });
  });

  describe('participant pick counts sidebar', () => {
    it("shows \"0 picks\" for participants with no picks", () => {
      setup({ participants: [p1, p2], pickHistory: [] });

      const zeroPickEls = screen.getAllByText('0 picks');
      expect(zeroPickEls).toHaveLength(2);
    });

    it('correctly counts picks per participant', () => {
      setup({
        participants: [p1, p2],
        pickHistory: [
          pick1,
          { participantId: 'p1', entryId: 'entry-2', round: 2, pickNumber: 3 },
        ],
      });

      expect(screen.getByText('2 picks')).toBeInTheDocument();
      expect(screen.getByText('0 picks')).toBeInTheDocument();
    });
  });

  describe('recent picks', () => {
    it('does not render the recent picks section when there are no picks', () => {
      setup({ pickHistory: [] });

      expect(screen.queryByText('Recent Picks')).not.toBeInTheDocument();
    });

    it('renders up to 5 most recent picks in reverse order', () => {
      const picks: PickRecord[] = Array.from({ length: 6 }, (_, i) => ({
        participantId: 'p1',
        entryId: `entry-${i + 1}`,
        round: 1,
        pickNumber: i + 1,
      }));
      const pool: PoolEntry[] = picks.map((_, i) => ({
        entryId: `entry-${i + 1}`,
        draftMode: 'mvp' as const,
        playerId: i,
        playerName: `Player ${i + 1}`,
        season: '2020-21',
      }));

      setup({ pickHistory: picks, pool });

      expect(screen.getByText('Recent Picks')).toBeInTheDocument();

      // Only 5 most recent picks are shown (picks 2–6) and they appear in reverse
      // chronological order (most recent first: Player 6, 5, 4, 3, 2).
      // Player 1 (oldest) should be omitted entirely.
      const recentPicksSection = screen.getByText('Recent Picks').closest('div')!;
      const text = recentPicksSection.textContent ?? '';

      expect(text).not.toContain('Player 1');
      expect(text).toContain('Player 6');

      // Verify reverse order: Player 6 must appear before Player 2 in the rendered output
      expect(text.indexOf('Player 6')).toBeLessThan(text.indexOf('Player 2'));
    });
  });

  describe('turn timer', () => {
    it('renders the TurnTimer when a turnDuration is configured', () => {
      setup({
        config: { draftMode: 'mvp', draftOrder: 'snake', maxRounds: 5, turnDuration: 60 },
      });

      expect(screen.getByTestId('turn-timer')).toBeInTheDocument();
    });

    it('does not render the TurnTimer when no turnDuration is configured', () => {
      setup({ config: null });

      expect(screen.queryByTestId('turn-timer')).not.toBeInTheDocument();
    });

    it('calls notifyTimerExpired and shows a toast when the timer expires', async () => {
      const { toast } = await import('react-toastify');
      const { user } = setup({
        config: { draftMode: 'mvp', draftOrder: 'snake', maxRounds: 5, turnDuration: 30 },
      });

      await user.click(screen.getByTestId('turn-timer'));

      expect(mockNotifyTimerExpired).toHaveBeenCalledOnce();
      expect(toast.info).toHaveBeenCalledWith("Time's up!");
    });
  });
});
