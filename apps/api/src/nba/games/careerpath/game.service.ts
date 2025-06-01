import { Injectable } from '@nestjs/common';
import { PlayersService } from '../../player/player.service';
import { GameDifficulty } from '@dribblio/types';
import { RoundProps } from './actors';

@Injectable()
export class GameService {
  constructor(private readonly playerService: PlayersService) {}

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
