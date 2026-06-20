/**
 * On-device AI bridge injected by the Suite desktop app's Electron preload
 * (see apps/desktop/electron/preload.ts). Present only when the web dashboard
 * runs inside Suite Desktop; absent in a plain browser.
 */
export interface QvacReviewContext {
  revenue: number;
  expenses: number;
  cashFlow: number;
  taxEstimate: number;
  topCategories: { category: string; amount: number }[];
  anomalies: { detail?: string }[];
}

export interface QvacInsights {
  summaryText: string;
  recommendations: {
    title: string;
    rationale: string;
    severity: "info" | "warning" | "critical";
  }[];
}

export interface QvacStatus {
  state: "idle" | "loading" | "ready" | "error";
  model: string;
  progress: number;
  error?: string;
}

export interface QvacBridge {
  available: true;
  chat(message: string, context?: string): Promise<string>;
  insights(ctx: QvacReviewContext): Promise<QvacInsights>;
  status(): Promise<QvacStatus>;
}

declare global {
  interface Window {
    qvac?: QvacBridge;
  }
}

export {};
