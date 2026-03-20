import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OnTheClockCard } from '@/components/draft/OnTheClockCard';
import type { Participant } from '@dribblio/types';

// Stub TurnTimer to keep tests unit-level
vi.mock('@/components/draft/TurnTimer', () => ({
  TurnTimer: ({ durationSeconds }: { durationSeconds: number; onExpire: () => void }) => (
    <div data-testid="turn-timer">{durationSeconds}s</div>
  ),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const participant: Participant = { participantId: 'p1', name: 'Jordan', isOrganizer: false };

afterEach(() => {
  vi.clearAllMocks();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('OnTheClockCard', () => {
  it("shows the participant's name when it is not the current user's turn", () => {
    render(
      <OnTheClockCard participant={participant} isMyTurn={false} />,
    );

    expect(screen.getByText('Jordan')).toBeInTheDocument();
  });

  it('shows "You!" when it is the current user\'s turn', () => {
    render(
      <OnTheClockCard participant={participant} isMyTurn={true} />,
    );

    expect(screen.getByText('You!')).toBeInTheDocument();
  });

  it('does not render TurnTimer when no timerDurationSeconds is provided', () => {
    render(
      <OnTheClockCard participant={participant} isMyTurn={false} />,
    );

    expect(screen.queryByTestId('turn-timer')).not.toBeInTheDocument();
  });

  it('renders TurnTimer when timerDurationSeconds and onTimerExpire are provided', () => {
    render(
      <OnTheClockCard
        participant={participant}
        isMyTurn={false}
        timerDurationSeconds={60}
        onTimerExpire={vi.fn()}
      />,
    );

    expect(screen.getByTestId('turn-timer')).toBeInTheDocument();
    expect(screen.getByTestId('turn-timer')).toHaveTextContent('60s');
  });
});
