'use client';

import { DraftBoard } from '@/components/draft/DraftBoard';
import { DraftConfigPanel } from '@/components/draft/DraftConfigPanel';
import { DraftResults } from '@/components/draft/DraftResults';
import { ParticipantList } from '@/components/draft/ParticipantList';
import { PoolPreview } from '@/components/draft/PoolPreview';
import { useDraft } from '@/hooks/useDraft';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * The `/draft/:roomId` room page.
 *
 * Renders the appropriate UI for each draft phase:
 * - `lobby` — participant list + organizer sees config panel
 * - `configuring` — organizer config panel or waiting message
 * - `pool-preview` — pool preview for all participants
 * - `drafting` — full draft board
 * - `results` — post-draft results
 *
 * Redirects to `/draft` if there is no roomId in context (e.g. if the user navigated
 * directly to this URL without going through the entrance flow).
 */
export default function DraftRoomPage() {
  const { state } = useDraft();
  const router = useRouter();

  useEffect(() => {
    if (!state.roomId) {
      router.replace('/draft');
    }
  }, [state.roomId, router]);

  if (!state.roomId) {
    return null;
  }

  const organizerId =
    state.participants.find((p) => p.isOrganizer)?.participantId ?? '';

  return (
    <div className="flex flex-col h-full gap-6 pt-4">
      {/* Room code header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold">NBA All-Time Draft</h1>
          <p className="text-sm text-muted-foreground font-mono">Room: {state.roomId}</p>
        </div>
      </div>

      {/* Phase-specific layout */}
      {(state.phase === 'lobby' || state.phase === 'configuring') && (
        <div className="flex gap-6 flex-col md:flex-row">
          {/* Sidebar: participants */}
          <aside className="w-full md:w-64 shrink-0">
            <ParticipantList participants={state.participants} organizerId={organizerId} />
          </aside>

          {/* Main: config or waiting */}
          <main className="flex-1">
            {state.isOrganizer ? (
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold">Configure Draft</h2>
                <DraftConfigPanel />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">Waiting for Organizer</h2>
                <p className="text-sm text-muted-foreground">
                  The organizer is setting up the draft. You&apos;ll be notified when it&apos;s
                  ready.
                </p>
              </div>
            )}
          </main>
        </div>
      )}

      {state.phase === 'pool-preview' && (
        <div className="flex gap-6 flex-col md:flex-row">
          <aside className="w-full md:w-64 shrink-0">
            <ParticipantList participants={state.participants} organizerId={organizerId} />
          </aside>
          <main className="flex-1">
            <PoolPreview />
          </main>
        </div>
      )}

      {state.phase === 'drafting' && <DraftBoard />}

      {state.phase === 'results' && <DraftResults />}
    </div>
  );
}
