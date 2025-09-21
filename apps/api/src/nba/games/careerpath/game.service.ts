import { RoundProps } from '@/nba/games/careerpath/machines/actors';
import { BaseGameService } from '@/nba/games/careerpath/machines/gameservice';
import { PlayersService } from '@/nba/player/player.service';
import { GameDifficulty } from '@dribblio/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService implements BaseGameService {
  constructor(private playerService: PlayersService) {}

  async generateRound(difficulty: GameDifficulty): Promise<RoundProps> {
    const player = await this.playerService.findRandom(difficulty.filter);

    if (!player) {
      throw new Error('No player found');
    }

    const validAnswers = await this.playerService.findAll({
      where: { team_history: { equals: player.team_history } },
    });

    const players = await this.playerService.findAll({
      orderBy: {
        last_name: 'desc',
      },
    });

    return { validAnswers, players };
  }
}
