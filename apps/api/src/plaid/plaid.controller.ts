import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { PlaidService } from './plaid.service';
import { ExchangePublicTokenDto } from './dto/exchange.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('plaid')
export class PlaidController {
  constructor(private readonly plaid: PlaidService) {}

  @Post('link-token')
  @HttpCode(HttpStatus.OK)
  async linkToken(@CurrentUser('userId') userId: string) {
    const linkToken = await this.plaid.createLinkToken(userId);
    return { linkToken };
  }

  @Post('exchange')
  @HttpCode(HttpStatus.OK)
  exchange(
    @CurrentUser('userId') userId: string,
    @Body() dto: ExchangePublicTokenDto,
  ) {
    return this.plaid.exchangePublicToken(
      userId,
      dto.publicToken,
      dto.institutionName,
    );
  }

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  sync(@CurrentUser('userId') userId: string) {
    return this.plaid.syncAll(userId);
  }

  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(@Body() body: Record<string, unknown>) {
    await this.plaid.handleWebhook(body);
    return { received: true };
  }
}

/** Root-level account/transaction endpoints consumed by the dashboard. */
@Controller()
export class AccountsController {
  constructor(private readonly plaid: PlaidService) {}

  @Get('accounts')
  accounts(@CurrentUser('userId') userId: string) {
    return this.plaid.listAccounts(userId);
  }

  @Get('transactions')
  transactions(
    @CurrentUser('userId') userId: string,
    @Query('since') since?: string,
  ) {
    return this.plaid.listTransactions(userId, since);
  }

  @Post('transactions')
  @HttpCode(HttpStatus.CREATED)
  createTransaction(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateTransactionDto,
  ) {
    return this.plaid.createManualTransaction(userId, dto);
  }
}
