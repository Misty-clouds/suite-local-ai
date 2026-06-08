# Suite

**The all-in-one business operations platform by [CloudsTech](https://cloudstech.org).**

Suite brings projects, finances, invoicing, and team communication into a single product for freelancers, agencies, and small businesses. Instead of stitching together a project tracker, an accounting tool, an invoicing service, and a chat app, teams run their entire operation from one place — on web and mobile.

It's a full-stack monorepo containing a marketing site, dashboard app, admin panel, REST API, and mobile app — all managed with Turborepo and pnpm workspaces.

## What's inside

Suite is built around five connected workspaces, mirrored across web and mobile:

- **Projects & Tasks** — manage client work with list and Kanban views, per-project Overview, Tasks, Documents, Invoices, and Analytics tabs. Each project carries a budget, deadline, and AI insights.
- **Financials** — track transactions, budgets, bank accounts, and tax from one overview.
- **Invoicing** — create and send invoices to clients, tied back to projects.
- **Team & Roles** — invite members, assign roles and permissions, and organize people by project and channel.
- **Workspace (Discussions)** — team channels and direct messaging.

A guided onboarding/setup flow gets a business running fast: branding, bank connection, team invites, invoice preferences, and a business card.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TailwindCSS 4 |
| Backend | NestJS 11, Node.js 20 |
| Mobile | Flutter (Dart) |
| Monorepo | Turborepo, pnpm workspaces |
| Infrastructure | Docker, Nginx, GitHub Actions |

## Project Structure

```
suite/
├── apps/
│   ├── landing/        Marketing site (Next.js)
│   ├── web/            Dashboard app (Next.js)
│   ├── admin/          Admin panel (Next.js)
│   ├── api/            REST API (NestJS)
│   └── mobile/         Mobile app (Flutter)
│
├── packages/
│   ├── config/         Shared tsconfig, eslint, tailwind configs
│   ├── types/          Shared TypeScript type definitions
│   ├── ui/             Shared React component library
│   ├── utils/          Shared utility functions
│   └── sdk/            Type-safe API client for frontends
│
├── infra/
│   ├── docker/         Dockerfiles for each service
│   └── nginx/          Nginx reverse proxy config
│
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 9 (`corepack enable && corepack prepare pnpm@9 --activate`)
- **Docker** & **Docker Compose** (for containerized deployment)
- **Flutter SDK** (only if working on the mobile app)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Misty-clouds/suites.git
cd suites
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Copy the example env files for each app you want to run:

```bash
cp apps/web/.env.example apps/web/.env
cp apps/landing/.env.example apps/landing/.env
cp apps/admin/.env.example apps/admin/.env
cp apps/api/.env.example apps/api/.env
```

### 4. Start development

```bash
# Start all apps in parallel
pnpm dev

# Or start a specific app
pnpm --filter @suite/web dev       # Dashboard on :3001
pnpm --filter @suite/landing dev   # Landing on :3000
pnpm --filter @suite/admin dev     # Admin on :3002
pnpm --filter @suite/api dev       # API on :5000
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Lint all packages and apps |
| `pnpm typecheck` | Type-check all TypeScript |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check formatting without writing |
| `pnpm clean` | Remove all build artifacts and node_modules |

### Filtering by app

Use pnpm's `--filter` flag to target a specific app or package:

```bash
pnpm --filter @suite/api test          # Run API tests
pnpm --filter @suite/web build         # Build only the web app
pnpm --filter @suite/ui typecheck      # Typecheck the UI package
```

## Deployment

### Docker (recommended)

Build and start all services with a single command:

```bash
docker compose up --build -d
```

This starts:
- **Nginx** on port 80, routing subdomains to the correct container
- **Landing** → `suite.cloudstech.org`
- **Web** → `app.suite.cloudstech.org`
- **Admin** → `cp.suite.cloudstech.org`
- **API** → `api.suite.cloudstech.org`

### CI/CD

The project uses GitHub Actions with three workflows:

1. **CI** — Runs on every push/PR: lint, typecheck, build, and API tests
2. **Docker Build** — Runs on push to `main`: builds images and pushes to GitHub Container Registry
3. **Deploy** — Triggers after successful Docker Build: SSH into production server and runs `docker compose up`

#### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `DEPLOY_HOST` | Production server IP or hostname |
| `DEPLOY_USER` | SSH username on the server |
| `DEPLOY_SSH_KEY` | Private SSH key for deployment |
| `DEPLOY_PATH` | Path on server (default: `/opt/suites`) |
| `TURBO_TOKEN` | *(Optional)* Turborepo remote cache token |
| `TURBO_TEAM` | *(Optional)* Turborepo team name |

## Contributing

We welcome contributions to Suite! Here's how to get started:

### Setting up for development

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/suites.git
   cd suites
   ```
3. **Install dependencies:**
   ```bash
   pnpm install
   ```
4. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development workflow

1. Make your changes in the appropriate `apps/` or `packages/` directory
2. Run checks before committing:
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm build
   ```
3. Commit your changes with a clear message:
   ```bash
   git commit -m "feat(web): add project filters to dashboard"
   ```
4. Push your branch and open a Pull Request against `main`

### Commit message format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore
Scopes: web, landing, admin, api, ui, types, utils, sdk, config, infra
```

Examples:
- `feat(web): add drag-and-drop task reordering`
- `fix(api): handle null response in auth middleware`
- `chore(infra): update nginx gzip settings`

### Guidelines

- **Keep PRs focused** — one feature or fix per PR
- **Don't mix refactors with features** — separate PRs for each
- **Add types** to `packages/types` if they're used by more than one app
- **Shared components** go in `packages/ui`, app-specific ones stay in their app
- **Don't force Next.js version alignment** across apps — `admin` intentionally uses a different version
- **Test the API** — add Jest tests for new endpoints in `apps/api`
- **Run `pnpm build`** before opening a PR to ensure nothing is broken

### Reporting Issues

Found a bug or have a feature request? [Open an issue](https://github.com/Misty-clouds/suites/issues) with:
- A clear title and description
- Steps to reproduce (for bugs)
- Which app/package is affected

## License

This project is proprietary software owned by **CloudsTech**. All rights reserved.
