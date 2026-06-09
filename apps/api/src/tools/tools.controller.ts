import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { BudgetsService } from '../budgets/budgets.service';
import { InvoicesService } from '../invoices/invoices.service';
import { ReportsService } from '../reports/reports.service';
import { TasksService } from '../tasks/tasks.service';
import { AgentServiceGuard } from './guards/agent-service.guard';
import { ToolsService } from './tools.service';
import {
  CreateRecommendationToolDto,
  CreateReportToolDto,
  CreateTaskToolDto,
  TaxEstimateDto,
} from './dto/tool-dtos';

/**
 * Endpoints the ADK agent calls as tools. Bypass the user JWT guard (@Public)
 * but require the shared agent service token; the target user is the
 * `x-owner-id` header.
 */
@Public()
@UseGuards(AgentServiceGuard)
@Controller('tools')
export class ToolsController {
  constructor(
    private readonly budgets: BudgetsService,
    private readonly invoices: InvoicesService,
    private readonly reports: ReportsService,
    private readonly tasks: TasksService,
    private readonly tools: ToolsService,
  ) {}

  private requireOwner(owner?: string): string {
    if (!owner) throw new BadRequestException('Missing x-owner-id header');
    return owner;
  }

  @Get('budget-summary')
  budgetSummary(@Headers('x-owner-id') owner?: string) {
    return this.budgets.summary(this.requireOwner(owner));
  }

  @Get('invoice-summary')
  invoiceSummary(@Headers('x-owner-id') owner?: string) {
    return this.invoices.summary(this.requireOwner(owner));
  }

  @Post('reports')
  createReport(
    @Body() dto: CreateReportToolDto,
    @Headers('x-owner-id') owner?: string,
  ) {
    return this.reports.createReport(this.requireOwner(owner), {
      ...dto,
      period: {
        start: new Date(dto.period.start),
        end: new Date(dto.period.end),
      },
    });
  }

  @Post('recommendations')
  createRecommendation(
    @Body() dto: CreateRecommendationToolDto,
    @Headers('x-owner-id') owner?: string,
  ) {
    return this.reports.createRecommendation(this.requireOwner(owner), dto);
  }

  @Post('tasks')
  createTask(
    @Body() dto: CreateTaskToolDto,
    @Headers('x-owner-id') owner?: string,
  ) {
    return this.tasks.create(this.requireOwner(owner), dto);
  }

  @Post('tax-estimate')
  taxEstimate(@Body() dto: TaxEstimateDto) {
    return this.tools.estimateTax(dto);
  }
}
