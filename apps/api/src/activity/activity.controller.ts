import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ActivityService } from './activity.service';

@Controller('activities')
export class ActivityController {
  constructor(private readonly activities: ActivityService) {}

  @Get()
  list(@CurrentUser('userId') userId: string) {
    return this.activities.list(userId);
  }
}
