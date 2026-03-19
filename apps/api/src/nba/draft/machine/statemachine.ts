import { actions } from '@/nba/draft/machine/actions';
import { autoPickActor } from '@/nba/draft/machine/actors/auto-pick';
import { timerActor } from '@/nba/draft/machine/actors/timer';
import {
  socketActor,
  SocketActorInput,
} from '@/nba/draft/machine/actors/websocket';
import { guards } from '@/nba/draft/machine/guards';
import { NbaDraftContext, NbaDraftEvent } from '@dribblio/types';
import { createActor, not, or, setup } from 'xstate';

export const createDraftMachine = (socketInfo: SocketActorInput) => {
  const machine = setup({
    types: {
      context: {} as NbaDraftContext,
      events: {} as NbaDraftEvent,
    },
    actions,
    guards,
    actors: {
      timerActor,
      socketActor,
      autoPickActor,
    },
  }).createMachine({
    /** @xstate-layout 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-nkV9bGfKFYEyJg0EmZNyaCrKp+ccoqqXis-IcupIji4i2eIIleG07ScoEljH63t+WK3QP7QOOq-R6vHoULwJo5xfN1IZUZdTPlQKdk7IZwaOXVy5Z7VV8tfZWB1R0BsYAfUbMqQSZa5pAqpjyOaO2BQiDXBaj4RVgVJzKqIP3A+UAh6t0zbiWK45JzrD2o8T5bs7Z8MdpGjMMRpwRBrXWweR9T7n0vvWm+d8H6vngM+X+acs6AI7SSLts14aRAnD4DMOLtS2jBe9blfd97jtblLUSzaPCFyuBuvEaYaR4kSIvAZy8wH4ogivY9O9T3EGYRTVhjpMEQBvQgYRNEfzTknFmTwxiC7hEZdiuctxAgtUJXGx1+5FHoGUao064HIOxQKH+Fl4Q0ysQglFJ9BRylbVTJh8F8bsOEHUGQTxVg75SXA6c9SVp7hgXos8PSZxQiqhGdI+D+xGK-uJfYxxi7OkvOmoEQIq44gbUEbcZaC8zhMTmtsERARjiaenHYuADinFEBcW4jx6BvHgcCNUjThwzRCN0wk20RCUkZHWBhyWLpyCwEgE5y0DsFyfPnNK8Ba1Ig0ZCoWERq9NyZOKEAA */
    id: 'nbaDraft',
    initial: 'lobby',
    invoke: {
      id: 'socket',
      src: 'socketActor',
      input: socketInfo,
    },
    context: {
      roomId: '',
      config: {
        draftMode: 'mvp',
        draftOrder: 'snake',
        maxRounds: 0,
      },
      participants: [],
      pool: [],
      currentRound: 0,
      currentTurnIndex: 0,
      turnOrder: [],
      pickHistory: [],
    },
    on: {
      PARTICIPANT_LEFT: {
        actions: ['removeParticipant', 'notifyParticipantLeft'],
      },
    },
    states: {
      lobby: {
        initial: 'waitingForPlayers',
        states: {
          waitingForPlayers: {
            always: {
              guard: 'minPlayersMet',
              target: 'readyToStart',
            },
            on: {
              ORGANIZER_CONFIGURE: 'configuring',
              PARTICIPANT_JOINED: {
                actions: ['assignParticipant', 'notifyParticipantJoined'],
              },
            },
          },
          configuring: {
            on: {
              SAVE_CONFIG: {
                target: 'waitingForPlayers',
                actions: ['assignConfig', 'notifyConfigSaved'],
              },
            },
          },
          readyToStart: {
            entry: 'notifyReadyToStart',
            on: {
              ORGANIZER_CONFIGURE: 'configuring',
              ORGANIZER_START_DRAFT: {
                target: '#nbaDraft.draft',
                actions: ['assignDraftStart', 'notifyDraftStarted'],
              },
            },
          },
        },
      },
      draft: {
        initial: 'turnInProgress',
        on: {
          ORGANIZER_CANCEL_DRAFT: {
            target: 'lobby',
            actions: 'notifyDraftCancelled',
          },
          PARTICIPANT_DISCONNECTED: {
            actions: [
              'assignParticipantDisconnected',
              'notifyParticipantDisconnected',
            ],
          },
          PARTICIPANT_RECONNECTED: {
            actions: [
              'assignParticipantReconnected',
              'notifyParticipantReconnected',
            ],
          },
        },
        states: {
          turnInProgress: {
            initial: 'awaitingPick',
            states: {
              awaitingPick: {
                invoke: {
                  src: 'timerActor',
                  input: ({ context }) => ({
                    turnDuration: context.config.turnDuration,
                  }),
                },
                on: {
                  SUBMIT_PICK: {
                    target: 'pickMade',
                    actions: ['assignPick', 'notifyPickConfirmed'],
                  },
                  TURN_TIMER_EXPIRED: 'autoPicking',
                },
              },
              autoPicking: {
                invoke: {
                  src: 'autoPickActor',
                  input: ({ context }) => ({
                    pool: context.pool,
                    participantId:
                      context.turnOrder[context.currentTurnIndex],
                    round: context.currentRound,
                  }),
                },
                on: {
                  AUTO_PICK_RESOLVED: {
                    target: 'pickMade',
                    actions: ['assignPick', 'notifyPickConfirmed'],
                  },
                },
              },
              pickMade: {
                type: 'final',
              },
            },
            onDone: {
              target: 'updatingPool',
            },
          },
          updatingPool: {
            initial: 'invalidatingSelections',
            states: {
              invalidatingSelections: {
                entry: ['invalidatePool', 'notifyPoolUpdated'],
                always: { target: 'done' },
              },
              done: {
                type: 'final',
              },
            },
            onDone: {
              target: 'checkingDraftEnd',
            },
          },
          checkingDraftEnd: {
            always: [
              {
                guard: or([not('areRoundsRemaining'), 'isPoolEmpty']),
                target: 'draftComplete',
              },
              {
                target: 'advancingTurn',
              },
            ],
          },
          advancingTurn: {
            entry: ['advanceTurn', 'notifyTurnAdvanced'],
            always: {
              target: 'turnInProgress',
            },
          },
          draftComplete: {
            type: 'final',
            entry: 'notifyDraftComplete',
          },
        },
        onDone: {
          target: 'results',
        },
      },
      results: {
        initial: 'viewingTeams',
        states: {
          viewingTeams: {
            on: {
              ROOM_CLOSED: '#nbaDraft.closed',
            },
          },
        },
      },
      closed: {
        type: 'final',
      },
    },
  });

  return createActor(machine).start();
};
