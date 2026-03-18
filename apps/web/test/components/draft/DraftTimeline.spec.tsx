import { render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { DraftTimeline } from '@/components/draft/DraftTimeline';

// jsdom does not implement scrollIntoView
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});
import type { Participant, PickRecord, PoolEntry } from '@dribblio/types';

// Stub sub-cards to isolate DraftTimeline logic
vi.mock('@/components/draft/DraftPickCard', () => ({
  DraftPickCard: ({ label, playerName, participant }: { label: string; playerName: string; participant?: { name: string } }) => (
    <div data-testid="draft-pick-card">
      <span>{label}</span>
      <span>{playerName}</span>
      <span>{participant?.name}</span>
    </div>
  ),
}));

vi.mock('@/components/draft/OnTheClockCard', () => ({
  OnTheClockCard: ({ participant }: { participant: { name: string }; isMyTurn: boolean }) => (
    <div data-testid="on-the-clock-card">{participant.name}</div>
  ),
}));

vi.mock('@/components/draft/UpcomingPickCard', () => ({
  UpcomingPickCard: ({ participantName, index, participantsCount }: { participantName: string; index: number; participantsCount: number }) => (
    <div data-testid="upcoming-pick-card" data-index={index} data-participants-count={participantsCount}>
      {participantName}
    </div>
  ),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const p1: Participant = { participantId: 'p1', name: 'Jordan', isOrganizer: true };
const p2: Participant = { participantId: 'p2', name: 'Bird', isOrganizer: false };

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

const pick1: PickRecord = { participantId: 'p1', entryId: 'entry-1', round: 1, pickNumber: 1 };

afterEach(() => {
  vi.clearAllMocks();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('DraftTimeline', () => {
  it('renders DraftPickCard for indices before currentTurnIndex', () => {
    render(
      <DraftTimeline
        turnOrder={['p1', 'p2']}
        currentTurnIndex={1}
        pickHistory={[pick1]}
        participants={[p1, p2]}
        pool={[mvpEntry]}
        isMyTurn={false}
      />,
    );

    expect(screen.getAllByTestId('draft-pick-card')).toHaveLength(1);
  });

  it('renders OnTheClockCard for the currentTurnIndex slot', () => {
    render(
      <DraftTimeline
        turnOrder={['p1', 'p2']}
        currentTurnIndex={0}
        pickHistory={[]}
        participants={[p1, p2]}
        pool={[mvpEntry]}
        isMyTurn={false}
      />,
    );

    expect(screen.getByTestId('on-the-clock-card')).toBeInTheDocument();
  });

  it('renders UpcomingPickCard for indices after currentTurnIndex', () => {
    render(
      <DraftTimeline
        turnOrder={['p1', 'p2', 'p1']}
        currentTurnIndex={0}
        pickHistory={[]}
        participants={[p1, p2]}
        pool={[]}
        isMyTurn={false}
      />,
    );

    expect(screen.getAllByTestId('upcoming-pick-card')).toHaveLength(2);
  });

  it('renders the correct participant name inside OnTheClockCard', () => {
    render(
      <DraftTimeline
        turnOrder={['p2']}
        currentTurnIndex={0}
        pickHistory={[]}
        participants={[p1, p2]}
        pool={[]}
        isMyTurn={false}
      />,
    );

    expect(screen.getByTestId('on-the-clock-card')).toHaveTextContent('Bird');
  });

  it('renders the player name inside DraftPickCard', () => {
    render(
      <DraftTimeline
        turnOrder={['p1', 'p2']}
        currentTurnIndex={1}
        pickHistory={[pick1]}
        participants={[p1, p2]}
        pool={[mvpEntry]}
        isMyTurn={false}
      />,
    );

    expect(screen.getByTestId('draft-pick-card')).toHaveTextContent('LeBron James');
  });

  it('does not render OnTheClockCard when participant is not found for currentTurnIndex', () => {
    render(
      <DraftTimeline
        turnOrder={['unknown-id']}
        currentTurnIndex={0}
        pickHistory={[]}
        participants={[p1]}
        pool={[]}
        isMyTurn={false}
      />,
    );

    expect(screen.queryByTestId('on-the-clock-card')).not.toBeInTheDocument();
  });
});
