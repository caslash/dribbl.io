import { RoundProps } from '@/nba/careerpath/machine/actors/generate-round';
import { createCareerPathMachine } from '@/nba/careerpath/machine/statemachine';
import { PlayerService } from '@/nba/player/player.service';
import { GameDifficulty, Player, Season } from '@dribblio/types';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ShortUniqueId from 'short-unique-id';
import { Server, Socket } from 'socket.io';
import { DataSource, In, Repository } from 'typeorm';
import { Subscription } from 'xstate';

const uid = new ShortUniqueId({ length: 5, dictionary: 'alphanum_upper' });

/** Maximum number of concurrent career path rooms allowed. */
const MAX_ROOMS = 200;

/** Maximum time in milliseconds the career-signature CTE query may run. */
const SIGNATURE_QUERY_TIMEOUT_MS = 30_000;

/**
 * Derives a player's canonical career signature as an ordered list of team IDs,
 * collapsing consecutive stints with the same team into a single entry.
 *
 * @param seasons - All seasons for a given player.
 * @returns An ordered array of team IDs representing the player's career path.
 */
function computeCareerSignature(seasons: Season[]): number[] {
  const sorted = seasons
    .filter(
      (s): s is Season & { teamId: number } =>
        s.teamId !== null && s.seasonType === 'Regular Season',
    )
    .sort((a, b) => a.seasonId.localeCompare(b.seasonId));

  const sig: number[] = [];
  let last: number | null = null;
  for (const s of sorted) {
    if (s.teamId !== last) {
      sig.push(s.teamId);
      last = s.teamId;
    }
  }
  return sig;
}

/**
 * Manages the lifecycle of active career path rooms and their XState actors.
 *
 * @example
 * const roomId = careerPathService.createRoom(io, socket);
 * careerPathService.getRoom(roomId)?.send({ type: 'START_GAME' });
 */
@Injectable()
export class CareerPathService {
  private readonly logger = new Logger(CareerPathService.name);

  private readonly rooms = new Map<
    string,
    ReturnType<typeof createCareerPathMachine>
  >();

  private readonly subscriptions = new Map<string, Subscription>();

  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,

    private readonly playerService: PlayerService,

    private readonly dataSource: DataSource,
  ) {}

  /**
   * Creates a new career path room, starts its XState actor, and registers a
   * subscription to auto-destroy the room when the machine reaches a final state.
   *
   * @param io - The Socket.io server instance.
   * @param creatorSocket - The socket of the player creating the room.
   * @returns The newly created room ID.
   * @throws {Error} When the room limit has been reached.
   */
  createRoom(io: Server, creatorSocket: Socket): string {
    if (this.rooms.size >= MAX_ROOMS) {
      this.logger.warn(
        `Room limit reached (${MAX_ROOMS}) — rejecting new room creation`,
      );
      throw new Error('Room limit reached. Try again later.');
    }

    const roomId = uid.randomUUID();

    const actor = createCareerPathMachine(
      { io, roomId, initialSocket: creatorSocket },
      this.generateRound,
    );

    const subscription = actor.subscribe((state) => {
      if (state.status === 'done') {
        this.logger.log(
          `Career path machine for room ${roomId} reached final state — triggering cleanup`,
        );
        this.destroyRoom(roomId);
      }
    });

    this.subscriptions.set(roomId, subscription);
    this.rooms.set(roomId, actor);
    this.logger.log(
      `Career path room ${roomId} created (active rooms: ${this.rooms.size})`,
    );
    return roomId;
  }

  /**
   * Retrieves the running XState actor for a given room.
   *
   * @param roomId - The room ID to look up.
   * @returns The actor instance, or `undefined` if the room does not exist.
   */
  getRoom(
    roomId: string,
  ): ReturnType<typeof createCareerPathMachine> | undefined {
    return this.rooms.get(roomId);
  }

  private readonly generateRound = async (
    difficulty: GameDifficulty,
  ): Promise<RoundProps> => {
    const randomPlayer = await this.playerService.findRandomPlayer(
      difficulty.filter,
    );

    if (!randomPlayer) {
      this.logger.warn(
        'generateRound: no random player found for difficulty filter',
      );
      return { validAnswers: [] };
    }

    const playerWithSeasons = await this.playerRepository.findOne({
      where: { playerId: randomPlayer.playerId },
      relations: { seasons: true },
    });
    if (!playerWithSeasons) {
      this.logger.warn(
        `generateRound: player ${randomPlayer.playerId} not found with seasons`,
      );
      return { validAnswers: [] };
    }

    const signature = computeCareerSignature(playerWithSeasons.seasons);
    if (signature.length === 0) return { validAnswers: [playerWithSeasons] };

    // SET LOCAL scopes the timeout to this transaction only, preventing it from
    // leaking back into the shared connection pool. dataSource.transaction()
    // manages the full connection lifecycle (acquire → BEGIN → commit/rollback → release).
    const rows = await this.dataSource.transaction(async (manager) => {
      await manager.query(`SET LOCAL statement_timeout = ${SIGNATURE_QUERY_TIMEOUT_MS}`);
      return manager.query<{ player_id: number }[]>(
        `
        WITH player_sigs AS (
          SELECT
            player_id,
            array_agg(team_id ORDER BY first_season) AS sig
          FROM (
            SELECT
              player_id,
              team_id,
              MIN(season_id) AS first_season
            FROM (
              SELECT
                player_id,
                team_id,
                season_id,
                ROW_NUMBER() OVER (PARTITION BY player_id ORDER BY season_id)
                  - ROW_NUMBER() OVER (PARTITION BY player_id, team_id ORDER BY season_id) AS grp
              FROM seasons
              WHERE team_id IS NOT NULL
                AND season_type = 'Regular Season'
            ) ranked
            GROUP BY player_id, team_id, grp
          ) t
          GROUP BY player_id
        )
        SELECT player_id FROM player_sigs WHERE sig = $1::bigint[]
        `,
        [signature],
      );
    });

    const matchingIds = rows.map((r) => r.player_id);
    if (matchingIds.length === 0) {
      this.logger.debug(
        `generateRound: no other players share career signature for player ${randomPlayer.playerId} — using solo answer`,
      );
      return { validAnswers: [playerWithSeasons] };
    }

    const validAnswers = await this.playerRepository.find({
      where: { playerId: In(matchingIds) },
      relations: { seasons: true },
    });

    return { validAnswers };
  };

  /**
   * Stops the XState actor for a room, cleans up its subscription, and
   * removes it from the active rooms map.
   *
   * @param roomId - The room ID to destroy.
   */
  destroyRoom(roomId: string) {
    const actor = this.rooms.get(roomId);

    if (actor) {
      this.logger.log(
        `Career path room ${roomId} destroyed (active rooms: ${this.rooms.size - 1})`,
      );
      this.subscriptions.get(roomId)?.unsubscribe();
      this.subscriptions.delete(roomId);
      actor.stop();
      this.rooms.delete(roomId);
    }
  }
}
