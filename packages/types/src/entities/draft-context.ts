export type DraftMode = 'mvp' | 'franchise';
export type DraftOrder = 'snake' | 'linear';

export type NbaPlayer = {
  id: string;
  name: string;
};

export type MvpSeasonEntry = {
  id: string; // e.g. "jordan-1987-88"
  playerId: string; // used for cross-season invalidation
  player: NbaPlayer;
  season: string; // e.g. "1987-88"
  available: boolean;
};

export type FranchiseEntry = {
  id: string; // e.g. "lebron-cavaliers"
  playerId: string; // used for cross-franchise invalidation
  franchiseId: string;
  player: NbaPlayer;
  franchise: string;
  available: boolean;
};

export type PoolEntry = MvpSeasonEntry | FranchiseEntry;

export type Participant = {
  id: string;
  name: string;
  isOrganizer: boolean;
  isConnected: boolean;
};

export type PickRecord = {
  participantId: string;
  pick: PoolEntry;
  round: number;
  turnIndex: number;
  wasAutoPicked: boolean;
};

export type RoomConfig = {
  draftMode: DraftMode;
  draftOrder: DraftOrder;
  maxRounds: number;
  turnDuration: number;
};

export type NbaDraftContext = {
  roomId: string;
  config: RoomConfig;

  participants: Participant[];

  pool: PoolEntry[];

  currentRound: number;
  currentTurnIndex: number;
  turnOrder: string[];

  pickHistory: PickRecord[];
};
