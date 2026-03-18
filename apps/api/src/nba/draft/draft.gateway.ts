import { DraftService } from '@/nba/draft/draft.service';
import { PoolService } from '@/nba/pool/pool.service';
import {
  DraftRoomConfig,
  FranchisePoolEntry,
  NbaDraftEvent,
  StartDraftDto,
  SubmitPickEvent,
} from '@dribblio/types';
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

@WebSocketGateway({ namespace: '/draft' })
export class DraftGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  io: Server;

  /** Tracks the number of active sockets per room for cleanup purposes. */
  private readonly roomSocketCounts = new Map<string, number>();

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

    const pool = await this.poolService.generatePreview(data.config);

    room.send({ type: 'SAVE_CONFIG', config: data.config, pool });
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

    // Compute which pool entries are invalidated by this pick and advance the machine.
    const { pool, config } = room.getSnapshot().context;
    const pickedEntry = pool.find((e) => e.entryId === data.pickRecord.entryId);
    if (!pickedEntry) return;

    const invalidatedIds = new Set<string>();
    for (const entry of pool) {
      if (config.draftMode === 'mvp') {
        if (entry.playerId === pickedEntry.playerId) {
          invalidatedIds.add(entry.entryId);
        }
      } else if (config.draftMode === 'franchise') {
        if (entry.playerId === pickedEntry.playerId) {
          invalidatedIds.add(entry.entryId);
        } else if (
          entry.draftMode === 'franchise' &&
          pickedEntry.draftMode === 'franchise' &&
          (entry as FranchisePoolEntry).franchiseAbbr ===
            (pickedEntry as FranchisePoolEntry).franchiseAbbr
        ) {
          invalidatedIds.add(entry.entryId);
        }
      }
    }

    room.send({ type: 'POOL_UPDATED', invalidatedIds });
  }

  private getRoomId(socket: Socket): string | undefined {
    return [...socket.rooms].find((r) => r !== socket.id);
  }
}
