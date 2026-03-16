import { socketActor } from '@/nba/draft/machine/actors/websocket';
import {
  NbaDraftContext,
  NbaDraftEvent,
  ParticipantDisconnectedEvent,
  ParticipantJoinedEvent,
  ParticipantLeftEvent,
  ParticipantReconnectedEvent,
  PoolUpdatedEvent,
} from '@dribblio/types';
import { ActorRefFrom, sendTo } from 'xstate';

type SocketRef = ActorRefFrom<typeof socketActor>;

const sendToSocket = sendTo<
  NbaDraftContext,
  NbaDraftEvent,
  undefined,
  SocketRef,
  NbaDraftEvent
>;

const notifyParticipantJoined = sendToSocket('socket', ({ context, event }) => ({
  type: 'NOTIFY_PARTICIPANT_JOINED',
  participant: (event as ParticipantJoinedEvent).participant,
  participants: context.participants,
}));

const notifyParticipantLeft = sendToSocket('socket', ({ event }) => ({
  type: 'NOTIFY_PARTICIPANT_LEFT',
  participantId: (event as ParticipantLeftEvent).participantId,
}));

const notifyConfigSaved = sendToSocket('socket', ({ context }) => ({
  type: 'NOTIFY_CONFIG_SAVED',
  config: context.config,
  pool: context.pool,
}));

const notifyReadyToStart = sendToSocket('socket', () => ({
  type: 'NOTIFY_READY_TO_START',
}));

const notifyDraftStarted = sendToSocket('socket', ({ context }) => ({
  type: 'NOTIFY_DRAFT_STARTED',
  pool: context.pool,
  turnOrder: context.turnOrder,
}));

const notifyDraftCancelled = sendToSocket('socket', () => ({
  type: 'NOTIFY_DRAFT_CANCELLED',
}));

const notifyPickConfirmed = sendToSocket('socket', ({ context }) => ({
  type: 'NOTIFY_PICK_CONFIRMED',
  pickRecord: context.pickHistory[context.pickHistory.length - 1],
}));

const notifyPoolUpdated = sendToSocket('socket', ({ event }) => ({
  type: 'NOTIFY_POOL_UPDATED',
  invalidatedIds: [...(event as PoolUpdatedEvent).invalidatedIds],
}));

const notifyTurnAdvanced = sendToSocket('socket', ({ context }) => ({
  type: 'NOTIFY_TURN_ADVANCED',
  currentTurnIndex: context.currentTurnIndex,
  currentRound: context.currentRound,
  participantId: context.turnOrder[context.currentTurnIndex],
}));

const notifyParticipantDisconnected = sendToSocket('socket', ({ event }) => ({
  type: 'NOTIFY_PARTICIPANT_DISCONNECTED',
  participantId: (event as ParticipantDisconnectedEvent).participantId,
}));

const notifyParticipantReconnected = sendToSocket('socket', ({ event }) => ({
  type: 'NOTIFY_PARTICIPANT_RECONNECTED',
  participantId: (event as ParticipantReconnectedEvent).participantId,
}));

const notifyDraftComplete = sendToSocket('socket', ({ context }) => ({
  type: 'NOTIFY_DRAFT_COMPLETE',
  pickHistory: context.pickHistory,
}));

export const notifyActions = {
  notifyParticipantJoined,
  notifyParticipantLeft,
  notifyConfigSaved,
  notifyReadyToStart,
  notifyDraftStarted,
  notifyDraftCancelled,
  notifyPickConfirmed,
  notifyPoolUpdated,
  notifyTurnAdvanced,
  notifyParticipantDisconnected,
  notifyParticipantReconnected,
  notifyDraftComplete,
};
