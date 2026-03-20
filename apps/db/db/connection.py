from pathlib import Path

import asyncpg

from config import Settings

_MIGRATIONS_DIR = Path(__file__).parent / "migrations"


async def create_pool(settings: Settings) -> asyncpg.Pool:
    return await asyncpg.create_pool(
        dsn=settings.database_url,
        min_size=settings.db_pool_min,
        max_size=settings.db_pool_max,
    )


async def run_migrations(pool: asyncpg.Pool) -> None:
    """Execute all *.sql files in migrations/ in filename order."""
    sql_files = sorted(_MIGRATIONS_DIR.glob("*.sql"))
    async with pool.acquire() as conn:
        for path in sql_files:
            await conn.execute(path.read_text())
