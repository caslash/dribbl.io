import { RoundProps } from '@/nba/careerpath/machine/actors/generate-round';
import { createCareerPathMachine } from '@/nba/careerpath/machine/statemachine';
import { PlayerService } from '@/nba/player/player.service';
import { GameDifficulty, Player, Season } from '@dribblio/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ShortUniqueId from 'short-unique-id';
import { Server, Socket } from 'socket.io';
import { In, Repository } from 'typeorm';

const uid = new ShortUniqueId({ length: 5, dictionary: 'alphanum_upper' });

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

@Injectable()
export class CareerPathService {
  private readonly rooms = new Map<
    string,
    ReturnType<typeof createCareerPathMachine>
  >();

  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,

    private readonly playerService: PlayerService,
  ) {}

  createRoom(io: Server, creatorSocket: Socket): string {
    const roomId = uid.randomUUID();

    const actor = createCareerPathMachine(
      { io, roomId, initialSocket: creatorSocket },
      this.generateRound,
    );

    actor.subscribe((state) => {
      if (state.status === 'done') {
        this.destroyRoom(roomId);
      }
    });

    console.log(`[CareerPathService] Creating room: ${roomId}`);

    this.rooms.set(roomId, actor);
    return roomId;
  }

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

    if (!randomPlayer) return { validAnswers: [] };

    const playerWithSeasons = await this.playerRepository.findOne({
      where: { playerId: randomPlayer.playerId },
      relations: { seasons: true },
    });
    if (!playerWithSeasons) return { validAnswers: [] };

    const signature = computeCareerSignature(playerWithSeasons.seasons);
    if (signature.length === 0) return { validAnswers: [playerWithSeasons] };

    const rows: { player_id: number }[] = await this.playerRepository.query(
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

    const matchingIds = rows.map((r) => r.player_id);
    if (matchingIds.length === 0) return { validAnswers: [playerWithSeasons] };

    const validAnswers = await this.playerRepository.find({
      where: { playerId: In(matchingIds) },
      relations: { seasons: true },
    });

    return { validAnswers };
  };

  private destroyRoom(roomId: string) {
    const actor = this.rooms.get(roomId);

    if (actor) {
      actor.stop();
      this.rooms.delete(roomId);
      console.log(`[CareerPathService] Room destroyed: ${roomId}`);
    }
  }
}
