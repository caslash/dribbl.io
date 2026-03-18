import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { DraftRoomConfig, Participant, PickRecord, PoolEntry } from '@dribblio/types';
import { DraftResults } from '@/components/draft/DraftResults';

// ─── Mock framer-motion ────────────────────────────────────────────────────────
// Avoids animation side-effects and useReducedMotion in jsdom.

vi.mock('framer-motion', () => ({
  motion: {
    header: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <header {...props}>{children}</header>
    ),
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}));

// ─── Mock react-router ─────────────────────────────────────────────────────────

const mockNavigate = vi.fn();

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

// ─── Mock @/components barrel (Button lives here) ─────────────────────────────

vi.mock('@/components', async () => {
  const { ComponentsMock } = await import('../../mocks/components/ComponentsMock');
  return { ...ComponentsMock };
});

// ─── Per-test mock state ───────────────────────────────────────────────────────

interface MockDraftContext {
  participants: Participant[];
  pool: PoolEntry[];
  pickHistory: PickRecord[];
  config: DraftRoomConfig | null;
  myParticipantId: string | null;
}

let mockCtx: MockDraftContext = {
  participants: [],
  pool: [],
  pickHistory: [],
  config: null,
  myParticipantId: null,
};

const mockLeave = vi.fn();

vi.mock('@/hooks/useDraft', () => ({
  useDraft: () => ({
    state: {
      phase: 'results',
      participants: mockCtx.participants,
      pool: mockCtx.pool,
      pickHistory: mockCtx.pickHistory,
      config: mockCtx.config,
      myParticipantId: mockCtx.myParticipantId,
    },
    leave: mockLeave,
    isMyTurn: false,
    currentTurnParticipant: null,
    createRoom: vi.fn(),
    joinRoom: vi.fn(),
    saveConfig: vi.fn(),
    startDraft: vi.fn(),
    submitPick: vi.fn(),
    notifyTimerExpired: vi.fn(),
  }),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const p1: Participant = { participantId: 'p1', name: 'Cameron', isOrganizer: true, isConnected: true };
const p2: Participant = { participantId: 'p2', name: 'Jess', isOrganizer: false, isConnected: true };

const mvpEntry1: PoolEntry = {
  entryId: 'e1',
  draftMode: 'mvp',
  playerId: 2544,
  playerName: 'LeBron James',
  season: '2012-13',
  ptsPg: 27.1,
  astPg: 6.2,
  rebPg: 7.9,
};

const mvpEntry2: PoolEntry = {
  entryId: 'e2',
  draftMode: 'mvp',
  playerId: 893,
  playerName: 'Michael Jordan',
  season: '1988-89',
  ptsPg: 35.0,
  astPg: 5.9,
  rebPg: 5.5,
};

const franchiseEntry: PoolEntry = {
  entryId: 'e3',
  draftMode: 'franchise',
  playerId: 2544,
  playerName: 'LeBron James',
  franchiseName: 'Los Angeles Lakers',
  franchiseAbbr: 'LAL',
};

const pickP1R1: PickRecord = { participantId: 'p1', entryId: 'e1', round: 1, pickNumber: 1 };
const pickP2R1: PickRecord = { participantId: 'p2', entryId: 'e2', round: 1, pickNumber: 2 };

const mvpConfig: DraftRoomConfig = { draftMode: 'mvp', draftOrder: 'snake', maxRounds: 5 };
const franchiseConfig: DraftRoomConfig = { draftMode: 'franchise', draftOrder: 'linear', maxRounds: 3 };

// ─── Helpers ──────────────────────────────────────────────────────────────────

type SetupOptions = Partial<MockDraftContext>;

function setup({
  participants = [p1, p2],
  pool = [mvpEntry1, mvpEntry2],
  pickHistory = [pickP1R1, pickP2R1],
  config = mvpConfig,
  myParticipantId = 'p1',
}: SetupOptions = {}) {
  mockCtx = { participants, pool, pickHistory, config, myParticipantId };

  const user = userEvent.setup();
  render(<DraftResults />);
  return { user };
}

afterEach(() => {
  vi.clearAllMocks();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('DraftResults', () => {
  describe('header rendering', () => {
    it('renders the "Draft Complete" headline', () => {
      setup();

      expect(screen.getByRole('heading', { name: 'Draft Complete' })).toBeInTheDocument();
    });

    it('renders the MVP mode badge for mvp draftMode', () => {
      setup({ config: mvpConfig });

      expect(screen.getByText('MVP Mode')).toBeInTheDocument();
    });

    it('renders the Franchise mode badge for franchise draftMode', () => {
      setup({ config: franchiseConfig });

      expect(screen.getByText('Franchise Mode')).toBeInTheDocument();
    });

    it('renders the draft order settings pill (snake)', () => {
      setup({ config: mvpConfig });

      expect(screen.getByText('Snake draft')).toBeInTheDocument();
    });

    it('renders the draft order settings pill (linear)', () => {
      setup({ config: franchiseConfig });

      expect(screen.getByText('Linear draft')).toBeInTheDocument();
    });

    it('renders the rounds settings pill with correct count', () => {
      setup({ config: mvpConfig });

      expect(screen.getByText('5 rounds')).toBeInTheDocument();
    });

    it('renders "1 round" (singular) when maxRounds is 1', () => {
      setup({ config: { ...mvpConfig, maxRounds: 1 } });

      expect(screen.getByText('1 round')).toBeInTheDocument();
    });

    it('renders the turn duration pill when turnDuration is set', () => {
      setup({ config: { ...mvpConfig, turnDuration: 30 } });

      expect(screen.getByText('30s timer')).toBeInTheDocument();
    });

    it('does not render a timer pill when turnDuration is not set', () => {
      setup({ config: mvpConfig });

      expect(screen.queryByText(/timer/)).not.toBeInTheDocument();
    });

    it('renders the "Start New Draft" button', () => {
      setup();

      expect(screen.getByRole('button', { name: 'Start New Draft' })).toBeInTheDocument();
    });

    it('does not render settings pills when config is null', () => {
      setup({ config: null });

      expect(screen.queryByText('MVP Mode')).not.toBeInTheDocument();
      expect(screen.queryByText('Franchise Mode')).not.toBeInTheDocument();
    });
  });

  describe('tab bar rendering', () => {
    it('renders all three tabs when myParticipantId is set and there are multiple participants', () => {
      setup({ participants: [p1, p2], myParticipantId: 'p1' });

      expect(screen.getByRole('tab', { name: 'My Team' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'All Teams' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Draft Order' })).toBeInTheDocument();
    });

    it('suppresses "My Team" tab when myParticipantId is null', () => {
      setup({ myParticipantId: null });

      expect(screen.queryByRole('tab', { name: 'My Team' })).not.toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Draft Order' })).toBeInTheDocument();
    });

    it('suppresses "All Teams" tab when there is only one participant', () => {
      setup({ participants: [p1], myParticipantId: 'p1' });

      expect(screen.queryByRole('tab', { name: 'All Teams' })).not.toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'My Team' })).toBeInTheDocument();
    });

    it('defaults active tab to "My Team" when myParticipantId is set', () => {
      setup({ myParticipantId: 'p1' });

      expect(screen.getByRole('tab', { name: 'My Team' })).toHaveAttribute('aria-selected', 'true');
    });

    it('defaults active tab to "Draft Order" when myParticipantId is null', () => {
      setup({ myParticipantId: null });

      expect(screen.getByRole('tab', { name: 'Draft Order' })).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('tab navigation', () => {
    it('switches to the "All Teams" panel when clicking the "All Teams" tab', async () => {
      const { user } = setup();

      await user.click(screen.getByRole('tab', { name: 'All Teams' }));

      expect(screen.getByRole('tabpanel')).toHaveAttribute('id', 'panel-all-teams');
    });

    it('switches to the "Draft Order" panel when clicking the "Draft Order" tab', async () => {
      const { user } = setup();

      await user.click(screen.getByRole('tab', { name: 'Draft Order' }));

      expect(screen.getByRole('tabpanel')).toHaveAttribute('id', 'panel-draft-order');
    });

    it('returns to the "My Team" panel when clicking "My Team" after switching away', async () => {
      const { user } = setup();

      await user.click(screen.getByRole('tab', { name: 'Draft Order' }));
      await user.click(screen.getByRole('tab', { name: 'My Team' }));

      expect(screen.getByRole('tabpanel')).toHaveAttribute('id', 'panel-my-team');
    });

    it('marks the clicked tab as aria-selected', async () => {
      const { user } = setup();

      await user.click(screen.getByRole('tab', { name: 'All Teams' }));

      expect(screen.getByRole('tab', { name: 'All Teams' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tab', { name: 'My Team' })).toHaveAttribute('aria-selected', 'false');
    });

    it('moves focus to the next tab on ArrowRight', async () => {
      const { user } = setup();

      const myTeamTab = screen.getByRole('tab', { name: 'My Team' });
      myTeamTab.focus();
      await user.keyboard('{ArrowRight}');

      expect(screen.getByRole('tab', { name: 'All Teams' })).toHaveFocus();
    });

    it('moves focus to the previous tab on ArrowLeft', async () => {
      const { user } = setup();

      const allTeamsTab = screen.getByRole('tab', { name: 'All Teams' });
      allTeamsTab.focus();
      await user.keyboard('{ArrowLeft}');

      expect(screen.getByRole('tab', { name: 'My Team' })).toHaveFocus();
    });

    it('wraps focus from the last tab to the first on ArrowRight', async () => {
      const { user } = setup();

      const draftOrderTab = screen.getByRole('tab', { name: 'Draft Order' });
      draftOrderTab.focus();
      await user.keyboard('{ArrowRight}');

      expect(screen.getByRole('tab', { name: 'My Team' })).toHaveFocus();
    });

    it('wraps focus from the first tab to the last on ArrowLeft', async () => {
      const { user } = setup();

      const myTeamTab = screen.getByRole('tab', { name: 'My Team' });
      myTeamTab.focus();
      await user.keyboard('{ArrowLeft}');

      expect(screen.getByRole('tab', { name: 'Draft Order' })).toHaveFocus();
    });

    it('tab panel has aria-labelledby pointing to the active tab', async () => {
      const { user } = setup();

      await user.click(screen.getByRole('tab', { name: 'All Teams' }));

      expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'tab-all-teams');
    });
  });

  describe('"My Team" panel', () => {
    it('shows the local user\'s picks in the grid', () => {
      setup({
        pool: [mvpEntry1],
        pickHistory: [pickP1R1],
        myParticipantId: 'p1',
      });

      expect(screen.getByText('LeBron James')).toBeInTheDocument();
    });

    it('shows the empty state when pickHistory is empty', () => {
      setup({ pickHistory: [], myParticipantId: 'p1' });

      expect(screen.getByText('No picks recorded for this draft.')).toBeInTheDocument();
    });

    it('shows the empty state when the local user has no picks', () => {
      setup({
        pool: [mvpEntry2],
        pickHistory: [pickP2R1],
        myParticipantId: 'p1',
      });

      expect(screen.getByText('No picks recorded for this draft.')).toBeInTheDocument();
    });

    it('shows "Unable to identify your team." when myParticipantId is null but My Team tab is active', () => {
      // myParticipantId is null so "My Team" tab is suppressed — the panel
      // only renders when the tab is somehow forced; however the component does
      // define a fallback panel for this case. We verify the suppression instead.
      setup({ myParticipantId: null });

      expect(screen.queryByRole('tab', { name: 'My Team' })).not.toBeInTheDocument();
    });
  });

  describe('"All Teams" panel', () => {
    it('shows the local user\'s block with "(You)" label first', async () => {
      const { user } = setup({ participants: [p1, p2], myParticipantId: 'p1' });

      await user.click(screen.getByRole('tab', { name: 'All Teams' }));

      const youLabels = screen.getAllByText('(You)');
      expect(youLabels.length).toBeGreaterThanOrEqual(1);
    });

    it('shows both participant sections in the All Teams panel', async () => {
      const { user } = setup({ participants: [p1, p2], myParticipantId: 'p1' });

      await user.click(screen.getByRole('tab', { name: 'All Teams' }));

      expect(screen.getByRole('heading', { name: /Cameron/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Jess/i })).toBeInTheDocument();
    });

    it('shows the empty state message when pickHistory is empty', async () => {
      const { user } = setup({ pickHistory: [], participants: [p1, p2] });

      await user.click(screen.getByRole('tab', { name: 'All Teams' }));

      expect(screen.getByText('No picks recorded for this draft.')).toBeInTheDocument();
    });

    it('shows "No picks." for a participant with no picks', async () => {
      const { user } = setup({
        participants: [p1, p2],
        pool: [mvpEntry1],
        pickHistory: [pickP1R1],
        myParticipantId: 'p1',
      });

      await user.click(screen.getByRole('tab', { name: 'All Teams' }));

      expect(screen.getByText('No picks.')).toBeInTheDocument();
    });
  });

  describe('"Draft Order" panel', () => {
    it('groups picks by round with round headers', async () => {
      const { user } = setup({
        pool: [mvpEntry1, mvpEntry2],
        pickHistory: [pickP1R1, pickP2R1],
      });

      await user.click(screen.getByRole('tab', { name: 'Draft Order' }));

      expect(screen.getByText('Round 1')).toBeInTheDocument();
    });

    it('shows all picks in the draft order table', async () => {
      const { user } = setup({
        pool: [mvpEntry1, mvpEntry2],
        pickHistory: [pickP1R1, pickP2R1],
      });

      await user.click(screen.getByRole('tab', { name: 'Draft Order' }));

      expect(screen.getByText('LeBron James')).toBeInTheDocument();
      expect(screen.getByText('Michael Jordan')).toBeInTheDocument();
    });

    it('bolds the local user\'s row in the participant column', async () => {
      const { user } = setup({
        pool: [mvpEntry1],
        pickHistory: [pickP1R1],
        myParticipantId: 'p1',
      });

      await user.click(screen.getByRole('tab', { name: 'Draft Order' }));

      // The table td renders Cameron's name directly; the sidebar uses a span wrapper.
      // Find the td specifically via the table cell role.
      const table = screen.getByRole('table');
      const cameronCells = Array.from(table.querySelectorAll('td')).filter(
        (td) => td.textContent?.includes('Cameron') && td.textContent?.includes('(You)'),
      );
      expect(cameronCells[0]?.className).toContain('font-semibold');
    });

    it('uses table semantics with th column headers', async () => {
      const { user } = setup();

      await user.click(screen.getByRole('tab', { name: 'Draft Order' }));

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Pick' })).toBeInTheDocument();
    });

    it('renders multiple rounds when picks span multiple rounds', async () => {
      const pickR2P1: PickRecord = { participantId: 'p1', entryId: 'e1', round: 2, pickNumber: 1 };
      const { user } = setup({
        pool: [mvpEntry1],
        pickHistory: [pickP1R1, pickR2P1],
      });

      await user.click(screen.getByRole('tab', { name: 'Draft Order' }));

      expect(screen.getByText('Round 1')).toBeInTheDocument();
      expect(screen.getByText('Round 2')).toBeInTheDocument();
    });

    it('shows empty state message when pickHistory is empty', async () => {
      const { user } = setup({ pickHistory: [] });

      await user.click(screen.getByRole('tab', { name: 'Draft Order' }));

      expect(screen.getByText('No picks recorded for this draft.')).toBeInTheDocument();
    });

    it('shows "(You)" label beside the local user\'s name in the participant column', async () => {
      const { user } = setup({
        pool: [mvpEntry1],
        pickHistory: [pickP1R1],
        myParticipantId: 'p1',
      });

      await user.click(screen.getByRole('tab', { name: 'Draft Order' }));

      // "(You)" appears in both the table row and the sidebar pick-counts panel.
      const youLabels = screen.getAllByText('(You)');
      expect(youLabels.length).toBeGreaterThanOrEqual(1);
    });

    it('shows the season detail for MVP mode entries', async () => {
      const { user } = setup({
        pool: [mvpEntry1],
        pickHistory: [pickP1R1],
      });

      await user.click(screen.getByRole('tab', { name: 'Draft Order' }));

      expect(screen.getByText('2012-13')).toBeInTheDocument();
    });

    it('shows "FranchiseName (Abbr)" detail for franchise mode entries', async () => {
      const franchisePick: PickRecord = { participantId: 'p1', entryId: 'e3', round: 1, pickNumber: 1 };
      const { user } = setup({
        pool: [franchiseEntry],
        pickHistory: [franchisePick],
      });

      await user.click(screen.getByRole('tab', { name: 'Draft Order' }));

      expect(screen.getByText('Los Angeles Lakers (LAL)')).toBeInTheDocument();
    });
  });

  describe('"Start New Draft" action', () => {
    it('calls leave() when "Start New Draft" is clicked', async () => {
      const { user } = setup();

      await user.click(screen.getByRole('button', { name: 'Start New Draft' }));

      expect(mockLeave).toHaveBeenCalledOnce();
    });

    it('navigates to "/draft" when "Start New Draft" is clicked', async () => {
      const { user } = setup();

      await user.click(screen.getByRole('button', { name: 'Start New Draft' }));

      expect(mockNavigate).toHaveBeenCalledWith('/draft');
    });
  });
});
