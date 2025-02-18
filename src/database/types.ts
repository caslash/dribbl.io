export {};

declare global {
  namespace PrismaJson {
    type PlayerAccolade = {
      PERSON_ID: number;
      FIRST_NAME: string;
      LAST_NAME: string;
      TEAM: string;
      DESCRIPTION: string;
      ALL_NBA_TEAM_NUMBER: string | null;
      SEASON: string;
      MONTH: string | null;
      WEEK: string | null;
      CONFERENCE: string;
      TYPE: string;
      SUBTYPE1: string;
      SUBTYPE2: string | null;
      SUBTYPE3: string | null;
    };
    type PlayerAccoladeList = {
      PlayerAwards: PlayerAccolade[];
    };
  }
}
