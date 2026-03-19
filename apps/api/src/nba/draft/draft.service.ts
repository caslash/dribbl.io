import { createDraftMachine } from '@/nba/draft/machine/statemachine';
import { DraftOrder, Participant } from '@dribblio/types';
import { Injectable } from '@nestjs/common';
import ShortUniqueId from 'short-unique-id';
import { Server } from 'socket.io';
import { Subscription } from 'xstate';

const uid = new ShortUniqueId({ length: 5, dictionary: 'alphanum_upper' });

/** Maximum number of concurrent draft rooms allowed. */
const MAX_ROOMS = 50;

/**
 * Manages the lifecycle of active draft rooms and their XState actors.
 *
 * @example
 * const roomId = draftService.createRoom(io);
 * draftService.getRoom(roomId)?.send({ type: 'PARTICIPANT_JOINED', ... });
 */
@Injectable()
export class DraftService {
  private readonly rooms = new Map<
    string,
    ReturnType<typeof createDraftMachine>
  >();

  private readonly subscriptions = new Map<string, Subscription>();

  /** Optional callback invoked when a room is destroyed (for external cleanup). */
  onRoomDestroyed?: (roomId: string) => void;

  /**
   * Creates a new draft room, starts its XState actor, and registers a
   * subscription to auto-destroy the room when the machine reaches a final state.
   *
   * @param io - The Socket.io server instance.
   * @returns The newly created room ID.
   * @throws {Error} When the room limit has been reached.
   */
  createRoom(io: Server): string {
    if (this.rooms.size >= MAX_ROOMS) {
      throw new Error('Room limit reached. Try again later.');
    }

    const roomId = uid.randomUUID();

    const actor = createDraftMachine({ io, roomId });

    const subscription = actor.subscribe((state) => {
      if (state.status === 'done') {
        this.destroyRoom(roomId);
      }
    });

    this.subscriptions.set(roomId, subscription);
    this.rooms.set(roomId, actor);
    return roomId;
  }

  /**
   * Retrieves the running XState actor for a given room.
   *
   * @param roomId - The room ID to look up.
   * @returns The actor instance, or `undefined` if the room does not exist.
   */
  getRoom(roomId: string): ReturnType<typeof createDraftMachine> | undefined {
    return this.rooms.get(roomId);
  }

  /**
   * Computes the ordered list of participant IDs for the full draft, expanded
   * across all rounds according to the specified draft order.
   *
   * @param participants - The participants in their initial seeding order.
   * @param draftOrder - Either `'snake'` or `'linear'`.
   * @param maxRounds - The total number of rounds in the draft.
   * @returns A flat array of participant IDs representing the turn order.
   *
   * @example
   * // Linear, 2 participants, 3 rounds → [A, B, A, B, A, B]
   * computeTurnOrder([{ participantId: 'A' }, { participantId: 'B' }], 'linear', 3);
   */
  computeTurnOrder(
    participants: Participant[],
    draftOrder: DraftOrder,
    maxRounds: number,
  ): string[] {
    const ids = participants.map((p) => p.participantId);

    switch (draftOrder) {
      case 'snake':
        return this.snake(ids, maxRounds);
      case 'linear':
      default:
        return this.linear(ids, maxRounds);
    }
  }

  private linear(ids: string[], maxRounds: number): string[] {
    return Array.from({ length: maxRounds }, () => ids).flat();
  }

  private snake(ids: string[], maxRounds: number): string[] {
    return Array.from({ length: maxRounds }, (_, round) =>
      round % 2 === 0 ? ids : [...ids].reverse(),
    ).flat();
  }

  /**
   * Stops the XState actor for a room, cleans up its subscription, and
   * removes it from the active rooms map.
   *
   * @param roomId - The room ID to destroy.
   */
  destroyRoom(roomId: string) {
    const actor = this.rooms.get(roomId);

    if (actor) {
      this.subscriptions.get(roomId)?.unsubscribe();
      this.subscriptions.delete(roomId);
      actor.stop();
      this.rooms.delete(roomId);
      this.onRoomDestroyed?.(roomId);
    }
  }
}
