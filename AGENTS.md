# AGENTS.md

## Project Overview
That'so product catalog — a frontend-only React + Vite + Tailwind app. No backend, no database, no external API calls. All data comes from static JSON files in `src/data/`.

## Stack
- React 18 + react-router-dom 6
- Vite 5 dev server
- Tailwind CSS 3

## Running in the Sandbox
```
docker compose -f docker-compose.base44.yml up -d --build
```
- Web entry point: host port 3000 → container port 5173 (Vite dev)
- `vite.config.js` has `server.host: true` + `allowedHosts: true` so the preview proxy works.
- No secrets or external credentials required.

## Verifying It Works
- `docker compose -f docker-compose.base44.yml ps` shows the web service healthy.
- `curl -s http://localhost:3000/` returns the HTML shell with `<div id="root">`.
- Preview should show the That'so home page with product cards.
