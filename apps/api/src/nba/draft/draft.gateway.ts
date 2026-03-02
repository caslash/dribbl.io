import { DraftService } from '@/nba/draft/draft.service';
import { PoolService } from '@/nba/draft/pool/pool.service';
import { NbaDraftEvent, StartDraftDto } from '@dribblio/types';
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

  constructor(
    private readonly draftService: DraftService,
    private readonly poolService: PoolService,
  ) {}

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
    const roomId = this.getRoomId(socket);
    if (!roomId) return;

    const room = this.draftService.getRoom(roomId);
    if (!room) return;

    room.send(data);
  }

  @SubscribeMessage('ORGANIZER_START_DRAFT')
  async handleStartDraft(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: StartDraftDto,
  ): Promise<void> {
    const roomId = this.getRoomId(socket);
    if (!roomId) return;

    const room = this.draftService.getRoom(roomId);
    if (!room) return;

    let pool;
    if (data.savedPoolId) {
      const savedPool = await this.poolService.loadPool(data.savedPoolId);
      if (!savedPool) {
        socket.emit('ERROR', { message: `Pool ${data.savedPoolId} not found` });
        return;
      }

      pool = savedPool.entries.map((entry) => ({ ...entry, available: true }));
    } else {
      pool = await this.poolService.finalize(data.config);
    }

    const { participants, config } = room.getSnapshot().context;
    const turnOrder = this.draftService.computeTurnOrder(
      participants,
      config.draftOrder,
      config.maxRounds,
    );

    room.send({
      type: 'ORGANIZER_START_DRAFT',
      pool,
      turnOrder: turnOrder,
    });
  }

  private getRoomId(socket: Socket): string | undefined {
    return [...socket.rooms].find((r) => r !== socket.id);
  }
}
