'use client';

import { PoolEntryCard } from '@/components/draft/PoolEntryCard';
import { Button } from '@/components/ui/button';
import { useDraft } from '@/hooks/useDraft';
import { useState } from 'react';

/**
 * Displays the full generated pool before the draft begins.
 *
 * All participants see the pool grid. The organizer also sees a "Start Draft" button;
 * other participants see a waiting message.
 *
 * @example
 * <PoolPreview />
 */
export function PoolPreview() {
  const { state, startDraft } = useDraft();
  const [filter, setFilter] = useState('');

  const filtered = filter.trim()
    ? state.pool.filter((e) =>
        e.playerName.toLowerCase().includes(filter.trim().toLowerCase()),
      )
    : state.pool;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold">Draft Pool</h2>
          <p className="text-sm text-muted-foreground">{state.pool.length} entries</p>
        </div>
        {state.isOrganizer && (
          <Button onClick={startDraft}>Start Draft</Button>
        )}
        {!state.isOrganizer && (
          <p className="text-sm text-muted-foreground italic">
            Waiting for organizer to start…
          </p>
        )}
      </div>

      <input
        type="text"
        placeholder="Filter by player name…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="flex h-9 w-full max-w-xs rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 overflow-y-auto max-h-[60vh] pr-1">
        {filtered.map((entry) => (
          <PoolEntryCard
            key={entry.entryId}
            entry={entry}
            available
            isMyTurn={false}
          />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-sm text-muted-foreground py-8">
            No entries match your filter.
          </p>
        )}
      </div>
    </div>
  );
}
