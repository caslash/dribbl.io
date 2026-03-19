import { DraftService } from '@/nba/draft/draft.service';
import { PoolService } from '@/nba/pool/pool.service';
import {
  DraftRoomConfig,
  NbaDraftEvent,
  StartDraftDto,
  SubmitPickEvent,
} from '@dribblio/types';
import { createRateLimiter } from '@/nba/shared/rate-limiter';
import { Logger } from '@nestjs/common';
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
    origin: process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()) ?? ['http://localhost:3000'],
  },
})
export class DraftGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  io: Server;

  private readonly logger = new Logger(DraftGateway.name);

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
    this.logger.log('Draft gateway initialized');
  }

  handleConnection(socket: Socket) {
    const roomId = socket.handshake.query.roomId as string | undefined;

    if (roomId) {
      const room = this.draftService.getRoom(roomId);

      if (!room) {
        this.logger.warn(`Socket ${socket.id} attempted to join non-existent room ${roomId}`);
        socket.emit('ERROR', { message: `Room ${roomId} not found` });
        socket.disconnect();
        return;
      }

      socket.data.roomId = roomId;
      socket.join(roomId);
      this.roomSocketCounts.set(roomId, (this.roomSocketCounts.get(roomId) ?? 0) + 1);
      this.logger.log(`Socket ${socket.id} joined room ${roomId}`);
      return;
    }

    // Temp socket used only to obtain a generated roomId.
    // Store it so handleDisconnect can clean up if no participant ever joins.
    const newRoomId = this.draftService.createRoom(this.io);
    socket.data.createdRoomId = newRoomId;
    socket.join(newRoomId);
    socket.emit('ROOM_CREATED', { roomId: newRoomId });
    this.logger.log(`Socket ${socket.id} created room ${newRoomId}`);
  }

  handleDisconnect(socket: Socket) {
    const roomId = socket.data.roomId as string | undefined;

    if (!roomId) {
      // Temp room-creation socket — destroy the room if no participant joined.
      const createdRoomId = socket.data.createdRoomId as string | undefined;
      if (createdRoomId && !this.roomSocketCounts.has(createdRoomId)) {
        this.logger.log(`Destroying orphaned room ${createdRoomId} — no participants joined`);
        this.draftService.destroyRoom(createdRoomId);
      } else {
        this.logger.debug(`Temp socket ${socket.id} disconnected`);
      }
      return;
    }

    const remaining = (this.roomSocketCounts.get(roomId) ?? 1) - 1;
    if (remaining <= 0) {
      this.roomSocketCounts.delete(roomId);
      this.logger.log(`Last participant left room ${roomId} — destroying room`);
      this.draftService.destroyRoom(roomId);
    } else {
      this.roomSocketCounts.set(roomId, remaining);
      this.logger.debug(`Socket ${socket.id} left room ${roomId} (${remaining} remaining)`);
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
      this.logger.error(`Failed to generate pool preview for room ${roomId}`, error instanceof Error ? error.stack : String(error));
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
          this.logger.warn(`Saved pool ${data.savedPoolId} not found for room ${roomId}`);
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
      this.logger.error(`Failed to start draft for room ${roomId}`, error instanceof Error ? error.stack : String(error));
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
