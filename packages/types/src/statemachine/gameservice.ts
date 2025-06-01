import { RoundProps } from './actors.js';
import { GameDifficulty } from './gamedifficulties.js';

export interface BaseGameService {
  generateRound: (difficulty: GameDifficulty) => Promise<RoundProps>;
}
