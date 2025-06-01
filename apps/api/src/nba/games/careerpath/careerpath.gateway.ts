import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { HostRoomMessageBody, JoinRoomMessageBody } from '@dribblio/types';
import { RoomService } from './room/room.service';
import { RoomFactory } from './room/factory.service';

@WebSocketGateway({ cors: true })
export class CareerPathGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private roomService: RoomService;

  afterInit(server: Server) {
    this.roomService = new RoomService(server, new RoomFactory(server));
  }

  handleDisconnect(client: Socket) {
    console.log(`Client socket ${client.id} disconnected`);
  }

  @SubscribeMessage('host_room')
  handleHostRoom(
    @MessageBody() config: HostRoomMessageBody,
    @ConnectedSocket() client: Socket,
  ) {
    this.roomService.createRoom(
      config.isMulti,
      client,
      config.userName,
      config.config,
    );
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody() config: JoinRoomMessageBody,
    @ConnectedSocket() client: Socket,
  ) {
    this.roomService.joinRoom(client, config.roomId, config.userName);
  }

  @SubscribeMessage('disconnecting')
  handleDisconnecting(@ConnectedSocket() client: Socket) {
    this.roomService.leaveRoom(Array.from(client.rooms)[1], client.id);
  }
}
