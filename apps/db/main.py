import argparse
import asyncio

from pipeline.orchestrator import run


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="nba-pipeline",
        description="NBA stats data pipeline — scrapes stats.nba.com into Postgres",
    )
    parser.add_argument(
        "--mode",
        choices=["full", "season", "player"],
        required=True,
        help="full=all historical players, season=one season's active roster, player=single player",
    )
    parser.add_argument(
        "--season",
        metavar="YYYY-YY",
        help="Season string (e.g. 2023-24). Required for --mode=season.",
    )
    parser.add_argument(
        "--player-id",
        type=int,
        metavar="ID",
        help="NBA player ID. Required for --mode=player.",
    )
    parser.add_argument(
        "--reset-failed",
        action="store_true",
        help="Reset previously-failed players back to pending before running.",
    )
    args = parser.parse_args()

    asyncio.run(
        run(
            mode=args.mode,
            season=args.season,
            player_id=args.player_id,
            reset_failed_players=args.reset_failed,
        )
    )


if __name__ == "__main__":
    main()
