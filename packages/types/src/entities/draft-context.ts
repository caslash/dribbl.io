export type DraftMode = 'mvp' | 'franchise';
export type DraftOrder = 'snake' | 'linear';

export type DraftRoomConfig = {
  draftMode: DraftMode;
  draftOrder: DraftOrder;
  maxRounds: number;
  /** Duration in seconds. Undefined means no timer. */
  turnDuration?: number;
};

export type MvpPoolEntry = {
  entryId: string;
  draftMode: 'mvp';
  playerId: number;
  playerName: string;
  season: string;
  ptsPg: number | null;
  astPg: number | null;
  rebPg: number | null;
  /** Used internally by the machine to track availability. Not sent to clients. */
  available?: boolean;
};

export type FranchisePoolEntry = {
  entryId: string;
  draftMode: 'franchise';
  playerId: number;
  playerName: string;
  franchiseName: string;
  franchiseAbbr: string;
  /** Used internally by the machine to track availability. Not sent to clients. */
  available?: boolean;
};

export type PoolEntry = MvpPoolEntry | FranchisePoolEntry;

export type Participant = {
  participantId: string;
  name: string;
  isOrganizer: boolean;
  /** Used internally by the machine. Not sent over the wire. */
  isConnected?: boolean;
};

export type PickRecord = {
  participantId: string;
  entryId: string;
  round: number;
  pickNumber: number;
};

export type NbaDraftContext = {
  roomId: string;
  config: DraftRoomConfig;
  participants: Participant[];
  pool: PoolEntry[];
  currentRound: number;
  currentTurnIndex: number;
  turnOrder: string[];
  pickHistory: PickRecord[];
};
