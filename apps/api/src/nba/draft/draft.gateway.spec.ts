import { vi } from 'vitest';
import { DraftService } from '@/nba/draft/draft.service';
import { PoolService } from '@/nba/pool/pool.service';
import { DraftRoomConfig, Participant } from '@dribblio/types';
import { Test, TestingModule } from '@nestjs/testing';
import { DraftGateway } from './draft.gateway';

describe('DraftGateway', () => {
  let gateway: DraftGateway;

  const mockDraftService = {
    createRoom: vi.fn(),
    getRoom: vi.fn(),
    computeTurnOrder: vi.fn(),
    destroyRoom: vi.fn(),
  };

  const mockPoolService = {
    generatePreview: vi.fn(),
    loadPool: vi.fn(),
    finalize: vi.fn(),
  };

  const mockServer = {} as any;

  const makeSocket = (socketId: string, roomId?: string) => ({
    id: socketId,
    rooms: new Set(roomId ? [socketId, roomId] : [socketId]),
    emit: vi.fn(),
    join: vi.fn(),
    disconnect: vi.fn(),
    handshake: { query: { roomId } },
    data: {} as Record<string, unknown>,
  });

  const makeRoom = (
    participants: Participant[] = [],
    config: DraftRoomConfig,
  ) => ({
    send: vi.fn(),
    getSnapshot: vi.fn().mockReturnValue({ context: { participants, config } }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DraftGateway,
        { provide: DraftService, useValue: mockDraftService },
        { provide: PoolService, useValue: mockPoolService },
      ],
    }).compile();

    gateway = module.get<DraftGateway>(DraftGateway);
    gateway.io = mockServer;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('afterInit', () => {
    it('should register a middleware function on the server via server.use', () => {
      const server = { use: vi.fn() };

      gateway.afterInit(server as any);

      expect(server.use).toHaveBeenCalledTimes(1);
      expect(server.use).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('handleConnection', () => {
    it('should join the existing room when roomId is in the query and room exists', () => {
      const room = makeRoom([], {
        draftOrder: 'snake',
        maxRounds: 3,
        draftMode: 'mvp',
      });
      mockDraftService.getRoom.mockReturnValue(room);
      const socket = makeSocket('socket-1', 'ROOM1');

      gateway.handleConnection(socket as any);

      expect(mockDraftService.getRoom).toHaveBeenCalledWith('ROOM1');
      expect(socket.join).toHaveBeenCalledWith('ROOM1');
      expect(socket.emit).not.toHaveBeenCalled();
      expect(socket.disconnect).not.toHaveBeenCalled();
    });

    it('should emit ERROR and disconnect when roomId is given but room does not exist', () => {
      mockDraftService.getRoom.mockReturnValue(undefined);
      const socket = makeSocket('socket-1', 'NOPE1');

      gateway.handleConnection(socket as any);

      expect(socket.emit).toHaveBeenCalledWith('ERROR', {
        message: 'Room NOPE1 not found',
      });
      expect(socket.disconnect).toHaveBeenCalled();
      expect(socket.join).not.toHaveBeenCalled();
    });

    it('should create a new room, join it, emit ROOM_CREATED, and store createdRoomId when no roomId is provided', () => {
      mockDraftService.createRoom.mockReturnValue('NEW01');
      const socket = makeSocket('socket-1');

      gateway.handleConnection(socket as any);

      expect(mockDraftService.createRoom).toHaveBeenCalledWith(mockServer);
      expect(socket.join).toHaveBeenCalledWith('NEW01');
      expect(socket.emit).toHaveBeenCalledWith('ROOM_CREATED', {
        roomId: 'NEW01',
      });
      expect(socket.data.createdRoomId).toBe('NEW01');
    });
  });

  describe('handleDisconnect', () => {
    it('should destroy the room when the temp socket disconnects and no participant joined', () => {
      mockDraftService.createRoom.mockReturnValue('NEW01');
      const socket = makeSocket('socket-1');
      gateway.handleConnection(socket as any);

      gateway.handleDisconnect(socket as any);

      expect(mockDraftService.destroyRoom).toHaveBeenCalledWith('NEW01');
    });

    it('should not destroy the room when the temp socket disconnects but a participant already joined', () => {
      mockDraftService.createRoom.mockReturnValue('NEW01');
      const tempSocket = makeSocket('socket-1');
      gateway.handleConnection(tempSocket as any);

      // Simulate a participant joining, which increments roomSocketCounts
      const participantSocket = makeSocket('socket-2', 'NEW01');
      mockDraftService.getRoom.mockReturnValue(makeRoom([], { draftOrder: 'snake', maxRounds: 3, draftMode: 'mvp' }));
      gateway.handleConnection(participantSocket as any);

      gateway.handleDisconnect(tempSocket as any);

      expect(mockDraftService.destroyRoom).not.toHaveBeenCalled();
    });
  });

  describe('handleMessage', () => {
    it('should send the event to the room when socket is in a room', () => {
      const room = makeRoom([], {
        draftOrder: 'snake',
        maxRounds: 3,
        draftMode: 'mvp',
      });
      mockDraftService.getRoom.mockReturnValue(room);
      const socket = makeSocket('socket-1', 'ROOM1');
      const event = { type: 'ORGANIZER_CONFIGURE' } as any;

      gateway.handleMessage(socket as any, event);

      expect(mockDraftService.getRoom).toHaveBeenCalledWith('ROOM1');
      expect(room.send).toHaveBeenCalledWith(event);
    });

    it('should return early and not call getRoom when socket is not in any room', () => {
      const socket = makeSocket('socket-1');
      const event = { type: 'ORGANIZER_CONFIGURE' } as any;

      gateway.handleMessage(socket as any, event);

      expect(mockDraftService.getRoom).not.toHaveBeenCalled();
    });
  });

  describe('handleStartDraft', () => {
    it('should return early when socket is not in any room', async () => {
      const socket = makeSocket('socket-1');

      await gateway.handleStartDraft(socket as any, undefined);

      expect(mockDraftService.getRoom).not.toHaveBeenCalled();
    });

    it('should emit ERROR when savedPoolId is provided but pool is not found', async () => {
      const room = makeRoom([], {
        draftOrder: 'snake',
        maxRounds: 3,
        draftMode: 'mvp',
      });
      mockDraftService.getRoom.mockReturnValue(room);
      mockPoolService.loadPool.mockResolvedValue(null);
      const socket = makeSocket('socket-1', 'ROOM1');

      await gateway.handleStartDraft(
        socket as any,
        { savedPoolId: 'pool-123' },
      );

      expect(mockPoolService.loadPool).toHaveBeenCalledWith('pool-123');
      expect(socket.emit).toHaveBeenCalledWith('ERROR', {
        message: 'Pool pool-123 not found',
      });
      expect(room.send).not.toHaveBeenCalled();
    });

    it('should load the saved pool and send ORGANIZER_START_DRAFT when savedPoolId resolves', async () => {
      const participants: Participant[] = [
        { participantId: 'p1', name: 'P1', isOrganizer: true },
      ];
      const config: DraftRoomConfig = {
        draftOrder: 'snake',
        maxRounds: 2,
        draftMode: 'mvp',
      };
      const room = makeRoom(participants, config);
      mockDraftService.getRoom.mockReturnValue(room);

      const savedPool = {
        id: 'pool-123',
        entries: [
          { entryId: 'entry-1', available: false },
          { entryId: 'entry-2', available: false },
        ],
      };
      mockPoolService.loadPool.mockResolvedValue(savedPool);
      mockDraftService.computeTurnOrder.mockReturnValue(['p1', 'p1']);

      const socket = makeSocket('socket-1', 'ROOM1');

      await gateway.handleStartDraft(
        socket as any,
        { savedPoolId: 'pool-123' },
      );

      expect(mockPoolService.loadPool).toHaveBeenCalledWith('pool-123');
      expect(mockDraftService.computeTurnOrder).toHaveBeenCalledWith(
        participants,
        config.draftOrder,
        config.maxRounds,
      );
      expect(room.send).toHaveBeenCalledWith({
        type: 'ORGANIZER_START_DRAFT',
        pool: [
          { entryId: 'entry-1', available: true },
          { entryId: 'entry-2', available: true },
        ],
        turnOrder: ['p1', 'p1'],
      });
    });

    it('should call finalize and send ORGANIZER_START_DRAFT when no savedPoolId is given', async () => {
      const participants: Participant[] = [
        { participantId: 'p1', name: 'P1', isOrganizer: true },
      ];
      const config: DraftRoomConfig = {
        draftOrder: 'linear',
        maxRounds: 1,
        draftMode: 'mvp',
      };
      const room = makeRoom(participants, config);
      mockDraftService.getRoom.mockReturnValue(room);

      const pool = [{ entryId: 'entry-1', available: true }];
      mockPoolService.finalize.mockResolvedValue(pool);
      mockDraftService.computeTurnOrder.mockReturnValue(['p1']);

      const socket = makeSocket('socket-1', 'ROOM1');

      await gateway.handleStartDraft(socket as any, undefined);

      expect(mockPoolService.finalize).toHaveBeenCalledWith(config);
      expect(room.send).toHaveBeenCalledWith({
        type: 'ORGANIZER_START_DRAFT',
        pool,
        turnOrder: ['p1'],
      });
    });
  });
});
