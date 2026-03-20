import { vi } from 'vitest';

/**
 * Mock implementation of `useDraft`. All action callbacks are `vi.fn()` stubs
 * so tests can assert on calls without triggering real socket or context logic.
 *
 * Import the named stubs directly when you need to assert on specific calls:
 *
 * @example
 * import { mockSaveConfig } from '../mocks/hooks/useMockDraft';
 * expect(mockSaveConfig).toHaveBeenCalledWith({ draftMode: 'mvp', ... });
 */
export const mockSaveConfig = vi.fn();
export const mockCreateRoom = vi.fn();
export const mockJoinRoom = vi.fn();
export const mockStartDraft = vi.fn();
export const mockSubmitPick = vi.fn();
export const mockNotifyTimerExpired = vi.fn();
export const mockLeave = vi.fn();

export function useMockDraft() {
  return {
    saveConfig: mockSaveConfig,
    createRoom: mockCreateRoom,
    joinRoom: mockJoinRoom,
    startDraft: mockStartDraft,
    submitPick: mockSubmitPick,
    notifyTimerExpired: mockNotifyTimerExpired,
    leave: mockLeave,
    state: null,
    isMyTurn: false,
    currentTurnParticipant: null,
  };
}
