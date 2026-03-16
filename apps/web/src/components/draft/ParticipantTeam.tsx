import type { Participant, PickRecord, PoolEntry } from '@dribblio/types';

interface ParticipantTeamProps {
  participant: Participant;
  picks: PickRecord[];
  pool: PoolEntry[];
}

/**
 * Displays a single participant's drafted team as a grid of picked players.
 *
 * Resolves each `PickRecord` against the pool to show the player name and
 * mode-specific subtitle (season or franchise).
 *
 * @param participant - The participant whose team is shown.
 * @param picks - All picks made by this participant.
 * @param pool - The full pool to resolve entry details.
 *
 * @example
 * <ParticipantTeam participant={p} picks={myPicks} pool={state.pool} />
 */
export function ParticipantTeam({ participant, picks, pool }: ParticipantTeamProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-base font-bold">{participant.name}</h3>
      {picks.length === 0 ? (
        <p className="text-sm text-muted-foreground">No picks yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {picks.map((pick) => {
            const entry = pool.find((e) => e.entryId === pick.entryId);
            const subtitle =
              entry?.draftMode === 'mvp'
                ? entry.season
                : entry?.draftMode === 'franchise'
                  ? `${entry.franchiseName} (${entry.franchiseAbbr})`
                  : pick.entryId;

            return (
              <div key={pick.entryId} className="rounded-lg border bg-card p-3">
                <p className="text-sm font-semibold truncate">
                  {entry?.playerName ?? pick.entryId}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  R{pick.round} · #{pick.pickNumber}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
