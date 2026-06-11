import {
  Body,
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
import { SkipTransform } from '../common/decorators/skip-transform.decorator';
import { GeminiService } from '../gemini/gemini.service';
import { ReportsService } from '../reports/reports.service';
import { AgentRunsService } from './agent-runs.service';
import { AgentEventsService, RunSnapshot } from './agent-events.service';
import { ReviewOrchestratorService } from './review-orchestrator.service';
import { ChatDto } from './dto/chat.dto';

@Controller('agent')
export class AgentController {
  constructor(
    private readonly runs: AgentRunsService,
    private readonly events: AgentEventsService,
    private readonly orchestrator: ReviewOrchestratorService,
    private readonly gemini: GeminiService,
    private readonly reports: ReportsService,
  ) {}

  @Post('financial-review')
  @HttpCode(HttpStatus.OK)
  async startReview(@CurrentUser('userId') userId: string) {
    const runId = await this.orchestrator.start(userId);
    return { runId };
  }

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  async chat(
    @CurrentUser('userId') userId: string,
    @Body() dto: ChatDto,
  ): Promise<{ reply: string }> {
    if (!this.gemini.configured) {
      return {
        reply:
          'AI is not configured yet. Add GOOGLE_CLOUD_PROJECT to enable Suite AI.',
      };
    }
    const report = await this.reports.latest(userId);
    const context = report
      ? `The user's latest financial review: revenue $${report.revenue}, expenses $${report.expenses}, net $${report.net}, cash flow $${report.cashFlow}.`
      : undefined;
    const reply = await this.gemini.chat(dto.message, context);
    return { reply };
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
