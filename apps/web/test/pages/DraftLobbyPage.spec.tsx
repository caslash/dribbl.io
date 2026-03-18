import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

// RoomEntrance has its own tests; stub it here so we only test page-level logic
vi.mock('../../src/components/draft/RoomEntrance', () => ({
  RoomEntrance: () => <div data-testid="room-entrance" />,
}));

// ─── Per-test mock state ───────────────────────────────────────────────────────

let mockRoomId: string | null = null;
const mockNavigate = vi.fn();

vi.mock('@/hooks/useDraft', () => ({
  useDraft: () => ({
    state: { roomId: mockRoomId },
    isMyTurn: false,
    currentTurnParticipant: null,
    saveConfig: vi.fn(),
    createRoom: vi.fn(),
    joinRoom: vi.fn(),
    startDraft: vi.fn(),
    submitPick: vi.fn(),
    notifyTimerExpired: vi.fn(),
    leave: vi.fn(),
  }),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router');
  return { ...actual, useNavigate: vi.fn(() => mockNavigate) };
});

afterEach(() => {
  vi.clearAllMocks();
  mockRoomId = null;
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function setup(roomId: string | null = null) {
  mockRoomId = roomId;
  const { DraftLobbyPage } = await import('../../src/pages/DraftLobbyPage');

  render(
    <MemoryRouter>
      <DraftLobbyPage />
    </MemoryRouter>,
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('DraftLobbyPage', () => {
  it('renders the RoomEntrance component', async () => {
    await setup();

    expect(screen.getByTestId('room-entrance')).toBeInTheDocument();
  });

  it('does not navigate when roomId is null', async () => {
    await setup(null);

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('navigates to /draft/:roomId when roomId is set', async () => {
    await setup('ROOM9');

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/draft/ROOM9');
    });
  });
});
