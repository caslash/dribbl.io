import { Room } from '@/server/lib/models/room';
import { createMultiplayerRoom, createSinglePlayerRoom } from '@/server/lib/sockets/roomFactory';
import { Server as HttpServer } from 'http';
import ShortUniqueId from 'short-unique-id';
import { Server, Socket } from 'socket.io';
const uid = new ShortUniqueId({ length: 5, dictionary: 'alpha_upper' });

export const createServerSocket = (httpServer: HttpServer): Server => {
  const rooms: Record<string, Room> = {};

  const io = new Server(httpServer);

  io.on('connection', async (socket) => {
    console.log(`Client socket ${socket.id} connected`);

    socket.on('host_room', (isMulti: boolean, userName: string) => {
      const roomId = generateUniqueCode();

      if (!rooms[roomId]) {
        rooms[roomId] = isMulti
          ? createMultiplayerRoom(io, socket, roomId)
          : createSinglePlayerRoom(socket);
      }

      console.log(`Game machine created for room ${roomId}`);

      joinRoom(socket, roomId, userName);
    });

    socket.on('join_room', (roomId: string, userName: string) => {
      joinRoom(socket, roomId, userName);
    });

    socket.on('disconnecting', () => {
      const roomId: string = Array.from(socket.rooms)[1];

      if (rooms[roomId]) {
        rooms[roomId] = {
          ...rooms[roomId],
          users: [...rooms[roomId].users.filter((user) => user.id !== socket.id)],
        };

        if (!rooms[roomId].users.some((user) => user)) {
          delete rooms[roomId];
          console.log(`Game machine destroyed for room ${roomId}`);
        } else {
          const { ...room } = rooms[roomId];

          io.to(roomId).emit('room_updated', room);
        }
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client socket ${socket.id} disconnected`);
    });
  });

  function joinRoom(socket: Socket, roomId: string, userName: string) {
    if (!rooms[roomId]) return;

    socket.join(roomId);

    rooms[roomId] = {
      ...rooms[roomId],
      users: [...rooms[roomId].users, { id: socket.id, name: userName }],
    };

    const { ...room } = rooms[roomId];

    io.to(roomId).emit('room_updated', room);
  }

  function generateUniqueCode(): string {
    const roomId = uid.randomUUID();
    if (roomId in rooms) {
      return generateUniqueCode();
    }

    return roomId;
  }
  return io;
};
