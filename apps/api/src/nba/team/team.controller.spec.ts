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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
