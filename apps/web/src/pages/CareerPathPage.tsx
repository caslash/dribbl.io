import {
  CareerPathConfig,
  GameOverScreen,
  GuessArea,
  PageMeta,
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

      <GuessArea disabled={state.lastResult !== null} />
      {state.lastResult && (
        <RoundFeedback
          result={state.lastResult}
          validAnswers={state.validAnswers}
          lives={state.lives}
          onDismiss={clearFeedback}
        />
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
      <PageMeta
        title="Career Path — dribbl.io"
        description="Guess the NBA player from their career team history. How many can you get right in a row?"
        canonicalPath="/career"
      />
      <CareerPathContent />
    </CareerPathProvider>
  );
}
