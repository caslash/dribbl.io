import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PoolEntryRow } from '@/components/draft/PoolEntryRow';
import type { PoolEntry } from '@dribblio/types';

afterEach(() => {
  vi.clearAllMocks();
});

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mvpEntry: PoolEntry = {
  entryId: 'entry-1',
  draftMode: 'mvp',
  playerId: 23,
  playerName: 'LeBron James',
  season: '2012-13',
  ptsPg: 27.1,
  astPg: 7.3,
  rebPg: 8.0,
};

const mvpEntryNullStats: PoolEntry = {
  entryId: 'entry-2',
  draftMode: 'mvp',
  playerId: 33,
  playerName: "Shaquille O'Neal",
  season: '1999-00',
  ptsPg: null,
  astPg: null,
  rebPg: null,
};

const franchiseEntry: PoolEntry = {
  entryId: 'entry-3',
  draftMode: 'franchise',
  playerId: 6,
  playerName: 'Bill Russell',
  franchiseName: 'Boston Celtics',
  franchiseAbbr: 'BOS',
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('PoolEntryRow', () => {
  describe('content rendering', () => {
    it('renders the player name', () => {
      render(<PoolEntryRow entry={mvpEntry} available />);

      expect(screen.getByText('LeBron James')).toBeInTheDocument();
    });

    it('renders the season as subtitle for MVP mode', () => {
      render(<PoolEntryRow entry={mvpEntry} available />);

      expect(screen.getByText('2012-13')).toBeInTheDocument();
    });

    it('renders "FranchiseName (Abbr)" as subtitle for franchise mode', () => {
      render(<PoolEntryRow entry={franchiseEntry} available />);

      expect(screen.getByText('Boston Celtics (BOS)')).toBeInTheDocument();
    });
  });

  describe('stat pills (MVP mode)', () => {
    it('shows PTS, AST, and REB stat pills for MVP mode entries', () => {
      render(<PoolEntryRow entry={mvpEntry} available />);

      expect(screen.getByText('PTS')).toBeInTheDocument();
      expect(screen.getByText('AST')).toBeInTheDocument();
      expect(screen.getByText('REB')).toBeInTheDocument();
    });

    it('displays formatted stat values for MVP entries', () => {
      render(<PoolEntryRow entry={mvpEntry} available />);

      expect(screen.getByText('27.1')).toBeInTheDocument();
      expect(screen.getByText('7.3')).toBeInTheDocument();
      expect(screen.getByText('8.0')).toBeInTheDocument();
    });

    it('shows "-" for null stat values', () => {
      render(<PoolEntryRow entry={mvpEntryNullStats} available />);

      const dashes = screen.getAllByText('-');
      expect(dashes).toHaveLength(3);
    });

    it('does not show stat pills for franchise mode entries', () => {
      render(<PoolEntryRow entry={franchiseEntry} available />);

      expect(screen.queryByText('PTS')).not.toBeInTheDocument();
      expect(screen.queryByText('AST')).not.toBeInTheDocument();
      expect(screen.queryByText('REB')).not.toBeInTheDocument();
    });
  });

  describe('availability', () => {
    it('has correct aria-label when available', () => {
      render(<PoolEntryRow entry={mvpEntry} available />);

      expect(
        screen.getByRole('button', { name: 'Select LeBron James' }),
      ).toBeInTheDocument();
    });

    it('has "(unavailable)" suffix in aria-label when not available', () => {
      render(<PoolEntryRow entry={mvpEntry} available={false} />);

      expect(
        screen.getByRole('button', { name: 'Select LeBron James (unavailable)' }),
      ).toBeInTheDocument();
    });

    it('is disabled when not available', () => {
      render(<PoolEntryRow entry={mvpEntry} available={false} />);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('is disabled when available but isMyTurn is false', () => {
      render(<PoolEntryRow entry={mvpEntry} available isMyTurn={false} onSelect={vi.fn()} />);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('is disabled when available and isMyTurn but no onSelect provided', () => {
      render(<PoolEntryRow entry={mvpEntry} available isMyTurn />);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('is enabled when available, isMyTurn, and onSelect is provided', () => {
      render(<PoolEntryRow entry={mvpEntry} available isMyTurn onSelect={vi.fn()} />);

      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    it('applies strikethrough style to player name when unavailable', () => {
      render(<PoolEntryRow entry={mvpEntry} available={false} />);

      const name = screen.getByText('LeBron James');
      expect(name.className).toContain('line-through');
    });

    it('does not apply strikethrough when available', () => {
      render(<PoolEntryRow entry={mvpEntry} available />);

      const name = screen.getByText('LeBron James');
      expect(name.className).not.toContain('line-through');
    });
  });

  describe('interactions', () => {
    it('calls onSelect when clicked and the entry is available and isMyTurn', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(<PoolEntryRow entry={mvpEntry} available isMyTurn onSelect={onSelect} />);

      await user.click(screen.getByRole('button'));

      expect(onSelect).toHaveBeenCalledOnce();
    });

    it('does not call onSelect when the entry is unavailable', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(<PoolEntryRow entry={mvpEntry} available={false} isMyTurn onSelect={onSelect} />);

      await user.click(screen.getByRole('button'));

      expect(onSelect).not.toHaveBeenCalled();
    });

    it('does not call onSelect when it is not the user\'s turn', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(<PoolEntryRow entry={mvpEntry} available isMyTurn={false} onSelect={onSelect} />);

      await user.click(screen.getByRole('button'));

      expect(onSelect).not.toHaveBeenCalled();
    });
  });
});
