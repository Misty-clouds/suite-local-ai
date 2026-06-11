import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VertexAI, type GenerativeModel } from '@google-cloud/vertexai';

export type Severity = 'info' | 'warning' | 'critical';

export interface GeminiInsights {
  summaryText: string;
  recommendations: { title: string; rationale: string; severity: Severity }[];
}

export interface ReviewContext {
  revenue: number;
  expenses: number;
  cashFlow: number;
  taxEstimate: number;
  topCategories: { category: string; amount: number }[];
  anomalies: { detail?: string }[];
}

/**
 * Gemini (Vertex AI) reasoning for the financial review — turns the computed
 * numbers into an executive summary and concrete recommendations. Auth is ADC.
 */
@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private model?: GenerativeModel;

  constructor(private readonly config: ConfigService) {}

  get configured(): boolean {
    return Boolean(this.config.get<string>('GOOGLE_CLOUD_PROJECT'));
  }

  private getModel(): GenerativeModel {
    if (!this.model) {
      const vertex = new VertexAI({
        project: this.config.get<string>('GOOGLE_CLOUD_PROJECT') ?? '',
        location: this.config.get<string>('VERTEX_LOCATION') ?? 'us-central1',
      });
      this.model = vertex.getGenerativeModel({
        model: this.config.get<string>('GEMINI_MODEL') ?? 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.4,
          responseMimeType: 'application/json',
        },
      });
    }
    return this.model;
  }

  async insights(ctx: ReviewContext): Promise<GeminiInsights> {
    const prompt = `You are a finance operations analyst for a small business.
Given this month's figures, write a 1-2 sentence executive summary and 2-3
specific, actionable recommendations.

Revenue: $${ctx.revenue}
Expenses: $${ctx.expenses}
Net cash flow: $${ctx.cashFlow}
Estimated tax: $${ctx.taxEstimate}
Top expense categories: ${JSON.stringify(ctx.topCategories)}
Anomalies: ${JSON.stringify(ctx.anomalies.map((a) => a.detail).filter(Boolean))}

Respond ONLY with JSON of the shape:
{"summaryText": string, "recommendations": [{"title": string, "rationale": string, "severity": "info"|"warning"|"critical"}]}`;

    const result = await this.getModel().generateContent(prompt);
    const text =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
    const parsed = JSON.parse(text) as Partial<GeminiInsights>;

    const allowed: Severity[] = ['info', 'warning', 'critical'];
    return {
      summaryText: parsed.summaryText ?? '',
      recommendations: (parsed.recommendations ?? [])
        .filter((r) => r && r.title && r.rationale)
        .map((r) => ({
          title: String(r.title),
          rationale: String(r.rationale),
          severity: allowed.includes(r.severity) ? r.severity : 'info',
        })),
    };
  }
}
