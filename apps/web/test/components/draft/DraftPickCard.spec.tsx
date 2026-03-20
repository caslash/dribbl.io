import { DraftPickCard } from '@/components/draft/DraftPickCard';
import type { Participant } from '@dribblio/types';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const participant: Participant = { participantId: 'p1', name: 'Jordan', isOrganizer: true };

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('DraftPickCard', () => {
  it('displays the pick label', () => {
    render(
      <DraftPickCard
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
