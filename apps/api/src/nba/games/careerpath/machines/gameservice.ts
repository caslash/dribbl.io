import { GameDifficulty } from '@dribblio/types/src/dtos/gamedifficulties';
import { RoundProps } from './actors';

export interface BaseGameService {
  generateRound: (difficulty: GameDifficulty) => Promise<RoundProps>;
}
