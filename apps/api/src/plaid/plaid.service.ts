import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
  type AccountBase,
  type Transaction as PlaidTransaction,
} from 'plaid';
import { PlaidItem, PlaidItemDocument } from './schemas/plaid-item.schema';
import {
  BankAccount,
  BankAccountDocument,
} from './schemas/bank-account.schema';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';

@Injectable()
export class PlaidService {
  private readonly logger = new Logger(PlaidService.name);
  private readonly plaid: PlaidApi;

  constructor(
    private readonly config: ConfigService,
    @InjectModel(PlaidItem.name)
    private readonly itemModel: Model<PlaidItemDocument>,
    @InjectModel(BankAccount.name)
    private readonly accountModel: Model<BankAccountDocument>,
    @InjectModel(Transaction.name)
    private readonly txnModel: Model<TransactionDocument>,
  ) {
    const env = this.config.get<string>('PLAID_ENV') ?? 'sandbox';
    this.plaid = new PlaidApi(
      new Configuration({
        basePath: PlaidEnvironments[env] ?? PlaidEnvironments.sandbox,
        baseOptions: {
          headers: {
            'PLAID-CLIENT-ID': this.config.get<string>('PLAID_CLIENT_ID') ?? '',
            'PLAID-SECRET': this.config.get<string>('PLAID_SECRET') ?? '',
          },
        },
      }),
    );
  }

  async createLinkToken(owner: string): Promise<string> {
    const res = await this.plaid.linkTokenCreate({
      user: { client_user_id: owner },
      client_name: 'Cloudstech Suite',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
    });
    return res.data.link_token;
  }

  async exchangePublicToken(
    owner: string,
    publicToken: string,
    institutionName?: string,
  ): Promise<BankAccountDocument[]> {
    const exch = await this.plaid.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const accessToken = exch.data.access_token;
    const itemId = exch.data.item_id;

    await this.itemModel.findOneAndUpdate(
      { owner: new Types.ObjectId(owner), itemId },
      {
        owner: new Types.ObjectId(owner),
        itemId,
        accessToken,
        institutionName,
        cursor: null,
        status: 'active',
      },
      { upsert: true },
    );

    await this.refreshAccounts(owner, itemId, accessToken, institutionName);
    await this.syncItem(owner, itemId, accessToken, null);
    return this.listAccounts(owner);
  }

  /** Pull balances/accounts for one item and upsert them. */
  private async refreshAccounts(
    owner: string,
    plaidItemId: string,
    accessToken: string,
    institutionName?: string,
  ): Promise<void> {
    const res = await this.plaid.accountsGet({ access_token: accessToken });
    await Promise.all(
      res.data.accounts.map((a: AccountBase) =>
        this.accountModel.findOneAndUpdate(
          { owner: new Types.ObjectId(owner), accountId: a.account_id },
          {
            owner: new Types.ObjectId(owner),
            plaidItemId,
            accountId: a.account_id,
            name: a.name,
            mask: a.mask ?? undefined,
            type: a.type,
            subtype: a.subtype ?? undefined,
            currentBalance: a.balances.current,
            availableBalance: a.balances.available,
            isoCurrency: a.balances.iso_currency_code ?? undefined,
            institutionName,
          },
          { upsert: true },
        ),
      ),
    );
  }

  /** Cursor-based incremental transaction sync for a single item. */
  private async syncItem(
    owner: string,
    plaidItemId: string,
    accessToken: string,
    startCursor: string | null,
  ): Promise<number> {
    let cursor = startCursor ?? undefined;
    let added = 0;
    let hasMore = true;

    while (hasMore) {
      const res = await this.plaid.transactionsSync({
        access_token: accessToken,
        cursor,
      });
      const data = res.data;

      await Promise.all(
        [...data.added, ...data.modified].map((t) => this.upsertTxn(owner, t)),
      );
      if (data.removed.length) {
        await this.txnModel.deleteMany({
          owner: new Types.ObjectId(owner),
          txnId: { $in: data.removed.map((r) => r.transaction_id) },
        });
      }

      added += data.added.length;
      cursor = data.next_cursor;
      hasMore = data.has_more;
    }

    await this.itemModel.updateOne(
      { owner: new Types.ObjectId(owner), itemId: plaidItemId },
      { cursor: cursor ?? null },
    );
    return added;
  }

  private upsertTxn(owner: string, t: PlaidTransaction): Promise<unknown> {
    const direction = t.amount > 0 ? 'outflow' : 'inflow';
    return this.txnModel.findOneAndUpdate(
      { owner: new Types.ObjectId(owner), txnId: t.transaction_id },
      {
        owner: new Types.ObjectId(owner),
        accountId: t.account_id,
        txnId: t.transaction_id,
        date: new Date(t.date),
        name: t.name,
        merchantName: t.merchant_name ?? undefined,
        amount: Math.abs(t.amount),
        direction,
        category:
          t.personal_finance_category?.primary != null
            ? [t.personal_finance_category.primary]
            : (t.category ?? []),
        pending: t.pending,
        isoCurrency: t.iso_currency_code ?? undefined,
        source: 'plaid',
      },
      { upsert: true },
    );
  }

  /** Sync every connected item for an owner. */
  async syncAll(owner: string): Promise<{ synced: number }> {
    const items = await this.itemModel
      .find({ owner: new Types.ObjectId(owner) })
      .select('+accessToken')
      .exec();
    let total = 0;
    for (const item of items) {
      total += await this.syncItem(
        owner,
        item.itemId,
        item.accessToken,
        item.cursor ?? null,
      );
    }
    return { synced: total };
  }

  listAccounts(owner: string): Promise<BankAccountDocument[]> {
    return this.accountModel
      .find({ owner: new Types.ObjectId(owner) })
      .sort({ createdAt: -1 })
      .exec();
  }

  listTransactions(
    owner: string,
    since?: string,
    limit = 200,
  ): Promise<TransactionDocument[]> {
    const filter: Record<string, unknown> = {
      owner: new Types.ObjectId(owner),
    };
    if (since) filter.date = { $gte: new Date(since) };
    return this.txnModel.find(filter).sort({ date: -1 }).limit(limit).exec();
  }

  /** Plaid webhook: on new data, sync the affected item. */
  async handleWebhook(body: {
    webhook_type?: string;
    webhook_code?: string;
    item_id?: string;
  }): Promise<void> {
    if (body.webhook_type !== 'TRANSACTIONS' || !body.item_id) return;
    const item = await this.itemModel
      .findOne({ itemId: body.item_id })
      .select('+accessToken')
      .exec();
    if (!item) return;
    await this.syncItem(
      item.owner.toString(),
      item.itemId,
      item.accessToken,
      item.cursor ?? null,
    );
    this.logger.log(`Synced item ${body.item_id} from webhook`);
  }
}
