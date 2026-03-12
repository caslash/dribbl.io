import { useContext } from 'react';
import {
  CareerPathContext,
  type CareerPathContextValue,
} from '@/providers/CareerPathProvider';

/**
 * Consumes the CareerPathContext. Must be used inside a `<CareerPathProvider>`.
 *
 * @returns The current game state and action dispatchers.
 *
 * @example
 * const { state, submitGuess, skip } = useCareerPath();
 */
export function useCareerPath(): CareerPathContextValue {
  const ctx = useContext(CareerPathContext);
  if (!ctx) {
    throw new Error('useCareerPath must be used inside <CareerPathProvider>');
  }
  return ctx;
}
