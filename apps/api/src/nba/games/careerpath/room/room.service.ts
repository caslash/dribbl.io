import { MultiplayerGateway } from '@/nba/games/careerpath/multiplayer.gateway';
import { RoomFactory } from '@/nba/games/careerpath/room/factory.service';
import { UsersService } from '@/users/users.service';
import { users } from '@dribblio/database';
import {
  HostRoomMessageBody,
  JoinRoomMessageBody,
  Room,
  SinglePlayerConfig,
} from '@dribblio/types';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import ShortUniqueId from 'short-unique-id';
import { Socket } from 'socket.io';

const uid = new ShortUniqueId({ length: 5, dictionary: 'alpha_upper' });

@Injectable()
export class RoomService {
  private rooms: Record<string, Room> = {};

  constructor(
    @Inject(forwardRef(() => MultiplayerGateway))
    private gateway: MultiplayerGateway,
    private roomFactory: RoomFactory,
    private usersService: UsersService,
  ) {}

  async createSinglePlayerRoom(socket: Socket, config: SinglePlayerConfig): Promise<Room> {
    const roomId: string = this.generateUniqueCode();

    if (!this.rooms[roomId]) {
      this.rooms[roomId] = this.roomFactory.createSinglePlayerRoom(socket, config);
    }

    console.log(`Single player room created for room ${roomId}`);

    await this.joinRoom(socket, { roomId, userId: socket.id });

    return this.rooms[roomId];
  }

  async createMultiplayerRoom(
    socket: Socket,
    { userId, config }: HostRoomMessageBody,
  ): Promise<Room> {
    const roomId: string = this.generateUniqueCode();

    if (!this.rooms[roomId]) {
      this.rooms[roomId] = this.roomFactory.createMultiplayerRoom(socket, roomId, config);
    }

    console.log(`Game machine created for room ${roomId}`);

    await this.joinRoom(socket, { roomId, userId });

    return this.rooms[roomId];
  }

  destroyRoom(id: string) {
    delete this.rooms[id];
    console.log(`Room destroyed for room ${id}`);
  }

  async joinRoom(socket: Socket, { roomId, userId }: JoinRoomMessageBody): Promise<void> {
    if (!this.rooms[roomId]) return;

    socket.join(roomId);

    this.roomFactory.setUpListenersOnJoin(socket, this.rooms[roomId]);

    if (this.rooms[roomId].isMulti) {
      const user = await this.usersService.get(userId);

      if (!user) throw new Error('User not found');

      this.rooms[roomId] = {
        ...this.rooms[roomId],
        users: [...this.rooms[roomId].users, user],
      };
    } else {
      this.rooms[roomId] = {
        ...this.rooms[roomId],
        users: [
          ...this.rooms[roomId].users,
          { id: socket.id, name: 'Guest', display_name: 'Guest', profile_url: '' },
        ],
      };
    }

    const { ...room } = this.rooms[roomId];

    this.gateway.server.to(roomId).emit('room_updated', room);
  }

  leaveRoom(roomId: string, userId: string): void {
    let room: Room = this.rooms[roomId];

    if (room) {
      room = {
        ...room,
        users: [...room.users.filter((user: users.users) => user.id !== userId)],
      };

      if (!room.users.some((user: users.users) => user)) {
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
