import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

interface DailyResultPanelProps {
  /** Whether the user won (named the full roster). */
  won: boolean;
  /** Number of players the user successfully named. */
  namedCount: number;
  /** Total roster size. */
  rosterSize: number;
  /** Full team name for the share text. */
  teamFullName: string;
  /** Season identifier for the share text, e.g. "2015-16". */
  seasonId: string;
  /** Remaining lives at game end. */
  lives: number;
}

/**
 * Terminal state panel shown after the user wins or loses.
 * Handles clipboard copy for the share button internally.
 *
 * @example
 * <DailyResultPanel
 *   won={true}
 *   namedCount={14}
 *   rosterSize={14}
 *   teamFullName="Golden State Warriors"
 *   seasonId="2015-16"
 *   lives={2}
 * />
 */
export function DailyResultPanel({
  won,
  namedCount,
  rosterSize,
  teamFullName,
  seasonId,
  lives,
}: DailyResultPanelProps) {
  const shareText = won
    ? `Daily Roster Challenge — ${seasonId} ${teamFullName}\nNamed all ${rosterSize} players! ${lives}/3 lives remaining\ndribbl.io/daily`
    : `Daily Roster Challenge — ${seasonId} ${teamFullName}\nNamed ${namedCount} of ${rosterSize} players ❌\ndribbl.io/daily`;

  const handleShare = () => {
    void navigator.clipboard.writeText(shareText);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-surface-warm">
        {won ? (
          <>
            <div className="flex justify-center">
              <Trophy className="h-8 w-8 text-highlight" />
            </div>
            <p className="font-sans text-xl font-bold text-text-primary text-center mt-2">
              You named the full roster!
            </p>
            <p className="text-sm text-text-muted text-center">
              {seasonId} {teamFullName}
            </p>
          </>
        ) : (
          <>
            <p className="font-sans font-bold text-text-primary text-center text-4xl mt-2">
              Game Over
            </p>
            <p className="text-sm text-text-muted text-center mt-1">
              You named {namedCount} of {rosterSize} players.
            </p>
          </>
        )}

        <Button variant="secondary" size="md" className="w-full mt-4" onClick={handleShare}>
          Share Result
        </Button>

        <p className="text-xs text-text-muted text-center mt-3">
          Come back tomorrow for a new challenge.
        </p>
      </Card>
    </motion.div>
  );
}
