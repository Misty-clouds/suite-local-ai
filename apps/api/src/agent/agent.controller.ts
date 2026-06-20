import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  MessageEvent,
  Param,
  Post,
  Sse,
} from '@nestjs/common';
import { concat, from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Activity } from '../activity/decorators/activity.decorator';
import { SkipTransform } from '../common/decorators/skip-transform.decorator';
import { ReportsService } from '../reports/reports.service';
import { InvoicesService } from '../invoices/invoices.service';
import { BudgetsService } from '../budgets/budgets.service';
import { AgentRunsService } from './agent-runs.service';
import { AgentEventsService, RunSnapshot } from './agent-events.service';
import { ReviewOrchestratorService } from './review-orchestrator.service';

@Controller('agent')
export class AgentController {
  constructor(
    private readonly runs: AgentRunsService,
    private readonly events: AgentEventsService,
    private readonly orchestrator: ReviewOrchestratorService,
    private readonly reports: ReportsService,
    private readonly invoices: InvoicesService,
    private readonly budgets: BudgetsService,
  ) {}

  @Post('financial-review')
  @HttpCode(HttpStatus.OK)
  @Activity('Ran a financial review', 'agent')
  async startReview(@CurrentUser('userId') userId: string) {
    const runId = await this.orchestrator.start(userId);
    return { runId };
  }

  /**
   * Returns the user's live financial context as a plain-text block. The AI
   * reply itself is generated on-device by the QVAC SDK in the desktop app
   * (window.qvac.chat) — no inference happens on the server.
   */
  @Get('chat-context')
  async chatContext(
    @CurrentUser('userId') userId: string,
  ): Promise<{ context: string }> {
    const [report, invSummary, overdue, budgetSummary] = await Promise.all([
      this.reports.latest(userId),
      this.invoices.summary(userId),
      this.invoices.overdueInvoices(userId),
      this.budgets.summary(userId),
    ]);

    const lines: string[] = ["The user's live financial data:"];
    if (report) {
      lines.push(
        `- Latest review: revenue $${report.revenue}, expenses $${report.expenses}, net $${report.net}, cash flow $${report.cashFlow}.`,
      );
    }
    lines.push(
      `- Invoices: ${invSummary.count} total, $${invSummary.totalBilled} billed, $${invSummary.totalPaid} paid, $${invSummary.outstanding} outstanding, ${invSummary.overdueCount} overdue ($${invSummary.overdueAmount}).`,
    );
    if (overdue.length > 0) {
      const list = overdue
        .slice(0, 10)
        .map(
          (o) =>
            `${o.invoiceNumber} — ${o.client}, $${o.amountDue} due ${o.dueDate ? new Date(o.dueDate).toISOString().slice(0, 10) : 'n/a'}`,
        )
        .join('; ');
      lines.push(`- Overdue invoices: ${list}.`);
    }
    lines.push(
      `- Budgets: $${budgetSummary.totalAllocated} allocated, $${budgetSummary.totalSpent} spent, $${budgetSummary.remaining} remaining, ${budgetSummary.exceeded} exceeded, ${budgetSummary.needsAttention} need attention.`,
    );

    return { context: lines.join('\n') };
  }

  @Get('runs/:id')
  getRun(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.runs.findOne(userId, id);
  }

  @SkipTransform()
  @Sse('runs/:id/stream')
  stream(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ): Observable<MessageEvent> {
    const live$ = this.events.channel(id).asObservable();
    return from(this.runs.findOne(userId, id)).pipe(
      switchMap((run) => {
        const initial: RunSnapshot = {
          id: run.id as string,
          status: run.status,
          steps: run.steps,
          reportId: run.reportId,
          error: run.error,
        };
        // If the run already finished, just send the final state and close.
        return run.status === 'running'
          ? concat(of(initial), live$)
          : of(initial);
      }),
      map((snapshot): MessageEvent => ({ data: snapshot })),
    );
  }
}
