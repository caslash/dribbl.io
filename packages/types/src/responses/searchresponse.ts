import { nba } from '@dribblio/database';

export type SearchResponse = {
  results: nba.Player[];
};
