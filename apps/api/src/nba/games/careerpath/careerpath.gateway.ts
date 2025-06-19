import { RoomService } from '@/nba/games/careerpath/room/room.service';
import { HostRoomMessageBody, JoinRoomMessageBody } from '@dribblio/types';
import { forwardRef, Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class CareerPathGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => RoomService))
    private roomService: RoomService,
  ) {}

  handleDisconnect(client: Socket) {
    this.roomService.leaveRoom(Array.from(client.rooms)[1], client.id);
  }

  @SubscribeMessage('host_room')
  async handleHostRoom(
    @MessageBody() config: HostRoomMessageBody,
    @ConnectedSocket() client: Socket,
  ) {
    await this.roomService.createRoom(client, config);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() config: JoinRoomMessageBody,
    @ConnectedSocket() client: Socket,
  ) {
    await this.roomService.joinRoom(client, config);
  }
}
