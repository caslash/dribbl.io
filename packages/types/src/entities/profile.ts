type PlayerProfileSeason = {
  seasonId: string;
  seasonType: string;
  team: string;
  age: number | null;
  gp: number | null;
  gs: number | null;
  minPg: number | null;
  ptsPg: number | null;
  rebPg: number | null;
  astPg: number | null;
  stlPg: number | null;
  blkPg: number | null;
  tovPg: number | null;
  fgPct: number | null;
  fg3Pct: number | null;
  ftPct: number | null;
};

type PlayerProfileAccolade = {
  season: string;
  description: string;
  type: string;
  team: string | null;
  subtype: string | null;
};

export type PlayerProfile = {
  // Bio
  playerId: number;
  fullName: string;
  birthdate: string | null;
  height: string | null;
  weightLbs: number | null;
  position: string | null;
  jerseyNumber: string | null;
  school: string | null;
  country: string | null;
  isActive: boolean;
  greatest75Flag: boolean;
  // Current team (null if retired/unsigned)
  teamId: number | null;
  teamName: string | null;
  teamAbbreviation: string | null;
  // Draft
  draftYear: number | null;
  draftRound: number | null;
  draftNumber: number | null;
  // Career span
  fromYear: number | null;
  toYear: number | null;
  // Aggregates (null when player has no rows in the respective table)
  seasons: PlayerProfileSeason[] | null;
  accolades: PlayerProfileAccolade[] | null;
};
