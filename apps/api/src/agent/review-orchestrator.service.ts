import { Injectable, Logger } from '@nestjs/common';
import { BigQueryService } from '../bigquery/bigquery.service';
import { BudgetsService } from '../budgets/budgets.service';
import { FivetranService } from '../fivetran/fivetran.service';
import { InvoicesService } from '../invoices/invoices.service';
import { PlaidService } from '../plaid/plaid.service';
import { ReportsService } from '../reports/reports.service';
import { TasksService } from '../tasks/tasks.service';
import { AgentRunsService } from './agent-runs.service';
import { AgentEventsService } from './agent-events.service';
import { AgentRunDocument, AgentStepData } from './schemas/agent-run.schema';

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const STEP_DELAY_MS = 250; // makes the live execution visible in the UI

interface ReviewTxn {
  name: string;
  amount: number;
  direction: 'inflow' | 'outflow';
  aiCategory?: string;
  category: string[];
  date: string | Date;
}

const REVIEW_STEPS: { key: string; label: string }[] = [
  { key: 'check_accounts', label: 'Checking connected accounts' },
  { key: 'sync_fivetran', label: 'Triggering Fivetran sync (MCP)' },
  { key: 'verify_sync', label: 'Verifying data sync' },
  { key: 'retrieve', label: 'Retrieving latest transactions' },
  { key: 'categorize', label: 'Categorizing transactions' },
  { key: 'revenue_expenses', label: 'Calculating revenue & expenses' },
  { key: 'cash_flow', label: 'Calculating cash flow' },
  { key: 'tax', label: 'Estimating tax obligations' },
  { key: 'budget', label: 'Comparing against budget targets' },
  { key: 'anomalies', label: 'Detecting anomalies' },
  { key: 'recommend', label: 'Generating recommendations' },
  { key: 'tasks', label: 'Creating action items' },
  { key: 'save', label: 'Saving report' },
];

/**
 * Deterministic local implementation of the financial-review workflow. Runs
 * the 13 visible steps against real data and emits live snapshots over SSE.
 * Runs fully offline with no cloud AI — the numeric work is deterministic and
 * the narrative summary/recommendations are generated on-device by the QVAC
 * SDK (in the desktop app) or via the deterministic heuristics below.
 */
@Injectable()
export class ReviewOrchestratorService {
  private readonly logger = new Logger(ReviewOrchestratorService.name);

  constructor(
    private readonly plaid: PlaidService,
    private readonly budgets: BudgetsService,
    private readonly invoices: InvoicesService,
    private readonly fivetran: FivetranService,
    private readonly bigquery: BigQueryService,
    private readonly reports: ReportsService,
    private readonly tasks: TasksService,
    private readonly runs: AgentRunsService,
    private readonly events: AgentEventsService,
  ) {}

  /** Creates a run, kicks off execution in the background, returns the run id. */
  async start(owner: string): Promise<string> {
    const run = await this.runs.create(owner, {
      type: 'financial_review',
      model: 'local-orchestrator',
      steps: REVIEW_STEPS.map((s) => ({ ...s, status: 'pending' })),
    });
    const runId = run.id as string;
    void this.execute(owner, runId).catch((err) => {
      this.logger.error(`Review run ${runId} failed`, err as Error);
    });
    return runId;
  }

  private snapshot(run: AgentRunDocument) {
    this.events.publish(run.id as string, {
      id: run.id as string,
      status: run.status,
      steps: run.steps,
      reportId: run.reportId,
      error: run.error,
    });
  }

  private async setStep(
    owner: string,
    runId: string,
    step: AgentStepData,
  ): Promise<void> {
    const run = await this.runs.upsertStep(owner, runId, step);
    this.snapshot(run);
  }

  private async execute(owner: string, runId: string): Promise<void> {
    // Accumulators shared across steps.
    let revenue = 0;
    let expenses = 0;
    let txnCount = 0;
    let accountCount = 0;
    const categoryTotals = new Map<string, number>();

    const runStep = async (
      key: string,
      label: string,
      work: () => string | Promise<string>,
    ) => {
      await this.setStep(owner, runId, {
        key,
        label,
        status: 'running',
        startedAt: new Date(),
      });
      await sleep(STEP_DELAY_MS);
      const detail = await work();
      await this.setStep(owner, runId, {
        key,
        label,
        status: 'done',
        detail,
        finishedAt: new Date(),
      });
    };

    try {
      await runStep(
        'check_accounts',
        'Checking connected accounts',
        async () => {
          const accounts = await this.plaid.listAccounts(owner);
          accountCount = accounts.length;
          return `${accountCount} account${accountCount === 1 ? '' : 's'} connected`;
        },
      );

      await runStep(
        'sync_fivetran',
        'Triggering Fivetran sync (MCP)',
        async () => {
          if (!this.fivetran.configured)
            return 'Fivetran not configured — skipped';
          const { message } = await this.fivetran.triggerSync();
          return message;
        },
      );

      await runStep('verify_sync', 'Verifying data sync', async () => {
        if (!this.fivetran.configured) return 'skipped';
        const s = await this.fivetran.getStatus();
        return `Connector ${s.syncState ?? 'unknown'} (setup: ${s.setupState ?? 'n/a'})`;
      });

      let txns: ReviewTxn[] = [];
      await runStep('retrieve', 'Retrieving latest transactions', async () => {
        // Prefer the Fivetran-synced warehouse; fall back to Mongo.
        if (this.bigquery.configured) {
          try {
            const fromBq = await this.bigquery.listTransactions(owner, 500);
            if (fromBq.length) {
              txns = fromBq;
              txnCount = txns.length;
              return `${txnCount} transactions from BigQuery (Fivetran)`;
            }
          } catch (e) {
            this.logger.warn(
              `BigQuery read failed, using Mongo: ${e instanceof Error ? e.message : String(e)}`,
            );
          }
        }
        const mongo = await this.plaid.listTransactions(owner, undefined, 500);
        txns = mongo.map((t) => ({
          name: t.name,
          amount: t.amount,
          direction: t.direction,
          aiCategory: t.aiCategory,
          category: t.category,
          date: t.date,
        }));
        txnCount = txns.length;
        return `${txnCount} transactions (MongoDB)`;
      });

      await runStep('categorize', 'Categorizing transactions', () => {
        for (const t of txns) {
          if (t.direction === 'outflow') {
            const cat = t.aiCategory || t.category?.[0] || 'Uncategorized';
            categoryTotals.set(
              cat,
              round2((categoryTotals.get(cat) ?? 0) + t.amount),
            );
          }
        }
        return `${categoryTotals.size} expense categories`;
      });

      await runStep(
        'revenue_expenses',
        'Calculating revenue & expenses',
        () => {
          for (const t of txns) {
            if (t.direction === 'inflow') revenue = round2(revenue + t.amount);
            else expenses = round2(expenses + t.amount);
          }
          return `Revenue ${revenue} · Expenses ${expenses}`;
        },
      );

      let cashFlow = 0;
      await runStep('cash_flow', 'Calculating cash flow', () => {
        cashFlow = round2(revenue - expenses);
        return `Net cash flow ${cashFlow}`;
      });

      let taxEstimate = 0;
      await runStep('tax', 'Estimating tax obligations', () => {
        const taxable = Math.max(0, round2(revenue - expenses));
        taxEstimate = round2(taxable * 0.2);
        return `Estimated CIT ${taxEstimate}`;
      });

      let budgetVariance: Record<string, unknown>[] = [];
      await runStep('budget', 'Comparing against budget targets', async () => {
        const summary = await this.budgets.summary(owner);
        budgetVariance = [
          {
            category: 'All budgets',
            budgeted: summary.totalAllocated,
            actual: summary.totalSpent,
            variance: round2(summary.totalSpent - summary.totalAllocated),
            variancePct:
              summary.totalAllocated > 0
                ? round2(
                    ((summary.totalSpent - summary.totalAllocated) /
                      summary.totalAllocated) *
                      100,
                  )
                : 0,
          },
        ];
        return `${summary.exceeded} over budget, ${summary.needsAttention} need attention`;
      });

      const anomalies: Record<string, unknown>[] = [];
      await runStep('anomalies', 'Detecting anomalies', async () => {
        const prior = await this.reports.latest(owner);
        if (prior && prior.expenses > 0 && expenses > prior.expenses * 1.2) {
          const pct = round2(
            ((expenses - prior.expenses) / prior.expenses) * 100,
          );
          anomalies.push({
            type: 'expense_spike',
            detail: `Expenses up ${pct}% vs the previous review`,
            severity: 'warning',
          });
        }
        const top = [...categoryTotals.entries()].sort(
          (a, b) => b[1] - a[1],
        )[0];
        if (top && expenses > 0 && top[1] / expenses > 0.3) {
          anomalies.push({
            type: 'concentration',
            detail: `${top[0]} is ${round2((top[1] / expenses) * 100)}% of expenses ($${top[1]})`,
            severity: 'warning',
          });
        }
        return anomalies.length
          ? `${anomalies.length} anomaly flagged`
          : 'No anomalies detected';
      });

      const period = this.periodFor(txns);
      const topCategories = [...categoryTotals.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([category, amount]) => ({ category, amount }));

      // Deterministic, fully-offline summary + recommendations. The desktop
      // app can additionally generate a richer narrative on-device with the
      // QVAC SDK (window.qvac.insights) and patch it onto the report later.
      void topCategories; // retained for the on-device insights context
      let summaryText = '';
      let recs: {
        title: string;
        rationale: string;
        severity: 'info' | 'warning' | 'critical';
      }[] = [];
      await runStep(
        'recommend',
        'Generating recommendations',
        () => {
          summaryText = this.buildSummary(
            revenue,
            expenses,
            cashFlow,
            anomalies.length,
          );
          recs = this.buildRecommendations(categoryTotals, expenses, anomalies);
          return `${recs.length} recommendations`;
        },
      );

      // Persist the report (with the deterministic summary) so recs/tasks can link.
      const report = await this.reports.createReport(owner, {
        period,
        revenue,
        expenses,
        net: round2(revenue - expenses),
        cashFlow,
        taxEstimate,
        budgetVariance,
        anomalies,
        summaryText,
        kpis: { accounts: accountCount, transactions: txnCount },
        status: 'complete',
        agentRunId: runId,
      });
      const reportId = report.id as string;

      await runStep('tasks', 'Creating action items', async () => {
        for (const r of recs) {
          await this.reports.createRecommendation(owner, { ...r, reportId });
          await this.tasks.create(owner, {
            title: r.title,
            detail: r.rationale,
            reportId,
            source: 'agent',
          });
        }
        return `${recs.length} recommendations + tasks`;
      });

      await runStep('save', 'Saving report', () => 'Report saved');

      const finished = await this.runs.update(owner, runId, {
        status: 'done',
        reportId,
      });
      if (finished) this.snapshot(finished);
    } catch (err) {
      const failed = await this.runs.update(owner, runId, {
        status: 'error',
        error: err instanceof Error ? err.message : 'Run failed',
      });
      if (failed) this.snapshot(failed);
    } finally {
      this.events.complete(runId);
    }
  }

  private periodFor(txns: { date: string | Date }[]): {
    start: Date;
    end: Date;
  } {
    if (!txns.length) {
      const end = new Date();
      const start = new Date(end);
      start.setDate(start.getDate() - 30);
      return { start, end };
    }
    const dates = txns.map((t) => new Date(t.date).getTime());
    return {
      start: new Date(Math.min(...dates)),
      end: new Date(Math.max(...dates)),
    };
  }

  private buildSummary(
    revenue: number,
    expenses: number,
    cashFlow: number,
    anomalyCount: number,
  ): string {
    const trend = cashFlow >= 0 ? 'positive' : 'negative';
    const flag = anomalyCount ? ` ${anomalyCount} item(s) need attention.` : '';
    return `Revenue of $${revenue} against $${expenses} in expenses for a ${trend} cash flow of $${cashFlow}.${flag}`;
  }

  private buildRecommendations(
    categoryTotals: Map<string, number>,
    expenses: number,
    anomalies: Record<string, unknown>[],
  ): {
    title: string;
    rationale: string;
    severity: 'info' | 'warning' | 'critical';
  }[] {
    const recs: {
      title: string;
      rationale: string;
      severity: 'info' | 'warning' | 'critical';
    }[] = [];
    const top = [...categoryTotals.entries()].sort((a, b) => b[1] - a[1])[0];
    if (top) {
      recs.push({
        title: `Review ${top[0]} spending`,
        rationale: `${top[0]} is your largest expense at $${top[1]}. Look for savings or renegotiation.`,
        severity: anomalies.length ? 'warning' : 'info',
      });
    }
    if (expenses > 0) {
      recs.push({
        title: 'Set aside tax reserve',
        rationale:
          'Move ~20% of net profit into a tax reserve so the estimated obligation is covered.',
        severity: 'info',
      });
    }
    recs.push({
      title: 'Schedule next financial review',
      rationale:
        'Run a review monthly to catch anomalies early and stay on budget.',
      severity: 'info',
    });
    return recs.slice(0, 3);
  }
}
