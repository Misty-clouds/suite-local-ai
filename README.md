# Suite — On-Device Autonomous Financial Operations Agent

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)
[![Powered by QVAC SDK](https://img.shields.io/badge/AI-QVAC%20SDK%20(on--device)-7c3aed.svg)](https://qvac.tether.io)

> A local-first autonomous agent that runs a small business's entire month-end
> financial review — with **every AI inference running on-device** through the
> **QVAC SDK** (`@qvac/sdk`). No cloud AI, no API bills, your financial data
> never leaves your machine. Ships as a cross-platform **Electron desktop app**.

Built for the **QVAC Hackathon I — Unleash Edge AI** (Tether).

## Why local-first

A business's books are about as private as data gets. Suite proves you don't
have to ship them to a third-party LLM to get an autonomous financial analyst:
the reasoning model runs **on the same machine as the app**, via QVAC's
cross-platform on-device inference SDK. It's private, it works offline, and it
costs nothing per run.

## What it does

Suite's flagship is the **Financial Review Agent**, a multi-step mission that
runs end to end while keeping the owner in control. Every step streams live to
the dashboard over Server-Sent Events:

1. Checks connected bank accounts
2. *(Optional)* Triggers a data sync from connected sources
3. *(Optional)* Verifies the sync completed
4. Retrieves the latest transactions (local MongoDB; optional warehouse)
5. Categorizes transactions
6. Calculates revenue & expenses
7. Calculates net cash flow
8. Estimates the tax reserve
9. Compares actuals against budget targets
10. Detects anomalies (expense spikes, category concentration)
11. **Generates the executive summary + recommendations on-device via the QVAC SDK**
12. Takes action — creates tasks / action items
13. Saves the report

The numeric steps are fully deterministic and run offline. The natural-language
summary, recommendations, and the **Suite AI chat assistant** are generated
locally by the QVAC SDK inside the desktop app — never by a cloud model.

## Tech stack

| Layer | Technology |
|-------|------------|
| **AI brain** | **QVAC SDK (`@qvac/sdk`) — on-device, GGUF via llama.cpp** |
| **Default model** | `QWEN3_1_7B_INST_Q4` (configurable via `QVAC_MODEL`) |
| Desktop shell | Electron (`apps/desktop`) — hosts inference, loads the dashboard |
| Web dashboard | Next.js 16 (React, TypeScript) |
| API | NestJS 11 (TypeScript) |
| Operational DB | MongoDB |
| Monorepo | Turborepo + pnpm |

### AI model

Inference uses the QVAC SDK exclusively. The model is chosen with the
`QVAC_MODEL` env var (see `apps/desktop/.env.example`) and is either:

- a **built-in constant** that downloads out-of-the-box on first launch —
  `QWEN3_1_7B_INST_Q4` (default), `QWEN3_600M_INST_Q4`, `LLAMA_3_2_1B_INST_Q4_0`; or
- a **custom `modelSrc`** — a local `*.gguf` path or a remote URL to any
  llama.cpp-compatible GGUF model (e.g. a QVAC / MedPsy model you have access to).

No QVAC model is required by the rules — only the SDK — so the default ships a
small instruct model that any judge can run with zero setup.

## Disclosures (third-party services)

All AI runs on-device via the QVAC SDK. The following are **optional,
clearly-disclosed, non-AI** cloud data connectors — the app runs **fully
offline against MongoDB** when they are unset (graceful fallback is built in):

- **Plaid** — bank-account linking (sandbox)
- **Fivetran** — operational-data sync
- **BigQuery** — optional warehouse destination for synced data
- **Resend** — invoice emails · **Cloudflare R2** — document storage

## Architecture

Turborepo + pnpm workspace.

| App | Path | Framework | Port |
|-----|------|-----------|------|
| **Desktop** | `apps/desktop` | Electron + QVAC SDK | — |
| Web (dashboard) | `apps/web` | Next.js 16 | 3001 |
| Admin | `apps/admin` | Next.js 16 | 3002 |
| API | `apps/api` | NestJS 11 | 5050 |
| Mobile | `apps/mobile` | Flutter | — |

Shared packages: `@suite/config`, `@suite/types`, `@suite/ui`, `@suite/utils`,
`@suite/sdk`.

The desktop app's Electron **main process** loads the GGUF model once via
`@qvac/sdk` and exposes `chat` / `insights` to the renderer over IPC
(`window.qvac`). The web dashboard calls that bridge instead of any cloud AI.

## Download a prebuilt app (no toolchain needed)

Don't want to build locally? Every desktop installer is built in the cloud via
GitHub Actions for **macOS, Windows and Linux**:

1. Open the **[Actions tab](../../actions/workflows/desktop-build.yml)** →
   **Desktop Build** → **Run workflow** (or open the latest successful run).
2. When the run finishes, scroll to its **Artifacts** section and download the
   installer for your OS:
   - `suite-desktop-macos` — `.dmg` (unsigned: first launch → right-click → **Open**)
   - `suite-desktop-windows` — `.exe`
   - `suite-desktop-linux` — `.AppImage`
3. Install and launch. On **first launch** the QVAC SDK downloads the model
   (`QVAC_MODEL`) once; after that, all AI runs **fully offline** on-device.

> The workflow lives at `.github/workflows/desktop-build.yml`. It packages the
> Electron app with electron-builder on native runners so QVAC's on-device
> native addons match each platform.

## Quick start

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+ (`npm install -g pnpm`)
- A MongoDB connection string (local `mongod` or Atlas)

### Install

```bash
git clone https://github.com/Misty-clouds/suite-local-ai.git
cd suite-local-ai
pnpm install
```

### Configure

```bash
cp apps/api/.env.example apps/api/.env        # set MONGODB_URI + JWT secrets
cp apps/web/.env.example apps/web/.env
cp apps/desktop/.env.example apps/desktop/.env # QVAC_MODEL (defaults are fine)
```

### Run (desktop — the full experience)

```bash
# 1) start the API + web dashboard locally
pnpm --filter @suite/api dev      # http://localhost:5050
pnpm --filter @suite/web dev      # http://localhost:3001

# 2) launch the desktop app (hosts on-device QVAC inference)
pnpm --filter @suite/desktop dev
```

On first launch the QVAC SDK downloads the model (`QVAC_MODEL`) to your machine,
then the **Suite AI** chat and review insights run **entirely offline**. Verify
it for yourself: disconnect from the network after the model is cached and the
assistant keeps working.

### Other commands

```bash
pnpm build       # build everything
pnpm lint        # lint all apps and packages
pnpm typecheck   # type-check everything
pnpm --filter @suite/api test    # run API tests
```

## Reproducibility & hardware

- **Declared hardware:** any consumer laptop/desktop (Apple Silicon or x86_64,
  ≥ 8 GB RAM). The default `QWEN3_1_7B_INST_Q4` runs comfortably on-device; drop
  to `QWEN3_600M_INST_Q4` for lower-spec machines.
- Out-of-the-box: `pnpm install` → run API + web → `pnpm --filter @suite/desktop dev`.
  No cloud AI credentials are needed for the full AI experience.
- All inference uses the QVAC SDK; no multi-GPU/cluster inference is used.

## License

Open source under the **[Apache License 2.0](./LICENSE)** — see [LICENSE](./LICENSE).

---

*Demo video: _add unlisted YouTube link here before submitting._*
