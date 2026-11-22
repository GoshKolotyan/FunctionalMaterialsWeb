.PHONY: install seed export dev-backend dev-frontend build preview test lint check

install:            ## Install backend and frontend dependencies
	cd backend && uv sync
	cd frontend && npm ci

seed:               ## Rebuild SQLite DB from backend/content/seed.yaml
	cd backend && uv run python -m scripts.seed

export:             ## Dump API content to frontend/public/data/*.json
	cd backend && uv run python -m scripts.export

dev-backend:        ## FastAPI on http://localhost:8000 (docs at /docs)
	cd backend && uv run uvicorn app.main:app --reload --port 8000

dev-frontend:       ## Vite on http://localhost:5173, proxies /api to the backend
	cd frontend && npm run dev

build: seed export  ## Static production build in frontend/dist
	cd frontend && npm run build

preview: build      ## Serve the static build locally (same as GitHub Pages)
	cd frontend && npm run preview

test:
	cd backend && uv run pytest -q

lint:
	cd backend && uv run ruff check . && uv run ruff format --check .
	cd frontend && npm run lint && npm run typecheck

check: lint test build
