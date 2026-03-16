import { fromCallback } from 'xstate';

type TimerActorInput = {
  turnDuration: number | undefined;
};

type TimerActorEvent = { type: 'CANCEL_TIMER' };

export const timerActor = fromCallback<TimerActorEvent, TimerActorInput>(
  ({ input, sendBack }) => {
    const { turnDuration } = input;

    // When turnDuration is undefined the organizer has not set a turn time
    // limit, so the timer actor idles without scheduling a timeout.
    if (turnDuration === undefined) {
      return () => {};
    }

    const timeout = setTimeout(() => {
      sendBack({ type: 'TURN_TIMER_EXPIRED' });
    }, turnDuration);

    return () => {
      clearTimeout(timeout);
    };
  },
);
