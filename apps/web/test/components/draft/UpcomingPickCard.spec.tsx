import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UpcomingPickCard } from '@/components/draft/UpcomingPickCard';

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('UpcomingPickCard', () => {
  it("shows the participant's name", () => {
    render(<UpcomingPickCard participantName="Jordan" index={0} participantsCount={4} />);

    expect(screen.getByText('Jordan')).toBeInTheDocument();
  });

  it('shows "?" when participantName is "?"', () => {
    render(<UpcomingPickCard participantName="?" index={0} participantsCount={4} />);

    // The card renders two "?" — one as the unknown-player icon, one as the participant name
    expect(screen.getAllByText('?').length).toBeGreaterThanOrEqual(1);
  });

  it('calculates round 1 for the first pick (index 0, 4 participants)', () => {
    render(<UpcomingPickCard participantName="Jordan" index={0} participantsCount={4} />);

    expect(screen.getByText('R1')).toBeInTheDocument();
  });

  it('calculates round 2 for index 4 with 4 participants', () => {
    render(<UpcomingPickCard participantName="Bird" index={4} participantsCount={4} />);

    expect(screen.getByText('R2')).toBeInTheDocument();
  });

  it('calculates round 3 for index 8 with 4 participants', () => {
    render(<UpcomingPickCard participantName="Magic" index={8} participantsCount={4} />);

    expect(screen.getByText('R3')).toBeInTheDocument();
  });

  it('calculates round 1 for index 1 with 4 participants', () => {
    render(<UpcomingPickCard participantName="Bird" index={1} participantsCount={4} />);

    expect(screen.getByText('R1')).toBeInTheDocument();
  });

  it('calculates round 1 for index 0 with 2 participants', () => {
    render(<UpcomingPickCard participantName="Jordan" index={0} participantsCount={2} />);

    expect(screen.getByText('R1')).toBeInTheDocument();
  });

  it('calculates round 2 for index 2 with 2 participants', () => {
    render(<UpcomingPickCard participantName="Jordan" index={2} participantsCount={2} />);

    expect(screen.getByText('R2')).toBeInTheDocument();
  });
});
