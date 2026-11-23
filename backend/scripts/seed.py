"""Rebuild the SQLite database from content/seed.yaml (drops existing content)."""

import argparse
from pathlib import Path

import yaml
from sqlmodel import Session, SQLModel

from app.config import BACKEND_DIR
from app.db import create_db, engine
from app.models import Member, NewsPost, Page, Product, Publication, ResearchArea, SiteInfo

TABLES: dict[str, type[SQLModel]] = {
    "pages": Page,
    "team": Member,
    "research": ResearchArea,
    "publications": Publication,
    "products": Product,
    "news": NewsPost,
}


def seed(path: Path) -> dict[str, int]:
    data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    SQLModel.metadata.drop_all(engine)
    create_db()
    counts: dict[str, int] = {}
    with Session(engine) as session:
        for key, model in TABLES.items():
            rows = data.get(key) or []
            session.add_all(model.model_validate(row) for row in rows)
            counts[key] = len(rows)
        session.add(SiteInfo.model_validate(data.get("site") or {}))
        session.commit()
    return counts


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("file", nargs="?", type=Path, default=BACKEND_DIR / "content" / "seed.yaml")
    counts = seed(parser.parse_args().file)
    print("seeded:", ", ".join(f"{k}={v}" for k, v in counts.items()))


if __name__ == "__main__":
    main()
