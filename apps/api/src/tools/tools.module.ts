import { Module } from '@nestjs/common';
import { BudgetsModule } from '../budgets/budgets.module';
import { InvoicesModule } from '../invoices/invoices.module';
import { ReportsModule } from '../reports/reports.module';
import { TasksModule } from '../tasks/tasks.module';
import { ToolsController } from './tools.controller';
import { ToolsService } from './tools.service';

@Module({
  imports: [BudgetsModule, InvoicesModule, ReportsModule, TasksModule],
  controllers: [ToolsController],
  providers: [ToolsService],
})
export class ToolsModule {}
