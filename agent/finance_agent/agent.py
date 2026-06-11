"""Cloudstech Finance Operations Agent (Vertex ADK + Gemini).

Single orchestrator agent that runs the financial-review workflow using:
  • HTTP function tools  -> NestJS /tools/* (read app data, write report/tasks)
  • a BigQuery tool      -> reads Fivetran-synced transactions
  • the Fivetran MCP      -> triggers + verifies the connector sync
"""

from __future__ import annotations

import os

from google.adk.agents import Agent
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters

from .prompts import SYSTEM_PROMPT
from . import tools

# Fivetran's official MCP server is a stdio server launched via uvx; it
# authenticates with the API key/secret and exposes trigger/status tools.
fivetran_mcp = MCPToolset(
    connection_params=StdioServerParameters(
        command="uvx",
        args=[
            "--from",
            "git+https://github.com/fivetran/fivetran-mcp",
            "fivetran-mcp",
        ],
        env={
            "FIVETRAN_API_KEY": os.environ.get("FIVETRAN_API_KEY", ""),
            "FIVETRAN_API_SECRET": os.environ.get("FIVETRAN_API_SECRET", ""),
            "FIVETRAN_ALLOW_WRITES": os.environ.get("FIVETRAN_ALLOW_WRITES", "true"),
        },
    )
)

root_agent = Agent(
    name="finance_ops_agent",
    model=os.environ.get("AGENT_MODEL", "gemini-2.5-flash"),
    description="Autonomously runs a small business's financial review.",
    instruction=SYSTEM_PROMPT,
    tools=[
        tools.get_accounts,
        tools.query_transactions,
        tools.get_budget_summary,
        tools.get_invoice_summary,
        tools.estimate_tax,
        tools.save_report,
        tools.create_recommendation,
        tools.create_task,
        fivetran_mcp,
    ],
)
