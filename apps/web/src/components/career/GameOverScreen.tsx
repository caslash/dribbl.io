import { Button } from '@/components/Button';
import { useCareerPath } from '@/hooks/useCareerPath';

/**
 * Final screen shown when the player runs out of lives.
 * Displays the final score and provides a "Play Again" button.
 *
 * @example
 * <GameOverScreen />
 */
export function GameOverScreen() {
  const { state } = useCareerPath();

  const handlePlayAgain = () => {
    // Full page reload to reset provider state and create a new room
    window.location.reload();
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-serif text-5xl font-bold text-primary-text">
        Game Over
      </h1>
      <p className="mt-4 text-lg text-text-muted">
        You finished with a score of
      </p>
      <p className="mt-2 font-serif text-7xl font-bold text-red-600">
        {state.score}
      </p>
      <Button
        variant="primary"
        size="lg"
        className="mt-10"
        onClick={handlePlayAgain}
      >
        Play Again
      </Button>
    </div>
  );
}
