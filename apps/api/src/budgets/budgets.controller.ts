import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Activity } from '../activity/decorators/activity.decorator';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { RecordSpendDto } from './dto/record-spend.dto';

@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  @Activity('Created a budget', 'budget')
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateBudgetDto) {
    return this.budgetsService.create(userId, dto);
  }

  @Get()
  findAll(
    @CurrentUser('userId') userId: string,
    @Query('category') category?: string,
  ) {
    return this.budgetsService.findAll(userId, category);
  }

  @Get('summary')
  summary(@CurrentUser('userId') userId: string) {
    return this.budgetsService.summary(userId);
  }

  @Get(':id')
  findOne(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.budgetsService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateBudgetDto,
  ) {
    return this.budgetsService.update(userId, id, dto);
  }

  @Post(':id/spend')
  recordSpend(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: RecordSpendDto,
  ) {
    return this.budgetsService.recordSpend(userId, id, dto);
  }

  @Post(':id/reset')
  @HttpCode(HttpStatus.OK)
  reset(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.budgetsService.reset(userId, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Activity('Deleted a budget', 'budget')
  async remove(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    await this.budgetsService.remove(userId, id);
    return { message: 'Budget deleted' };
  }
}
