import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DailyResultPanel } from '@/components/daily/DailyResultPanel';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  useReducedMotion: () => false,
}));

vi.mock('@/components', async () => {
  const { ComponentsMock } = await import('../../mocks/components/ComponentsMock');
  return { ...ComponentsMock };
});

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const winProps = {
  won: true,
  namedCount: 14,
  rosterSize: 14,
  teamFullName: 'Golden State Warriors',
  seasonId: '2015-16',
  lives: 2,
};

const lossProps = {
  won: false,
  namedCount: 9,
  rosterSize: 14,
  teamFullName: 'Golden State Warriors',
  seasonId: '2015-16',
  lives: 0,
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('DailyResultPanel', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ─── Win state ─────────────────────────────────────────────────────────────

  describe('win state', () => {
    it('renders "You named the full roster!" heading', () => {
      render(<DailyResultPanel {...winProps} />);

      expect(screen.getByText('You named the full roster!')).toBeInTheDocument();
    });

    it('renders the season and team name in the win sub-label', () => {
      render(<DailyResultPanel {...winProps} />);

      expect(screen.getByText('2015-16 Golden State Warriors')).toBeInTheDocument();
    });

    it('does not render "Game Over" in win state', () => {
      render(<DailyResultPanel {...winProps} />);

      expect(screen.queryByText('Game Over')).not.toBeInTheDocument();
    });
  });

  // ─── Loss state ───────────────────────────────────────────────────────────

  describe('loss state', () => {
    it('renders "Game Over" heading', () => {
      render(<DailyResultPanel {...lossProps} />);

      expect(screen.getByText('Game Over')).toBeInTheDocument();
    });

    it('shows the correct named count and total in loss state', () => {
      render(<DailyResultPanel {...lossProps} />);

      expect(screen.getByText('You named 9 of 14 players.')).toBeInTheDocument();
    });

    it('does not render "You named the full roster!" in loss state', () => {
      render(<DailyResultPanel {...lossProps} />);

      expect(screen.queryByText('You named the full roster!')).not.toBeInTheDocument();
    });
  });

  // ─── Share button ─────────────────────────────────────────────────────────

  describe('share button', () => {
    it('renders a "Share Result" button', () => {
      render(<DailyResultPanel {...winProps} />);

      expect(screen.getByRole('button', { name: 'Share Result' })).toBeInTheDocument();
    });

    it('copies win share text to clipboard on click', async () => {
      const user = userEvent.setup();
      render(<DailyResultPanel {...winProps} />);

      await user.click(screen.getByRole('button', { name: 'Share Result' }));

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'Daily Roster Challenge — 2015-16 Golden State Warriors\nNamed all 14 players! 2/3 lives remaining\ndribbl.io/daily',
      );
    });

    it('copies loss share text to clipboard on click', async () => {
      const user = userEvent.setup();
      render(<DailyResultPanel {...lossProps} />);

      await user.click(screen.getByRole('button', { name: 'Share Result' }));

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'Daily Roster Challenge — 2015-16 Golden State Warriors\nNamed 9 of 14 players ❌\ndribbl.io/daily',
      );
    });

    it('calls clipboard.writeText exactly once per click', async () => {
      const user = userEvent.setup();
      render(<DailyResultPanel {...winProps} />);

      await user.click(screen.getByRole('button', { name: 'Share Result' }));

      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    });
  });

  // ─── "Come back tomorrow" notice ─────────────────────────────────────────

  describe('return notice', () => {
    it('shows the "Come back tomorrow" message in both win and loss states', () => {
      const { rerender } = render(<DailyResultPanel {...winProps} />);
      expect(screen.getByText('Come back tomorrow for a new challenge.')).toBeInTheDocument();

      rerender(<DailyResultPanel {...lossProps} />);
      expect(screen.getByText('Come back tomorrow for a new challenge.')).toBeInTheDocument();
    });
  });
});
