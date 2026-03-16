import { DraftRoomConfig, Participant, PickRecord, PoolEntry } from '../entities';

export type NotifyParticipantJoined = {
  type: 'NOTIFY_PARTICIPANT_JOINED';
  participant: Participant;
  participants: Participant[];
};

export type NotifyParticipantLeft = {
  type: 'NOTIFY_PARTICIPANT_LEFT';
  participantId: string;
};

export type NotifyConfigSaved = {
  type: 'NOTIFY_CONFIG_SAVED';
  config: DraftRoomConfig;
  pool: PoolEntry[];
};

export type NotifyReadyToStart = {
  type: 'NOTIFY_READY_TO_START';
};

export type NotifyDraftStarted = {
  type: 'NOTIFY_DRAFT_STARTED';
  pool: PoolEntry[];
  turnOrder: string[];
};

export type NotifyDraftCancelled = {
  type: 'NOTIFY_DRAFT_CANCELLED';
};

export type NotifyPickConfirmed = {
  type: 'NOTIFY_PICK_CONFIRMED';
  pickRecord: PickRecord;
};

export type NotifyPoolUpdated = {
  type: 'NOTIFY_POOL_UPDATED';
  invalidatedIds: string[];
};

export type NotifyTurnAdvanced = {
  type: 'NOTIFY_TURN_ADVANCED';
  currentTurnIndex: number;
  currentRound: number;
  participantId: string;
};

export type NotifyParticipantDisconnected = {
  type: 'NOTIFY_PARTICIPANT_DISCONNECTED';
  participantId: string;
};

export type NotifyParticipantReconnected = {
  type: 'NOTIFY_PARTICIPANT_RECONNECTED';
  participantId: string;
};

export type NotifyDraftComplete = {
  type: 'NOTIFY_DRAFT_COMPLETE';
  pickHistory: PickRecord[];
};

export type DraftSocketActorEvent =
  | NotifyParticipantJoined
  | NotifyParticipantLeft
  | NotifyConfigSaved
  | NotifyReadyToStart
  | NotifyDraftStarted
  | NotifyDraftCancelled
  | NotifyPickConfirmed
  | NotifyPoolUpdated
  | NotifyTurnAdvanced
  | NotifyParticipantDisconnected
  | NotifyParticipantReconnected
  | NotifyDraftComplete;
