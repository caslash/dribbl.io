import { IsArray, IsInt, Min } from 'class-validator';

/**
 * Response payload for `GET /api/daily/roster/today`.
 *
 * Intentionally omits player names — the client must not know who is on the
 * roster before guessing. `rosterSize` lets the client render a progress bar.
 */
export interface DailyChallengeDto {
  /** Calendar date of this challenge in `"YYYY-MM-DD"` format. */
  challengeDate: string;
  teamId: number;
  teamFullName: string;
  teamAbbreviation: string;
  /** e.g. `"2023-24"` */
  seasonId: string;
  /** Count of qualifying roster members — no player names included. */
  rosterSize: number;
}

/**
 * Request body for `POST /api/daily/roster/guess`.
 *
 * The client owns `namedIds` — a running list of player IDs already correctly
 * guessed. The server re-validates membership on every request so no session
 * state is needed server-side.
 *
 * @example
 * const body: RosterGuessDto = { guessId: 2544, namedIds: [201939] };
 */
export class RosterGuessDto {
  /** The player ID the user is guessing. */
  @IsInt()
  @Min(1)
  guessId: number;

  /** All player IDs the user has already named correctly this session. */
  @IsArray()
  @IsInt({ each: true })
  namedIds: number[];
}

/**
 * Response payload for `GET /api/daily/roster/today/reveal`.
 *
 * Returns the full roster so the client can populate the missed-player
 * stagger animation at game-over. Only call this endpoint from terminal state.
 */
export interface RosterRevealDto {
  players: Array<{
    playerId: number;
    fullName: string;
    position: string | null;
    jerseyNumber: string | null;
  }>;
}

/**
 * Response payload for `POST /api/daily/roster/guess`.
 *
 * `duplicate` is only present (and `true`) when the player was already in
 * `namedIds` — no life should be deducted in that case.
 * `namedIds` is only returned on a correct, non-duplicate guess so the client
 * can replace its local copy with the server-confirmed list.
 */
export interface RosterGuessResponseDto {
  correct: boolean;
  duplicate?: boolean;
  player?: {
    playerId: number;
    fullName: string;
    position: string | null;
    jerseyNumber: string | null;
  };
  /** Updated named-IDs list, returned only on a correct non-duplicate guess. */
  namedIds?: number[];
  rosterSize: number;
}
