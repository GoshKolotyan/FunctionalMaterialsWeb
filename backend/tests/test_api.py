from pathlib import Path

import yaml

from app.models import Member, NewsPost, Page, Publication, ResearchArea, SiteInfo

SEED = Path(__file__).resolve().parent.parent / "content" / "seed.yaml"


def test_health(client):
    assert client.get("/api/health").json() == {"status": "ok"}


def test_team_crud_and_ordering(client):
    b = client.post("/api/team", json={"name": "B", "role": "r", "order": 1}).json()
    client.post("/api/team", json={"name": "A", "role": "r", "order": 2})
    client.post("/api/team", json={"name": "C", "role": "lead", "order": 0})
    assert [m["name"] for m in client.get("/api/team").json()] == ["C", "B", "A"]

    resp = client.put(f"/api/team/{b['id']}", json={"name": "B2", "role": "r", "order": 1})
    assert resp.json()["name"] == "B2"
    assert client.delete(f"/api/team/{b['id']}").status_code == 204
    assert client.get(f"/api/team/{b['id']}").status_code == 404


def test_publications_sorted_by_year_desc(client):
    for year in (2023, 2026, 2024):
        client.post("/api/publications", json={"title": f"P{year}", "authors": "X", "year": year})
    assert [p["year"] for p in client.get("/api/publications").json()] == [2026, 2024, 2023]


def test_news_validation_and_order(client):
    assert client.post("/api/news", json={"slug": "x", "title": "x"}).status_code == 422
    client.post("/api/news", json={"slug": "old", "title": "Old", "date": "2025-01-01"})
    client.post("/api/news", json={"slug": "new", "title": "New", "date": "2026-01-01"})
    assert [n["slug"] for n in client.get("/api/news").json()] == ["new", "old"]


def test_pages_upsert(client):
    assert client.get("/api/pages/about").status_code == 404
    client.put("/api/pages/about", json={"title": "About", "body": "v1"})
    client.put("/api/pages/about", json={"title": "About", "body": "v2"})
    page = client.get("/api/pages/about").json()
    assert page == {"slug": "about", "title": "About", "lead": "", "body": "v2"}


def test_member_group(client):
    m = client.post(
        "/api/team",
        json={"name": "X", "role": "r", "group": "phd"},
    ).json()
    assert m["group"] == "phd"
    assert (
        client.post("/api/team", json={"name": "Y", "role": "r", "group": "boss"}).status_code
        == 422
    )


def test_research_crud(client):
    client.post("/api/research", json={"title": "B", "summary": "s", "order": 1})
    client.post("/api/research", json={"title": "A", "summary": "s", "order": 0})
    assert [r["title"] for r in client.get("/api/research").json()] == ["A", "B"]


def test_products_crud(client):
    assert client.get("/api/products").json() == []
    client.post("/api/products", json={"title": "B", "order": 1})
    client.post("/api/products", json={"title": "A", "order": 0})
    assert [p["title"] for p in client.get("/api/products").json()] == ["A", "B"]


def test_site_info_defaults_and_update(client):
    assert client.get("/api/site").json()["name"] == "Functional Materials"
    client.put("/api/site", json={"name": "FM", "email": "x@example.org"})
    info = client.get("/api/site").json()
    assert info["name"] == "FM" and info["email"] == "x@example.org"


def test_seed_file_is_valid():
    data = yaml.safe_load(SEED.read_text(encoding="utf-8"))
    for key, model in {
        "pages": Page,
        "team": Member,
        "research": ResearchArea,
        "publications": Publication,
        "news": NewsPost,
    }.items():
        for row in data[key] or []:
            model.model_validate(row)
    SiteInfo.model_validate(data["site"])
    assert {p["slug"] for p in data["pages"]} >= {"home", "about", "contacts"}
