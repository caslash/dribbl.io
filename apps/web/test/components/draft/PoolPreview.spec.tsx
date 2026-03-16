import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PoolPreview } from '../../../src/components/draft/PoolPreview';
import type { PoolEntry } from '../../../src/components/draft/types';

vi.mock('@/components', async () => {
  const { ComponentsMock } = await import('../../mocks/components/ComponentsMock');
  return { ...ComponentsMock };
});

// ─── Per-test mock state ───────────────────────────────────────────────────────

interface MockDraftState {
  pool: PoolEntry[];
  isOrganizer: boolean;
  myParticipantId: string;
}

let mockState: MockDraftState = { pool: [], isOrganizer: false, myParticipantId: 'p1' };
const mockStartDraft = vi.fn();

vi.mock('@/hooks/useDraft', () => ({
  useDraft: () => ({
    state: mockState,
    isMyTurn: false,
    currentTurnParticipant: null,
    saveConfig: vi.fn(),
    createRoom: vi.fn(),
    joinRoom: vi.fn(),
    startDraft: mockStartDraft,
    submitPick: vi.fn(),
    notifyTimerExpired: vi.fn(),
    leave: vi.fn(),
  }),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mvpEntry: PoolEntry = {
  entryId: 'entry-1',
  draftMode: 'mvp',
  playerId: 23,
  playerName: 'LeBron James',
  season: '2012-13',
};

const franchiseEntry: PoolEntry = {
  entryId: 'entry-2',
  draftMode: 'franchise',
  playerId: 6,
  playerName: 'Bill Russell',
  franchiseName: 'Boston Celtics',
  franchiseAbbr: 'BOS',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setup({
  pool = [] as PoolEntry[],
  isOrganizer = false,
} = {}) {
  mockState = { pool, isOrganizer, myParticipantId: 'p1' };
  const user = userEvent.setup();
  render(<PoolPreview />);
  return { user };
}

afterEach(() => {
  vi.clearAllMocks();
  mockState = { pool: [], isOrganizer: false, myParticipantId: 'p1' };
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('PoolPreview', () => {
  describe('pool heading', () => {
    it('renders the Draft Pool heading', () => {
      setup({ pool: [] });

      expect(screen.getByRole('heading', { name: 'Draft Pool' })).toBeInTheDocument();
    });

    it('shows the entry count', () => {
      setup({ pool: [mvpEntry, franchiseEntry] });

      expect(screen.getByText('2 entries')).toBeInTheDocument();
    });

    it('shows "0 entries" for an empty pool', () => {
      setup({ pool: [] });

      expect(screen.getByText('0 entries')).toBeInTheDocument();
    });
  });

  describe('pool entries', () => {
    it('renders each pool entry player name', () => {
      setup({ pool: [mvpEntry, franchiseEntry] });

      expect(screen.getByText('LeBron James')).toBeInTheDocument();
      expect(screen.getByText('Bill Russell')).toBeInTheDocument();
    });

    it('shows "No entries match your filter." when filter finds nothing', async () => {
      const { user } = setup({ pool: [mvpEntry] });

      await user.type(screen.getByPlaceholderText('Filter by player name…'), 'zzznomatch');

      expect(screen.getByText('No entries match your filter.')).toBeInTheDocument();
    });

    it('filters entries by player name (case-insensitive)', async () => {
      const { user } = setup({ pool: [mvpEntry, franchiseEntry] });

      await user.type(screen.getByPlaceholderText('Filter by player name…'), 'lebron');

      expect(screen.getByText('LeBron James')).toBeInTheDocument();
      expect(screen.queryByText('Bill Russell')).not.toBeInTheDocument();
    });
  });

  describe('organizer controls', () => {
    it('shows the Start Draft button for the organizer', () => {
      setup({ pool: [mvpEntry], isOrganizer: true });

      expect(screen.getByRole('button', { name: 'Start Draft' })).toBeInTheDocument();
    });

    it('calls startDraft when the organizer clicks Start Draft', async () => {
      const { user } = setup({ pool: [mvpEntry], isOrganizer: true });

      await user.click(screen.getByRole('button', { name: 'Start Draft' }));

      expect(mockStartDraft).toHaveBeenCalledOnce();
    });

    it('does not show the Start Draft button for non-organizer', () => {
      setup({ pool: [mvpEntry], isOrganizer: false });

      expect(screen.queryByRole('button', { name: 'Start Draft' })).not.toBeInTheDocument();
    });

    it('shows the waiting message for non-organizer', () => {
      setup({ pool: [mvpEntry], isOrganizer: false });

      expect(screen.getByText('Waiting for organizer to start…')).toBeInTheDocument();
    });
  });
});
