/**
 * Exposes the on-device QVAC inference to the renderer as `window.qvac`.
 * The web app calls these instead of any cloud AI endpoint (see
 * apps/web/lib/agent-api.ts). Everything runs locally in the main process.
 */
import { contextBridge, ipcRenderer } from 'electron';

interface ReviewContext {
  revenue: number;
  expenses: number;
  cashFlow: number;
  taxEstimate: number;
  topCategories: { category: string; amount: number }[];
  anomalies: { detail?: string }[];
}

contextBridge.exposeInMainWorld('qvac', {
  available: true,
  chat: (message: string, context?: string): Promise<string> =>
    ipcRenderer.invoke('qvac:chat', { message, context }),
  insights: (ctx: ReviewContext) =>
    ipcRenderer.invoke('qvac:insights', { ctx }),
  status: () => ipcRenderer.invoke('qvac:status'),
});
