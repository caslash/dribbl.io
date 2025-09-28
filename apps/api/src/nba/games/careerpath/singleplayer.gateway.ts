import { RoomService } from '@/nba/games/careerpath/room/room.service';
import { SinglePlayerConfig } from '@dribblio/types';
import { BadRequestException, forwardRef, Inject, PipeTransform } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export class ParseJSONPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value !== 'string') return value;
    try {
      return JSON.parse(value);
    } catch {
      throw new BadRequestException('Invalid JSON payload');
    }
  }
}

@WebSocketGateway({ namespace: '/singleplayer', cors: true })
export class SinglePlayerGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => RoomService))
    private roomService: RoomService,
  ) {}

  handleConnection(client: any) {
    client.on('disconnecting', () => {
      const rooms = [...client.rooms].filter((room) => room !== client.id);
      rooms.forEach((roomId) => this.roomService.leaveRoom(roomId, client.id));
    });
  }

  @SubscribeMessage('create_game')
  async handleHostRoom(
    @MessageBody(new ParseJSONPipe()) config: SinglePlayerConfig,
    @ConnectedSocket() client: Socket,
  ) {
    await this.roomService.createSinglePlayerRoom(client, config);
  }
}
