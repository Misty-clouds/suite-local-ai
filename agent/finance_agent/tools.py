"""Tools the Finance Ops Agent calls.

HTTP tools hit the NestJS `/tools/*` endpoints (shared service token + owner
header). The BigQuery tool reads the transactions that Fivetran synced from
MongoDB into the warehouse. The owner id comes from session state.
"""

from __future__ import annotations

import os
from typing import Any

import requests
from google.adk.tools import ToolContext

API_URL = os.environ.get("SUITE_API_URL", "http://localhost:5050")
AGENT_TOKEN = os.environ.get("AGENT_SERVICE_TOKEN", "")
BQ_DATASET = os.environ.get("BIGQUERY_DATASET", "cloudstech_finance")
GCP_PROJECT = os.environ.get("GOOGLE_CLOUD_PROJECT", "")


def _owner(tool_context: ToolContext) -> str:
    owner = tool_context.state.get("owner")
    if not owner:
        raise ValueError("No `owner` in session state")
    return str(owner)


def _headers(owner: str) -> dict[str, str]:
    return {
        "x-agent-token": AGENT_TOKEN,
        "x-owner-id": owner,
        "Content-Type": "application/json",
    }


def _get(path: str, owner: str) -> Any:
    r = requests.get(f"{API_URL}{path}", headers=_headers(owner), timeout=30)
    r.raise_for_status()
    return r.json().get("data")


def _post(path: str, owner: str, body: dict) -> Any:
    r = requests.post(
        f"{API_URL}{path}", headers=_headers(owner), json=body, timeout=30
    )
    r.raise_for_status()
    return r.json().get("data")


# ─── Read tools ──────────────────────────────────────────────────────────────

def get_accounts(tool_context: ToolContext) -> list:
    """List the user's connected bank accounts and balances."""
    return _get("/tools/accounts", _owner(tool_context))


def query_transactions(tool_context: ToolContext) -> list:
    """Read the latest transactions from BigQuery (the Fivetran destination)."""
    from google.cloud import bigquery  # imported lazily so deploy is light

    owner = _owner(tool_context)
    client = bigquery.Client(project=GCP_PROJECT)
    sql = f"""
        SELECT name, merchantName, amount, direction, category, aiCategory, date
        FROM `{GCP_PROJECT}.{BQ_DATASET}.transactions`
        WHERE owner = @owner
        ORDER BY date DESC
        LIMIT 500
    """
    job = client.query(
        sql,
        job_config=bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("owner", "STRING", owner)
            ]
        ),
    )
    return [dict(row) for row in job.result()]


def get_budget_summary(tool_context: ToolContext) -> dict:
    """Budget targets vs. actual spend."""
    return _get("/tools/budget-summary", _owner(tool_context))


def get_invoice_summary(tool_context: ToolContext) -> dict:
    """Receivables / overdue invoices."""
    return _get("/tools/invoice-summary", _owner(tool_context))


def estimate_tax(revenue: float, expenses: float, tool_context: ToolContext) -> dict:
    """Estimate the company income tax obligation from revenue and expenses."""
    return _post(
        "/tools/tax-estimate",
        _owner(tool_context),
        {"revenue": revenue, "expenses": expenses},
    )


# ─── Write tools ─────────────────────────────────────────────────────────────

def save_report(report: dict, tool_context: ToolContext) -> dict:
    """Persist the financial review report. Returns the saved report (with id).

    `report` must include period {start,end} (ISO dates), revenue, expenses,
    net, cashFlow, taxEstimate, budgetVariance[], anomalies[], summaryText.
    """
    return _post("/tools/reports", _owner(tool_context), report)


def create_recommendation(
    title: str,
    rationale: str,
    severity: str,
    report_id: str,
    tool_context: ToolContext,
) -> dict:
    """Save a recommendation linked to a report (severity: info|warning|critical)."""
    return _post(
        "/tools/recommendations",
        _owner(tool_context),
        {
            "title": title,
            "rationale": rationale,
            "severity": severity,
            "reportId": report_id,
        },
    )


def create_task(
    title: str, detail: str, report_id: str, tool_context: ToolContext
) -> dict:
    """Create an actionable task in the user's workspace, linked to a report."""
    return _post(
        "/tools/tasks",
        _owner(tool_context),
        {"title": title, "detail": detail, "reportId": report_id},
    )
