from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="../.env", extra="ignore")


    DATABASE_URL: str
    JWT_SECRET: str | None = None
    JWT_EXPIRES_MINUTES: int = 60


settings = Settings()


def require_jwt_secret() -> str:
    if not settings.JWT_SECRET:
        # erreur claire si secret manquant (exigé par le cahier de charge)
        raise RuntimeError("JWT secret is missing")
    return settings.JWT_SECRET



