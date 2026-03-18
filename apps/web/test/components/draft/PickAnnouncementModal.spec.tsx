import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PickAnnouncementModal } from '@/components/draft/PickAnnouncementModal';
import type { Participant, PickRecord, PoolEntry } from '@dribblio/types';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const pick: PickRecord = { participantId: 'p1', entryId: 'entry-1', round: 1, pickNumber: 1 };

const entry: PoolEntry = {
  entryId: 'entry-1',
  draftMode: 'mvp',
  playerId: 23,
  playerName: 'LeBron James',
  season: '2012-13',
  ptsPg: 27.1,
  astPg: 7.3,
  rebPg: 8.0,
};

const participant: Participant = { participantId: 'p1', name: 'Jordan', isOrganizer: true };

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('PickAnnouncementModal', () => {
  describe('visibility', () => {
    it('renders when pick and entry are non-null', () => {
      render(
        <PickAnnouncementModal
          pick={pick}
          entry={entry}
          participant={participant}
          onDismiss={vi.fn()}
        />,
      );

      expect(screen.getByText('The Pick Is In')).toBeInTheDocument();
    });

    it('does not render when pick is null', () => {
      render(
        <PickAnnouncementModal
          pick={null}
          entry={entry}
          participant={participant}
          onDismiss={vi.fn()}
        />,
      );

      expect(screen.queryByText('The Pick Is In')).not.toBeInTheDocument();
    });

    it('does not render when entry is undefined', () => {
      render(
        <PickAnnouncementModal
          pick={pick}
          entry={undefined}
          participant={participant}
          onDismiss={vi.fn()}
        />,
      );

      expect(screen.queryByText('The Pick Is In')).not.toBeInTheDocument();
    });
  });

  describe('content', () => {
    it('shows the player name', () => {
      render(
        <PickAnnouncementModal
          pick={pick}
          entry={entry}
          participant={participant}
          onDismiss={vi.fn()}
        />,
      );

      expect(screen.getByText('LeBron James')).toBeInTheDocument();
    });

    it('shows "Picked by" with the participant name', () => {
      render(
        <PickAnnouncementModal
          pick={pick}
          entry={entry}
          participant={participant}
          onDismiss={vi.fn()}
        />,
      );

      expect(screen.getByText('Jordan')).toBeInTheDocument();
    });

    it('shows "?" for participant name when participant is undefined', () => {
      render(
        <PickAnnouncementModal
          pick={pick}
          entry={entry}
          participant={undefined}
          onDismiss={vi.fn()}
        />,
      );

      expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('renders the player headshot img', () => {
      render(
        <PickAnnouncementModal
          pick={pick}
          entry={entry}
          participant={participant}
          onDismiss={vi.fn()}
        />,
      );

      expect(screen.getByRole('img', { name: 'LeBron James' })).toBeInTheDocument();
    });
  });

  describe('auto-dismiss timer', () => {
    it('calls onDismiss after 2500ms', () => {
      const onDismiss = vi.fn();

      render(
        <PickAnnouncementModal
          pick={pick}
          entry={entry}
          participant={participant}
          onDismiss={onDismiss}
        />,
      );

      expect(onDismiss).not.toHaveBeenCalled();

      vi.advanceTimersByTime(2500);

      expect(onDismiss).toHaveBeenCalledOnce();
    });

    it('does not call onDismiss before 2500ms elapses', () => {
      const onDismiss = vi.fn();

      render(
        <PickAnnouncementModal
          pick={pick}
          entry={entry}
          participant={participant}
          onDismiss={onDismiss}
        />,
      );

      vi.advanceTimersByTime(2499);

      expect(onDismiss).not.toHaveBeenCalled();
    });

    it('does not call onDismiss when pick is null', () => {
      const onDismiss = vi.fn();

      render(
        <PickAnnouncementModal
          pick={null}
          entry={entry}
          participant={participant}
          onDismiss={onDismiss}
        />,
      );

      vi.advanceTimersByTime(2500);

      expect(onDismiss).not.toHaveBeenCalled();
    });
  });

  describe('click to dismiss', () => {
    it('calls onDismiss when the overlay is clicked', () => {
      const onDismiss = vi.fn();

      const { container } = render(
        <PickAnnouncementModal
          pick={pick}
          entry={entry}
          participant={participant}
          onDismiss={onDismiss}
        />,
      );

      // The outermost div has the onClick handler
      const overlay = container.firstChild as HTMLElement;
      overlay.click();

      expect(onDismiss).toHaveBeenCalled();
    });
  });
});
