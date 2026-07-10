from sqlalchemy import create_engine
from app.config.settings import settings

print("DATABASE_URL =", repr(settings.DATABASE_URL))

engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
)