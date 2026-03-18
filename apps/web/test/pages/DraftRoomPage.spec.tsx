import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { DraftPhase } from '@/providers/DraftProvider';
import type { Participant } from '@dribblio/types';

// Stub all phase-specific child components
vi.mock('../../src/components/draft/RoomSidebar', () => ({
  RoomSidebar: () => <div data-testid="room-sidebar" />,
}));

vi.mock('../../src/components/draft/DraftBoard', () => ({
  DraftBoard: () => <div data-testid="draft-board" />,
}));

vi.mock('../../src/components/draft/DraftConfigPanel', () => ({
  DraftConfigPanel: () => <div data-testid="draft-config-panel" />,
}));

vi.mock('../../src/components/draft/DraftResults', () => ({
  DraftResults: () => <div data-testid="draft-results" />,
}));

vi.mock('../../src/components/draft/ParticipantList', () => ({
  ParticipantList: ({ participants }: { participants: Participant[] }) => (
    <div data-testid="participant-list" data-count={participants.length} />
  ),
}));

vi.mock('../../src/components/draft/PoolPreview', () => ({
  PoolPreview: () => <div data-testid="pool-preview" />,
}));

// ─── Per-test mock state ───────────────────────────────────────────────────────

interface MockDraftState {
  phase: DraftPhase;
  isOrganizer: boolean;
  participants: Participant[];
  roomId: string;
  myParticipantId: string;
}

let mockState: MockDraftState = {
  phase: 'lobby',
  isOrganizer: false,
  participants: [],
  roomId: 'ROOM1',
  myParticipantId: 'p1',
};

vi.mock('@/hooks/useDraft', () => ({
  useDraft: () => ({
    state: mockState,
    isMyTurn: false,
    currentTurnParticipant: null,
    saveConfig: vi.fn(),
    createRoom: vi.fn(),
    joinRoom: vi.fn(),
    startDraft: vi.fn(),
    submitPick: vi.fn(),
    notifyTimerExpired: vi.fn(),
    leave: vi.fn(),
  }),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const organizer: Participant = { participantId: 'p1', name: 'Jordan', isOrganizer: true };
const nonOrganizer: Participant = { participantId: 'p2', name: 'Bird', isOrganizer: false };

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function setup(
  phase: DraftPhase,
  opts: { isOrganizer?: boolean; participants?: Participant[]; roomId?: string } = {},
) {
  const { isOrganizer = false, participants = [organizer], roomId = 'ROOM1' } = opts;

  mockState = {
    phase,
    isOrganizer,
    participants,
    roomId,
    myParticipantId: isOrganizer ? 'p1' : 'p2',
  };

  const { DraftRoomPage } = await import('../../src/pages/DraftRoomPage');

  render(
    <MemoryRouter>
      <DraftRoomPage />
    </MemoryRouter>,
  );
}

afterEach(() => {
  vi.clearAllMocks();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('DraftRoomPage', () => {
  describe('drafting phase', () => {
    it('renders DraftBoard in the drafting phase', async () => {
      await setup('drafting');

      expect(screen.getByTestId('draft-board')).toBeInTheDocument();
    });

    it('renders RoomSidebar in the drafting phase', async () => {
      await setup('drafting');

      expect(screen.getByTestId('room-sidebar')).toBeInTheDocument();
    });
  });

  describe('pool-preview phase', () => {
    it('renders PoolPreview in the pool-preview phase', async () => {
      await setup('pool-preview');

      expect(screen.getByTestId('pool-preview')).toBeInTheDocument();
    });

    it('does not render DraftBoard in the pool-preview phase', async () => {
      await setup('pool-preview');

      expect(screen.queryByTestId('draft-board')).not.toBeInTheDocument();
    });
  });

  describe('results phase', () => {
    it('renders DraftResults in the results phase', async () => {
      await setup('results');

      expect(screen.getByTestId('draft-results')).toBeInTheDocument();
    });

    it('does not render DraftBoard in the results phase', async () => {
      await setup('results');

      expect(screen.queryByTestId('draft-board')).not.toBeInTheDocument();
    });
  });

  describe('lobby phase', () => {
    it('renders RoomSidebar in the lobby phase', async () => {
      await setup('lobby', { participants: [organizer, nonOrganizer] });

      expect(screen.getByTestId('room-sidebar')).toBeInTheDocument();
    });

    it('renders DraftConfigPanel for the organizer in the lobby phase', async () => {
      await setup('lobby', { isOrganizer: true });

      expect(screen.getByTestId('draft-config-panel')).toBeInTheDocument();
    });

    it('shows a waiting message for non-organizer in the lobby phase', async () => {
      await setup('lobby', { isOrganizer: false });

      expect(
        screen.getByText('Waiting for the organizer to configure the draft…'),
      ).toBeInTheDocument();
    });

    it('does not render DraftConfigPanel for non-organizer in the lobby phase', async () => {
      await setup('lobby', { isOrganizer: false });

      expect(screen.queryByTestId('draft-config-panel')).not.toBeInTheDocument();
    });

    it('renders RoomSidebar (which shows the room code)', async () => {
      await setup('lobby', { roomId: 'ABC99' });

      expect(screen.getByTestId('room-sidebar')).toBeInTheDocument();
    });
  });

  describe('configuring phase', () => {
    it('renders the same lobby layout in the configuring phase (organizer sees config panel)', async () => {
      await setup('configuring', { isOrganizer: true });

      expect(screen.getByTestId('draft-config-panel')).toBeInTheDocument();
      expect(screen.getByTestId('room-sidebar')).toBeInTheDocument();
    });

    it('renders the same lobby layout in the configuring phase (non-organizer sees waiting message)', async () => {
      await setup('configuring', { isOrganizer: false });

      expect(screen.queryByTestId('draft-config-panel')).not.toBeInTheDocument();
      expect(
        screen.getByText('Waiting for the organizer to configure the draft…'),
      ).toBeInTheDocument();
    });
  });
});
