import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DailyLivesDisplay } from '@/components/daily/DailyLivesDisplay';

vi.mock('framer-motion', () => ({
  motion: {
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span {...props}>{children}</span>
    ),
  },
  useReducedMotion: () => false,
}));

describe('DailyLivesDisplay', () => {
  // ─── Heart rendering ──────────────────────────────────────────────────────

  describe('heart icons', () => {
    it('renders maxLives heart icons by default (3)', () => {
      render(<DailyLivesDisplay lives={3} namedCount={0} rosterSize={14} />);

      // Each heart icon is aria-hidden; count via SVG elements under the lives section.
      // We rely on the container structure: the hearts wrapper has exactly maxLives children.
      const heartsContainer = screen.getByRole('status').querySelector('.flex.items-center.gap-1');
      expect(heartsContainer?.children).toHaveLength(3);
    });

    it('renders the correct number of hearts when maxLives is overridden', () => {
      render(<DailyLivesDisplay lives={4} maxLives={5} namedCount={0} rosterSize={14} />);

      const heartsContainer = screen.getByRole('status').querySelector('.flex.items-center.gap-1');
      expect(heartsContainer?.children).toHaveLength(5);
    });

    it('renders 3 filled hearts when lives is 3', () => {
      const { container } = render(
        <DailyLivesDisplay lives={3} namedCount={0} rosterSize={14} />,
      );

      const filled = container.querySelectorAll('.fill-accent');
      const empty = container.querySelectorAll('.fill-transparent');

      expect(filled).toHaveLength(3);
      expect(empty).toHaveLength(0);
    });

    it('renders 2 filled and 1 empty heart when lives is 2', () => {
      const { container } = render(
        <DailyLivesDisplay lives={2} namedCount={0} rosterSize={14} />,
      );

      const filled = container.querySelectorAll('.fill-accent');
      const empty = container.querySelectorAll('.fill-transparent');

      expect(filled).toHaveLength(2);
      expect(empty).toHaveLength(1);
    });

    it('renders 0 filled and 3 empty hearts when lives is 0', () => {
      const { container } = render(
        <DailyLivesDisplay lives={0} namedCount={0} rosterSize={14} />,
      );

      const filled = container.querySelectorAll('.fill-accent');
      const empty = container.querySelectorAll('.fill-transparent');

      expect(filled).toHaveLength(0);
      expect(empty).toHaveLength(3);
    });
  });

  // ─── Progress label ───────────────────────────────────────────────────────

  describe('progress label', () => {
    it('shows "0 / 14 named" when no players are named', () => {
      render(<DailyLivesDisplay lives={3} namedCount={0} rosterSize={14} />);

      expect(screen.getByText('0 / 14 named')).toBeInTheDocument();
    });

    it('shows the correct named count after players are named', () => {
      render(<DailyLivesDisplay lives={2} namedCount={5} rosterSize={14} />);

      expect(screen.getByText('5 / 14 named')).toBeInTheDocument();
    });

    it('shows the full count when all players are named', () => {
      render(<DailyLivesDisplay lives={3} namedCount={14} rosterSize={14} />);

      expect(screen.getByText('14 / 14 named')).toBeInTheDocument();
    });
  });

  // ─── Accessibility ────────────────────────────────────────────────────────

  describe('accessibility', () => {
    it('has role="status" on the root element', () => {
      render(<DailyLivesDisplay lives={3} namedCount={0} rosterSize={14} />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('has aria-live="polite" on the root element', () => {
      render(<DailyLivesDisplay lives={3} namedCount={0} rosterSize={14} />);

      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });

    it('marks individual heart icons as aria-hidden', () => {
      const { container } = render(
        <DailyLivesDisplay lives={3} namedCount={0} rosterSize={14} />,
      );

      // Each heart wrapper is a <span aria-hidden="true">. SVG icons from
      // lucide-react also carry aria-hidden, so narrow to span elements only.
      const hiddenSpans = container.querySelectorAll('span[aria-hidden="true"]');
      expect(hiddenSpans).toHaveLength(3);
    });
  });
});
