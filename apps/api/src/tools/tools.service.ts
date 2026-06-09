import { Injectable } from '@nestjs/common';

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

@Injectable()
export class ToolsService {
  /**
   * Lightweight company-income-tax estimate. Defaults to a 20% small-company
   * CIT rate on taxable profit (revenue − expenses, floored at 0).
   */
  estimateTax(input: { revenue: number; expenses: number; citRate?: number }) {
    const taxableProfit = Math.max(0, round2(input.revenue - input.expenses));
    const citRate = input.citRate ?? 0.2;
    const cit = round2(taxableProfit * citRate);
    return { taxableProfit, citRate, cit, estimatedTax: cit };
  }
}
