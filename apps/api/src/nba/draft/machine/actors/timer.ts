import { fromCallback } from 'xstate';

type TimerActorInput = {
  turnDuration: number;
};

type TimerActorEvent = { type: 'CANCEL_TIMER' };

export const timerActor = fromCallback<TimerActorEvent, TimerActorInput>(
  ({ input, sendBack }) => {
    const { turnDuration } = input;

    const timeout = setTimeout(() => {
      sendBack({ type: 'TURN_TIMER_EXPIRED' });
    }, turnDuration);

    return () => {
      clearTimeout(timeout);
    };
  },
);
