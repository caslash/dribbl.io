import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from '@/nba/games/careerpath/room/room.service';
import { forwardRef, Inject } from '@nestjs/common';
import { SinglePlayerConfig } from '@dribblio/types';

@WebSocketGateway({ path: '/singleplayer', cors: true })
export class SinglePlayerGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => RoomService))
    private roomService: RoomService,
  ) {}

  handleDisconnect(client: Socket) {
    this.roomService.leaveRoom(Array.from(client.rooms)[1], client.id);
  }

  @SubscribeMessage('create_game')
  async handleHostRoom(
    @MessageBody() config: SinglePlayerConfig,
    @ConnectedSocket() client: Socket,
  ) {
    await this.roomService.createSinglePlayerRoom(client, config);
  }
}
