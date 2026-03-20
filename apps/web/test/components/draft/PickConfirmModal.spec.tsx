import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PickConfirmModal } from '@/components/draft/PickConfirmModal';
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

describe('PickConfirmModal', () => {
  describe('visibility', () => {
    it('renders when entry is non-null', () => {
      render(
        <PickConfirmModal entry={mvpEntry} onConfirm={vi.fn()} onCancel={vi.fn()} />,
      );

      expect(screen.getByRole('button', { name: 'Confirm Pick' })).toBeInTheDocument();
    });

    it('does not render when entry is null', () => {
      render(
        <PickConfirmModal entry={null} onConfirm={vi.fn()} onCancel={vi.fn()} />,
      );

      expect(screen.queryByRole('button', { name: 'Confirm Pick' })).not.toBeInTheDocument();
    });
  });

  describe('content', () => {
    it('shows the player name', () => {
      render(
        <PickConfirmModal entry={mvpEntry} onConfirm={vi.fn()} onCancel={vi.fn()} />,
      );

      expect(screen.getByText('LeBron James')).toBeInTheDocument();
    });

    it('shows the season as subtitle for MVP mode', () => {
      render(
        <PickConfirmModal entry={mvpEntry} onConfirm={vi.fn()} onCancel={vi.fn()} />,
      );

      expect(screen.getByText('2012-13')).toBeInTheDocument();
    });

    it('shows "FranchiseName (Abbr)" as subtitle for franchise mode', () => {
      render(
        <PickConfirmModal entry={franchiseEntry} onConfirm={vi.fn()} onCancel={vi.fn()} />,
      );

      expect(screen.getByText('Boston Celtics (BOS)')).toBeInTheDocument();
    });

    it('renders the player headshot img', () => {
      render(
        <PickConfirmModal entry={mvpEntry} onConfirm={vi.fn()} onCancel={vi.fn()} />,
      );

      expect(screen.getByRole('img', { name: 'LeBron James' })).toBeInTheDocument();
    });
  });

  describe('stat pills (MVP mode)', () => {
    it('shows PTS, AST, and REB stat pills for MVP entries', () => {
      render(
        <PickConfirmModal entry={mvpEntry} onConfirm={vi.fn()} onCancel={vi.fn()} />,
      );

      expect(screen.getByText('PTS')).toBeInTheDocument();
      expect(screen.getByText('AST')).toBeInTheDocument();
      expect(screen.getByText('REB')).toBeInTheDocument();
    });

    it('displays formatted stat values for MVP entries', () => {
      render(
        <PickConfirmModal entry={mvpEntry} onConfirm={vi.fn()} onCancel={vi.fn()} />,
      );

      expect(screen.getByText('27.1')).toBeInTheDocument();
      expect(screen.getByText('7.3')).toBeInTheDocument();
      expect(screen.getByText('8.0')).toBeInTheDocument();
    });

    it('shows "-" for null stat values in MVP entries', () => {
      render(
        <PickConfirmModal entry={mvpEntryNullStats} onConfirm={vi.fn()} onCancel={vi.fn()} />,
      );

      const dashes = screen.getAllByText('-');
      expect(dashes).toHaveLength(3);
    });

    it('does not show stat pills for franchise mode entries', () => {
      render(
        <PickConfirmModal entry={franchiseEntry} onConfirm={vi.fn()} onCancel={vi.fn()} />,
      );

      expect(screen.queryByText('PTS')).not.toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onConfirm when "Confirm Pick" is clicked', async () => {
      const user = userEvent.setup();
      const onConfirm = vi.fn();

      render(
        <PickConfirmModal entry={mvpEntry} onConfirm={onConfirm} onCancel={vi.fn()} />,
      );

      await user.click(screen.getByRole('button', { name: 'Confirm Pick' }));

      expect(onConfirm).toHaveBeenCalledOnce();
    });

    it('calls onCancel when "Cancel" button is clicked', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();

      render(
        <PickConfirmModal entry={mvpEntry} onConfirm={vi.fn()} onCancel={onCancel} />,
      );

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onCancel).toHaveBeenCalledOnce();
    });
  });
});
