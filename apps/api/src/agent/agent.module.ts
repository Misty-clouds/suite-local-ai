import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BigQueryModule } from '../bigquery/bigquery.module';
import { BudgetsModule } from '../budgets/budgets.module';
import { FivetranModule } from '../fivetran/fivetran.module';
import { GeminiModule } from '../gemini/gemini.module';
import { InvoicesModule } from '../invoices/invoices.module';
import { PlaidModule } from '../plaid/plaid.module';
import { ReportsModule } from '../reports/reports.module';
import { TasksModule } from '../tasks/tasks.module';
import { AgentRun, AgentRunSchema } from './schemas/agent-run.schema';
import { AgentRunsService } from './agent-runs.service';
import { AgentEventsService } from './agent-events.service';
import { ReviewOrchestratorService } from './review-orchestrator.service';
import { AgentController } from './agent.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AgentRun.name, schema: AgentRunSchema },
    ]),
    PlaidModule,
    BudgetsModule,
    InvoicesModule,
    FivetranModule,
    BigQueryModule,
    GeminiModule,
    ReportsModule,
    TasksModule,
  ],
  controllers: [AgentController],
  providers: [AgentRunsService, AgentEventsService, ReviewOrchestratorService],
  exports: [AgentRunsService],
})
export class AgentModule {}
