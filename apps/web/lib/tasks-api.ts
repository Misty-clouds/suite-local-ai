import type { ActionTask } from "@suite/types";
import { api } from "./api";

export const tasksApi = {
  async list(status?: string): Promise<ActionTask[]> {
    const qs = status ? `?status=${encodeURIComponent(status)}` : "";
    const res = await api.get<ActionTask[]>(`/tasks${qs}`);
    return res.data;
  },
  async updateStatus(
    id: string,
    status: "open" | "done" | "dismissed",
  ): Promise<ActionTask> {
    const res = await api.patch<ActionTask>(`/tasks/${id}`, { status });
    return res.data;
  },
};
