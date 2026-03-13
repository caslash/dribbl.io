import { DraftBoard } from '@/components/draft/DraftBoard';
import { DraftConfigPanel } from '@/components/draft/DraftConfigPanel';
import { DraftResults } from '@/components/draft/DraftResults';
import { ParticipantList } from '@/components/draft/ParticipantList';
import { PoolPreview } from '@/components/draft/PoolPreview';
import { useDraft } from '@/hooks/useDraft';

/**
 * Active NBA All-Time Draft room.
 *
 * Renders the correct UI for each draft phase:
 * - `lobby` / `configuring`: participant list + organizer config panel (or waiting message)
 * - `pool-preview`: pool preview grid before the draft starts
 * - `drafting`: live draft board with pool grid and sidebar
 * - `results`: post-draft results screen
 *
 * @example
 * // Rendered at /draft/:roomId via App.tsx
 * <DraftRoomPage />
 */
export const DraftRoomPage = () => {
  const { state } = useDraft();
  const { phase, participants, isOrganizer } = state;

  const organizerId =
    participants.find((p) => p.isOrganizer)?.participantId ?? '';

  if (phase === 'drafting') {
    return (
      <div className="flex-1 flex flex-col min-h-0 p-4">
        <DraftBoard />
      </div>
    );
  }

  if (phase === 'pool-preview') {
    return (
      <div className="flex flex-col gap-6 p-4 max-w-5xl mx-auto w-full">
        <PoolPreview />
      </div>
    );
  }

  if (phase === 'results') {
    return (
      <div className="flex flex-col gap-6 p-4 max-w-5xl mx-auto w-full">
        <DraftResults />
      </div>
    );
  }

  // lobby / configuring phases
  return (
    <div className="flex flex-col gap-6 p-4 max-w-5xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Participant list */}
        <div className="md:col-span-1">
          <h2 className="text-lg font-semibold mb-3">Room</h2>
          {state.roomId && (
            <p className="text-xs text-navy-500 dark:text-cream-300 mb-3">
              Code:{' '}
              <span className="font-mono font-bold tracking-widest text-navy-900 dark:text-cream-50">
                {state.roomId}
              </span>
            </p>
          )}
          <ParticipantList participants={participants} organizerId={organizerId} />
        </div>

        {/* Config panel or waiting message */}
        <div className="md:col-span-2">
          {isOrganizer ? (
            <>
              <h2 className="text-lg font-semibold mb-3">Configure Draft</h2>
              <DraftConfigPanel />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-32 gap-3 text-center text-navy-500 dark:text-cream-300">
              <p className="text-sm">Waiting for the organizer to configure the draft…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
