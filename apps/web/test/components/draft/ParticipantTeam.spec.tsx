import { ParticipantTeam } from '@/components/draft/ParticipantTeam';
import type { Participant, PickRecord, PoolEntry } from '@dribblio/types';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.clearAllMocks();
});

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const participant: Participant = { participantId: 'p1', name: 'Jordan', isOrganizer: true };

const mvpEntry: PoolEntry = {
  entryId: 'entry-1',
  draftMode: 'mvp',
  playerId: 23,
  playerName: 'LeBron James',
  season: '2012-13',
  ptsPg: 29.3,
  astPg: 5.6,
  rebPg: 8.5,
};

const franchiseEntry: PoolEntry = {
  entryId: 'entry-2',
  draftMode: 'franchise',
  playerId: 6,
  playerName: 'Bill Russell',
  franchiseName: 'Boston Celtics',
  franchiseAbbr: 'BOS',
};

const pick1: PickRecord = { participantId: 'p1', entryId: 'entry-1', round: 1, pickNumber: 1 };
const pick2: PickRecord = { participantId: 'p1', entryId: 'entry-2', round: 2, pickNumber: 3 };

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ParticipantTeam', () => {
  describe('participant name', () => {
    it('renders the participant name as a heading', () => {
      render(<ParticipantTeam participant={participant} picks={[]} pool={[]} />);

      expect(screen.getByRole('heading', { name: 'Jordan' })).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('shows "No picks yet." when the participant has no picks', () => {
      render(<ParticipantTeam participant={participant} picks={[]} pool={[]} />);

      expect(screen.getByText('No picks yet.')).toBeInTheDocument();
    });
  });

  describe('picks grid', () => {
    it('renders the player name for each pick', () => {
      render(
        <ParticipantTeam
          participant={participant}
          picks={[pick1, pick2]}
          pool={[mvpEntry, franchiseEntry]}
        />,
      );

      expect(screen.getByText('LeBron James')).toBeInTheDocument();
      expect(screen.getByText('Bill Russell')).toBeInTheDocument();
    });

    it('shows the season subtitle for MVP picks', () => {
      render(<ParticipantTeam participant={participant} picks={[pick1]} pool={[mvpEntry]} />);

      expect(screen.getByText('2012-13')).toBeInTheDocument();
    });

    it('shows "FranchiseName (Abbr)" subtitle for franchise picks', () => {
      render(<ParticipantTeam participant={participant} picks={[pick2]} pool={[franchiseEntry]} />);

      expect(screen.getByText('Boston Celtics (BOS)')).toBeInTheDocument();
    });

    it('shows round and pick number', () => {
      render(<ParticipantTeam participant={participant} picks={[pick1]} pool={[mvpEntry]} />);

      expect(screen.getByText('R1 · #1')).toBeInTheDocument();
    });

    it('falls back to entryId for both the player name and subtitle when the entry is not in the pool', () => {
      const orphanPick: PickRecord = {
        participantId: 'p1',
        entryId: 'unknown-entry',
        round: 1,
        pickNumber: 1,
      };

      render(<ParticipantTeam participant={participant} picks={[orphanPick]} pool={[]} />);

      // The entryId appears in both the player name slot and subtitle slot
      const elements = screen.getAllByText('unknown-entry');
      expect(elements).toHaveLength(2);
    });
  });
});
