import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import type { PoolEntry, PickRecord } from '@dribblio/types';
import { useDraft } from '@/hooks/useDraft';
import { DraftTimeline } from '@/components/draft/DraftTimeline';
import { PoolEntryRow } from '@/components/draft/PoolEntryRow';
import { PickConfirmModal } from '@/components/draft/PickConfirmModal';
import { PickAnnouncementModal } from '@/components/draft/PickAnnouncementModal';

/**
 * The main active-draft view.
 *
 * Layout (top to bottom):
 * - `DraftTimeline`: horizontal scrollable pick history strip (~180px)
 * - Search filter bar
 * - Scrollable list of `PoolEntryRow` components
 * - `PickConfirmModal` overlay (when a row is selected)
 * - `PickAnnouncementModal` overlay (auto-dismissed after each confirmed pick)
 *
 * Pick flow:
 * 1. User clicks a `PoolEntryRow` → sets `selectedEntry`
 * 2. `PickConfirmModal` appears → user confirms → `submitPick` is called
 * 3. `useEffect` on `pickHistory.length` captures the latest pick → sets `announcedPick`
 * 4. `PickAnnouncementModal` auto-dismisses after 2500ms
 *
 * @example
 * <DraftBoard />
 */
export function DraftBoard() {
  const { state, isMyTurn, submitPick, notifyTimerExpired } = useDraft();
  const [filter, setFilter] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<PoolEntry | null>(null);
  const [announcedPick, setAnnouncedPick] = useState<PickRecord | null>(null);

  const filtered = filter.trim()
    ? state.pool.filter((e) =>
        e.playerName.toLowerCase().includes(filter.trim().toLowerCase()),
      )
    : state.pool;

  function handleSelectEntry(entry: PoolEntry) {
    setSelectedEntry(entry);
  }

  function handleConfirmPick() {
    if (!selectedEntry) return;
    submitPick(selectedEntry.entryId);
    setSelectedEntry(null);
  }

  function handleTimerExpire() {
    notifyTimerExpired();
    toast.info("Time's up!");
  }

  const handleDismissAnnouncement = useCallback(() => {
    setAnnouncedPick(null);
  }, []);

  // Watch for new picks and trigger the announcement overlay
  useEffect(() => {
    if (state.pickHistory.length === 0) return;
    const lastPick = state.pickHistory[state.pickHistory.length - 1];
    setAnnouncedPick(lastPick);
  }, [state.pickHistory.length]);

  const announcedEntry = announcedPick
    ? state.pool.find((e) => e.entryId === announcedPick.entryId)
    : undefined;
  const announcedParticipant = announcedPick
    ? state.participants.find((p) => p.participantId === announcedPick.participantId)
    : undefined;

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Draft order timeline */}
      <DraftTimeline
        turnOrder={state.turnOrder}
        currentTurnIndex={state.currentTurnIndex}
        pickHistory={state.pickHistory}
        participants={state.participants}
        pool={state.pool}
        isMyTurn={isMyTurn}
        timerDurationSeconds={state.config?.turnDuration}
        onTimerExpire={handleTimerExpire}
      />

      {/* Filter bar */}
      <div className="flex items-center gap-3 px-2 py-2 shrink-0 border-b border-primary-border">
        <h2 className="text-sm font-bold shrink-0 text-text-muted">Draft Pool</h2>
        <input
          type="text"
          placeholder="Filter by player…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex h-8 w-full max-w-xs rounded-md border border-primary-border bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-600"
        />
      </div>

      {/* Scrollable pool list */}
      <div className="overflow-y-auto flex-1 flex flex-col gap-1 p-2">
        {filtered.map((entry) => {
          const available = !state.invalidatedIds.has(entry.entryId);
          return (
            <PoolEntryRow
              key={entry.entryId}
              entry={entry}
              available={available}
              isMyTurn={isMyTurn}
              onSelect={() => handleSelectEntry(entry)}
            />
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-text-muted py-8">No entries match.</p>
        )}
      </div>

      {/* Pick confirmation modal */}
      {selectedEntry && (
        <PickConfirmModal
          entry={selectedEntry}
          onConfirm={handleConfirmPick}
          onCancel={() => setSelectedEntry(null)}
        />
      )}

      {/* Pick announcement overlay */}
      <PickAnnouncementModal
        pick={announcedPick}
        entry={announcedEntry}
        participant={announcedParticipant}
        onDismiss={handleDismissAnnouncement}
      />
    </div>
  );
}
