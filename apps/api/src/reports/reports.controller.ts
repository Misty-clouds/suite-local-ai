import { Controller, Get, Param } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  findAll(@CurrentUser('userId') userId: string) {
    return this.reportsService.findAll(userId);
  }

  @Get('latest')
  async latest(@CurrentUser('userId') userId: string) {
    return this.reportsService.latest(userId);
  }

  @Get(':id')
  async findOne(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    const report = await this.reportsService.findOne(userId, id);
    const recommendations = await this.reportsService.listRecommendations(
      userId,
      id,
    );
    return { ...report.toJSON(), recommendations };
  }
}
