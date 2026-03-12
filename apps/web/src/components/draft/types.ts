/**
 * Local draft types for the NBA All-Time Draft game mode.
 *
 * These mirror the backend event payloads defined in the CLAUDE.md spec.
 * Once the backend exposes them via `@dribblio/types`, this file should be replaced
 * with imports from that package.
 */

export type DraftMode = 'mvp' | 'franchise';
export type DraftOrder = 'snake' | 'linear';

/**
 * A participant in a draft room.
 */
export interface Participant {
  participantId: string;
  name: string;
  isOrganizer: boolean;
}

/**
 * Configuration for a draft room.
 */
export interface DraftRoomConfig {
  draftMode: DraftMode;
  draftOrder: DraftOrder;
  maxRounds: number;
  /** Duration in seconds; undefined means no timer. */
  turnDuration?: number;
}

/**
 * A single entry in the draft pool.
 *
 * MVP mode entries carry a season year; Franchise mode entries carry a franchise name.
 */
export type PoolEntry =
  | {
      entryId: string;
      draftMode: 'mvp';
      playerId: number;
      playerName: string;
      /** The season year this MVP award was won, e.g. "2012-13". */
      season: string;
    }
  | {
      entryId: string;
      draftMode: 'franchise';
      playerId: number;
      playerName: string;
      /** The full franchise name, e.g. "Los Angeles Lakers". */
      franchiseName: string;
      franchiseAbbr: string;
    };

/**
 * A completed pick in the draft.
 */
export interface PickRecord {
  participantId: string;
  entryId: string;
  round: number;
  pickNumber: number;
}

// ─── Socket event payload types ──────────────────────────────────────────────

export interface NotifyParticipantJoinedPayload {
  participant: Participant;
}

export interface NotifyParticipantLeftPayload {
  participantId: string;
}

export interface NotifyConfigSavedPayload {
  config: DraftRoomConfig;
}

export interface NotifyDraftStartedPayload {
  pool: PoolEntry[];
  turnOrder: string[];
}

export interface NotifyPickConfirmedPayload {
  pickRecord: PickRecord;
}

export interface NotifyPoolUpdatedPayload {
  invalidatedIds: string[];
}

export interface NotifyTurnAdvancedPayload {
  currentTurnIndex: number;
  currentRound: number;
  participantId: string;
}

export interface NotifyDraftCompletePayload {
  pickHistory: PickRecord[];
}

// ─── UI state ─────────────────────────────────────────────────────────────────

export type DraftPhase = 'entrance' | 'lobby' | 'configuring' | 'pool-preview' | 'drafting' | 'results';
