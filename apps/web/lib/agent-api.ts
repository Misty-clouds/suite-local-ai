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

  /**
   * Answers a finance question. Inference runs entirely on-device via the
   * QVAC SDK in the Suite desktop app (`window.qvac.chat`); the server only
   * supplies the user's live financial context. In a plain browser (no
   * desktop bridge) we return a hint to open the desktop app.
   */
  async chat(message: string): Promise<string> {
    if (typeof window === "undefined" || !window.qvac?.available) {
      return "On-device AI runs in the Suite desktop app. Open Suite Desktop to chat with Suite AI — your data never leaves your machine.";
    }
    let context = "";
    try {
      const res = await api.get<{ context: string }>("/agent/chat-context");
      context = res.data.context;
    } catch {
      // No context is fine — the assistant can still answer generally.
    }
    return window.qvac.chat(message, context);
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
