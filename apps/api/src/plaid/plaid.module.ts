import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaidItem, PlaidItemSchema } from './schemas/plaid-item.schema';
import { BankAccount, BankAccountSchema } from './schemas/bank-account.schema';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { PlaidService } from './plaid.service';
import { AccountsController, PlaidController } from './plaid.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlaidItem.name, schema: PlaidItemSchema },
      { name: BankAccount.name, schema: BankAccountSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [PlaidController, AccountsController],
  providers: [PlaidService],
  exports: [PlaidService],
})
export class PlaidModule {}
