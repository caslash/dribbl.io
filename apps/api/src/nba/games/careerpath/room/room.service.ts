import { CareerPathGateway } from '@/nba/games/careerpath/careerpath.gateway';
import { RoomFactory } from '@/nba/games/careerpath/room/factory.service';
import { MultiplayerConfig, Room, SinglePlayerConfig, User } from '@dribblio/types';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import ShortUniqueId from 'short-unique-id';
import { Socket } from 'socket.io';

const uid = new ShortUniqueId({ length: 5, dictionary: 'alpha_upper' });

@Injectable()
export class RoomService {
  private rooms: Record<string, Room> = {};

  constructor(
    @Inject(forwardRef(() => CareerPathGateway))
    private gateway: CareerPathGateway,
    private roomFactory: RoomFactory,
  ) {}

  createRoom(
    isMulti: boolean,
    socket: Socket,
    userName: string,
    config: MultiplayerConfig | SinglePlayerConfig,
  ): Room {
    const roomId: string = this.generateUniqueCode();

    if (!this.rooms[roomId]) {
      this.rooms[roomId] = isMulti
        ? this.roomFactory.createMultiplayerRoom(socket, roomId, config as MultiplayerConfig)
        : this.roomFactory.createSinglePlayerRoom(socket, config as SinglePlayerConfig);
    }

    console.log(`Game machine created for room ${roomId}`);

    this.joinRoom(socket, roomId, userName);

    return this.rooms[roomId];
  }

  destroyRoom(id: string) {
    delete this.rooms[id];
    console.log(`Room destroyed for room ${id}`);
  }

  joinRoom(socket: Socket, id: string, userName: string): void {
    if (!this.rooms[id]) return;

    socket.join(id);

    this.roomFactory.setUpListenersOnJoin(socket, this.rooms[id]);

    this.rooms[id] = {
      ...this.rooms[id],
      users: [...this.rooms[id].users, { id: socket.id, name: userName }],
    };

    const { ...room } = this.rooms[id];

    this.gateway.server.to(id).emit('room_updated', room);
  }

  leaveRoom(roomId: string, userId: string): void {
    let room: Room = this.rooms[roomId];

    if (room) {
      room = {
        ...room,
        users: [...room.users.filter((user: User) => user.id !== userId)],
      };

      if (!room.users.some((user: User) => user)) {
        this.destroyRoom(roomId);
      } else {
        this.gateway.server.to(roomId).emit('room_updated', room);
      }
    }
  }

  generateUniqueCode(): string {
    const roomId = uid.randomUUID();
    if (roomId in this.rooms) {
      return this.generateUniqueCode();
    }

    return roomId;
  }
}
