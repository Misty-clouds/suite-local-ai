"""Deploy the Finance Ops Agent to Vertex AI Agent Engine.

Prereqs:
  • gcloud auth application-default login   (or a service-account key)
  • GOOGLE_CLOUD_PROJECT, VERTEX_LOCATION, AGENT_STAGING_BUCKET set
Run:
  python deploy.py
Then copy the printed resource name into the API's AGENT_ENGINE_URL.
"""

from __future__ import annotations

import os

import vertexai
from vertexai import agent_engines
from vertexai.preview import reasoning_engines

from finance_agent import root_agent

PROJECT = os.environ["GOOGLE_CLOUD_PROJECT"]
LOCATION = os.environ.get("VERTEX_LOCATION", "us-central1")
STAGING_BUCKET = os.environ["AGENT_STAGING_BUCKET"]  # gs://your-bucket


def main() -> None:
    vertexai.init(project=PROJECT, location=LOCATION, staging_bucket=STAGING_BUCKET)

    app = reasoning_engines.AdkApp(agent=root_agent, enable_tracing=True)

    remote = agent_engines.create(
        agent_engine=app,
        requirements=[
            "google-adk",
            "google-cloud-aiplatform[agent_engines]",
            "google-cloud-bigquery",
            "requests",
        ],
        extra_packages=["finance_agent"],
    )
    print("Deployed. Set AGENT_ENGINE_URL to:")
    print(remote.resource_name)


if __name__ == "__main__":
    main()
