import { DraftRoomConfig, Participant, PickRecord, PoolEntry } from '../entities';

export type ParticipantJoinedEvent = {
  type: 'PARTICIPANT_JOINED';
  participant: Participant;
};

export type ParticipantLeftEvent = {
  type: 'PARTICIPANT_LEFT';
  participantId: string;
};

export type OrganizerConfigureEvent = {
  type: 'ORGANIZER_CONFIGURE';
};

export type SaveDraftConfigEvent = {
  type: 'SAVE_CONFIG';
  config: DraftRoomConfig;
};

export type OrganizerStartDraftEvent = {
  type: 'ORGANIZER_START_DRAFT';
  pool: PoolEntry[];
  turnOrder: string[];
};

export type OrganizerCancelDraftEvent = {
  type: 'ORGANIZER_CANCEL_DRAFT';
};

export type SubmitPickEvent = {
  type: 'SUBMIT_PICK';
  pickRecord: PickRecord;
};

export type TurnTimerExpiredEvent = {
  type: 'TURN_TIMER_EXPIRED';
};

export type ParticipantDisconnectedEvent = {
  type: 'PARTICIPANT_DISCONNECTED';
  participantId: string;
};

export type ParticipantReconnectedEvent = {
  type: 'PARTICIPANT_RECONNECTED';
  participantId: string;
};

export type AutoPickResolvedEvent = {
  type: 'AUTO_PICK_RESOLVED';
  pickRecord: PickRecord;
};

export type PoolUpdatedEvent = {
  type: 'POOL_UPDATED';
  invalidatedIds: Set<string>;
};

export type RoomClosedEvent = {
  type: 'ROOM_CLOSED';
};

export type NbaDraftEvent =
  | ParticipantJoinedEvent
  | ParticipantLeftEvent
  | OrganizerConfigureEvent
  | SaveDraftConfigEvent
  | OrganizerStartDraftEvent
  | OrganizerCancelDraftEvent
  | SubmitPickEvent
  | TurnTimerExpiredEvent
  | ParticipantDisconnectedEvent
  | ParticipantReconnectedEvent
  | AutoPickResolvedEvent
  | PoolUpdatedEvent
  | RoomClosedEvent;
