# Suite — Autonomous Financial Operations Agent

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> An autonomous agent that runs a small business's entire month-end financial
> review — powered by **Gemini** on **Google Cloud**, with the **Fivetran MCP
> server** moving operational data into **BigQuery** so the agent reasons on
> numbers it can trust.

Built for the **Google Cloud Rapid Agent Hackathon — Fivetran track**.

## What it does

Suite's flagship is the **Financial Review Agent**, a multi-step mission that
runs end to end while keeping the owner in control. Every step streams live to
the dashboard over Server-Sent Events:

1. Checks connected bank accounts (Plaid)
2. **Triggers a Fivetran sync via the Fivetran MCP server** → lands MongoDB data into BigQuery
3. Verifies the sync completed
4. Retrieves the latest transactions from the Fivetran-synced BigQuery warehouse
5. Categorizes transactions
6. Calculates revenue & expenses
7. Calculates net cash flow
8. Estimates the tax reserve
9. Compares actuals against budget targets
10. Detects anomalies (expense spikes, category concentration)
11. **Generates an executive summary + recommendations with Gemini (Vertex AI)**
12. Takes action — creates tasks / action items
13. Saves the report

## Tech stack

| Layer | Technology |
|-------|------------|
| Brain | Google Cloud Agent Builder + Gemini (Vertex AI) |
| Superpower (data) | Fivetran + Model Context Protocol (MCP) |
| Warehouse | Google BigQuery |
| Operational DB | MongoDB |
| Bank links | Plaid |
| API | NestJS 11 (TypeScript) |
| Web dashboard | Next.js 16 (React, TypeScript) |
| Monorepo | Turborepo + pnpm |

## Architecture

Turborepo + pnpm workspace with 4 deployable apps and 5 shared packages.

| App | Path | Framework | Port |
|-----|------|-----------|------|
| Web (dashboard) | `apps/web` | Next.js 16 | 3001 |
| Admin | `apps/admin` | Next.js 16 | 3002 |
| API | `apps/api` | NestJS 11 | 5050 |
| Mobile | `apps/mobile` | Flutter | — |

Shared packages: `@suite/config`, `@suite/types`, `@suite/ui`, `@suite/utils`,
`@suite/sdk`.

## Quick start

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+ (`npm install -g pnpm`)
- A MongoDB connection string
- (Optional, for full agent) Google Cloud project, Fivetran account, Plaid keys

### Clone & install

```bash
git clone https://github.com/Misty-clouds/suite.git
cd suite
pnpm install
```

### Configure environment

Each app has its own `.env`. Copy the examples and fill in your keys:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Key variables for the API (`apps/api/.env`):

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/suite

# Google Cloud / Gemini (Vertex AI)
GOOGLE_CLOUD_PROJECT=your-gcp-project
VERTEX_LOCATION=us-central1
GEMINI_MODEL=gemini-2.5-flash
BIGQUERY_DATASET=mongo_suite

# Fivetran
FIVETRAN_API_KEY=your-key
FIVETRAN_API_SECRET=your-secret
FIVETRAN_CONNECTOR_ID=your-connector-id

# Plaid
PLAID_CLIENT_ID=your-client-id
PLAID_SECRET=your-secret
```

> The agent degrades gracefully: if Fivetran, BigQuery, or Gemini is not
> configured, those steps are skipped or fall back to local data, and the
> mission still completes.

### Run

```bash
pnpm dev                         # start all apps in parallel
pnpm --filter @suite/api dev     # API only  (http://localhost:5050)
pnpm --filter @suite/web dev     # web only  (http://localhost:3001)
```

### Other commands

```bash
pnpm build       # build everything
pnpm lint        # lint all apps and packages
pnpm typecheck   # type-check everything
pnpm --filter @suite/api test    # run API tests
```

### Docker

```bash
docker compose up --build
```

## License

This project is open source under the **[MIT License](./LICENSE)** — you are
free to clone, modify, and use it. See the [LICENSE](./LICENSE) file for the
full text.
