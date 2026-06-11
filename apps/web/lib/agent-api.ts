import { api } from "./api";
import { getAccessToken } from "./auth-tokens";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050";

export interface RunStep {
  key: string;
  label: string;
  status: "pending" | "running" | "done" | "error";
  detail?: string;
}

export interface RunSnapshot {
  id: string;
  status: "running" | "done" | "error";
  steps: RunStep[];
  reportId?: string;
  error?: string;
}

export const agentApi = {
  async startReview(): Promise<string> {
    const res = await api.post<{ runId: string }>(
      "/agent/financial-review",
      {},
    );
    return res.data.runId;
  },

  async chat(message: string): Promise<string> {
    const res = await api.post<{ reply: string }>("/agent/chat", { message });
    return res.data.reply;
  },

  /**
   * Streams run snapshots over SSE. Uses fetch (not EventSource) so the JWT
   * Authorization header can be sent. Resolves when the stream closes.
   */
  async streamRun(
    runId: string,
    onSnapshot: (snap: RunSnapshot) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    const token = getAccessToken();
    const res = await fetch(`${BASE}/agent/runs/${runId}/stream`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      signal,
    });
    if (!res.body) return;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const chunks = buffer.split("\n\n");
      buffer = chunks.pop() ?? "";
      for (const chunk of chunks) {
        const dataLine = chunk
          .split("\n")
          .find((l) => l.startsWith("data:"));
        if (!dataLine) continue;
        try {
          onSnapshot(JSON.parse(dataLine.slice(5).trim()) as RunSnapshot);
        } catch {
          // ignore malformed frames
        }
      }
    }
  },
};
