import {
  CareerPathConfig,
  GameOverScreen,
  GuessArea,
  RoundFeedback,
  ScoreBoard,
  TeamHistoryDisplay,
} from '@/components';
import { useCareerPath } from '@/hooks/useCareerPath';
import { CareerPathProvider } from '@/providers/CareerPathProvider';

/**
 * Inner page content — consumes CareerPathProvider and renders the correct
 * view for each game phase.
 */
function CareerPathContent() {
  const { state, clearFeedback } = useCareerPath();

  if (state.phase === 'config') {
    return <CareerPathConfig />;
  }

  if (state.phase === 'game-over') {
    return <GameOverScreen />;
  }

  // phase === 'playing'
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <ScoreBoard score={state.score} lives={state.lives} />
      <TeamHistoryDisplay teamHistory={state.teamHistory} />

      {state.lastResult ? (
        <RoundFeedback
          result={state.lastResult}
          validAnswers={state.validAnswers}
          lives={state.lives}
          onDismiss={clearFeedback}
        />
      ) : (
        <GuessArea />
      )}
    </div>
  );
}

/**
 * Career Path game route. Wraps content in the provider which manages
 * the socket connection and game state machine.
 */
export function CareerPathPage() {
  return (
    <CareerPathProvider>
      <CareerPathContent />
    </CareerPathProvider>
  );
}
