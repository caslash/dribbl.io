import { Room, User } from '@/server/lib/models/room';
import { createMultiplayerRoom, createSinglePlayerRoom } from '@/server/lib/services/roomFactory';
import ShortUniqueId from 'short-unique-id';
import { Server, Socket } from 'socket.io';

const uid = new ShortUniqueId({ length: 5, dictionary: 'alpha_upper' });

export interface RoomManager {
  server: Server;
  createRoom(isMulti: boolean, socket: Socket, userName: string): Room;
  destroyRoom(id: string): void;
  joinRoom(socket: Socket, id: string, userName: string): void;
  leaveRoom(roomId: string, userId: string): void;
  generateUniqueCode(): string;
}

export class GlobalRoomManager implements RoomManager {
  server: Server;
  private rooms: Record<string, Room> = {};

  constructor(server: Server) {
    this.server = server;
  }

  createRoom(isMulti: boolean, socket: Socket, userName: string): Room {
    const roomId: string = this.generateUniqueCode();

    if (!this.rooms[roomId]) {
      this.rooms[roomId] = isMulti
        ? createMultiplayerRoom(this.server, socket, roomId)
        : createSinglePlayerRoom(socket);
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

    this.rooms[id] = {
      ...this.rooms[id],
      users: [...this.rooms[id].users, { id: socket.id, name: userName }],
    };

    const { ...room } = this.rooms[id];

    this.server.to(id).emit('room_updated', room);
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
        this.server.to(roomId).emit('room_updated', room);
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
