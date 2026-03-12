'use client';

import { PoolEntryCard } from '@/components/draft/PoolEntryCard';
import { TurnTimer } from '@/components/draft/TurnTimer';
import { useDraft } from '@/hooks/useDraft';
import { useState } from 'react';
import { toast } from 'react-toastify';

/**
 * The main active-draft view.
 *
 * Layout:
 * - Left (70%): filterable pool grid with `PoolEntryCard` components.
 * - Right sidebar (30%): current-turn banner with optional timer,
 *   participant pick counts, and the 5 most recent picks.
 *
 * @example
 * <DraftBoard />
 */
export function DraftBoard() {
  const { state, isMyTurn, currentTurnParticipant, submitPick, notifyTimerExpired } = useDraft();
  const [filter, setFilter] = useState('');

  const filtered = filter.trim()
    ? state.pool.filter((e) =>
        e.playerName.toLowerCase().includes(filter.trim().toLowerCase()),
      )
    : state.pool;

  function handlePick(entryId: string) {
    submitPick(entryId);
  }

  function handleTimerExpire() {
    notifyTimerExpired();
    toast.info("Time's up!");
  }

  // Build a pick-count lookup by participantId
  const pickCounts: Record<string, number> = {};
  for (const pick of state.pickHistory) {
    pickCounts[pick.participantId] = (pickCounts[pick.participantId] ?? 0) + 1;
  }

  const recentPicks = state.pickHistory.slice(-5).reverse();

  return (
    <div className="flex gap-4 h-full">
      {/* Pool grid */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-lg font-bold shrink-0">Draft Pool</h2>
          <input
            type="text"
            placeholder="Filter by player…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex h-9 w-full max-w-xs rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto flex-1 pr-1">
          {filtered.map((entry) => {
            const available = !state.invalidatedIds.has(entry.entryId);
            return (
              <PoolEntryCard
                key={entry.entryId}
                entry={entry}
                available={available}
                isMyTurn={isMyTurn}
                onPick={() => handlePick(entry.entryId)}
              />
            );
          })}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-sm text-muted-foreground py-8">
              No entries match.
            </p>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-64 shrink-0 flex flex-col gap-4">
        {/* Current turn banner */}
        <div className="rounded-lg border p-4 flex flex-col items-center gap-3 bg-card">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Round {state.currentRound}
          </p>
          {currentTurnParticipant ? (
            <p className="text-sm font-bold text-center">
              {isMyTurn ? "It's your turn!" : `${currentTurnParticipant.name}'s turn`}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Waiting…</p>
          )}
          {state.config?.turnDuration && (
            <TurnTimer
              durationSeconds={state.config.turnDuration}
              onExpire={handleTimerExpire}
            />
          )}
        </div>

        {/* Participant pick counts */}
        <div className="rounded-lg border p-4 flex flex-col gap-2 bg-card">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Participants
          </p>
          {state.participants.map((p) => (
            <div key={p.participantId} className="flex justify-between items-center text-sm">
              <span className="truncate">{p.name}</span>
              <span className="text-muted-foreground shrink-0 ml-2">
                {pickCounts[p.participantId] ?? 0} picks
              </span>
            </div>
          ))}
        </div>

        {/* Recent picks */}
        {recentPicks.length > 0 && (
          <div className="rounded-lg border p-4 flex flex-col gap-2 bg-card">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Recent Picks
            </p>
            {recentPicks.map((pick, i) => {
              const entry = state.pool.find((e) => e.entryId === pick.entryId);
              const participant = state.participants.find(
                (p) => p.participantId === pick.participantId,
              );
              return (
                <div key={i} className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{participant?.name ?? '?'}</span>
                  {' → '}
                  {entry?.playerName ?? pick.entryId}
                </div>
              );
            })}
          </div>
        )}
      </aside>
    </div>
  );
}
