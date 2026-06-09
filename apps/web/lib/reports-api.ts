import type { FinancialReport, Recommendation } from "@suite/types";
import { api } from "./api";

export type ReportWithRecommendations = FinancialReport & {
  recommendations: Recommendation[];
};

export const reportsApi = {
  async latest(): Promise<FinancialReport | null> {
    const res = await api.get<FinancialReport | null>("/reports/latest");
    return res.data;
  },

  async get(id: string): Promise<ReportWithRecommendations> {
    const res = await api.get<ReportWithRecommendations>(`/reports/${id}`);
    return res.data;
  },

  async list(): Promise<FinancialReport[]> {
    const res = await api.get<FinancialReport[]>("/reports");
    return res.data;
  },
};
