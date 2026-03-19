import { DraftService } from '@/nba/draft/draft.service';
import { PoolService } from '@/nba/pool/pool.service';
import {
  DraftRoomConfig,
  NbaDraftEvent,
  StartDraftDto,
  SubmitPickEvent,
} from '@dribblio/types';
import { createRateLimiter } from '@/nba/shared/rate-limiter';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/draft',
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') ?? 'http://localhost:3000',
  },
})
export class DraftGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  io: Server;

  /** Tracks the number of active sockets per room for cleanup purposes. */
  private readonly roomSocketCounts = new Map<string, number>();

  constructor(
    private readonly draftService: DraftService,
    private readonly poolService: PoolService,
  ) {
    // Clean up socket tracking when a room is destroyed internally (e.g. machine reaches final state)
    this.draftService.onRoomDestroyed = (roomId) => {
      this.roomSocketCounts.delete(roomId);
    };
  }

  afterInit(server: Server): void {
    server.use(createRateLimiter());
  }

  handleConnection(socket: Socket) {
    const roomId = socket.handshake.query.roomId as string | undefined;

    if (roomId) {
      const room = this.draftService.getRoom(roomId);

      if (!room) {
        socket.emit('ERROR', { message: `Room ${roomId} not found` });
        socket.disconnect();
        return;
      }

      socket.data.roomId = roomId;
      socket.join(roomId);
      this.roomSocketCounts.set(roomId, (this.roomSocketCounts.get(roomId) ?? 0) + 1);
      return;
    }

    // Temp socket used only to obtain a generated roomId — not tracked for cleanup.
    const newRoomId = this.draftService.createRoom(this.io);
    socket.join(newRoomId);
    socket.emit('ROOM_CREATED', { roomId: newRoomId });
  }

  handleDisconnect(socket: Socket) {
    const roomId = socket.data.roomId as string | undefined;
    // Temp room-creation sockets have no roomId stored — nothing to clean up.
    if (!roomId) return;

    const remaining = (this.roomSocketCounts.get(roomId) ?? 1) - 1;
    if (remaining <= 0) {
      this.roomSocketCounts.delete(roomId);
      this.draftService.destroyRoom(roomId);
    } else {
      this.roomSocketCounts.set(roomId, remaining);
    }
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

  @SubscribeMessage('SAVE_CONFIG')
  async handleSaveConfig(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { config: DraftRoomConfig },
  ): Promise<void> {
    const roomId = this.getRoomId(socket);
    if (!roomId) return;

    const room = this.draftService.getRoom(roomId);
    if (!room) return;

    try {
      const pool = await this.poolService.generatePreview(data.config);
      room.send({ type: 'SAVE_CONFIG', config: data.config, pool });
    } catch (error) {
      socket.emit('ERROR', { message: 'Failed to generate pool preview' });
    }
  }

  @SubscribeMessage('ORGANIZER_START_DRAFT')
  async handleStartDraft(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: StartDraftDto | undefined,
  ): Promise<void> {
    const roomId = this.getRoomId(socket);
    if (!roomId) return;

    const room = this.draftService.getRoom(roomId);
    if (!room) return;

    try {
      const { participants, config } = room.getSnapshot().context;

      let pool;
      if (data?.savedPoolId) {
        const savedPool = await this.poolService.loadPool(data.savedPoolId);
        if (!savedPool) {
          socket.emit('ERROR', { message: `Pool ${data.savedPoolId} not found` });
          return;
        }
        pool = savedPool.entries.map((entry) => ({ ...entry, available: true }));
      } else {
        pool = await this.poolService.finalize(config);
      }

      const turnOrder = this.draftService.computeTurnOrder(
        participants,
        config.draftOrder,
        config.maxRounds,
      );

      room.send({
        type: 'ORGANIZER_START_DRAFT',
        pool,
        turnOrder,
      });
    } catch (error) {
      socket.emit('ERROR', { message: 'Failed to start draft' });
    }
  }

  @SubscribeMessage('SUBMIT_PICK')
  handleSubmitPick(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { pickRecord: SubmitPickEvent['pickRecord'] },
  ): void {
    const roomId = this.getRoomId(socket);
    if (!roomId) return;

    const room = this.draftService.getRoom(roomId);
    if (!room) return;

    room.send({ type: 'SUBMIT_PICK', pickRecord: data.pickRecord });
  }

  private getRoomId(socket: Socket): string | undefined {
    return [...socket.rooms].find((r) => r !== socket.id);
  }
}
