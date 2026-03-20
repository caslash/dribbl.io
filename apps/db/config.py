from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str
    direct_database_url: str | None = None  # Prisma projects set this to the direct Postgres URL
    db_pool_min: int = 2
    db_pool_max: int = 15
    concurrency: int = 10       # asyncio.Semaphore limit in fetcher
    request_timeout: int = 30   # per-request HTTP timeout (seconds)

    @model_validator(mode="after")
    def resolve_database_url(self) -> "Settings":
        """
        Prisma projects use two URLs:
          DATABASE_URL      — points to a connection pooler (Prisma Accelerate, pgBouncer, etc.)
          DIRECT_DATABASE_URL — direct Postgres connection, required by asyncpg

        Use DIRECT_DATABASE_URL when present; otherwise fall back to DATABASE_URL
        after stripping any 'prisma+' scheme prefix.
        """
        url = self.direct_database_url or self.database_url
        self.database_url = url.replace("prisma+postgres://", "postgresql://", 1)
        return self


settings = Settings()
