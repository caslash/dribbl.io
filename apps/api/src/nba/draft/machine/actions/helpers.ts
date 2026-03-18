import { DraftRoomConfig, FranchisePoolEntry, PoolEntry } from '@dribblio/types';

/**
 * Computes which pool entries are invalidated by picking a specific entry,
 * based on the draft mode rules.
 *
 * - `mvp`: all entries sharing the same `playerId` are invalidated.
 * - `franchise`: all entries sharing the same `playerId` OR the same `franchiseAbbr` are invalidated.
 *
 * @param pool - The current pool of entries.
 * @param config - The room configuration (determines invalidation rules per draft mode).
 * @param pickedEntryId - The `entryId` of the pick that was just made.
 * @returns Array of entry IDs that are invalidated by this pick.
 *
 * @example
 * const ids = computeInvalidatedIds(pool, config, 'entry-abc');
 */
export function computeInvalidatedIds(
  pool: PoolEntry[],
  config: DraftRoomConfig,
  pickedEntryId: string,
): string[] {
  const pickedEntry = pool.find((e) => e.entryId === pickedEntryId);
  if (!pickedEntry) return [];

  return pool
    .filter((entry) => {
      if (config.draftMode === 'mvp') {
        return entry.playerId === pickedEntry.playerId;
      }
      if (config.draftMode === 'franchise') {
        if (entry.playerId === pickedEntry.playerId) return true;
        return (
          entry.draftMode === 'franchise' &&
          pickedEntry.draftMode === 'franchise' &&
          (entry as FranchisePoolEntry).franchiseAbbr ===
            (pickedEntry as FranchisePoolEntry).franchiseAbbr
        );
      }
      return false;
    })
    .map((e) => e.entryId);
}
