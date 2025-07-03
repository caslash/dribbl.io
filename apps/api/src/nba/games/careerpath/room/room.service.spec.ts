import { CareerPathGateway } from '@/nba/games/careerpath/careerpath.gateway';
import { RoomFactory } from '@/nba/games/careerpath/room/factory.service';
import { RoomService } from '@/nba/games/careerpath/room/room.service';
import { UsersService } from '@/users/users.service';
import { Test, TestingModule } from '@nestjs/testing';

const mockCareerPathGateway = {
  createRoom: jest.fn(),
  destroyRoom: jest.fn(),
  joinRoom: jest.fn(),
  leaveRoom: jest.fn(),
  generateUniqueCode: jest.fn(),
};
const mockRoomFactory = {
  createMultiplayerRoom: jest.fn(),
  createSinglePlayerRoom: jest.fn(),
  setUpListenersOnJoin: jest.fn(),
};
const mockUsersService = {
  get: jest.fn(),
  update: jest.fn(),
  uploadProfileImage: jest.fn(),
};

describe('RoomService', () => {
  let service: RoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        { provide: CareerPathGateway, useValue: mockCareerPathGateway },
        { provide: RoomFactory, useValue: mockRoomFactory },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
