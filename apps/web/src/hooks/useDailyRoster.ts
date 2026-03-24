import { useContext } from 'react';
import { DailyRosterContext } from '@/providers/DailyRosterProvider';
import type { DailyRosterContextValue } from '@/providers/DailyRosterProvider';

/**
 * Consumes the DailyRosterContext. Must be used inside a `<DailyRosterProvider>`.
 *
 * @returns The current daily roster state and `submitGuess` action.
 *
 * @example
 * const { state, submitGuess } = useDailyRoster();
 */
export function useDailyRoster(): DailyRosterContextValue {
  const ctx = useContext(DailyRosterContext);
  if (!ctx) throw new Error('useDailyRoster must be used inside <DailyRosterProvider>');
  return ctx;
}
