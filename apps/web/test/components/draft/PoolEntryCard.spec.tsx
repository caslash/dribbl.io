import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PoolEntryCard } from '../../../src/components/draft/PoolEntryCard';
import type { PoolEntry } from '../../../src/components/draft/types';

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
};

const franchiseEntry: PoolEntry = {
  entryId: 'entry-2',
  draftMode: 'franchise',
  playerId: 6,
  playerName: 'Bill Russell',
  franchiseName: 'Boston Celtics',
  franchiseAbbr: 'BOS',
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('PoolEntryCard', () => {
  describe('content rendering', () => {
    it('renders the player name', () => {
      render(<PoolEntryCard entry={mvpEntry} available isMyTurn={false} />);

      expect(screen.getByText('LeBron James')).toBeInTheDocument();
    });

    it('renders the season as subtitle for an MVP entry', () => {
      render(<PoolEntryCard entry={mvpEntry} available isMyTurn={false} />);

      expect(screen.getByText('2012-13')).toBeInTheDocument();
    });

    it('renders "FranchiseName (Abbr)" as subtitle for a franchise entry', () => {
      render(<PoolEntryCard entry={franchiseEntry} available isMyTurn={false} />);

      expect(screen.getByText('Boston Celtics (BOS)')).toBeInTheDocument();
    });
  });

  describe('availability', () => {
    it('has the correct aria-label when available', () => {
      render(<PoolEntryCard entry={mvpEntry} available isMyTurn={false} />);

      expect(screen.getByRole('button', { name: 'Pick LeBron James' })).toBeInTheDocument();
    });

    it('has the "(unavailable)" suffix in aria-label when not available', () => {
      render(<PoolEntryCard entry={mvpEntry} available={false} isMyTurn={false} />);

      expect(
        screen.getByRole('button', { name: 'Pick LeBron James (unavailable)' }),
      ).toBeInTheDocument();
    });

    it('is disabled when not available', () => {
      render(<PoolEntryCard entry={mvpEntry} available={false} isMyTurn={false} />);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('is disabled when available but it is not the user\'s turn', () => {
      render(<PoolEntryCard entry={mvpEntry} available isMyTurn={false} />);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('is disabled when it is the user\'s turn but the entry is not available', () => {
      render(<PoolEntryCard entry={mvpEntry} available={false} isMyTurn />);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('is enabled when available and it is the user\'s turn and onPick is provided', () => {
      render(<PoolEntryCard entry={mvpEntry} available isMyTurn onPick={vi.fn()} />);

      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    it('is disabled even when isMyTurn is true but onPick is not provided', () => {
      render(<PoolEntryCard entry={mvpEntry} available isMyTurn />);

      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('interactions', () => {
    it('calls onPick when clicked and the entry is clickable', async () => {
      const user = userEvent.setup();
      const onPick = vi.fn();

      render(<PoolEntryCard entry={mvpEntry} available isMyTurn onPick={onPick} />);

      await user.click(screen.getByRole('button'));

      expect(onPick).toHaveBeenCalledOnce();
    });

    it('does not call onPick when the entry is unavailable', async () => {
      const user = userEvent.setup();
      const onPick = vi.fn();

      render(<PoolEntryCard entry={mvpEntry} available={false} isMyTurn onPick={onPick} />);

      await user.click(screen.getByRole('button'));

      expect(onPick).not.toHaveBeenCalled();
    });

    it('does not call onPick when it is not the user\'s turn', async () => {
      const user = userEvent.setup();
      const onPick = vi.fn();

      render(<PoolEntryCard entry={mvpEntry} available isMyTurn={false} onPick={onPick} />);

      await user.click(screen.getByRole('button'));

      expect(onPick).not.toHaveBeenCalled();
    });
  });

  describe('visual state', () => {
    it('applies line-through style to the player name when unavailable', () => {
      render(<PoolEntryCard entry={mvpEntry} available={false} isMyTurn={false} />);

      const name = screen.getByText('LeBron James');
      expect(name.className).toContain('line-through');
    });

    it('does not apply line-through when available', () => {
      render(<PoolEntryCard entry={mvpEntry} available isMyTurn={false} />);

      const name = screen.getByText('LeBron James');
      expect(name.className).not.toContain('line-through');
    });
  });
});
