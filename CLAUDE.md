# Suite — Monorepo

## Architecture

Turborepo + pnpm workspace monorepo with 4 deployable apps and 5 shared packages.

### Apps

| App | Path | Framework | Port | Domain |
|-----|------|-----------|------|--------|
| Landing | `apps/landing` | Next.js 16.1.6 | 3000 | `suite.cloudstech.org` |
| Web (dashboard) | `apps/web` | Next.js 16.1.6 | 3001 | `app.suite.cloudstech.org` |
| Admin (super-admin) | `apps/admin` | Next.js 16.2.1 | 3002 | `cp.suite.cloudstech.org` |
| API | `apps/api` | NestJS 11 | 5000 | `api.suite.cloudstech.org` |
| Mobile | `apps/mobile` | Flutter | — | — |

**IMPORTANT:** `apps/admin` uses Next.js 16.2.x which has breaking changes vs 16.1.x. Do NOT upgrade `apps/web` or `apps/landing` to 16.2.x without testing. Do NOT force all apps to the same Next.js version.

### Packages

| Package | Path | Purpose |
|---------|------|---------|
| `@suite/config` | `packages/config` | Shared tsconfig, eslint, tailwind configs |
| `@suite/types` | `packages/types` | Shared TypeScript types (Task, User, ApiResponse, etc.) |
| `@suite/ui` | `packages/ui` | Shared React components (Button, Badge, Avatar, ProgressBar) |
| `@suite/utils` | `packages/utils` | Shared helpers (formatCurrency, slugify, groupBy, etc.) |
| `@suite/sdk` | `packages/sdk` | API client factory (`createClient`) for all frontend apps |

## Commands

```bash
pnpm install          # install all deps
pnpm dev              # start all apps in parallel (turbo)
pnpm build            # build everything (packages first, then apps)
pnpm lint             # lint all apps and packages
pnpm typecheck        # type-check everything
pnpm format           # format with prettier
pnpm --filter @suite/web dev    # run only the web app
pnpm --filter @suite/api test   # run only API tests
```

## Docker

```bash
docker compose up --build    # build and start all services + nginx
```

## Code Conventions

- All workspace packages use `workspace:*` protocol in package.json
- All Next.js apps have `output: "standalone"` for Docker builds
- Shared types go in `packages/types`, NOT duplicated across apps
- API client usage: import `createClient` from `@suite/sdk`
- Each app has its own `.env` / `.env.example` — env vars are NOT shared
- Absolute imports use `@/*` within each app (maps to that app's root)
- Cross-package imports use `@suite/<package>` (e.g., `@suite/types`)

## CI/CD

- **CI** runs on every push/PR to `main` and `develop`: lint, typecheck, build, API tests
- **Docker Build** runs on push to `main`: builds and pushes images to GHCR
- **Deploy** triggers after successful Docker Build: SSH into server, pull, `docker compose up`

## Testing

- API: Jest + Supertest — run with `pnpm --filter @suite/api test`
- Frontend: no test framework configured yet

## Key Files

- `turbo.json` — Turborepo pipeline configuration
- `pnpm-workspace.yaml` — workspace package locations
- `docker-compose.yml` — full stack orchestration
- `infra/nginx/nginx.conf` — subdomain routing
- `infra/docker/Dockerfile.*` — per-app multi-stage Docker builds
