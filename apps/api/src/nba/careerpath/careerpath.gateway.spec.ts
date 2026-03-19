import { CareerPathService } from '@/nba/careerpath/careerpath.service';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CareerPathGateway } from './careerpath.gateway';

describe('CareerPathGateway', () => {
  let gateway: CareerPathGateway;

  const mockCareerPathService = {
    createRoom: vi.fn(),
    getRoom: vi.fn(),
  };

  const mockServer = {} as any;

  const makeSocket = (socketId: string, roomId?: string) => ({
    id: socketId,
    rooms: new Set(roomId ? [socketId, roomId] : [socketId]),
    data: {} as Record<string, unknown>,
    emit: vi.fn(),
    join: vi.fn(),
    disconnect: vi.fn(),
    handshake: { query: { roomId } },
  });

  const makeRoom = () => ({
    send: vi.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CareerPathGateway,
        { provide: CareerPathService, useValue: mockCareerPathService },
      ],
    }).compile();

    gateway = module.get<CareerPathGateway>(CareerPathGateway);
    gateway.io = mockServer;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should join the existing room when roomId is in the query and room exists', () => {
      const room = makeRoom();
      mockCareerPathService.getRoom.mockReturnValue(room);
      const socket = makeSocket('socket-1', 'ROOM1');

      gateway.handleConnection(socket as any);

      expect(mockCareerPathService.getRoom).toHaveBeenCalledWith('ROOM1');
      expect(socket.join).toHaveBeenCalledWith('ROOM1');
      expect(socket.emit).not.toHaveBeenCalled();
      expect(socket.disconnect).not.toHaveBeenCalled();
    });

    it('should emit ERROR and disconnect when roomId is given but room does not exist', () => {
      mockCareerPathService.getRoom.mockReturnValue(undefined);
      const socket = makeSocket('socket-1', 'NOPE1');

      gateway.handleConnection(socket as any);

      expect(socket.emit).toHaveBeenCalledWith('ERROR', {
        message: 'Room NOPE1 not found',
      });
      expect(socket.disconnect).toHaveBeenCalled();
      expect(socket.join).not.toHaveBeenCalled();
    });

    it('should create a new room and join it when no roomId is provided', () => {
      mockCareerPathService.createRoom.mockReturnValue('NEW01');
      const socket = makeSocket('socket-1');

      gateway.handleConnection(socket as any);

      expect(mockCareerPathService.createRoom).toHaveBeenCalledWith(mockServer, socket);
      expect(socket.join).toHaveBeenCalledWith('NEW01');
      expect(socket.emit).not.toHaveBeenCalled();
    });
  });

  describe('handleMessage', () => {
    it('should send the event to the room when socket is in a room', () => {
      const room = makeRoom();
      mockCareerPathService.getRoom.mockReturnValue(room);
      const socket = makeSocket('socket-1', 'ROOM1');
      const event = { type: 'PLAYER_GUESS' } as any;

      gateway.handleMessage(socket as any, event);

      expect(mockCareerPathService.getRoom).toHaveBeenCalledWith('ROOM1');
      expect(room.send).toHaveBeenCalledWith(event);
    });

    it('should return early and not call getRoom when socket is not in any room', () => {
      const socket = makeSocket('socket-1');
      const event = { type: 'PLAYER_GUESS' } as any;

      gateway.handleMessage(socket as any, event);

      expect(mockCareerPathService.getRoom).not.toHaveBeenCalled();
    });

    it('should return early and not send when room does not exist', () => {
      const room = makeRoom();
      mockCareerPathService.getRoom.mockReturnValue(undefined);
      const socket = makeSocket('socket-1', 'ROOM1');
      const event = { type: 'PLAYER_GUESS' } as any;

      gateway.handleMessage(socket as any, event);

      expect(mockCareerPathService.getRoom).toHaveBeenCalledWith('ROOM1');
      expect(room.send).not.toHaveBeenCalled();
    });
  });
});
