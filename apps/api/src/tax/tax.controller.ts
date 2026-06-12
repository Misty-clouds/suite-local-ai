import { Body, Controller, Get, Patch } from '@nestjs/common';
import { IsObject } from 'class-validator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Activity } from '../activity/decorators/activity.decorator';
import { TaxService } from './tax.service';

class SaveTaxProfileDto {
  @IsObject()
  data!: Record<string, string>;
}

@Controller('tax/profile')
export class TaxController {
  constructor(private readonly tax: TaxService) {}

  @Get()
  async get(@CurrentUser('userId') userId: string) {
    const profile = await this.tax.get(userId);
    return { data: profile?.data ?? null };
  }

  @Patch()
  @Activity('Updated tax settings', 'tax')
  async save(
    @CurrentUser('userId') userId: string,
    @Body() dto: SaveTaxProfileDto,
  ) {
    const profile = await this.tax.upsert(userId, dto.data);
    return { data: profile?.data ?? dto.data };
  }
}
