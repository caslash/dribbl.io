import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RoomEntrance } from '../../../src/components/draft/RoomEntrance';

vi.mock('@/components', async () => {
  const { ComponentsMock } = await import('../../mocks/components/ComponentsMock');
  return { ...ComponentsMock };
});

vi.mock('@/hooks/useDraft', async () => {
  const { useMockDraft } = await import('../../mocks/hooks/useMockDraft');
  return { useDraft: useMockDraft };
});

vi.mock('react-router', () => ({
  useNavigate: vi.fn(() => vi.fn()),
}));

vi.mock('react-toastify', () => ({
  toast: {
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setup() {
  const user = userEvent.setup();
  render(<RoomEntrance />);
  return { user };
}

function getCreateNameInput() {
  return screen.getByLabelText('Your name', { selector: '#create-name' });
}

function getJoinNameInput() {
  return screen.getByLabelText('Your name', { selector: '#join-name' });
}

function getJoinCodeInput() {
  return screen.getByLabelText('Room code');
}

function getCreateButton() {
  return screen.getByRole('button', { name: /create room/i });
}

function getJoinButton() {
  return screen.getByRole('button', { name: /join room/i });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('RoomEntrance', () => {
  describe('renders', () => {
    it('renders the page heading', () => {
      setup();

      expect(screen.getByRole('heading', { name: 'NBA All-Time Draft' })).toBeInTheDocument();
    });

    it('renders the Create a Room section', () => {
      setup();

      expect(screen.getByRole('heading', { name: 'Create a Room' })).toBeInTheDocument();
    });

    it('renders the Join a Room section', () => {
      setup();

      expect(screen.getByRole('heading', { name: 'Join a Room' })).toBeInTheDocument();
    });

    it('renders the create name input', () => {
      setup();

      expect(getCreateNameInput()).toBeInTheDocument();
    });

    it('renders the join name input', () => {
      setup();

      expect(getJoinNameInput()).toBeInTheDocument();
    });

    it('renders the room code input', () => {
      setup();

      expect(getJoinCodeInput()).toBeInTheDocument();
    });

    it('renders the Create Room button', () => {
      setup();

      expect(getCreateButton()).toBeInTheDocument();
    });

    it('renders the Join Room button', () => {
      setup();

      expect(getJoinButton()).toBeInTheDocument();
    });
  });

  describe('Create Room flow', () => {
    it('calls createRoom with the trimmed name when submitted with a valid name', async () => {
      const { mockCreateRoom } = await import('../../mocks/hooks/useMockDraft');
      mockCreateRoom.mockResolvedValue(undefined);
      const { user } = setup();

      await user.type(getCreateNameInput(), '  Jordan  ');
      await user.click(getCreateButton());

      await waitFor(() => {
        expect(mockCreateRoom).toHaveBeenCalledWith('Jordan');
      });
    });

    it('shows a toast error and does not call createRoom when name is empty', async () => {
      const { toast } = await import('react-toastify');
      const { mockCreateRoom } = await import('../../mocks/hooks/useMockDraft');
      const { user } = setup();

      await user.click(getCreateButton());

      expect(toast.error).toHaveBeenCalledWith('Please enter your name.');
      expect(mockCreateRoom).not.toHaveBeenCalled();
    });

    it('shows a toast error and does not call createRoom when name is whitespace only', async () => {
      const { toast } = await import('react-toastify');
      const { mockCreateRoom } = await import('../../mocks/hooks/useMockDraft');
      const { user } = setup();

      await user.type(getCreateNameInput(), '   ');
      await user.click(getCreateButton());

      expect(toast.error).toHaveBeenCalledWith('Please enter your name.');
      expect(mockCreateRoom).not.toHaveBeenCalled();
    });

    it('disables the Create Room button and shows "Creating…" while loading', async () => {
      const { mockCreateRoom } = await import('../../mocks/hooks/useMockDraft');
      let resolveCreate!: () => void;
      mockCreateRoom.mockReturnValue(
        new Promise<void>((res) => {
          resolveCreate = res;
        }),
      );
      const { user } = setup();

      await user.type(getCreateNameInput(), 'Jordan');
      await user.click(screen.getByRole('button', { name: /create room/i }));

      // Once loading starts the button text changes to "Creating…" and is disabled
      const creatingButton = screen.getByRole('button', { name: /creating/i });
      expect(creatingButton).toBeDisabled();

      resolveCreate();
    });

    it('shows a toast error when createRoom throws', async () => {
      const { toast } = await import('react-toastify');
      const { mockCreateRoom } = await import('../../mocks/hooks/useMockDraft');
      mockCreateRoom.mockRejectedValue(new Error('network error'));
      const { user } = setup();

      await user.type(getCreateNameInput(), 'Jordan');
      await user.click(getCreateButton());

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Could not create room. Is the server running?',
        );
      });
    });
  });

  describe('Join Room flow', () => {
    it('calls joinRoom with the uppercased code and trimmed name', async () => {
      const { mockJoinRoom } = await import('../../mocks/hooks/useMockDraft');
      const { useNavigate } = await import('react-router');
      const mockNavigate = vi.fn();
      vi.mocked(useNavigate).mockReturnValue(mockNavigate);
      const { user } = setup();

      await user.type(getJoinNameInput(), '  Bird  ');
      await user.type(getJoinCodeInput(), 'abc12');
      await user.click(getJoinButton());

      expect(mockJoinRoom).toHaveBeenCalledWith('ABC12', 'Bird');
    });

    it('navigates to /draft/:roomId on successful join', async () => {
      const { useNavigate } = await import('react-router');
      const mockNavigate = vi.fn();
      vi.mocked(useNavigate).mockReturnValue(mockNavigate);
      const { user } = setup();

      await user.type(getJoinNameInput(), 'Bird');
      await user.type(getJoinCodeInput(), 'XYZ12');
      await user.click(getJoinButton());

      expect(mockNavigate).toHaveBeenCalledWith('/draft/XYZ12');
    });

    it('shows a toast error when name is empty on join', async () => {
      const { toast } = await import('react-toastify');
      const { mockJoinRoom } = await import('../../mocks/hooks/useMockDraft');
      const { user } = setup();

      await user.type(getJoinCodeInput(), 'XYZ12');
      await user.click(getJoinButton());

      expect(toast.error).toHaveBeenCalledWith('Please enter your name.');
      expect(mockJoinRoom).not.toHaveBeenCalled();
    });

    it('shows a toast error when room code is empty', async () => {
      const { toast } = await import('react-toastify');
      const { mockJoinRoom } = await import('../../mocks/hooks/useMockDraft');
      const { user } = setup();

      await user.type(getJoinNameInput(), 'Bird');
      await user.click(getJoinButton());

      expect(toast.error).toHaveBeenCalledWith('Please enter a room code.');
      expect(mockJoinRoom).not.toHaveBeenCalled();
    });

    it('converts the room code to uppercase as the user types', async () => {
      const { user } = setup();

      await user.type(getJoinCodeInput(), 'abc12');

      expect(getJoinCodeInput()).toHaveValue('ABC12');
    });
  });
});
