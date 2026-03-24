import { vi } from 'vitest';
import { Team } from '@dribblio/types';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TeamService } from './team.service';

const mockTeamRepository = {
  findOne: vi.fn(),
  find: vi.fn(),
};

describe('TeamService', () => {
  let service: TeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: getRepositoryToken(Team),
          useValue: mockTeamRepository,
        },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should call repository.find and return all teams', async () => {
      const teams = [{ teamId: 1 }, { teamId: 2 }];
      mockTeamRepository.find.mockResolvedValue(teams);

      const result = await service.findAll();

      expect(mockTeamRepository.find).toHaveBeenCalledWith();
      expect(result).toBe(teams);
    });
  });

  describe('findOne', () => {
    it('should call repository.findOne with correct options and return the team', async () => {
      const team = { teamId: 1, fullName: 'Los Angeles Lakers' };
      mockTeamRepository.findOne.mockResolvedValue(team);

      const result = await service.findOne(1);

      expect(mockTeamRepository.findOne).toHaveBeenCalledWith({
        where: { teamId: 1 },
        relations: { players: true },
      });
      expect(result).toBe(team);
    });

    it('should return null when team is not found', async () => {
      mockTeamRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });
});
