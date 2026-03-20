import type { Difficulty } from './types.js';

export const BASE_URL = process.env['DRIBBL_API_URL'] ?? 'http://localhost:3001';
export const API_URL = `${BASE_URL}/api`;
export const WS_URL = BASE_URL;
export const WS_NAMESPACE = '/careerpath';
export const CONNECTION_TIMEOUT_MS = 8_000;
export const MAX_PLAYER_SEARCH_RESULTS = 10;

export const DIFFICULTIES: Difficulty[] = [
  { name: 'First Team All-NBA Players', value: 'firstallnba' },
  { name: 'All-NBA Players', value: 'allnba' },
  { name: 'Greatest 75', value: 'greatest75' },
  { name: 'All Players (hardest)', value: 'allplayers' },
];
