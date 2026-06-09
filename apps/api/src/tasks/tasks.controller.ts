import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(
    @CurrentUser('userId') userId: string,
    @Query('status') status?: string,
  ) {
    return this.tasksService.findAll(userId, status);
  }

  @Patch(':id')
  updateStatus(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body('status') status: 'open' | 'done' | 'dismissed',
  ) {
    return this.tasksService.updateStatus(userId, id, status);
  }
}
