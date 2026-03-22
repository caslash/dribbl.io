import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RosterPlayerCard } from '@/components/daily/RosterPlayerCard';
import type { NamedPlayer } from '@/providers/DailyRosterProvider';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  useReducedMotion: () => false,
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const basePlayer: NamedPlayer = {
  playerId: 30,
  fullName: 'Stephen Curry',
  position: 'PG',
  jerseyNumber: '30',
};

const playerNullFields: NamedPlayer = {
  playerId: 11,
  fullName: 'Klay Thompson',
  position: null,
  jerseyNumber: null,
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('RosterPlayerCard', () => {
  // ─── Content ───────────────────────────────────────────────────────────────

  describe('player information', () => {
    it("renders the player's full name", () => {
      render(<RosterPlayerCard player={basePlayer} />);

      expect(screen.getByText('Stephen Curry')).toBeInTheDocument();
    });

    it("renders the player's jersey number with a # prefix", () => {
      render(<RosterPlayerCard player={basePlayer} />);

      expect(screen.getByText('#30')).toBeInTheDocument();
    });

    it("renders the player's position", () => {
      render(<RosterPlayerCard player={basePlayer} />);

      expect(screen.getByText('PG')).toBeInTheDocument();
    });

    it('renders "—" for jersey number when jerseyNumber is null', () => {
      render(<RosterPlayerCard player={playerNullFields} />);

      expect(screen.getByText('—')).toBeInTheDocument();
    });

    it('renders "—" for position when position is null', () => {
      render(<RosterPlayerCard player={playerNullFields} />);

      // Both jersey and position fall back to "—" — get all and verify at least one
      const dashes = screen.getAllByText('—');
      expect(dashes.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ─── Styling: normal vs missed ─────────────────────────────────────────────

  describe('border styling', () => {
    it('applies border-l-primary class when missed prop is not set', () => {
      const { container } = render(<RosterPlayerCard player={basePlayer} />);

      const card = container.querySelector('[role="listitem"]');
      expect(card).toHaveClass('border-l-primary');
      expect(card).not.toHaveClass('border-l-accent');
    });

    it('applies border-l-primary class when missed is explicitly false', () => {
      const { container } = render(<RosterPlayerCard player={basePlayer} missed={false} />);

      const card = container.querySelector('[role="listitem"]');
      expect(card).toHaveClass('border-l-primary');
    });

    it('applies border-l-accent class when missed is true', () => {
      const { container } = render(<RosterPlayerCard player={basePlayer} missed />);

      const card = container.querySelector('[role="listitem"]');
      expect(card).toHaveClass('border-l-accent');
      expect(card).not.toHaveClass('border-l-primary');
    });
  });

  // ─── Text styling: normal vs missed ───────────────────────────────────────

  describe('name text styling', () => {
    it('uses text-text-primary for the name when not missed', () => {
      render(<RosterPlayerCard player={basePlayer} />);

      const name = screen.getByText('Stephen Curry');
      expect(name).toHaveClass('text-text-primary');
    });

    it('uses text-text-secondary for the name when missed', () => {
      render(<RosterPlayerCard player={basePlayer} missed />);

      const name = screen.getByText('Stephen Curry');
      expect(name).toHaveClass('text-text-secondary');
    });
  });

  // ─── Accessibility ─────────────────────────────────────────────────────────

  describe('accessibility', () => {
    it('has role="listitem"', () => {
      render(<RosterPlayerCard player={basePlayer} />);

      expect(screen.getByRole('listitem')).toBeInTheDocument();
    });
  });
});
