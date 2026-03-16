import { NbaDraftContext, NbaDraftEvent, PickRecord } from '@dribblio/types';
import { assertEvent, assign } from 'xstate';

const draftAssign = assign<
  NbaDraftContext,
  NbaDraftEvent,
  undefined,
  NbaDraftEvent,
  never
>;

const assignConfig = draftAssign(({ event }) => {
  assertEvent(event, 'SAVE_CONFIG');
  return { config: event.config, pool: event.pool };
});

const assignDraftStart = draftAssign(({ event }) => {
  assertEvent(event, 'ORGANIZER_START_DRAFT');
  return {
    pool: event.pool,
    turnOrder: event.turnOrder,
    currentRound: 1,
    currentTurnIndex: 0,
    pickHistory: [],
  };
});

const assignPick = draftAssign(({ context, event }) => {
  assertEvent(event, ['SUBMIT_PICK', 'AUTO_PICK_RESOLVED']);
  const pickRecord: PickRecord = {
    participantId: event.pickRecord.participantId,
    entryId: event.pickRecord.entryId,
    round: event.pickRecord.round,
    pickNumber: context.pickHistory.length + 1,
  };
  return { pickHistory: [...context.pickHistory, pickRecord] };
});

const assignPool = draftAssign(({ context, event }) => {
  assertEvent(event, 'POOL_UPDATED');
  return {
    pool: context.pool.map((entry) =>
      event.invalidatedIds.has(entry.entryId)
        ? { ...entry, available: false }
        : entry,
    ),
  };
});

const advanceTurn = draftAssign(({ context }) => ({
  currentRound:
    Math.floor(context.currentTurnIndex / context.participants.length) + 1,
  currentTurnIndex: context.currentTurnIndex + 1,
}));

const assignParticipant = draftAssign(({ context, event }) => {
  assertEvent(event, 'PARTICIPANT_JOINED');
  return { participants: [...context.participants, event.participant] };
});

const removeParticipant = draftAssign(({ context, event }) => {
  assertEvent(event, 'PARTICIPANT_LEFT');
  return {
    participants: context.participants.filter(
      (p) => p.participantId !== event.participantId,
    ),
  };
});

const assignParticipantDisconnected = draftAssign(({ context, event }) => {
  assertEvent(event, 'PARTICIPANT_DISCONNECTED');
  return {
    participants: context.participants.map((p) =>
      p.participantId === event.participantId ? { ...p, isConnected: false } : p,
    ),
  };
});

const assignParticipantReconnected = draftAssign(({ context, event }) => {
  assertEvent(event, 'PARTICIPANT_RECONNECTED');
  return {
    participants: context.participants.map((p) =>
      p.participantId === event.participantId ? { ...p, isConnected: true } : p,
    ),
  };
});

export const assignActions = {
  assignConfig,
  assignDraftStart,
  assignPick,
  assignPool,
  advanceTurn,
  assignParticipant,
  removeParticipant,
  assignParticipantDisconnected,
  assignParticipantReconnected,
};
