import { RoomService } from '@/nba/games/careerpath/room/room.service';
import { SinglePlayerConfig } from '@dribblio/types';
import {
  ArgumentMetadata,
  BadRequestException,
  forwardRef,
  Inject,
  PipeTransform,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export class ParseJSONPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    if (typeof value !== 'string') return value;
    try {
      return JSON.parse(value);
    } catch {
      throw new BadRequestException('Invalid JSON payload');
    }
  }
}

@WebSocketGateway({ namespace: '/singleplayer', cors: true })
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
    @MessageBody(new ParseJSONPipe()) config: SinglePlayerConfig,
    @ConnectedSocket() client: Socket,
  ) {
    await this.roomService.createSinglePlayerRoom(client, config);
  }
}
