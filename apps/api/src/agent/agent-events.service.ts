import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { AgentStepData } from './schemas/agent-run.schema';

export interface RunSnapshot {
  id: string;
  status: 'running' | 'done' | 'error';
  steps: AgentStepData[];
  reportId?: string;
  error?: string;
}

/**
 * In-memory pub/sub keyed by agent-run id. The orchestrator publishes run
 * snapshots; the SSE endpoint subscribes and forwards them to the browser.
 */
@Injectable()
export class AgentEventsService {
  private readonly channels = new Map<string, Subject<RunSnapshot>>();

  channel(runId: string): Subject<RunSnapshot> {
    let subject = this.channels.get(runId);
    if (!subject) {
      subject = new Subject<RunSnapshot>();
      this.channels.set(runId, subject);
    }
    return subject;
  }

  publish(runId: string, snapshot: RunSnapshot): void {
    this.channel(runId).next(snapshot);
  }

  complete(runId: string): void {
    const subject = this.channels.get(runId);
    if (subject) {
      subject.complete();
      this.channels.delete(runId);
    }
  }
}
