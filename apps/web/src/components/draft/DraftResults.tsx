import React, { useId, useRef, useState, useCallback, KeyboardEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { PickRecord, PoolEntry, Participant, DraftRoomConfig } from '@dribblio/types';
import { Button } from '@/components';
import { useDraft } from '@/hooks/useDraft';
import { MyPickCard } from '@/components/draft/MyPickCard';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolvePickEntry(pick: PickRecord, pool: PoolEntry[]): PoolEntry | undefined {
  return pool.find((e) => e.entryId === pick.entryId);
}

function formatMode(config: DraftRoomConfig): string {
  return config.draftMode === 'mvp' ? 'MVP Mode' : 'Franchise Mode';
}

function formatOrder(config: DraftRoomConfig): string {
  return config.draftOrder === 'snake' ? 'Snake' : 'Linear';
}

// ─── DraftOrderTable ──────────────────────────────────────────────────────────

interface DraftOrderTableProps {
  pickHistory: PickRecord[];
  pool: PoolEntry[];
  participants: Participant[];
  myParticipantId: string | null;
}

function DraftOrderTable({ pickHistory, pool, participants, myParticipantId }: DraftOrderTableProps) {
  const rounds = Array.from(new Set(pickHistory.map((p) => p.round))).sort((a, b) => a - b);

  return (
    <div className="flex gap-6">
      {/* Main table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-primary-border">
              <th scope="col" className="text-left py-2 px-3 text-xs text-muted-foreground font-medium w-16">
                Pick
              </th>
              <th scope="col" className="text-left py-2 px-3 text-xs text-muted-foreground font-medium w-10" aria-label="Headshot" />
              <th scope="col" className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">
                Participant
              </th>
              <th scope="col" className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">
                Player
              </th>
              <th scope="col" className="text-left py-2 px-3 text-xs text-muted-foreground font-medium hidden sm:table-cell">
                Detail
              </th>
            </tr>
          </thead>
          <tbody>
            {rounds.map((round) => {
              const roundPicks = pickHistory.filter((p) => p.round === round);
              return (
                <React.Fragment key={`round-${round}`}>
                  <tr>
                    <td
                      colSpan={5}
                      className="py-1.5 px-3 text-xs font-semibold text-muted-foreground bg-surface-warm border-b border-primary-border"
                    >
                      Round {round}
                    </td>
                  </tr>
                  {roundPicks.map((pick) => {
                    const entry = resolvePickEntry(pick, pool);
                    const participant = participants.find((p) => p.participantId === pick.participantId);
                    const isMe = pick.participantId === myParticipantId;
                    const subtitle =
                      entry?.draftMode === 'mvp'
                        ? entry.season
                        : entry?.draftMode === 'franchise'
                          ? `${entry.franchiseName} (${entry.franchiseAbbr})`
                          : null;
                    const playerName = entry?.playerName ?? pick.entryId;
                    const altText = `${playerName}, round ${pick.round} pick ${pick.pickNumber}`;

                    return (
                      <tr
                        key={`${pick.participantId}-${pick.entryId}`}
                        className={`border-b border-primary-border/50 ${isMe ? 'bg-primary-subtle/40' : ''}`}
                      >
                        <td className="py-2 px-3 text-xs text-muted-foreground font-mono">
                          R{pick.round}·{pick.pickNumber}
                        </td>
                        <td className="py-2 px-3">
                          {entry ? (
                            <img
                              src={`https://cdn.nba.com/headshots/nba/latest/260x190/${entry.playerId}.png`}
                              alt={altText}
                              width={32}
                              height={24}
                              className="object-cover rounded shrink-0"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-8 h-6 bg-surface-warm rounded flex items-center justify-center">
                              <User size={12} className="text-muted-foreground" />
                            </div>
                          )}
                        </td>
                        <td className={`py-2 px-3 ${isMe ? 'font-semibold' : ''}`}>
                          {participant?.name ?? '?'}
                          {isMe && (
                            <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                              (You)
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 font-medium truncate max-w-[160px]">
                          {playerName}
                        </td>
                        <td className="py-2 px-3 text-muted-foreground hidden sm:table-cell truncate max-w-[120px]">
                          {subtitle}
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {pickHistory.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-12">
            No picks recorded for this draft.
          </p>
        )}
      </div>

      {/* Desktop-only sticky summary sidebar */}
      <aside className="hidden lg:block w-48 shrink-0">
        <div className="sticky top-4 rounded-lg border border-primary-border bg-surface-raised p-4">
          <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Pick Counts
          </h3>
          <ul className="flex flex-col gap-2">
            {participants.map((p) => {
              const count = pickHistory.filter((pick) => pick.participantId === p.participantId).length;
              const isMe = p.participantId === myParticipantId;
              return (
                <li key={p.participantId} className="flex items-center justify-between gap-2 text-sm">
                  <span className={`truncate ${isMe ? 'font-semibold' : ''}`}>
                    {p.name}
                    {isMe && <span className="ml-1 text-xs text-muted-foreground font-normal">(You)</span>}
                  </span>
                  <span className="shrink-0 text-muted-foreground tabular-nums">{count}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </div>
  );
}

// ─── AllTeamsPanel ─────────────────────────────────────────────────────────────

interface AllTeamsPanelProps {
  participants: Participant[];
  pickHistory: PickRecord[];
  pool: PoolEntry[];
  myParticipantId: string | null;
}

function AllTeamsPanel({ participants, pickHistory, pool, myParticipantId }: AllTeamsPanelProps) {
  if (pickHistory.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground py-12">
        No picks recorded for this draft.
      </p>
    );
  }

  // Local user's block appears first
  const sorted = [...participants].sort((a, b) => {
    if (a.participantId === myParticipantId) return -1;
    if (b.participantId === myParticipantId) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col gap-8">
      {sorted.map((participant) => {
        const isMe = participant.participantId === myParticipantId;
        const myPicks = pickHistory.filter((p) => p.participantId === participant.participantId);

        return (
          <section key={participant.participantId}>
            <h3
              className={`text-base font-bold mb-3 ${isMe ? 'flex items-center gap-2' : ''}`}
            >
              {participant.name}
              {isMe && (
                <span className="text-sm font-normal text-muted-foreground">(You)</span>
              )}
            </h3>
            <div
              className={`rounded-lg p-4 border ${
                isMe
                  ? 'border-primary-border ring-1 ring-primary/30 bg-surface-raised'
                  : 'border-primary-border bg-surface-raised'
              }`}
            >
              {myPicks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No picks.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                  {myPicks.map((pick) => {
                    const entry = resolvePickEntry(pick, pool);
                    return (
                      <MyPickCard key={pick.entryId} pick={pick} entry={entry} compact />
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ─── Tab definitions ───────────────────────────────────────────────────────────

type TabId = 'my-team' | 'all-teams' | 'draft-order';

interface TabDef {
  id: TabId;
  label: string;
}

// ─── DraftResults ──────────────────────────────────────────────────────────────

/**
 * Post-draft results screen with three tabs: My Team, All Teams, Draft Order.
 *
 * Reads draft state via `useDraft()`. Passes `myParticipantId` as a prop to
 * sub-components so they do not need to call `useDraft()` themselves.
 *
 * @example
 * <DraftResults />
 */
export function DraftResults() {
  const { state, leave } = useDraft();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const tabListId = useId();

  const { myParticipantId, participants, pickHistory, pool, config } = state;

  // Build tab list; suppress "My Team" tab if participant can't be identified,
  // and "All Teams" tab if there is only one participant.
  const tabs: TabDef[] = [
    ...(myParticipantId !== null ? [{ id: 'my-team' as TabId, label: 'My Team' }] : []),
    ...(participants.length > 1 ? [{ id: 'all-teams' as TabId, label: 'All Teams' }] : []),
    { id: 'draft-order' as TabId, label: 'Draft Order' },
  ];

  const defaultTab: TabId = myParticipantId !== null ? 'my-team' : 'draft-order';
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    'my-team': null,
    'all-teams': null,
    'draft-order': null,
  });

  function handleNewDraft() {
    leave();
    navigate('/draft');
  }

  const handleTabKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, currentId: TabId) => {
      const idx = tabs.findIndex((t) => t.id === currentId);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = tabs[(idx + 1) % tabs.length];
        setActiveTab(next.id);
        tabRefs.current[next.id]?.focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
        setActiveTab(prev.id);
        tabRefs.current[prev.id]?.focus();
      }
    },
    [tabs],
  );

  const myPicks = pickHistory.filter((p) => p.participantId === myParticipantId);
  // Only stagger the first 12 cards to keep animation budget small
  const staggerCount = Math.min(myPicks.length, 12);

  const headerVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.04 },
    },
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Fixed header */}
      <motion.header
        className="shrink-0 border-b border-primary-border bg-surface px-4 py-4"
        initial={shouldReduceMotion ? false : 'hidden'}
        animate="visible"
        variants={headerVariants}
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Draft Complete</h1>
            {config && (
              <div className="flex items-center gap-2 flex-wrap" aria-label="Draft settings">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {formatMode(config)}
                </span>
                <span className="inline-flex items-center rounded-full border border-primary-border px-2.5 py-0.5 text-xs text-muted-foreground">
                  {formatOrder(config)} draft
                </span>
                <span className="inline-flex items-center rounded-full border border-primary-border px-2.5 py-0.5 text-xs text-muted-foreground">
                  {config.maxRounds} round{config.maxRounds !== 1 ? 's' : ''}
                </span>
                {config.turnDuration && (
                  <span className="inline-flex items-center rounded-full border border-primary-border px-2.5 py-0.5 text-xs text-muted-foreground">
                    {config.turnDuration}s timer
                  </span>
                )}
              </div>
            )}
          </div>
          <Button variant="secondary" onClick={handleNewDraft}>
            Start New Draft
          </Button>
        </div>

        {/* Tab bar */}
        <div
          role="tablist"
          aria-label="Results view"
          id={tabListId}
          className="flex gap-1 mt-4"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface-raised'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.header>

      {/* Scrollable panel content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === 'my-team' && myParticipantId !== null && (
            <div
              key="my-team"
              role="tabpanel"
              id="panel-my-team"
              aria-labelledby="tab-my-team"
              tabIndex={0}
              className="p-4 focus-visible:outline-none"
            >
              {pickHistory.length === 0 || myPicks.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-12">
                  No picks recorded for this draft.
                </p>
              ) : (
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                  variants={containerVariants}
                  initial={shouldReduceMotion ? false : 'hidden'}
                  animate="visible"
                >
                  {myPicks.map((pick, i) => {
                    const entry = resolvePickEntry(pick, pool);
                    return (
                      <motion.div
                        key={pick.entryId}
                        variants={i < staggerCount ? cardVariants : undefined}
                      >
                        <MyPickCard pick={pick} entry={entry} />
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          )}

          {activeTab === 'my-team' && myParticipantId === null && (
            <div
              key="my-team-missing"
              role="tabpanel"
              id="panel-my-team"
              aria-labelledby="tab-my-team"
              tabIndex={0}
              className="p-4 focus-visible:outline-none"
            >
              <p className="text-center text-sm text-muted-foreground py-12">
                Unable to identify your team.
              </p>
            </div>
          )}

          {activeTab === 'all-teams' && (
            <div
              key="all-teams"
              role="tabpanel"
              id="panel-all-teams"
              aria-labelledby="tab-all-teams"
              tabIndex={0}
              className="p-4 focus-visible:outline-none"
            >
              <AllTeamsPanel
                participants={participants}
                pickHistory={pickHistory}
                pool={pool}
                myParticipantId={myParticipantId}
              />
            </div>
          )}

          {activeTab === 'draft-order' && (
            <div
              key="draft-order"
              role="tabpanel"
              id="panel-draft-order"
              aria-labelledby="tab-draft-order"
              tabIndex={0}
              className="p-4 focus-visible:outline-none"
            >
              <DraftOrderTable
                pickHistory={pickHistory}
                pool={pool}
                participants={participants}
                myParticipantId={myParticipantId}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
