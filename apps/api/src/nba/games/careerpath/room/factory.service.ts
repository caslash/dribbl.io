import {
  createMultiplayerMachine,
  createSinglePlayerMachine,
  MultiplayerConfig,
  PlayerGuess,
  Room,
  SinglePlayerConfig,
  User,
} from '@dribblio/types';
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class RoomFactory {
  private server: Server;

  constructor(server: Server) {
    this.server = server;
  }

  createSinglePlayerRoom(socket: Socket, config: SinglePlayerConfig): Room {
    const room: Room = {
      id: '',
      statemachine: undefined,
      users: [],
      config,
    };

    room.statemachine = createSinglePlayerMachine(socket, room.config);

    socket.on('start_game', () => {
      room.statemachine?.subscribe((s) => {
        socket.emit('state_change', s.value);
      });

      socket.on('skip_round', () => room.statemachine?.send({ type: 'SKIP' }));

      socket.on('disconnect', () => {
        room.statemachine?.stop();
      });

      room.statemachine?.send({ type: 'START_GAME', socket });
    });

    return room;
  }

  createMultiplayerRoom(
    socket: Socket,
    roomId: string,
    config: MultiplayerConfig,
  ): Room {
    const room: Room = {
      id: roomId,
      statemachine: undefined,
      users: [],
      config: config,
    };

    room.statemachine = createMultiplayerMachine(this.server, room);

    socket.on('start_game', (users: User[]) => {
      room.statemachine?.subscribe((s) => {
        this.server.to(room.id).emit('state_change', s.value);
      });

      room.statemachine?.send({ type: 'START_GAME', users });
    });

    return room;
  }

  setUpListenersOnJoin(socket: Socket, room: Room) {
    socket.on('client_guess', (guessId: number) => {
      const userId = socket.id;
      const guess: PlayerGuess = { userId, guessId };
      room.statemachine?.send({ type: 'CLIENT_GUESS', guess });
    });

    socket.on('disconnect', () => {
      room.statemachine?.stop();
    });
  }
}
