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
import { SkipTransform } from '../common/decorators/skip-transform.decorator';
import { AgentRunsService } from './agent-runs.service';
import { AgentEventsService, RunSnapshot } from './agent-events.service';
import { ReviewOrchestratorService } from './review-orchestrator.service';

@Controller('agent')
export class AgentController {
  constructor(
    private readonly runs: AgentRunsService,
    private readonly events: AgentEventsService,
    private readonly orchestrator: ReviewOrchestratorService,
  ) {}

  @Post('financial-review')
  @HttpCode(HttpStatus.OK)
  async startReview(@CurrentUser('userId') userId: string) {
    const runId = await this.orchestrator.start(userId);
    return { runId };
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
