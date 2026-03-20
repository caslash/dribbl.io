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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DraftService],
    }).compile();

    service = module.get(DraftService);
    mockActor.subscribe.mockReturnValue({ unsubscribe: vi.fn() });
    vi.mocked(createDraftMachine).mockReturnValue(mockActor as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('computeTurnOrder', () => {
    const participants = [
      { participantId: 'A', name: 'Player A', isOrganizer: true },
      { participantId: 'B', name: 'Player B', isOrganizer: false },
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
      const single = [{ participantId: 'A', name: 'Player A', isOrganizer: true }];
      const result = service.computeTurnOrder(single, 'linear', 3);
      expect(result).toEqual(['A', 'A', 'A']);
    });

    it('should default to linear for an unknown draftOrder', () => {
      const result = service.computeTurnOrder(participants, 'unknown' as any, 3);
      const expected = service.computeTurnOrder(participants, 'linear', 3);
      expect(result).toEqual(expected);
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

    it('should throw when MAX_ROOMS rooms already exist', () => {
      const MAX_ROOMS = 50;
      for (let i = 0; i < MAX_ROOMS; i++) {
        service.createRoom(mockServer);
      }

      expect(() => service.createRoom(mockServer)).toThrow(
        'Room limit reached. Try again later.',
      );
    });
  });

  describe('destroyRoom', () => {
    it('should call unsubscribe on the stored subscription', () => {
      const mockUnsubscribe = vi.fn();
      mockActor.subscribe.mockReturnValue({ unsubscribe: mockUnsubscribe });

      const roomId = service.createRoom(mockServer);
      service.destroyRoom(roomId);

      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should stop the actor and remove the room', () => {
      const roomId = service.createRoom(mockServer);
      service.destroyRoom(roomId);

      expect(mockActor.stop).toHaveBeenCalled();
      expect(service.getRoom(roomId)).toBeUndefined();
    });

    it('should do nothing when the room does not exist', () => {
      expect(() => service.destroyRoom('NOPE1')).not.toThrow();
      expect(mockActor.stop).not.toHaveBeenCalled();
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
