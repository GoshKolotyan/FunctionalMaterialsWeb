# Functional Materials Group — website

Website of the Functional Materials Group, Institute of Chemical Physics NAS RA.

**Live:** https://goshkolotyan.github.io/FunctionalMaterialsWeb/

- `frontend/` — React + TypeScript + Vite
- `backend/` — FastAPI + SQLite (content API)

## Run locally

Requires Node 22+, [uv](https://docs.astral.sh/uv/) and make.

```bash
make install
make seed
make dev-backend    # http://localhost:8000/docs
make dev-frontend   # http://localhost:5173
```

## Edit content

All content (team, publications, news, pages, contacts) is in
[`backend/content/seed.yaml`](backend/content/seed.yaml). Photos go in `frontend/public/images/`.

Push to `main` and the site redeploys automatically.

## Check before pushing

```bash
make check   # lint + tests + build
```
