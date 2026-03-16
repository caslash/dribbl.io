import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ParticipantList } from '../../../src/components/draft/ParticipantList';
import type { Participant } from '../../../src/components/draft/types';

// Lucide icons render SVGs — mock to avoid environment issues
vi.mock('lucide-react', () => ({
  Crown: (props: Record<string, unknown>) => <svg aria-label="Organizer" {...props} />,
  User: (props: Record<string, unknown>) => <svg {...props} />,
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const organizer: Participant = { participantId: 'p1', name: 'Jordan', isOrganizer: true };
const nonOrganizer: Participant = { participantId: 'p2', name: 'Bird', isOrganizer: false };
const nonOrganizer2: Participant = { participantId: 'p3', name: 'Magic', isOrganizer: false };

// ─── Per-test mock state ───────────────────────────────────────────────────────

let mockMyParticipantId = '';

vi.mock('@/hooks/useDraft', () => ({
  useDraft: () => ({
    state: { myParticipantId: mockMyParticipantId },
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

afterEach(() => {
  vi.clearAllMocks();
  mockMyParticipantId = '';
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Renders ParticipantList with a controlled myParticipantId for the current test.
 */
function setup(
  participants: Participant[],
  organizerId: string,
  myParticipantId = '',
) {
  mockMyParticipantId = myParticipantId;
  render(<ParticipantList participants={participants} organizerId={organizerId} />);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ParticipantList', () => {
  describe('participant count', () => {
    it('shows "1 participant" for a single participant', () => {
      setup([organizer], 'p1');

      expect(screen.getByText('1 participant')).toBeInTheDocument();
    });

    it('shows "2 participants" for multiple participants', () => {
      setup([organizer, nonOrganizer], 'p1');

      expect(screen.getByText('2 participants')).toBeInTheDocument();
    });

    it('shows "0 participants" for an empty list', () => {
      setup([], 'p1');

      expect(screen.getByText('0 participants')).toBeInTheDocument();
    });
  });

  describe('participant names', () => {
    it('renders each participant name', () => {
      setup([organizer, nonOrganizer, nonOrganizer2], 'p1');

      expect(screen.getByText('Jordan')).toBeInTheDocument();
      expect(screen.getByText('Bird')).toBeInTheDocument();
      expect(screen.getByText('Magic')).toBeInTheDocument();
    });
  });

  describe('organizer indicator', () => {
    it('shows the crown icon for the organizer', () => {
      setup([organizer, nonOrganizer], 'p1');

      expect(screen.getByLabelText('Organizer')).toBeInTheDocument();
    });

    it('does not show the crown icon for non-organizer participants', () => {
      setup([nonOrganizer], 'p1');

      expect(screen.queryByLabelText('Organizer')).not.toBeInTheDocument();
    });

    it('shows only one crown when there is exactly one organizer', () => {
      setup([organizer, nonOrganizer, nonOrganizer2], 'p1');

      expect(screen.getAllByLabelText('Organizer')).toHaveLength(1);
    });
  });

  describe('current user indicator', () => {
    it('shows "(You)" next to the current user', () => {
      setup([organizer, nonOrganizer], 'p1', 'p1');

      expect(screen.getByText('(You)')).toBeInTheDocument();
    });

    it('does not show "(You)" for other participants', () => {
      setup([organizer, nonOrganizer], 'p1', 'p1');

      const items = screen.getAllByRole('listitem');
      // "(You)" should appear once
      expect(screen.queryAllByText('(You)')).toHaveLength(1);
      // It should be adjacent to Jordan's item, not Bird's
      expect(items[0]).toHaveTextContent('Jordan');
      expect(items[0]).toHaveTextContent('(You)');
      expect(items[1]).not.toHaveTextContent('(You)');
    });

    it('does not show "(You)" when myParticipantId does not match any participant', () => {
      setup([organizer, nonOrganizer], 'p1', 'p999');

      expect(screen.queryByText('(You)')).not.toBeInTheDocument();
    });
  });
});
