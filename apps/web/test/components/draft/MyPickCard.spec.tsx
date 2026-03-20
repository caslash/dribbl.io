import { render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MyPickCard } from '@/components/draft/MyPickCard';
import type { PickRecord, PoolEntry } from '@dribblio/types';

afterEach(() => {
  vi.clearAllMocks();
});

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const pick: PickRecord = { participantId: 'p1', entryId: 'e1', round: 1, pickNumber: 1 };

const pick2: PickRecord = { participantId: 'p1', entryId: 'e2', round: 3, pickNumber: 5 };

const mvpEntry: PoolEntry = {
  entryId: 'e1',
  draftMode: 'mvp',
  playerId: 2544,
  playerName: 'LeBron James',
  season: '2012-13',
  ptsPg: 27.1,
  astPg: 6.2,
  rebPg: 7.9,
};

const mvpEntryNullStats: PoolEntry = {
  entryId: 'e1',
  draftMode: 'mvp',
  playerId: 2544,
  playerName: 'LeBron James',
  season: '2012-13',
  ptsPg: null,
  astPg: null,
  rebPg: null,
};

const franchiseEntry: PoolEntry = {
  entryId: 'e2',
  draftMode: 'franchise',
  playerId: 2544,
  playerName: 'LeBron James',
  franchiseName: 'Los Angeles Lakers',
  franchiseAbbr: 'LAL',
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MyPickCard', () => {
  describe('player name', () => {
    it('renders the player name from the entry', () => {
      render(<MyPickCard pick={pick} entry={mvpEntry} />);

      expect(screen.getByText('LeBron James')).toBeInTheDocument();
    });

    it('falls back to entryId as player name when entry is undefined', () => {
      render(<MyPickCard pick={pick} entry={undefined} />);

      const els = screen.getAllByText('e1');
      expect(els.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('pick label', () => {
    it('renders the pick label with round and pick number', () => {
      render(<MyPickCard pick={pick} entry={mvpEntry} />);

      expect(screen.getByText('R1 · Pick 1')).toBeInTheDocument();
    });

    it('renders the correct round and pick number for later picks', () => {
      render(<MyPickCard pick={pick2} entry={franchiseEntry} />);

      expect(screen.getByText('R3 · Pick 5')).toBeInTheDocument();
    });
  });

  describe('headshot image', () => {
    it('renders the headshot img with the correct CDN src', () => {
      render(<MyPickCard pick={pick} entry={mvpEntry} />);

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute(
        'src',
        'https://cdn.nba.com/headshots/nba/latest/260x190/2544.png',
      );
    });

    it('renders the headshot img with descriptive alt text', () => {
      render(<MyPickCard pick={pick} entry={mvpEntry} />);

      expect(screen.getByAltText('LeBron James, round 1 pick 1')).toBeInTheDocument();
    });

    it('shows the User fallback icon when entry is undefined', () => {
      render(<MyPickCard pick={pick} entry={undefined} />);

      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('shows the User fallback icon when the headshot image errors', () => {
      render(<MyPickCard pick={pick} entry={mvpEntry} />);

      const img = screen.getByRole('img');
      fireEvent.error(img);

      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });

  describe('compact prop', () => {
    it('renders headshot with width 130 by default', () => {
      render(<MyPickCard pick={pick} entry={mvpEntry} />);

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('width', '130');
    });

    it('renders headshot with width 90 when compact is true', () => {
      render(<MyPickCard pick={pick} entry={mvpEntry} compact />);

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('width', '90');
    });
  });

  describe('subtitle', () => {
    it('shows the season as subtitle for MVP mode entries', () => {
      render(<MyPickCard pick={pick} entry={mvpEntry} />);

      expect(screen.getByText('2012-13')).toBeInTheDocument();
    });

    it('shows "FranchiseName (Abbr)" as subtitle for franchise mode entries', () => {
      render(<MyPickCard pick={pick} entry={franchiseEntry} />);

      expect(screen.getByText('Los Angeles Lakers (LAL)')).toBeInTheDocument();
    });

    it('falls back to entryId as subtitle when entry is undefined', () => {
      render(<MyPickCard pick={pick} entry={undefined} />);

      // entryId appears as both name and subtitle when entry is missing
      const els = screen.getAllByText('e1');
      expect(els.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('stat pills', () => {
    it('renders PTS, AST, and REB stat pills for MVP mode entries', () => {
      render(<MyPickCard pick={pick} entry={mvpEntry} />);

      expect(screen.getByText('PTS')).toBeInTheDocument();
      expect(screen.getByText('AST')).toBeInTheDocument();
      expect(screen.getByText('REB')).toBeInTheDocument();
    });

    it('renders formatted stat values for MVP mode entries', () => {
      render(<MyPickCard pick={pick} entry={mvpEntry} />);

      expect(screen.getByText('27.1')).toBeInTheDocument();
      expect(screen.getByText('6.2')).toBeInTheDocument();
      expect(screen.getByText('7.9')).toBeInTheDocument();
    });

    it('renders "-" for null stat values in MVP mode', () => {
      render(<MyPickCard pick={pick} entry={mvpEntryNullStats} />);

      const dashes = screen.getAllByText('-');
      expect(dashes).toHaveLength(3);
    });

    it('does not render stat pills for franchise mode entries', () => {
      render(<MyPickCard pick={pick} entry={franchiseEntry} />);

      expect(screen.queryByText('PTS')).not.toBeInTheDocument();
      expect(screen.queryByText('AST')).not.toBeInTheDocument();
      expect(screen.queryByText('REB')).not.toBeInTheDocument();
    });

    it('does not render stat pills when entry is undefined', () => {
      render(<MyPickCard pick={pick} entry={undefined} />);

      expect(screen.queryByText('PTS')).not.toBeInTheDocument();
    });
  });
});
