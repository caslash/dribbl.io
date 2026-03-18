import { DraftBoard } from '@/components/draft/DraftBoard';
import { DraftConfigPanel } from '@/components/draft/DraftConfigPanel';
import { DraftResults } from '@/components/draft/DraftResults';
import { PoolPreview } from '@/components/draft/PoolPreview';
import { RoomSidebar } from '@/components/draft/RoomSidebar';
import { useDraft } from '@/hooks/useDraft';

/**
 * Active NBA All-Time Draft room.
 *
 * Renders a persistent `RoomSidebar` (room code + participants) for all
 * phases except 'entrance', alongside phase-specific main content:
 * - `lobby` / `configuring`: organizer config panel or waiting message
 * - `pool-preview`: pool preview grid before the draft starts
 * - `drafting`: live draft board
 * - `results`: post-draft results screen
 *
 * @example
 * // Rendered at /draft/:roomId via App.tsx
 * <DraftRoomPage />
 */
export const DraftRoomPage = () => {
  const { state } = useDraft();
  const { phase, isOrganizer } = state;

  return (
    <div className="flex h-full">
      {phase !== 'entrance' && <RoomSidebar />}

      <main className="flex-1 overflow-hidden">
        {phase === 'drafting' && (
          <div className="flex-1 flex flex-col min-h-0 h-full p-4">
            <DraftBoard />
          </div>
        )}

        {phase === 'pool-preview' && (
          <div className="flex flex-col gap-6 p-4 max-w-5xl mx-auto w-full">
            <PoolPreview />
          </div>
        )}

        {phase === 'results' && (
          <div className="flex flex-col gap-6 p-4 max-w-5xl mx-auto w-full">
            <DraftResults />
          </div>
        )}

        {(phase === 'lobby' || phase === 'configuring') && (
          <div className="flex flex-col gap-6 p-4 max-w-5xl mx-auto w-full">
            <div>
              {isOrganizer ? (
                <>
                  <h2 className="text-lg font-semibold mb-3">Configure Draft</h2>
                  <DraftConfigPanel />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-32 gap-3 text-center text-text-muted">
                  <p className="text-sm">Waiting for the organizer to configure the draft…</p>
                </div>
              )}
            </div>
          </div>
        )}

        {phase === 'entrance' && null}
      </main>
    </div>
  );
};
