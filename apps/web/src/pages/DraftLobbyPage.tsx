import { PageMeta } from '@/components/PageMeta';
import { RoomEntrance } from '@/components/draft/RoomEntrance';
import { useDraft } from '@/hooks/useDraft';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

/**
 * Entry point for the NBA All-Time Draft.
 *
 * Renders the `RoomEntrance` form so users can create or join a room.
 * Once a room is created, the `DraftProvider` sets `state.roomId` and this
 * page automatically navigates to `/draft/:roomId`.
 *
 * @example
 * // Rendered at /draft via App.tsx
 * <DraftLobbyPage />
 */
export const DraftLobbyPage = () => {
  const { state } = useDraft();
  const navigate = useNavigate();

  // Navigate to the room once createRoom resolves and roomId is set
  useEffect(() => {
    if (state.roomId) {
      navigate(`/draft/${state.roomId}`);
    }
  }, [state.roomId, navigate]);

  return (
    <>
      <PageMeta
        title="NBA All-Time Draft — dribbl.io"
        description="Build your all-time NBA dream team. Create or join a multiplayer draft room and pick wisely."
        canonicalPath="/draft"
      />
      <RoomEntrance />
    </>
  );
};
