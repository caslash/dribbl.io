import { fromCallback } from 'xstate';

type TimerActorInput = {
  turnDuration: number;
};

type TimerActorEvent = { type: 'CANCEL_TIMER' };

type TimerActorEmitted = { type: 'TURN_TIMER_EXPIRED' };

export const timerActor = fromCallback<TimerActorEvent, TimerActorInput>(
  ({ input, sendBack, receive }) => {
    const { turnDuration } = input;

    const timeout = setTimeout(() => {
      sendBack({ type: 'TURN_TIMER_EXPIRED' });
    }, turnDuration);

    receive((event) => {
      if (event.type === 'CANCEL_TIMER') {
        clearTimeout(timeout);
      }
    });

    return () => {
      clearTimeout(timeout);
    };
  },
);
