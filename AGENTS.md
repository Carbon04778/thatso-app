# AGENTS.md

- Frontend-only Vite 5 + React SPA (rebuild of the WordPress/Elementor site thatso-germany.de). No backend, no DB.
- Run: `docker compose -f docker-compose.base44.yml up -d` → Vite dev server on host port 3000 (container 5173). Dependencies install via `npm ci` on container start into a named `node_modules` volume.
- `vite.config.js` sets `allowedHosts: true` because Vite 5 predates `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`; polling watch is on for bind mounts.
- Contact forms POST to the live site's Contact Form 7 REST endpoint; optional `VITE_CF7_ENDPOINT` overrides it (`{id}` placeholder). Not required to boot.
- `scripts/fetch-wp-*.cjs` are one-off importers that pulled content from the live WP site into `src/wp` / `src/data`; not part of the run.
- Verify: `curl localhost:3000` returns the Vite HTML shell; the page renders in the preview.
