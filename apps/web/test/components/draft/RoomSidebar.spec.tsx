import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RoomSidebar } from '@/components/draft/RoomSidebar';
import type { Participant } from '@dribblio/types';

// Stub ParticipantList to isolate RoomSidebar rendering
vi.mock('@/components/draft/ParticipantList', () => ({
  ParticipantList: ({ participants }: { participants: Participant[]; organizerId: string }) => (
    <div data-testid="participant-list">{participants.map((p) => p.name).join(', ')}</div>
  ),
}));

// ─── Per-test mock state ───────────────────────────────────────────────────────

interface MockDraftState {
  roomId: string | null;
  participants: Participant[];
  myParticipantId: string | null;
}

let mockState: MockDraftState = { roomId: null, participants: [], myParticipantId: null };

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

const p1: Participant = { participantId: 'p1', name: 'Jordan', isOrganizer: true };
const p2: Participant = { participantId: 'p2', name: 'Bird', isOrganizer: false };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setup({
  roomId = 'ROOM1',
  participants = [p1, p2],
}: Partial<MockDraftState> = {}) {
  mockState = { roomId, participants, myParticipantId: 'p1' };
  render(<RoomSidebar />);
}

afterEach(() => {
  vi.clearAllMocks();
  mockState = { roomId: null, participants: [], myParticipantId: null };
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('RoomSidebar', () => {
  describe('room code', () => {
    it('renders the room code when roomId is set', () => {
      setup({ roomId: 'ABC12' });

      expect(screen.getByText('ABC12')).toBeInTheDocument();
    });

    it('does not render the room code section when roomId is null', () => {
      setup({ roomId: null });

      expect(screen.queryByText('Room Code')).not.toBeInTheDocument();
    });
  });

  describe('participant list', () => {
    it('renders ParticipantList', () => {
      setup({ participants: [p1, p2] });

      expect(screen.getByTestId('participant-list')).toBeInTheDocument();
    });

    it('passes participants to ParticipantList', () => {
      setup({ participants: [p1, p2] });

      expect(screen.getByTestId('participant-list')).toHaveTextContent('Jordan');
      expect(screen.getByTestId('participant-list')).toHaveTextContent('Bird');
    });
  });
});
