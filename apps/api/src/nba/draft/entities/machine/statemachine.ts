import { actions } from '@/nba/draft/entities/machine/actions';
import { timerActor } from '@/nba/draft/entities/machine/actors/timer';
import {
  socketActor,
  SocketActorInput,
} from '@/nba/draft/entities/machine/actors/websocket';
import { NbaDraftContext } from '@/nba/draft/entities/machine/context';
import { NbaDraftEvent } from '@/nba/draft/entities/machine/events/inbound';
import { guards } from '@/nba/draft/entities/machine/guards';
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
    },
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QDsBGBDAIgJ3QMwBcA6AGwHtVUBPIgd3QEsCHkoAxM7ABRPSrGywAxAHkASgHEAggDkAkgC0AomID6AYREy2ciQFUxSgNoAGALqJQABzKwmDMsksgAHogBMATgAcRACzuXiYAjJ4AbADMngDsfhHRADQgVIhxvsFeAKzuJpnefsEhngC+xUloWLiEpBTUdIzMrBzcvPyCQgCycjKqXAAyUgCaKgDKqh1KACqmFkggNnbMjs5uCBF5RNHB3hFh7t6ZfgVhicmIYT5EEe6ZkSHBcSY7peUYOPjE5JQ09PZNnDw+AJhFwpGJJnJ1HJQTJJqoAFIibpKTAzZwLezLOarYLbK7ebb7TKZB7uaIRJIpBDRclEDJhE4REInQ5hF4gCrvapfOq-RrsAGtYFCUHgyHQ2RwvpKNjTczo2yYpzYxAPIiZGJpDXkrzuI6UxAakxEbwmTwFTJbM1HaLszlVT61GgAY0ceAYUAArtgWFAhCMpAA1JQaLQ6CRouYYpbK0CrHa+CLeaLuYLZbz7TwZA1rQ7qy0RQvZFPRTyZO1vB01b5EbBgdAQKiTMgjAjobAEEUDYZqaWyyPWRUxlaGg5EJ7HUuFMnRTI5vbBIhl02z4Klrw0iuVD7Vup1htNlttjuiSSyRQqUPaXQGYzyqNDhyx1znEwROm4t8EvYmFk5w6ZEQOSxJk8SRDEXhblyjo1vujbNq27aduI0jyMoagjJMYJwpgYhSP296DosT4jgga6pv4ZJ+CYfi3ABhw5oUIRLjRNFkmmfhhMSUFVhADpCBAjhgEQsBtgQwn2jufEfAO8yPlicYeF4fgmqaJJcfs8QUmcCDhNEmzRLk4TrAyMTeDxUn8Sh57oRosjqEofSqLh+FyrMRFKqRP7jrOnFhN4PhktkjEhO+v45BcYTWhEuIWdU0mECK2HijCOFyCMmgyDISjqJMKKydGJEqmRhS+LRZqgbkeQ0SFJj6cEMUBdEpoPIWwRxcQCWdqKEJQqlqiGJl2W5flhFycRCkvmRRyeOOATWmaYRHMFOlMYunisQEWystxZQcpWlk7gQ3rIHIyBcNgZBQHWsDCIJyDCaJ6DiUQknxVWx3YKd52XddcCwAV8nPjiGplbipqprsTxLYxRwqfk3jJtEXEo+1e1vZ1H0nWdF1XTdsBEOgfK+lwDDOgA1v6egAEJdHCXCQgA0oDE3A4gLUmn4nheMunFMu4sPEnSgTXNz7EaR1RBdUQn3fbjf23YTxOsKTFNCJMBg9BCExqEoAAaDOGKiY2FZN8bMfk3OeLzdwC6thYqfE7jXPzexc34kvS7LOO-fjhOegQZCq+TvpCFIeiTCIvRMwNSgjCIfTBsb7njZ5xW4hc-ixDFoTGesc727iRBLZa-lMpaprmejB3vTunpWBAz0k2QZAkAJQkiWJEk15jdcN03KstyQLNp4pCCBOaqm5MEGk7OSfiw0cnOIzSKO3GjrzbrX1T143-JcEPRAsAAbugJAMHvvojGAJBgM6MYgiICeqHoXCYFIeXJwqrOkaElrjjsSIpYszJm5rDKIJoUzuBRltUsnsqzOgABZ3xDqwaCShkAQCECPYcxVvBRXHEmJkAQfChUYlmfSlpMgmGhgyGkAR4E7iQSg306DMHYOCCnU2bMEAaSXGSTwhYdg3BOHbKkoQ1zqlnDQ-BdCQKMOqA2U+yBnS+kmCdbBJsgakVASadYhJBEbWoZ4Ri-lAKCJotRX8oEtge2rlvYgN1PQkAIATY+DAwC0DUfWAAtsIMQT8OgaD6CIEYo0uHaOKjcf+fNOJphntsWiOZYj6TfDcXEzt-JlhKHaMgEA4DOAxt-UeU0AC0BJ-AmBEQ8KpJw6phEYtcfMOoYjI3wY1SWPIqQeVwWPUphZKnVOotAwys4Gk6RGeOAsnFqG7ERhEOxm9oK7h+A0X0zRARtHgA+H+6cbjF1XoI8kGY6nBHnFmcchQojxFxLcWInSnREFdMgd0XofSsGKb0qaQClxrgWSQsI8TThUjSMLMs2R-IXFiFXJZVYum1nrPBI8SFPlFTHlxFSNEywCJJLkZ25zFwhDfICqK+DzRsnscsrqqKzaGjNFPQ4NImVRV-IxBqYRi60StCmPIgKYX7QcVLLGX0fZ43+jSnhxJ9KI1yH4Jlq8QiMUCCpB4lpdSpktM1BRxBvY-TFYrImayVZk3JhKryuQGVyvlVFM59t9l7GdtsQRfhTR1W1TLbGeqFYE3QAHIOJrfRmvTlU2aEMjjKr0rcRpCzIHO2drUvU5p3W6vln7KwJqOgNjAEGseNT3BXCWuaOqGqAoL3tgUICiNrbJm2HVJ47rd4DygAfVuOapozzLAA3YXFiRxBmo07IVwUzdtnIcGeDb+770PifM+F8m3X1vvfJ82yelovbdnLtDJiSHH+SY1afNxw+AzMS64cr+UYyFX3S+g9W5SyEm21YkNfDRJJLcmkuJgWqjicvUsZLkYuvPT3S91RmEU1YQ6DBEAH3syaQET8M8nhZmtuQhklyaHOwzJmClsLDqKIgMo1RrB1FfWgwgYRxdzTbDXCGwFBdxHI3fGmWI04jSpmwwKqlvEHTqDID4qwt9xKkauSpK08RyoFB2OQtUdVqGIZ8MSfyksnEuJXanL5j7Aj5vNEyM0QilplqpFxWaoFE19q0rRJTcBnGuKIO4zx3j0B+NI4EQyS5Hi6aTPp5JcrCHpIyHM8IktnTkFgJAZzlpHY0lAltCNYjzgDJngFQsNxEYkltKUYoQA */
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
        turnDuration: 0,
      },
      participants: [],
      pool: [],
      currentRound: 0,
      currentTurnIndex: 0,
      turnOrder: [],
      pickHistory: [],
    },
    states: {
      lobby: {
        initial: 'waitingForPlayers',
        states: {
          waitingForPlayers: {
            on: {
              ORGANIZER_CONFIGURE: 'configuring',
              MIN_PLAYERS_MET: 'readyToStart',
              PARTICIPANT_JOINED: { actions: 'assignParticipant' },
              PARTICIPANT_LEFT: { actions: 'removeParticipant' },
            },
          },
          configuring: {
            on: {
              SAVE_CONFIG: {
                target: 'waitingForPlayers',
                actions: 'assignConfig',
              },
            },
          },
          readyToStart: {
            on: {
              PLAYER_LEFT: 'waitingForPlayers',
              ORGANIZER_CONFIGURE: 'configuring',
              ORGANIZER_START_DRAFT: {
                target: '#nbaDraft.draft',
                actions: 'assignDraftStart',
              },
            },
          },
        },
      },
      draft: {
        initial: 'turnInProgress',
        on: {
          ORGANIZER_CANCEL_DRAFT: { target: 'lobby' },
          PARTICIPANT_DISCONNECTED: {
            actions: 'assignParticipantDisconnected',
          },
          PARTICIPANT_RECONNECTED: { actions: 'assignParticipantReconnected' },
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
                  SUBMIT_PICK: { target: 'pickMade', actions: 'assignPick' },
                  TURN_TIMER_EXPIRED: 'autoPicking',
                },
              },
              autoPicking: {
                on: {
                  AUTO_PICK_RESOLVED: {
                    target: 'pickMade',
                    actions: 'assignPick',
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
                on: {
                  POOL_UPDATED: {
                    target: 'done',
                    actions: 'assignPool',
                  },
                },
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
            entry: 'advanceTurn',
            always: {
              target: 'turnInProgress',
            },
          },
          draftComplete: {
            type: 'final',
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
