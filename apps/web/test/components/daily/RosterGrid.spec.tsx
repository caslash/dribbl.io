import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RosterGrid } from '@/components/daily/RosterGrid';
import type { NamedPlayer } from '@/providers/DailyRosterProvider';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span {...props}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const makePlayer = (id: number, name: string): NamedPlayer => ({
  playerId: id,
  fullName: name,
  position: 'PG',
  jerseyNumber: String(id),
});

const defaultProps = {
  namedPlayers: [],
  rosterSize: 5,
  complete: false,
  seasonId: '2015-16',
  teamFullName: 'Golden State Warriors',
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('RosterGrid', () => {
  // ─── Unrevealed slots ──────────────────────────────────────────────────────

  describe('unrevealed slots', () => {
    it('renders rosterSize unrevealed slots when no players are named', () => {
      render(<RosterGrid {...defaultProps} />);

      const unknownSlots = screen.getAllByRole('listitem', { name: 'Unknown player' });
      expect(unknownSlots).toHaveLength(5);
    });

    it('reduces unrevealed count as players are named', () => {
      const namedPlayers = [makePlayer(1, 'Player One'), makePlayer(2, 'Player Two')];

      render(<RosterGrid {...defaultProps} namedPlayers={namedPlayers} />);

      const unknownSlots = screen.getAllByRole('listitem', { name: 'Unknown player' });
      expect(unknownSlots).toHaveLength(3);
    });

    it('shows no unrevealed slots when all players are named', () => {
      const namedPlayers = [1, 2, 3, 4, 5].map((id) => makePlayer(id, `Player ${id}`));

      render(<RosterGrid {...defaultProps} namedPlayers={namedPlayers} />);

      expect(screen.queryAllByRole('listitem', { name: 'Unknown player' })).toHaveLength(0);
    });

    it('each unrevealed slot has aria-label "Unknown player"', () => {
      render(<RosterGrid {...defaultProps} rosterSize={3} />);

      const slots = screen.getAllByLabelText('Unknown player');
      expect(slots).toHaveLength(3);
    });

    it('hides unrevealed slots when complete is true', () => {
      render(
        <RosterGrid
          {...defaultProps}
          complete
          namedPlayers={[makePlayer(1, 'Named Player')]}
        />,
      );

      expect(screen.queryAllByRole('listitem', { name: 'Unknown player' })).toHaveLength(0);
    });
  });

  // ─── Named player cards ────────────────────────────────────────────────────

  describe('named player cards', () => {
    it('renders a card for each named player', () => {
      const namedPlayers = [makePlayer(1, 'Steph Curry'), makePlayer(2, 'Klay Thompson')];

      render(<RosterGrid {...defaultProps} namedPlayers={namedPlayers} />);

      expect(screen.getByText('Steph Curry')).toBeInTheDocument();
      expect(screen.getByText('Klay Thompson')).toBeInTheDocument();
    });
  });

  // ─── Missed players (game-over reveal) ────────────────────────────────────

  describe('missed players', () => {
    it('renders missed player cards in complete state', () => {
      const missed = [makePlayer(99, 'Draymond Green'), makePlayer(88, 'Andre Iguodala')];

      render(
        <RosterGrid
          {...defaultProps}
          complete
          namedPlayers={[makePlayer(1, 'Steph Curry')]}
          missedPlayers={missed}
        />,
      );

      expect(screen.getByText('Draymond Green')).toBeInTheDocument();
      expect(screen.getByText('Andre Iguodala')).toBeInTheDocument();
    });

    it('does not render missed players when game is not complete', () => {
      const missed = [makePlayer(99, 'Hidden Player')];

      render(
        <RosterGrid
          {...defaultProps}
          complete={false}
          missedPlayers={missed}
        />,
      );

      expect(screen.queryByText('Hidden Player')).not.toBeInTheDocument();
    });

    it('renders 0 missed players by default when missedPlayers prop is omitted', () => {
      render(<RosterGrid {...defaultProps} complete namedPlayers={[makePlayer(1, 'Only Player')]} />);

      // Only the named player card should be a listitem; no extra missed cards.
      const listitems = screen.getAllByRole('listitem');
      expect(listitems).toHaveLength(1);
    });
  });

  // ─── Grid container ────────────────────────────────────────────────────────

  describe('grid container', () => {
    it('has aria-label describing the season and team', () => {
      render(<RosterGrid {...defaultProps} />);

      const grid = screen.getByRole('list', { name: '2015-16 Golden State Warriors roster' });
      expect(grid).toBeInTheDocument();
    });

    it('uses the correct seasonId and teamFullName in aria-label', () => {
      render(
        <RosterGrid
          {...defaultProps}
          seasonId="1995-96"
          teamFullName="Chicago Bulls"
        />,
      );

      expect(
        screen.getByRole('list', { name: '1995-96 Chicago Bulls roster' }),
      ).toBeInTheDocument();
    });
  });

  // ─── rosterSize fallback ───────────────────────────────────────────────────

  describe('rosterSize fallback', () => {
    it('renders 14 placeholder slots when rosterSize is 0', () => {
      render(<RosterGrid {...defaultProps} rosterSize={0} complete={false} />);

      const unknownSlots = screen.getAllByRole('listitem', { name: 'Unknown player' });
      expect(unknownSlots).toHaveLength(14);
    });
  });
});
