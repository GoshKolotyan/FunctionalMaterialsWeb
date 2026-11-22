from collections.abc import Iterator
from pathlib import Path

from sqlalchemy.engine import Engine
from sqlmodel import Session, SQLModel, create_engine

from app.config import settings


def make_engine(url: str) -> Engine:
    if url.startswith("sqlite:///") and ":memory:" not in url:
        Path(url.removeprefix("sqlite:///")).parent.mkdir(parents=True, exist_ok=True)
    return create_engine(url, connect_args={"check_same_thread": False})


engine = make_engine(settings.database_url)


def create_db(bind: Engine = engine) -> None:
    from app import models  # noqa: F401  (register tables)

    SQLModel.metadata.create_all(bind)


def get_session() -> Iterator[Session]:
    with Session(engine) as session:
        yield session
