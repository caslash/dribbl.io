import { ParticipantTeam } from '@/components/draft/ParticipantTeam';
import { Button } from '@/components';
import { useDraft } from '@/hooks/useDraft';
import { useNavigate } from 'react-router';

/**
 * Post-draft results screen.
 *
 * Shows a chronological pick history timeline followed by a grid of each
 * participant's drafted team. Provides a "New Draft" button that navigates
 * back to `/draft`.
 *
 * @example
 * <DraftResults />
 */
export function DraftResults() {
  const { state, leave } = useDraft();
  const navigate = useNavigate();

  function handleNewDraft() {
    leave();
    navigate('/draft');
  }

  return (
    <div className="flex flex-col gap-8 pb-16">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Draft Complete!</h1>
        <Button variant="secondary" onClick={handleNewDraft}>
          New Draft
        </Button>
      </div>

      {/* Pick history timeline */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Pick History</h2>
        <div className="flex flex-col gap-1.5">
          {state.pickHistory.map((pick, i) => {
            const entry = state.pool.find((e) => e.entryId === pick.entryId);
            const participant = state.participants.find(
              (p) => p.participantId === pick.participantId,
            );
            return (
              <div
                key={i}
                className="flex items-center gap-3 rounded-md px-3 py-2 bg-secondary text-sm"
              >
                <span className="text-muted-foreground w-10 shrink-0 text-right">
                  R{pick.round}
                </span>
                <span className="text-muted-foreground w-6 shrink-0 text-right">
                  #{pick.pickNumber}
                </span>
                <span className="font-medium shrink-0">{participant?.name ?? '?'}</span>
                <span className="text-muted-foreground">→</span>
                <span className="truncate">{entry?.playerName ?? pick.entryId}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Per-participant teams */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Teams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {state.participants.map((participant) => {
            const myPicks = state.pickHistory.filter(
              (pick) => pick.participantId === participant.participantId,
            );
            return (
              <ParticipantTeam
                key={participant.participantId}
                participant={participant}
                picks={myPicks}
                pool={state.pool}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
