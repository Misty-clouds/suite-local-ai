import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { FivetranService } from './fivetran.service';

@Controller('fivetran')
export class FivetranController {
  constructor(private readonly fivetran: FivetranService) {}

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  sync() {
    return this.fivetran.triggerSync();
  }

  @Get('status')
  status() {
    return this.fivetran.getStatus();
  }
}
