import { useState } from 'react';
import { Button } from '@/components/Button';
import { PlayerSearchInput } from '@/components/PlayerSearchInput';
import { useCareerPath } from '@/hooks/useCareerPath';

interface GuessAreaProps {
  /** When true, the form is locked (e.g. during result feedback). */
  disabled?: boolean;
}

/**
 * Player guess form: autocomplete search, submit button, and skip button.
 * Clears the selected player after each submission.
 *
 * @example
 * <GuessArea disabled={state.lastResult !== null} />
 */
export function GuessArea({ disabled = false }: GuessAreaProps) {
  const { submitGuess, skip, state } = useCareerPath();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedName, setSelectedName] = useState('');
  const [key, setKey] = useState(0);

  const handleSelect = (playerId: number, fullName: string) => {
    setSelectedId(playerId);
    setSelectedName(fullName);
  };

  const handleSubmit = () => {
    if (selectedId === null) return;
    submitGuess(selectedId);
    // Reset the search after submitting
    setSelectedId(null);
    setSelectedName('');
    setKey((k) => k + 1);
  };

  const handleSkip = () => {
    skip();
    setSelectedId(null);
    setSelectedName('');
    setKey((k) => k + 1);
  };

  const isInfiniteMode = state.lives === null;

  return (
    <div className="flex flex-col gap-3">
      <PlayerSearchInput
        key={key}
        onSelect={handleSelect}
        disabled={disabled}
        placeholder="Type a player's name..."
      />
      <div className="flex gap-2">
        <Button
          variant="primary"
          size="md"
          className="flex-1"
          onClick={handleSubmit}
          disabled={disabled || selectedId === null}
        >
          Submit Guess
        </Button>
        <Button
          variant="ghost"
          size="md"
          onClick={handleSkip}
          disabled={disabled}
          title={
            isInfiniteMode
              ? 'Skip (resets score to 0)'
              : 'Skip (costs 1 life)'
          }
        >
          Skip{!isInfiniteMode && ' (−1 ♥)'}
        </Button>
      </div>
      {selectedName && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Selected:{' '}
          <span className="font-medium text-navy-800 dark:text-cream-200">
            {selectedName}
          </span>
        </p>
      )}
    </div>
  );
}
