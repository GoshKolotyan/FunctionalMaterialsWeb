# Functional Materials — project website

Monorepo for the Functional Materials project site.

| Part | Stack | Path |
|---|---|---|
| Frontend | React 19, TypeScript, Vite, React Router | [`frontend/`](frontend/) |
| Backend | FastAPI, SQLModel, SQLite (Python ≥ 3.10, managed by [uv](https://docs.astral.sh/uv/)) | [`backend/`](backend/) |

## How it works

GitHub Pages only serves static files, so the site is built ahead of time (the same approach as a
plain static site, but with an API for the content):

```
backend/content/seed.yaml ──seed──▶ SQLite ──FastAPI──▶ /api/*  ──export──▶ frontend/public/data/*.json
                                                          │                          │
                                              dev: Vite proxy                 prod: static build
                                                          └──────▶ React ◀───────────┘
```

- **Content lives in [`backend/content/seed.yaml`](backend/content/seed.yaml)**: pages (home, about, contacts),
  team, publications, news. Page and news bodies are Markdown.
- In development the frontend talks to the live API. The production build reads the exported JSON, and the
  JSON has exactly the same shape as the API responses.
- If the API is later deployed to a real server, build with `VITE_DATA_MODE=api VITE_API_URL=https://…`.

## Getting started

Requirements: Node 22+, [uv](https://docs.astral.sh/uv/getting-started/installation/), make.

```bash
make install
make seed
make dev-backend    # terminal 1 → http://localhost:8000/docs
make dev-frontend   # terminal 2 → http://localhost:5173
```

Other commands:

```bash
make test       # backend tests
make lint       # ruff + eslint + tsc
make build      # seed → export → static build in frontend/dist
make preview    # serve the static build locally
```

## Editing content

1. Edit `backend/content/seed.yaml` (or change data through the API at `/docs`, then copy it back to the YAML).
2. Team photos and other images go in `frontend/public/images/`. Reference them as `images/team/name.jpg`.
3. Commit and push to `main`. The site is rebuilt and deployed automatically.

## Deployment (GitHub Pages)

1. Push the repo to GitHub.
2. Go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): tests → seed →
   export → build → deploy. The base path (`/<repo>/` or `/` for a custom domain) is set automatically.
4. Custom domain: add it in the Pages settings and create `frontend/public/CNAME` containing the domain.

Pull requests and non-main branches run [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

Deep links like `/team` work because the build copies `index.html` to `404.html`.

## Layout

```
backend/
  app/            FastAPI app: config, db, models, routers (CRUD for team/publications/news, pages by slug)
  content/        seed.yaml — the site content
  scripts/        seed.py (YAML → SQLite), export.py (API → JSON)
  tests/
frontend/
  src/api/        data client (API or static JSON) and useData hook
  src/components/ Layout, Markdown, Async, ContentPage
  src/pages/      Home, Team, Publications, News, NotFound
  public/         static assets; data/ is generated
```
