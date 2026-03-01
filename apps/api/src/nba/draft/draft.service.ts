import { createDraftMachine } from '@/nba/draft/machine/statemachine';
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

    this.rooms.set(roomId, actor);

    return roomId;
  }

  getRoom(roomId: string): ReturnType<typeof createDraftMachine> | undefined {
    return this.rooms.get(roomId);
  }

  private destroyRoom(roomId: string) {
    const actor = this.rooms.get(roomId);

    if (actor) {
      actor.stop();
      this.rooms.delete(roomId);
    }
  }
}
