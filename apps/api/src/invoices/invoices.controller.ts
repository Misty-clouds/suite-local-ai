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
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { QueryInvoicesDto } from './dto/query-invoices.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @Activity('Created an invoice', 'invoice')
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateInvoiceDto) {
    return this.invoicesService.create(userId, dto);
  }

  @Get()
  findAll(
    @CurrentUser('userId') userId: string,
    @Query() query: QueryInvoicesDto,
  ) {
    return this.invoicesService.findAll(userId, query);
  }

  // Must be declared before `:id` so it is not captured as an id.
  @Get('summary')
  summary(@CurrentUser('userId') userId: string) {
    return this.invoicesService.summary(userId);
  }

  @Get(':id')
  findOne(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.invoicesService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.update(userId, id, dto);
  }

  @Post(':id/send')
  @HttpCode(HttpStatus.OK)
  @Activity('Sent an invoice', 'invoice')
  send(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.invoicesService.send(userId, id);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  cancel(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.invoicesService.cancel(userId, id);
  }

  @Post(':id/payments')
  @Activity('Recorded a payment', 'payment')
  recordPayment(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: RecordPaymentDto,
  ) {
    return this.invoicesService.recordPayment(userId, id, dto);
  }

  @Post(':id/mark-paid')
  @HttpCode(HttpStatus.OK)
  @Activity('Marked an invoice as paid', 'payment')
  markPaid(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.invoicesService.markPaid(userId, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Activity('Deleted an invoice', 'invoice')
  async remove(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    await this.invoicesService.remove(userId, id);
    return { message: 'Invoice deleted' };
  }
}
