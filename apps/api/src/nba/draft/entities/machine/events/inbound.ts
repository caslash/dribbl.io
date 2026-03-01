import {
  Participant,
  PickRecord,
  PoolEntry,
  RoomConfig,
} from '@/nba/draft/entities/machine/context';

type ParticipantJoinedEvent = {
  type: 'PARTICIPANT_JOINED';
  participant: Participant;
};

type ParticipantLeftEvent = {
  type: 'PARTICIPANT_LEFT';
  participantId: string;
};

type OrganizerConfigureEvent = {
  type: 'ORGANIZER_CONFIGURE';
};

type SaveConfigEvent = {
  type: 'SAVE_CONFIG';
  config: RoomConfig;
};

type MinPlayersMetEvent = {
  type: 'MIN_PLAYERS_MET';
};

type PlayerLeftEvent = {
  type: 'PLAYER_LEFT';
};

type OrganizerStartDraftEvent = {
  type: 'ORGANIZER_START_DRAFT';
  pool: PoolEntry[];
  turnOrder: string[];
};

type OrganizerCancelDraftEvent = {
  type: 'ORGANIZER_CANCEL_DRAFT';
};

type SubmitPickEvent = {
  type: 'SUBMIT_PICK';
  pickRecord: PickRecord;
};

type TurnTimerExpiredEvent = {
  type: 'TURN_TIMER_EXPIRED';
};

type ParticipantDisconnectedEvent = {
  type: 'PARTICIPANT_DISCONNECTED';
  participantId: string;
};

type ParticipantReconnectedEvent = {
  type: 'PARTICIPANT_RECONNECTED';
  participantId: string;
};

type AutoPickResolvedEvent = {
  type: 'AUTO_PICK_RESOLVED';
  pick: PickRecord;
};

type PoolUpdatedEvent = {
  type: 'POOL_UPDATED';
  invalidatedIds: Set<string>;
};

type RoomClosedEvent = {
  type: 'ROOM_CLOSED';
};

export type NbaDraftEvent =
  | ParticipantJoinedEvent
  | ParticipantLeftEvent
  | OrganizerConfigureEvent
  | SaveConfigEvent
  | MinPlayersMetEvent
  | PlayerLeftEvent
  | OrganizerStartDraftEvent
  | OrganizerCancelDraftEvent
  | SubmitPickEvent
  | TurnTimerExpiredEvent
  | ParticipantDisconnectedEvent
  | ParticipantReconnectedEvent
  | AutoPickResolvedEvent
  | PoolUpdatedEvent
  | RoomClosedEvent;
