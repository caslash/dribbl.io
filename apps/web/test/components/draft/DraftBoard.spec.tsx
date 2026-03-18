import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DraftBoard } from '@/components/draft/DraftBoard';
import type { DraftRoomConfig, Participant, PickRecord, PoolEntry } from '@dribblio/types';

// Stub DraftTimeline — it has its own spec; avoid pulling in its full dependency tree here
vi.mock('@/components/draft/DraftTimeline', () => ({
  DraftTimeline: () => <div data-testid="draft-timeline" />,
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
  currentTurnIndex: number;
  turnOrder: string[];
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
  currentTurnIndex: 0,
  turnOrder: [],
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
      currentTurnIndex: mockCtx.currentTurnIndex,
      turnOrder: mockCtx.turnOrder,
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
  ptsPg: 27.1,
  astPg: 7.3,
  rebPg: 8.0,
};

const mvpEntry2: PoolEntry = {
  entryId: 'entry-2',
  draftMode: 'mvp',
  playerId: 33,
  playerName: "Shaquille O'Neal",
  season: '1999-00',
  ptsPg: 29.7,
  astPg: 2.5,
  rebPg: 13.2,
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
  currentTurnIndex = 0,
  turnOrder = [] as string[],
  config = null as DraftRoomConfig | null,
  myParticipantId = 'p1',
}: SetupOptions = {}) {
  mockCtx = {
    pool,
    participants,
    isMyTurn,
    currentTurnParticipant,
    invalidatedIds,
    pickHistory,
    currentRound,
    currentTurnIndex,
    turnOrder,
    config,
    myParticipantId,
  };

  const user = userEvent.setup();
  render(<DraftBoard />);
  return { user };
}

afterEach(() => {
  vi.clearAllMocks();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('DraftBoard', () => {
  describe('timeline', () => {
    it('renders the DraftTimeline', () => {
      setup();

      expect(screen.getByTestId('draft-timeline')).toBeInTheDocument();
    });
  });

  describe('pool list', () => {
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
    it("opens the PickConfirmModal when it is the user's turn and entry is clicked", async () => {
      const { user } = setup({ isMyTurn: true, invalidatedIds: new Set() });

      await user.click(screen.getByRole('button', { name: /Select LeBron James$/i }));

      expect(screen.getByRole('button', { name: 'Confirm Pick' })).toBeInTheDocument();
    });

    it("calls submitPick with the entryId when the user confirms the pick", async () => {
      const { user } = setup({ isMyTurn: true, invalidatedIds: new Set() });

      await user.click(screen.getByRole('button', { name: /Select LeBron James$/i }));
      await user.click(screen.getByRole('button', { name: 'Confirm Pick' }));

      expect(mockSubmitPick).toHaveBeenCalledWith('entry-1');
    });

    it('closes the PickConfirmModal when the user cancels', async () => {
      const { user } = setup({ isMyTurn: true, invalidatedIds: new Set() });

      await user.click(screen.getByRole('button', { name: /Select LeBron James$/i }));
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(screen.queryByRole('button', { name: 'Confirm Pick' })).not.toBeInTheDocument();
    });

    it("does not open PickConfirmModal when it is not the user's turn (button is disabled)", async () => {
      setup({ isMyTurn: false });

      const entryButton = screen.getByRole('button', { name: /Select LeBron James/i });
      expect(entryButton).toBeDisabled();
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

    it('disables invalidated entries even when it is the user\'s turn', () => {
      setup({
        isMyTurn: true,
        invalidatedIds: new Set(['entry-1']),
      });

      const pickButton = screen.getByRole('button', { name: /LeBron James \(unavailable\)/i });
      expect(pickButton).toBeDisabled();
    });
  });

  describe('announcement modal', () => {
    it('shows the announcement modal when a new pick is added to pickHistory', () => {
      setup({
        pool: [mvpEntry],
        participants: [p1, p2],
        pickHistory: [pick1],
      });

      expect(screen.getByText('The Pick Is In')).toBeInTheDocument();
    });

    it('does not show the announcement modal when pickHistory is empty', () => {
      setup({ pickHistory: [] });

      expect(screen.queryByText('The Pick Is In')).not.toBeInTheDocument();
    });
  });
});
