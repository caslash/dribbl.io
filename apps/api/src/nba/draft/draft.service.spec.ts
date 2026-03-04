import { createDraftMachine } from '@/nba/draft/machine/statemachine';
import { Test, TestingModule } from '@nestjs/testing';
import { DraftService } from './draft.service';

vi.mock('@/nba/draft/machine/statemachine');

describe('DraftService', () => {
  let service: DraftService;

  const mockActor = {
    subscribe: vi.fn(),
    stop: vi.fn(),
    send: vi.fn(),
    getSnapshot: vi.fn(),
  };

  const mockServer = {} as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DraftService],
    }).compile();

    service = module.get(DraftService);

    vi.clearAllMocks();
    mockActor.subscribe.mockReturnValue({ unsubscribe: vi.fn() });
    vi.mocked(createDraftMachine).mockReturnValue(mockActor as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('computeTurnOrder', () => {
    const participants = [
      { id: 'A', name: 'Player A', isOrganizer: true, isConnected: true },
      { id: 'B', name: 'Player B', isOrganizer: false, isConnected: true },
    ];

    it('should produce a flat linear order repeated for each round', () => {
      const result = service.computeTurnOrder(participants, 'linear', 3);
      expect(result).toEqual(['A', 'B', 'A', 'B', 'A', 'B']);
    });

    it('should produce a snake order alternating direction each round', () => {
      const result = service.computeTurnOrder(participants, 'snake', 3);
      expect(result).toEqual(['A', 'B', 'B', 'A', 'A', 'B']);
    });

    it('should handle a single participant correctly', () => {
      const single = [{ id: 'A', name: 'Player A', isOrganizer: true, isConnected: true }];
      const result = service.computeTurnOrder(single, 'linear', 3);
      expect(result).toEqual(['A', 'A', 'A']);
    });
  });

  describe('createRoom', () => {
    it('should call createDraftMachine, subscribe to the actor, and return a room id', () => {
      const roomId = service.createRoom(mockServer);

      expect(typeof roomId).toBe('string');
      expect(roomId.length).toBe(5);
      expect(vi.mocked(createDraftMachine)).toHaveBeenCalledWith({
        io: mockServer,
        roomId,
      });
      expect(mockActor.subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('getRoom', () => {
    it('should return undefined for a room that does not exist', () => {
      expect(service.getRoom('NOPE1')).toBeUndefined();
    });

    it('should return the actor for a room that was created', () => {
      const roomId = service.createRoom(mockServer);
      const room = service.getRoom(roomId);
      expect(room).toBe(mockActor);
    });
  });
});
