import { GlobalRoomManager } from '@/server/lib/services/roommanager';
import { MultiplayerConfig } from '@/server/lib/statemachines/multiplayer/gamemachine';
import { SinglePlayerConfig } from '@/server/lib/statemachines/singleplayer/gamemachine';
import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

export const createServerSocket = (httpServer: HttpServer): Server => {
  const io = new Server(httpServer);
  const roomManager = new GlobalRoomManager(io);

  io.on('connection', async (socket) => {
    console.log(`Client socket ${socket.id} connected`);

    socket.on(
      'host_room',
      (isMulti: boolean, userName: string, config: MultiplayerConfig | SinglePlayerConfig) => {
        roomManager.createRoom(isMulti, socket, userName, config);
      },
    );

    socket.on('join_room', (roomId: string, userName: string) => {
      roomManager.joinRoom(socket, roomId, userName);
    });

    socket.on('disconnecting', () => {
      roomManager.leaveRoom(Array.from(socket.rooms)[1], socket.id);
    });

    socket.on('disconnect', () => {
      console.log(`Client socket ${socket.id} disconnected`);
    });
  });

  return io;
};
