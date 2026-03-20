import { Button } from '@/components/Button';
import { PlayerSearchInput } from '@/components/PlayerSearchInput';
import { useCareerPath } from '@/hooks/useCareerPath';
import { useEffect, useRef, useState } from 'react';

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
  const [key, setKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleSelect = (playerId: number) => {
    setSelectedId(playerId);
  };

  const handleSubmit = () => {
    if (selectedId === null) return;
    submitGuess(selectedId);
    // Reset the search after submitting
    setSelectedId(null);
    setKey((k) => k + 1);
  };

  const handleSkip = () => {
    skip();
    setSelectedId(null);
    setKey((k) => k + 1);
  };

  const isInfiniteMode = state.lives === null;

  return (
    <div className="flex flex-col gap-3">
      <PlayerSearchInput
        key={key}
        ref={inputRef}
        onSelect={handleSelect}
        onSubmit={handleSubmit}
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
          title={isInfiniteMode ? 'Skip (resets score to 0)' : 'Skip (costs 1 life)'}
        >
          Skip{!isInfiniteMode && ' (−1 ♥)'}
        </Button>
      </div>
    </div>
  );
}
