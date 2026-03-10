import { API_URL, MAX_PLAYER_SEARCH_RESULTS } from './config.js';
import type { Player, Team, TeamMap } from './types.js';

export async function fetchTeams(): Promise<TeamMap> {
  const res = await fetch(`${API_URL}/teams`);
  if (!res.ok) throw new Error(`Failed to fetch teams: ${res.status}`);

  const teams = (await res.json()) as Team[];
  return Object.fromEntries(teams.map((t) => [String(t.teamId), t]));
}

export async function fetchAllPlayers(): Promise<Player[]> {
  const res = await fetch(`${API_URL}/players`);
  if (!res.ok) throw new Error(`Failed to fetch players: ${res.status}`);
  return res.json() as Promise<Player[]>;
}

export async function searchPlayers(query: string): Promise<Player[]> {
  const all = await fetchAllPlayers();
  const q = query.toLowerCase();
  return all
    .filter((p) => p.fullName.toLowerCase().includes(q))
    .slice(0, MAX_PLAYER_SEARCH_RESULTS + 1); // +1 so we can detect overflow
}
