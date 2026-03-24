import { AnimatePresence, motion } from 'framer-motion';
import { BarChart2, Heart, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/Button';

const STORAGE_KEY = 'daily_roster_tutorial_v1';

/**
 * Reads and writes the tutorial-dismissed flag from localStorage.
 * Returns `true` if the tutorial has already been seen.
 */
function getTutorialSeen(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return true;
  }
}

function setTutorialSeen(): void {
  try {
    localStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // localStorage may be unavailable — fail silently
  }
}

/**
 * Hook that tracks whether the tutorial modal should be shown.
 * Persists the dismissed state to localStorage.
 *
 * @example
 * const { showTutorial, dismissTutorial } = useRosterTutorial();
 */
export function useRosterTutorial() {
  const [showTutorial, setShowTutorial] = useState(() => !getTutorialSeen());

  const dismissTutorial = () => {
    setTutorialSeen();
    setShowTutorial(false);
  };

  return { showTutorial, dismissTutorial };
}

interface RosterTutorialModalProps {
  /** Whether the modal is visible. */
  show: boolean;
  /** Called when the user dismisses the modal. */
  onDismiss: () => void;
}

interface RuleRowProps {
  icon: React.ReactNode;
  children: React.ReactNode;
}

function RuleRow({ icon, children }: RuleRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0 text-text-muted">{icon}</div>
      <p className="text-sm text-text-secondary leading-snug">{children}</p>
    </div>
  );
}

/**
 * First-visit tutorial overlay for the Daily Roster Challenge.
 * Explains the rules and dismisses to localStorage so it is never shown again.
 *
 * @example
 * const { showTutorial, dismissTutorial } = useRosterTutorial();
 * <RosterTutorialModal show={showTutorial} onDismiss={dismissTutorial} />
 */
export function RosterTutorialModal({ show, onDismiss }: RosterTutorialModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="tutorial-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={onDismiss}
        >
          <motion.div
            key="tutorial-card"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.22, ease: [0.34, 1.2, 0.64, 1] }}
            className="relative w-full max-w-sm rounded-2xl border border-border bg-surface-raised p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Close tutorial"
              className="absolute right-4 top-4 rounded-md p-1 text-text-muted hover:bg-surface-warm hover:text-text-primary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-1">
              Daily Roster Challenge
            </p>
            <h2 className="text-xl font-bold text-text-primary mb-5">How to Play</h2>

            <div className="flex flex-col gap-4 mb-6">
              <RuleRow icon={<Search className="h-4 w-4" />}>
                Each day you're given an <strong className="text-text-primary">NBA team and season</strong>.
                Name every player who appeared on that roster.
              </RuleRow>

              <RuleRow icon={<Heart className="h-4 w-4" />}>
                You have <strong className="text-text-primary">3 lives</strong>. Each wrong guess
                costs one — run out and the game ends.
              </RuleRow>

              <RuleRow icon={<BarChart2 className="h-4 w-4" />}>
                Players are listed by <strong className="text-text-primary">points per game</strong>,
                highest to lowest. Use the order as a hint — the stars are at the top.
              </RuleRow>
            </div>

            <Button variant="primary" size="md" className="w-full" onClick={onDismiss}>
              Let's Play
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
