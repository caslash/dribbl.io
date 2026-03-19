import { CareerPathService } from '@/nba/careerpath/careerpath.service';
import { CareerPathEvent } from '@dribblio/types';
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
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/careerpath',
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()) ?? ['http://localhost:3000'],
  },
})
export class CareerPathGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  io: Server;

  private readonly logger = new Logger(CareerPathGateway.name);

  constructor(private readonly careerPathService: CareerPathService) {}

  afterInit(server: Server): void {
    server.use(createRateLimiter());
    this.logger.log('Career path gateway initialized');
  }

  handleConnection(socket: Socket) {
    const roomId = socket.handshake.query.roomId as string | undefined;

    if (roomId) {
      const room = this.careerPathService.getRoom(roomId);

      if (!room) {
        this.logger.warn(
          `Socket ${socket.id} attempted to join non-existent room ${roomId}`,
        );
        socket.emit('ERROR', { message: `Room ${roomId} not found` });
        socket.disconnect();
        return;
      }

      socket.data.roomId = roomId;
      socket.join(roomId);
      this.logger.log(`Socket ${socket.id} joined room ${roomId}`);
      return;
    }

    const newRoomId = this.careerPathService.createRoom(this.io, socket);
    socket.join(newRoomId);
    this.logger.log(`Socket ${socket.id} created room ${newRoomId}`);
  }

  handleDisconnect(socket: Socket) {
    const roomId = socket.data.roomId as string | undefined;

    if (!roomId) return;

    this.logger.log(
      `Socket ${socket.id} disconnected from room ${roomId} — destroying room`,
    );
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
