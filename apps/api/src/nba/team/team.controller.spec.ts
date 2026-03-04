import { TeamService } from '@/nba/team/team.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TeamController } from './team.controller';

describe('TeamController', () => {
  let controller: TeamController;
  let service: TeamService;

  const mockTeamService = {
    findAll: vi.fn(),
    findOne: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [
        {
          provide: TeamService,
          useValue: mockTeamService,
        },
      ],
    }).compile();

    controller = module.get<TeamController>(TeamController);
    service = module.get(TeamService);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should delegate to service.findAll and return the result', async () => {
      const teams = [{ teamId: 1 }, { teamId: 2 }];
      mockTeamService.findAll.mockResolvedValue(teams);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledWith();
      expect(result).toBe(teams);
    });
  });

  describe('findOne', () => {
    it('should delegate to service.findOne with the teamId and return the result', async () => {
      const team = { teamId: 1, fullName: 'Los Angeles Lakers' };
      mockTeamService.findOne.mockResolvedValue(team);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toBe(team);
    });
  });
});
