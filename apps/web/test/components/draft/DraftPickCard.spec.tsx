import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DraftPickCard } from '@/components/draft/DraftPickCard';
import type { Participant, PickRecord } from '@dribblio/types';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const pick: PickRecord = { participantId: 'p1', entryId: 'entry-1', round: 1, pickNumber: 1 };
const participant: Participant = { participantId: 'p1', name: 'Jordan', isOrganizer: true };

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('DraftPickCard', () => {
  it('displays the pick label', () => {
    render(
      <DraftPickCard
        pick={pick}
        playerId={23}
        playerName="LeBron James"
        participant={participant}
        label="R1 P1"
      />,
    );

    expect(screen.getByText('R1 P1')).toBeInTheDocument();
  });

  it('displays the player name', () => {
    render(
      <DraftPickCard
        pick={pick}
        playerId={23}
        playerName="LeBron James"
        participant={participant}
        label="R1 P1"
      />,
    );

    expect(screen.getByText('LeBron James')).toBeInTheDocument();
  });

  it('displays the participant name as "Picked by" text', () => {
    render(
      <DraftPickCard
        pick={pick}
        playerId={23}
        playerName="LeBron James"
        participant={participant}
        label="R1 P1"
      />,
    );

    expect(screen.getByText('Jordan')).toBeInTheDocument();
  });

  it('shows "?" when participant is undefined', () => {
    render(
      <DraftPickCard
        pick={pick}
        playerId={23}
        playerName="LeBron James"
        participant={undefined}
        label="R1 P1"
      />,
    );

    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('renders a player headshot img with the correct alt text', () => {
    render(
      <DraftPickCard
        pick={pick}
        playerId={23}
        playerName="LeBron James"
        participant={participant}
        label="R1 P1"
      />,
    );

    const img = screen.getByRole('img', { name: 'LeBron James' });
    expect(img).toBeInTheDocument();
  });

  it('constructs the headshot src from the playerId', () => {
    render(
      <DraftPickCard
        pick={pick}
        playerId={2544}
        playerName="LeBron James"
        participant={participant}
        label="R1 P1"
      />,
    );

    const img = screen.getByRole('img', { name: 'LeBron James' });
    expect(img).toHaveAttribute('src', expect.stringContaining('2544'));
  });
});
