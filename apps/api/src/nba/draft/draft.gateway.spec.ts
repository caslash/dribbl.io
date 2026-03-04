import { DraftService } from '@/nba/draft/draft.service';
import { PoolService } from '@/nba/draft/pool/pool.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DraftGateway } from './draft.gateway';

describe('DraftGateway', () => {
  let gateway: DraftGateway;

  const mockDraftService = {
    createRoom: vi.fn(),
    getRoom: vi.fn(),
    computeTurnOrder: vi.fn(),
  };

  const mockPoolService = {
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
  });

  const makeRoom = (participants = [], config = { draftOrder: 'snake', maxRounds: 3 }) => ({
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

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should join the existing room when roomId is in the query and room exists', () => {
      const room = makeRoom();
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

    it('should create a new room, join it, and emit ROOM_CREATED when no roomId is provided', () => {
      mockDraftService.createRoom.mockReturnValue('NEW01');
      const socket = makeSocket('socket-1');

      gateway.handleConnection(socket as any);

      expect(mockDraftService.createRoom).toHaveBeenCalledWith(mockServer);
      expect(socket.join).toHaveBeenCalledWith('NEW01');
      expect(socket.emit).toHaveBeenCalledWith('ROOM_CREATED', { roomId: 'NEW01' });
    });
  });

  describe('handleMessage', () => {
    it('should send the event to the room when socket is in a room', () => {
      const room = makeRoom();
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

      await gateway.handleStartDraft(socket as any, { config: {} } as any);

      expect(mockDraftService.getRoom).not.toHaveBeenCalled();
    });

    it('should emit ERROR when savedPoolId is provided but pool is not found', async () => {
      const room = makeRoom();
      mockDraftService.getRoom.mockReturnValue(room);
      mockPoolService.loadPool.mockResolvedValue(null);
      const socket = makeSocket('socket-1', 'ROOM1');

      await gateway.handleStartDraft(socket as any, { savedPoolId: 'pool-123' } as any);

      expect(mockPoolService.loadPool).toHaveBeenCalledWith('pool-123');
      expect(socket.emit).toHaveBeenCalledWith('ERROR', {
        message: 'Pool pool-123 not found',
      });
      expect(room.send).not.toHaveBeenCalled();
    });

    it('should load the saved pool and send ORGANIZER_START_DRAFT when savedPoolId resolves', async () => {
      const participants = [{ id: 'p1', name: 'P1', isOrganizer: true, isConnected: true }];
      const config = { draftOrder: 'snake', maxRounds: 2, draftMode: 'mvp', turnDuration: 60 };
      const room = makeRoom(participants, config);
      mockDraftService.getRoom.mockReturnValue(room);

      const savedPool = {
        id: 'pool-123',
        entries: [
          { id: 'entry-1', available: false },
          { id: 'entry-2', available: false },
        ],
      };
      mockPoolService.loadPool.mockResolvedValue(savedPool);
      mockDraftService.computeTurnOrder.mockReturnValue(['p1', 'p1']);

      const socket = makeSocket('socket-1', 'ROOM1');

      await gateway.handleStartDraft(socket as any, { savedPoolId: 'pool-123' } as any);

      expect(mockPoolService.loadPool).toHaveBeenCalledWith('pool-123');
      expect(mockDraftService.computeTurnOrder).toHaveBeenCalledWith(
        participants,
        config.draftOrder,
        config.maxRounds,
      );
      expect(room.send).toHaveBeenCalledWith({
        type: 'ORGANIZER_START_DRAFT',
        pool: [
          { id: 'entry-1', available: true },
          { id: 'entry-2', available: true },
        ],
        turnOrder: ['p1', 'p1'],
      });
    });

    it('should call finalize and send ORGANIZER_START_DRAFT when no savedPoolId is given', async () => {
      const participants = [{ id: 'p1', name: 'P1', isOrganizer: true, isConnected: true }];
      const config = { draftOrder: 'linear', maxRounds: 1, draftMode: 'mvp', turnDuration: 60 };
      const room = makeRoom(participants, config);
      mockDraftService.getRoom.mockReturnValue(room);

      const pool = [{ id: 'entry-1', available: true }];
      mockPoolService.finalize.mockResolvedValue(pool);
      mockDraftService.computeTurnOrder.mockReturnValue(['p1']);

      const socket = makeSocket('socket-1', 'ROOM1');
      const data = { config } as any;

      await gateway.handleStartDraft(socket as any, data);

      expect(mockPoolService.finalize).toHaveBeenCalledWith(config);
      expect(room.send).toHaveBeenCalledWith({
        type: 'ORGANIZER_START_DRAFT',
        pool,
        turnOrder: ['p1'],
      });
    });
  });
});
