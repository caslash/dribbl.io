import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DraftConfigPanel } from '../../../src/components/draft/DraftConfigPanel';
import type { DraftRoomConfig } from '../../../src/components/draft/types';

vi.mock('@/components', async () => {
  const { ComponentsMock } = await import('../../mocks/components/ComponentsMock');
  return { ...ComponentsMock };
});

vi.mock('@/hooks/useDraft', async () => {
  const { HooksMock } = await import('../../mocks/hooks/HooksMock');
  return { ...HooksMock };
});

afterEach(() => {
  vi.clearAllMocks();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setup() {
  const user = userEvent.setup();
  render(<DraftConfigPanel />);
  return { user };
}

function getMaxRoundsInput() {
  return screen.getByLabelText('Max Rounds');
}

function getTimerToggle() {
  return screen.getByRole('checkbox', { name: 'Turn Timer' });
}

function getSubmitButton() {
  return screen.getByRole('button', { name: 'Save Config' });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('DraftConfigPanel', () => {
  describe('initial render', () => {
    it('renders the draft mode section with MVP and Franchise cards', () => {
      setup();

      expect(screen.getByText('MVP Mode')).toBeInTheDocument();
      expect(screen.getByText('Franchise Mode')).toBeInTheDocument();
    });

    it('renders the draft order section with Snake and Linear toggles', () => {
      setup();

      expect(screen.getByRole('button', { name: 'Snake' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Linear' })).toBeInTheDocument();
    });

    it('renders the max rounds input', () => {
      setup();

      expect(getMaxRoundsInput()).toBeInTheDocument();
    });

    it('renders the turn timer toggle', () => {
      setup();

      expect(getTimerToggle()).toBeInTheDocument();
    });

    it('renders the submit button', () => {
      setup();

      expect(getSubmitButton()).toBeInTheDocument();
    });
  });

  describe('default values', () => {
    it('pre-selects MVP mode', () => {
      setup();

      const mvpCard = screen.getByText('MVP Mode').closest('[class*="border-red-600"]');
      expect(mvpCard).toBeInTheDocument();
    });

    it('pre-selects Snake order', () => {
      setup();

      const snakeButton = screen.getByRole('button', { name: 'Snake' });
      expect(snakeButton.className).toMatch(/bg-red-600/);
    });

    it('pre-populates max rounds with 5', () => {
      setup();

      expect(getMaxRoundsInput()).toHaveValue(5);
    });

    it('leaves the timer toggle unchecked by default', () => {
      setup();

      expect(getTimerToggle()).not.toBeChecked();
    });

    it('hides the turn duration input when the timer is off', () => {
      setup();

      expect(screen.queryByLabelText('Seconds per turn (15–120)')).not.toBeInTheDocument();
    });

    it('shows the snake order description by default', () => {
      setup();

      expect(screen.getByText('Round order reverses each round (1→N, N→1, …)')).toBeInTheDocument();
    });
  });

  describe('draft mode selection', () => {
    it('activates Franchise mode when the Franchise card is clicked', async () => {
      const { user } = setup();

      await user.click(screen.getByText('Franchise Mode'));

      const franchiseCard = screen.getByText('Franchise Mode').closest('[class*="border-red-600"]');
      expect(franchiseCard).toBeInTheDocument();
    });

    it('deactivates MVP mode when Franchise is selected', async () => {
      const { user } = setup();

      await user.click(screen.getByText('Franchise Mode'));

      const mvpCard = screen.getByText('MVP Mode').closest('div');
      expect(mvpCard?.className).not.toMatch(/border-red-600 bg-red-600/);
    });

    it('re-activates MVP mode when MVP card is clicked after selecting Franchise', async () => {
      const { user } = setup();

      await user.click(screen.getByText('Franchise Mode'));
      await user.click(screen.getByText('MVP Mode'));

      const mvpCard = screen.getByText('MVP Mode').closest('[class*="border-red-600"]');
      expect(mvpCard).toBeInTheDocument();
    });
  });

  describe('draft order selection', () => {
    it('activates Linear order when the Linear button is clicked', async () => {
      const { user } = setup();

      await user.click(screen.getByRole('button', { name: 'Linear' }));

      const linearButton = screen.getByRole('button', { name: 'Linear' });
      expect(linearButton.className).toMatch(/bg-red-600/);
    });

    it('deactivates Snake when Linear is selected', async () => {
      const { user } = setup();

      await user.click(screen.getByRole('button', { name: 'Linear' }));

      const snakeButton = screen.getByRole('button', { name: 'Snake' });
      expect(snakeButton.className).not.toMatch(/bg-red-600/);
    });

    it('updates the description text when Linear is selected', async () => {
      const { user } = setup();

      await user.click(screen.getByRole('button', { name: 'Linear' }));

      expect(screen.getByText('Same pick order every round (1→N, 1→N, …)')).toBeInTheDocument();
    });

    it('restores Snake order and description when Snake is clicked after Linear', async () => {
      const { user } = setup();

      await user.click(screen.getByRole('button', { name: 'Linear' }));
      await user.click(screen.getByRole('button', { name: 'Snake' }));

      expect(screen.getByRole('button', { name: 'Snake' }).className).toMatch(/bg-red-600/);
      expect(screen.getByText('Round order reverses each round (1→N, N→1, …)')).toBeInTheDocument();
    });
  });

  describe('turn timer toggle', () => {
    it('reveals the turn duration input when the timer is enabled', async () => {
      const { user } = setup();

      await user.click(getTimerToggle());

      expect(screen.getByLabelText('Seconds per turn (15–120)')).toBeInTheDocument();
    });

    it('hides the turn duration input again when the timer is disabled', async () => {
      const { user } = setup();

      await user.click(getTimerToggle());
      await user.click(getTimerToggle());

      expect(screen.queryByLabelText('Seconds per turn (15–120)')).not.toBeInTheDocument();
    });

    it('pre-populates turn duration with 60 when the timer is first enabled', async () => {
      const { user } = setup();

      await user.click(getTimerToggle());

      expect(screen.getByLabelText('Seconds per turn (15–120)')).toHaveValue(60);
    });
  });

  describe('form submission', () => {
    it('calls saveConfig with default values when submitted without changes', async () => {
      const { mockSaveConfig } = await import('../../mocks/hooks/useMockDraft');
      const { user } = setup();

      await user.click(getSubmitButton());

      const expected: DraftRoomConfig = {
        draftMode: 'mvp',
        draftOrder: 'snake',
        maxRounds: 5,
      };
      expect(mockSaveConfig).toHaveBeenCalledOnce();
      expect(mockSaveConfig).toHaveBeenCalledWith(expected);
    });

    it('calls saveConfig with franchise mode when Franchise card is selected', async () => {
      const { mockSaveConfig } = await import('../../mocks/hooks/useMockDraft');
      const { user } = setup();

      await user.click(screen.getByText('Franchise Mode'));
      await user.click(getSubmitButton());

      expect(mockSaveConfig).toHaveBeenCalledWith(
        expect.objectContaining({ draftMode: 'franchise' }),
      );
    });

    it('calls saveConfig with linear order when Linear is selected', async () => {
      const { mockSaveConfig } = await import('../../mocks/hooks/useMockDraft');
      const { user } = setup();

      await user.click(screen.getByRole('button', { name: 'Linear' }));
      await user.click(getSubmitButton());

      expect(mockSaveConfig).toHaveBeenCalledWith(
        expect.objectContaining({ draftOrder: 'linear' }),
      );
    });

    it('calls saveConfig with the updated max rounds value', async () => {
      const { mockSaveConfig } = await import('../../mocks/hooks/useMockDraft');
      const { user } = setup();

      await user.clear(getMaxRoundsInput());
      await user.type(getMaxRoundsInput(), '8');
      await user.click(getSubmitButton());

      expect(mockSaveConfig).toHaveBeenCalledWith(expect.objectContaining({ maxRounds: 8 }));
    });

    it('omits turnDuration from the config when the timer is disabled', async () => {
      const { mockSaveConfig } = await import('../../mocks/hooks/useMockDraft');
      const { user } = setup();

      await user.click(getSubmitButton());

      const config: DraftRoomConfig = mockSaveConfig.mock.calls[0][0];
      expect(config.turnDuration).toBeUndefined();
    });

    it('includes turnDuration in the config when the timer is enabled', async () => {
      const { mockSaveConfig } = await import('../../mocks/hooks/useMockDraft');
      const { user } = setup();

      await user.click(getTimerToggle());
      await user.click(getSubmitButton());

      expect(mockSaveConfig).toHaveBeenCalledWith(expect.objectContaining({ turnDuration: 60 }));
    });

    it('calls saveConfig with a custom turnDuration when the timer is enabled and changed', async () => {
      const { mockSaveConfig } = await import('../../mocks/hooks/useMockDraft');
      const { user } = setup();

      await user.click(getTimerToggle());
      await user.clear(screen.getByLabelText('Seconds per turn (15–120)'));
      await user.type(screen.getByLabelText('Seconds per turn (15–120)'), '90');
      await user.click(getSubmitButton());

      expect(mockSaveConfig).toHaveBeenCalledWith(expect.objectContaining({ turnDuration: 90 }));
    });
  });

  describe('validation: maxRounds', () => {
    beforeEach(() => {
      setup();
    });

    it('shows an error and does not call saveConfig when maxRounds is 0', async () => {
      const { mockSaveConfig } = await import('../../mocks/hooks/useMockDraft');
      const user = userEvent.setup();

      await user.clear(getMaxRoundsInput());
      await user.type(getMaxRoundsInput(), '0');
      await user.click(getSubmitButton());

      expect(await screen.findByText(/must be greater than or equal to 1/i)).toBeInTheDocument();
      expect(mockSaveConfig).not.toHaveBeenCalled();
    });

    it('shows an error and does not call saveConfig when maxRounds is 11', async () => {
      const { mockSaveConfig } = await import('../../mocks/hooks/useMockDraft');
      const user = userEvent.setup();

      await user.clear(getMaxRoundsInput());
      await user.type(getMaxRoundsInput(), '11');
      await user.click(getSubmitButton());

      expect(await screen.findByText(/must be less than or equal to 10/i)).toBeInTheDocument();
      expect(mockSaveConfig).not.toHaveBeenCalled();
    });

    it('accepts the boundary value of 1 without showing an error', async () => {
      const { mockSaveConfig } = await import('../../mocks/hooks/useMockDraft');
      const user = userEvent.setup();

      await user.clear(getMaxRoundsInput());
      await user.type(getMaxRoundsInput(), '1');
      await user.click(getSubmitButton());

      expect(screen.queryByText(/must be/i)).not.toBeInTheDocument();
      expect(mockSaveConfig).toHaveBeenCalledOnce();
    });

    it('accepts the boundary value of 10 without showing an error', async () => {
      const { mockSaveConfig } = await import('../../mocks/hooks/useMockDraft');
      const user = userEvent.setup();

      await user.clear(getMaxRoundsInput());
      await user.type(getMaxRoundsInput(), '10');
      await user.click(getSubmitButton());

      expect(screen.queryByText(/must be/i)).not.toBeInTheDocument();
      expect(mockSaveConfig).toHaveBeenCalledOnce();
    });
  });

  describe('validation: turnDuration', () => {
    beforeEach(() => {
      setup();
    });

    it('shows an error and does not call saveConfig when turnDuration is below 15', async () => {
      const { mockSaveConfig } = await import('../../mocks/hooks/useMockDraft');
      const user = userEvent.setup();

      await user.click(getTimerToggle());
      await user.clear(screen.getByLabelText('Seconds per turn (15–120)'));
      await user.type(screen.getByLabelText('Seconds per turn (15–120)'), '5');
      await user.click(getSubmitButton());

      expect(await screen.findByText(/must be greater than or equal to 15/i)).toBeInTheDocument();
      expect(mockSaveConfig).not.toHaveBeenCalled();
    });

    it('shows an error and does not call saveConfig when turnDuration is above 120', async () => {
      const { mockSaveConfig } = await import('../../mocks/hooks/useMockDraft');
      const user = userEvent.setup();

      await user.click(getTimerToggle());
      await user.clear(screen.getByLabelText('Seconds per turn (15–120)'));
      await user.type(screen.getByLabelText('Seconds per turn (15–120)'), '200');
      await user.click(getSubmitButton());

      expect(await screen.findByText(/must be less than or equal to 120/i)).toBeInTheDocument();
      expect(mockSaveConfig).not.toHaveBeenCalled();
    });

    it('accepts the boundary value of 15 without error', async () => {
      const { mockSaveConfig } = await import('../../mocks/hooks/useMockDraft');
      const user = userEvent.setup();

      await user.click(getTimerToggle());
      await user.clear(screen.getByLabelText('Seconds per turn (15–120)'));
      await user.type(screen.getByLabelText('Seconds per turn (15–120)'), '15');
      await user.click(getSubmitButton());

      expect(mockSaveConfig).toHaveBeenCalledOnce();
      expect(mockSaveConfig).toHaveBeenCalledWith(expect.objectContaining({ turnDuration: 15 }));
    });

    it('accepts the boundary value of 120 without error', async () => {
      const { mockSaveConfig } = await import('../../mocks/hooks/useMockDraft');
      const user = userEvent.setup();

      await user.click(getTimerToggle());
      await user.clear(screen.getByLabelText('Seconds per turn (15–120)'));
      await user.type(screen.getByLabelText('Seconds per turn (15–120)'), '120');
      await user.click(getSubmitButton());

      expect(mockSaveConfig).toHaveBeenCalledOnce();
      expect(mockSaveConfig).toHaveBeenCalledWith(expect.objectContaining({ turnDuration: 120 }));
    });

    it('does not validate turnDuration and calls saveConfig when the timer is disabled', async () => {
      const { mockSaveConfig } = await import('../../mocks/hooks/useMockDraft');
      const user = userEvent.setup();

      await user.click(getSubmitButton());

      expect(mockSaveConfig).toHaveBeenCalledOnce();
    });
  });
});
