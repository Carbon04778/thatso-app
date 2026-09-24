# AGENTS.md

Static frontend-only React + Vite app (no backend, no database, no secrets needed).

## Dev environment
- `docker-compose.base44.yml` runs a single `web` service: `node:22` image, repo bind-mounted, `npm install && npm run dev -- --host 0.0.0.0 --port 3000`.
- Port 3000 is the only exposed port; Vite dev server serves the app with HMR.
- Product data (`src/data/products.json`) references image URLs on `thatso-germany.de`; those requests will fail/timeout in sandboxes without internet egress to that host, but this does not affect app functionality otherwise.

## Verifying it works
- `curl http://localhost:3000/` should return 200 with HTML.
- The homepage renders a hero carousel and product sections in German (brand: "that'so").
