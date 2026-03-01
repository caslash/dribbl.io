import { DraftService } from '@/nba/draft/draft.service';
import { NbaDraftEvent } from '@/nba/draft/machine/events/inbound';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class DraftGateway implements OnGatewayConnection {
  @WebSocketServer()
  io: Server;

  constructor(private readonly draftService: DraftService) {}

  handleConnection(socket: Socket) {
    const roomId = socket.handshake.query.roomId as string | undefined;

    if (roomId) {
      const room = this.draftService.getRoom(roomId);

      if (!room) {
        socket.emit('ERROR', { message: `Room ${roomId} not found` });
        socket.disconnect();
        return;
      }

      socket.join(roomId);
      return;
    }

    const newRoomId = this.draftService.createRoom(this.io);
    socket.join(newRoomId);
    socket.emit('ROOM_CREATED', { roomId: newRoomId });
  }

  @SubscribeMessage('*')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: NbaDraftEvent,
  ) {
    const roomId = [...socket.rooms].find((r) => r !== socket.id);
    if (!roomId) return;

    const room = this.draftService.getRoom(roomId);
    if (!room) return;

    room.send(data);
  }
}
