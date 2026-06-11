# Cloudstech Finance Operations Agent (Vertex ADK + Gemini)

The reasoning "brain" for the financial-review workflow. It calls the NestJS
`/tools/*` endpoints, reads Fivetran-synced data from BigQuery, and triggers/
verifies the connector through the **Fivetran MCP**. Locally, the NestJS
`ReviewOrchestratorService` already runs the same workflow deterministically;
this swaps in Gemini as the planner once GCP is set up.

## Prereqs

- Python ≥ 3.10, and [`uv`](https://astral.sh/uv) (for the Fivetran MCP):
  `curl -LsSf https://astral.sh/uv/install.sh | sh`
- `gcloud` + auth: `gcloud auth application-default login`
- A GCP project with **Vertex AI** + **BigQuery** enabled, and a GCS
  staging bucket.

## Setup

```bash
cd agent
cp .env.example .env        # fill in the values (gitignored)
uv venv && source .venv/bin/activate
uv pip install -e .
```

## Run locally

```bash
# interactive dev UI (pick `finance_agent`)
adk web
# or a one-shot run
adk run finance_agent
```
Seed the session state with `{"owner": "<mongo user id>"}` so the tools know
whose data to use. Make sure the NestJS API is running on `SUITE_API_URL`.

## Deploy to Agent Engine

```bash
python deploy.py
```
Copy the printed resource name into the API's `AGENT_ENGINE_URL`, then point
the agent gateway at it (replacing the local orchestrator).

## Structure

- `finance_agent/agent.py` — the `root_agent` (Gemini + tools + Fivetran MCP)
- `finance_agent/tools.py` — HTTP tools (→ NestJS) + the BigQuery read tool
- `finance_agent/prompts.py` — the 13-step workflow instruction
- `deploy.py` — Agent Engine deployment
