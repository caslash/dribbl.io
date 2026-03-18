import { createDraftMachine } from '@/nba/draft/machine/statemachine';
import { DraftOrder, Participant } from '@dribblio/types';
import { Injectable } from '@nestjs/common';
import ShortUniqueId from 'short-unique-id';
import { Server } from 'socket.io';

const uid = new ShortUniqueId({ length: 5, dictionary: 'alphanum_upper' });

@Injectable()
export class DraftService {
  private readonly rooms = new Map<
    string,
    ReturnType<typeof createDraftMachine>
  >();

  createRoom(io: Server): string {
    const roomId = uid.randomUUID();

    const actor = createDraftMachine({ io, roomId });

    actor.subscribe((state) => {
      if (state.status === 'done') {
        this.destroyRoom(roomId);
      }
    });

    console.log(`[DraftService] Creating room: ${roomId}`);

    this.rooms.set(roomId, actor);
    return roomId;
  }

  getRoom(roomId: string): ReturnType<typeof createDraftMachine> | undefined {
    return this.rooms.get(roomId);
  }

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

  destroyRoom(roomId: string) {
    const actor = this.rooms.get(roomId);

    if (actor) {
      actor.stop();
      this.rooms.delete(roomId);
      console.log(`[DraftService] Room destroyed: ${roomId}`);
    }
  }
}
