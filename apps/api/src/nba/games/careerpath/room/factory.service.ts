import { CareerPathGateway } from '@/nba/games/careerpath/careerpath.gateway';
import { GameService } from '@/nba/games/careerpath/game.service';
import { users } from '@dribblio/database';
import {
  createMultiplayerMachine,
  createSinglePlayerMachine,
  MultiplayerConfig,
  PlayerGuess,
  Room,
  SinglePlayerConfig,
} from '@dribblio/types';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class RoomFactory {
  constructor(
    @Inject(forwardRef(() => CareerPathGateway))
    private gateway: CareerPathGateway,
    private gameService: GameService,
  ) {}

  createSinglePlayerRoom(socket: Socket, config: SinglePlayerConfig): Room {
    const room: Room = {
      id: '',
      statemachine: undefined,
      users: [],
      config,
      isMulti: false,
    };

    room.statemachine = createSinglePlayerMachine(socket, room.config, this.gameService);

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

  createMultiplayerRoom(socket: Socket, roomId: string, config: MultiplayerConfig): Room {
    const room: Room = {
      id: roomId,
      statemachine: undefined,
      users: [],
      config: config,
      isMulti: true,
    };

    room.statemachine = createMultiplayerMachine(this.gateway.server, room, this.gameService);

    socket.on('start_game', (users: users.User[]) => {
      room.statemachine?.subscribe((s) => {
        this.gateway.server.to(room.id).emit('state_change', s.value);
      });

      room.statemachine?.send({ type: 'START_GAME', users });
    });

    return room;
  }

  setUpListenersOnJoin(socket: Socket, room: Room) {
    socket.on('client_guess', (guess: PlayerGuess) => {
      room.statemachine?.send({ type: 'CLIENT_GUESS', guess });
    });

    socket.on('disconnect', () => {
      room.statemachine?.stop();
    });
  }
}
