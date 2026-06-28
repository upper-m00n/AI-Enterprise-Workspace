from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME:str
    ENV:str
    DEBUG: bool

    HOST: str
    PORT: int

    SECRET_KEY: str
    ALGORITHM: str

    ACCESS_TOKEN_EXPIRE_MINUTES: int

    DATABASE_URL: str

    FRONTEND_URL: str

    GROQ_API_KEY: str = ""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )
    
settings = Settings()

