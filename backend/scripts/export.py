"""Export API content to static JSON for the GitHub Pages build.

Calls the real API endpoints in-process, so the JSON has exactly the shape the
frontend gets from the live API.
"""

import argparse
import json
from pathlib import Path

from fastapi.testclient import TestClient

from app.config import BACKEND_DIR
from app.main import app

ENDPOINTS = ["site", "team", "research", "publications", "news", "pages"]
DEFAULT_OUT = BACKEND_DIR.parent / "frontend" / "public" / "data"


def export(out: Path) -> None:
    out.mkdir(parents=True, exist_ok=True)
    with TestClient(app) as client:
        for name in ENDPOINTS:
            resp = client.get(f"/api/{name}")
            resp.raise_for_status()
            (out / f"{name}.json").write_text(
                json.dumps(resp.json(), ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
            )
            print(f"wrote {out / f'{name}.json'}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    export(parser.parse_args().out)


if __name__ == "__main__":
    main()
