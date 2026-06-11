# Deploying the API (pxxl / Railway / Render — no Docker)

The API is a NestJS app in a pnpm + Turborepo monorepo. These platforms clone
the **whole repo**, run a build command, then a start command. Point them at the
**repo root** (not `apps/api`) so the pnpm workspace resolves.

## Settings to enter in the dashboard

| Field | Value |
|-------|-------|
| Root directory | `/` (repo root) |
| Install command | `pnpm install --frozen-lockfile --filter @suite/api...` |
| Build command | `pnpm run build:api` |
| Start command | `pnpm run start:api` |
| Node version | `20` (pinned via `.nvmrc`) |
| Health check path | `/health` |
| Port | leave to the platform — the app reads `$PORT` (falls back to 5050) |

> `build:api` runs `nest build` → `apps/api/dist`. `start:api` runs
> `node apps/api/dist/main.js`. `@suite/types` is types-only (compiled away), so
> no extra build steps are needed.
>
> The `--filter @suite/api...` on install pulls **only** the API's dependency
> subtree — it skips the three Next.js frontends, so installs are much smaller
> and faster on a small free builder. (Plain `pnpm install --frozen-lockfile`
> also works but installs everything.)

## Environment variables (set in the dashboard, not a file)

```
NODE_ENV=production
# PORT is injected by the platform — do not set it.

# Mongo (Atlas) — add 0.0.0.0/0 under Atlas → Network Access (dynamic egress IPs)
MONGODB_URI=mongodb+srv://...

# Auth
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
AGENT_SERVICE_TOKEN=...

# CORS — your deployed web origin(s), comma-separated.
# (Any *.vercel.app is already allowed automatically.)
CORS_ORIGINS=https://your-web.example.com

# Plaid — keep sandbox for the testing phase
PLAID_CLIENT_ID=...
PLAID_SECRET=...
PLAID_ENV=sandbox

# Google Cloud (BigQuery + Vertex/Gemini)
GOOGLE_CLOUD_PROJECT=cloudstech-finance
VERTEX_LOCATION=us-central1
BIGQUERY_DATASET=mongo_suite
# Paste the FULL service-account key JSON as ONE value (not a file path).
# main.ts writes it to a temp file and sets GOOGLE_APPLICATION_CREDENTIALS.
GOOGLE_CREDENTIALS_JSON={"type":"service_account","project_id":"...", ... }

# Fivetran
FIVETRAN_API_KEY=...
FIVETRAN_API_SECRET=...
FIVETRAN_CONNECTOR_ID=...
FIVETRAN_ALLOW_WRITES=true

# Resend (invoice emails) — optional for testing
RESEND_API_KEY=...
RESEND_FROM=Suite <onboarding@resend.dev>
```

## Notes
- **SSE works here** (unlike Vercel) — these are long-lived containers, so the
  agent's live `/agent/runs/:id/stream` financial-review timeline streams fine.
- **GCP key:** use `GOOGLE_CREDENTIALS_JSON` (the whole JSON). Do **not** set
  `GOOGLE_APPLICATION_CREDENTIALS` — the app derives it.
- **Web app:** set `NEXT_PUBLIC_API_URL` on the web host to this API's URL, and
  make sure that origin is in `CORS_ORIGINS` (Vercel domains are auto-allowed).
- **Docker:** `infra/docker/Dockerfile.api` is for a future VPS and is not used
  by this buildpack flow.
