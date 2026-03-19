import { CareerPathService } from '@/nba/careerpath/careerpath.service';
import { CareerPathEvent } from '@dribblio/types';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/careerpath' })
export class CareerPathGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  io: Server;

  constructor(private readonly careerPathService: CareerPathService) {}

  handleConnection(socket: Socket) {
    const roomId = socket.handshake.query.roomId as string | undefined;

    if (roomId) {
      const room = this.careerPathService.getRoom(roomId);

      if (!room) {
        socket.emit('ERROR', { message: `Room ${roomId} not found` });
        socket.disconnect();
        return;
      }

      socket.data.roomId = roomId;
      socket.join(roomId);
      return;
    }

    const newRoomId = this.careerPathService.createRoom(this.io, socket);
    socket.join(newRoomId);
  }

  handleDisconnect(socket: Socket) {
    const roomId = socket.data.roomId as string | undefined;

    if (!roomId) return;

    this.careerPathService.destroyRoom(roomId);
  }

  @SubscribeMessage('*')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: CareerPathEvent,
  ) {
    const roomId = this.getRoomId(socket);
    if (!roomId) return;

    const room = this.careerPathService.getRoom(roomId);
    if (!room) return;

    room.send(data);
  }

  private getRoomId(socket: Socket): string | undefined {
    return [...socket.rooms].find((r) => r !== socket.id);
  }
}
