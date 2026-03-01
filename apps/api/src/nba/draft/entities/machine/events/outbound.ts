import {
  Participant,
  PickRecord,
  PoolEntry,
  RoomConfig,
} from '@/nba/draft/entities/machine/context';

type NotifyParticipantJoined = {
  type: 'NOTIFY_PARTICIPANT_JOINED';
  participant: Participant;
};

type NotifyParticipantLeft = {
  type: 'NOTIFY_PARTICIPANT_LEFT';
  participantId: string;
};

type NotifyConfigSaved = {
  type: 'NOTIFY_CONFIG_SAVED';
  config: RoomConfig;
};

type NotifyDraftStarted = {
  type: 'NOTIFY_DRAFT_STARTED';
  pool: PoolEntry[];
  turnOrder: string[];
};

type NotifyDraftCancelled = {
  type: 'NOTIFY_DRAFT_CANCELLED';
};

type NotifyPickConfirmed = {
  type: 'NOTIFY_PICK_CONFIRMED';
  pickRecord: PickRecord;
};

type NotifyPoolUpdated = {
  type: 'NOTIFY_POOL_UPDATED';
  invalidatedIds: string[];
};

type NotifyTurnAdvanced = {
  type: 'NOTIFY_TURN_ADVANCED';
  currentTurnIndex: number;
  currentRound: number;
  participantId: string;
};

type NotifyAutoPickResolved = {
  type: 'NOTIFY_AUTO_PICK_RESOLVED';
  pickRecord: PickRecord;
};

type NotifyParticipantDisconnected = {
  type: 'NOTIFY_PARTICIPANT_DISCONNECTED';
  participantId: string;
};

type NotifyParticipantReconnected = {
  type: 'NOTIFY_PARTICIPANT_RECONNECTED';
  participantId: string;
};

type NotifyDraftComplete = {
  type: 'NOTIFY_DRAFT_COMPLETE';
  pickHistory: PickRecord[];
};

export type SocketActorEvent =
  | NotifyParticipantJoined
  | NotifyParticipantLeft
  | NotifyConfigSaved
  | NotifyDraftStarted
  | NotifyDraftCancelled
  | NotifyPickConfirmed
  | NotifyPoolUpdated
  | NotifyTurnAdvanced
  | NotifyAutoPickResolved
  | NotifyParticipantDisconnected
  | NotifyParticipantReconnected
  | NotifyDraftComplete;
