import { nba } from '@dribblio/database';

export interface SearchResponse {
  results: nba.Player[];
}
