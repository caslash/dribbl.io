import { DailyLivesDisplay, DailyResultPanel, RosterPlayerList } from '@/components';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PlayerSearchInput } from '@/components/PlayerSearchInput';
import { useDailyRoster } from '@/hooks/useDailyRoster';
import type { NamedPlayer } from '@/providers/DailyRosterProvider';
import { DailyRosterProvider } from '@/providers/DailyRosterProvider';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, Calendar, CheckCircle2, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

/** Returns today's date as "YYYY-MM-DD" in local time. */
function getLocalDateString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Returns a new date string shifted by `days` from the given `YYYY-MM-DD` string.
 * Uses explicit year/month/day construction to avoid timezone offset issues.
 */
function shiftDate(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Skeleton placeholder block shown while data loads. */
function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-surface-warm rounded ${className ?? ''}`} />;
}

/** Full-page loading skeleton matching the page layout. */
function LoadingSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col flex-1 overflow-hidden max-w-2xl mx-auto w-full px-4">
      <div className="pt-4 space-y-3 shrink-0">
        <div className="rounded-lg border border-border bg-surface-raised p-4 flex flex-col items-center gap-3">
          <SkeletonBlock className="h-16 w-16 rounded-full" />
          <SkeletonBlock className="h-6 w-48" />
          <SkeletonBlock className="h-4 w-32" />
        </div>
        <SkeletonBlock className="h-1.5 w-full" />
        <SkeletonBlock className="h-6 w-full" />
      </div>
      <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-1.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-12 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

/** Team logo with abbreviation fallback. */
function TeamLogoDisplay({
  teamId,
  teamAbbreviation,
}: {
  teamId: number;
  teamAbbreviation: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="h-12 w-12 rounded-full bg-surface-warm flex items-center justify-center">
        <span className="font-mono font-semibold text-sm text-text-primary">
          {teamAbbreviation}
        </span>
      </div>
    );
  }

  return (
    <img
      src={`${import.meta.env.VITE_LOGO_SVG_PATH}/${teamId}.svg`}
      width={48}
      height={48}
      alt={teamAbbreviation}
      onError={() => setFailed(true)}
    />
  );
}

/** Formats an ISO date string as "March 22, 2026". */
function formatChallengeDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  // Construct with explicit parts to avoid timezone offset shifting the date
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ---------------------------------------------------------------------------
// Date navigation
// ---------------------------------------------------------------------------

interface DateNavProps {
  date: string;
  isToday: boolean;
  earliestDate: string | null;
  onPrev: () => void;
  onNext: () => void;
}

/** Prev/next arrow navigation for flipping through daily challenges. */
function DateNav({ date, isToday, earliestDate, onPrev, onNext }: DateNavProps) {
  const atEarliest = earliestDate !== null && date <= earliestDate;

  return (
    <div className="flex items-center justify-center gap-3 px-4 py-3 shrink-0">
      <button
        onClick={onPrev}
        disabled={atEarliest}
        aria-label="Previous day"
        className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-warm transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-muted"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-text-primary tabular-nums">
          {formatChallengeDate(date)}
        </span>
        {isToday && (
          <span className="text-xs text-text-muted">(today)</span>
        )}
      </div>

      <button
        onClick={onNext}
        disabled={isToday}
        aria-label="Next day"
        className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-warm transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-muted"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Already-played banner
// ---------------------------------------------------------------------------

function AlreadyPlayedBanner({ won }: { won: boolean }) {
  return (
    <div className="rounded-md bg-surface-warm border border-border px-4 py-2 flex items-center gap-2">
      {won ? (
        <CheckCircle2 className="h-4 w-4 text-text-muted flex-shrink-0" />
      ) : (
        <XCircle className="h-4 w-4 text-text-muted flex-shrink-0" />
      )}
      <span className="text-sm text-text-secondary">You played this challenge earlier today.</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Guess input area
// ---------------------------------------------------------------------------

interface GuessInputAreaProps {
  namedCount: number;
  isShaking: boolean;
  isDisabled: boolean;
  /** Called with the player ID and display name when the user submits. */
  onGuess: (playerId: number, fullName: string) => void;
}

function GuessInputArea({ namedCount, isShaking, isDisabled, onGuess }: GuessInputAreaProps) {
  const prefersReducedMotion = useReducedMotion();
  const [selected, setSelected] = useState<{ id: number; name: string } | null>(null);
  const [inputKey, setInputKey] = useState(0);
  const [borderFlash, setBorderFlash] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isDisabled) {
      inputRef.current?.focus();
    }
  }, [isDisabled]);

  // Flash border accent on wrong guess
  useEffect(() => {
    if (isShaking) {
      setBorderFlash(true);
      const t = setTimeout(() => setBorderFlash(false), 400);
      return () => clearTimeout(t);
    }
  }, [isShaking]);

  const handleSelect = (playerId: number, fullName: string) => {
    setSelected({ id: playerId, name: fullName });
  };

  const handleSubmit = () => {
    if (!selected || isDisabled) return;
    onGuess(selected.id, selected.name);
    setSelected(null);
    setInputKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence>
        {namedCount === 0 && (
          <motion.p
            key="hint"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="text-sm text-text-muted text-center"
          >
            Name every player from this roster.
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div
        animate={isShaking && !prefersReducedMotion ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className={borderFlash ? 'ring-2 ring-accent rounded-md' : ''}
      >
        <PlayerSearchInput
          key={inputKey}
          ref={inputRef}
          onSelect={handleSelect}
          onSubmit={handleSubmit}
          disabled={isDisabled}
          placeholder="Name a player on this roster..."
        />
      </motion.div>

      <Button
        variant="primary"
        size="md"
        className="w-full"
        onClick={handleSubmit}
        disabled={isDisabled || selected === null}
      >
        Submit
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page content (consumes provider)
// ---------------------------------------------------------------------------

/**
 * Inner content for the Daily Roster Challenge page.
 * Consumes DailyRosterProvider — must be rendered inside it.
 */
function DailyRosterContent() {
  const { state, submitGuess } = useDailyRoster();
  const [isShaking, setIsShaking] = useState(false);
  // missedPlayers would be populated if/when a reveal endpoint exists
  const [missedPlayers] = useState<NamedPlayer[]>([]);

  const handleGuess = useCallback(
    async (playerId: number, fullName: string) => {
      const result = await submitGuess(playerId);

      if (result === 'correct') {
        toast.success(fullName, {
          autoClose: 1500,
          position: 'bottom-center',
        });
      } else if (result === 'wrong') {
        // state.lives is the pre-decrement value; subtract 1 for the post-decrement count
        const livesAfter = Math.max(0, state.lives - 1);
        toast.error(`Wrong — ${livesAfter} ${livesAfter === 1 ? 'life' : 'lives'} remaining`, {
          autoClose: 2000,
          position: 'bottom-center',
        });
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 400);
      } else {
        toast.info('Already named', { autoClose: 1500, position: 'bottom-center' });
      }
    },
    [submitGuess, state.lives],
  );

  // -------------------------------------------------------------------------
  // Loading state
  // -------------------------------------------------------------------------

  if (state.phase === 'loading') {
    return <LoadingSkeleton />;
  }

  // -------------------------------------------------------------------------
  // Error states
  // -------------------------------------------------------------------------

  if (state.error === 'NO_CHALLENGE') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 flex flex-col items-center gap-4 text-center">
        <Calendar className="h-10 w-10 text-text-muted" />
        <p className="text-xl font-bold text-text-primary">No challenge today</p>
        <p className="text-sm text-text-muted">Check back tomorrow.</p>
      </div>
    );
  }

  if (state.error === 'NETWORK_ERROR') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 flex flex-col items-center gap-4 text-center">
        <AlertCircle className="h-10 w-10 text-text-muted" />
        <p className="text-xl font-bold text-text-primary">Couldn't load today's challenge</p>
        <Button variant="primary" size="md" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Game UI (playing or complete)
  // -------------------------------------------------------------------------

  const namedCount = state.namedPlayers.length;
  const progressPct = state.rosterSize > 0 ? (namedCount / state.rosterSize) * 100 : 0;
  const isComplete = state.phase === 'complete';

  return (
    <div className="flex flex-col flex-1 overflow-hidden max-w-2xl mx-auto w-full px-4">
      {/* Static top section */}
      <div className="pt-4 space-y-3 shrink-0">
        {isComplete && <AlreadyPlayedBanner won={state.won} />}

        {/* Challenge header */}
        <Card className="p-3">
          <div className="flex justify-center">
            <TeamLogoDisplay teamId={state.teamId} teamAbbreviation={state.teamAbbreviation} />
          </div>
          <p className="text-xl font-bold text-text-primary text-center mt-2">
            {state.teamFullName}
          </p>
          <div className="flex items-center justify-center gap-3 mt-1.5">
            <Badge label={state.seasonId} />
            <span className="text-sm text-text-muted">
              {formatChallengeDate(state.challengeDate)}
            </span>
          </div>
        </Card>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${progressPct}%`, transition: 'width 300ms ease' }}
          />
        </div>

        {/* Lives + progress count */}
        <DailyLivesDisplay
          lives={state.lives}
          namedCount={namedCount}
          rosterSize={state.rosterSize}
        />
      </div>

      {/* Scrollable roster list */}
      <div className="flex-1 overflow-y-auto py-3">
        <RosterPlayerList
          namedPlayers={state.namedPlayers}
          rosterSize={state.rosterSize}
          complete={isComplete}
          missedPlayers={missedPlayers}
          seasonId={state.seasonId}
          teamFullName={state.teamFullName}
        />
      </div>

      {/* Pinned bottom: search input or result panel */}
      <div className="shrink-0 py-4 border-t border-border">
        <AnimatePresence mode="wait">
          {isComplete ? (
            <DailyResultPanel
              key="result"
              won={state.won}
              namedCount={namedCount}
              rosterSize={state.rosterSize}
              teamFullName={state.teamFullName}
              seasonId={state.seasonId}
              lives={state.lives}
            />
          ) : (
            <motion.div key="input" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GuessInputArea
                namedCount={namedCount}
                isShaking={isShaking}
                isDisabled={isShaking}
                onGuess={handleGuess}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Daily Roster Challenge route. Manages the selected date and renders the
 * date navigation header above the provider. Re-keying the provider on date
 * change causes a clean remount, resetting all game state.
 */
export function DailyRosterPage() {
  const [selectedDate, setSelectedDate] = useState(getLocalDateString);
  const [earliestDate, setEarliestDate] = useState<string | null>(null);
  const today = getLocalDateString();

  useEffect(() => {
    fetch('/api/daily/roster/earliest-date')
      .then((res) => res.json())
      .then((data: { date: string | null }) => setEarliestDate(data.date))
      .catch(() => { /* fail silently — prev arrow stays enabled */ });
  }, []);

  return (
    <div className="flex flex-col h-full">
      <DateNav
        date={selectedDate}
        isToday={selectedDate === today}
        earliestDate={earliestDate}
        onPrev={() => setSelectedDate((d) => shiftDate(d, -1))}
        onNext={() => setSelectedDate((d) => shiftDate(d, 1))}
      />
      <DailyRosterProvider date={selectedDate} key={selectedDate}>
        <DailyRosterContent />
      </DailyRosterProvider>
    </div>
  );
}
