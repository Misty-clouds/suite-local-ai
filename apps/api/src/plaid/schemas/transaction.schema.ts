import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({
  collection: 'transactions',
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret: Record<string, unknown>) => {
      ret.id = ret._id?.toString();
      delete ret._id;
      delete ret.owner;
      return ret;
    },
  },
})
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  owner!: Types.ObjectId;

  @Prop({ required: true, index: true })
  accountId!: string;

  @Prop({ required: true, index: true })
  txnId!: string;

  @Prop({ type: Date, required: true, index: true })
  date!: Date;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ trim: true })
  merchantName?: string;

  // Always stored as a positive magnitude; sign is captured by `direction`.
  @Prop({ required: true })
  amount!: number;

  @Prop({ type: String, enum: ['inflow', 'outflow'], required: true })
  direction!: 'inflow' | 'outflow';

  @Prop({ type: [String], default: [] })
  category!: string[];

  @Prop({ trim: true })
  aiCategory?: string;

  @Prop({ default: false })
  pending!: boolean;

  @Prop({ trim: true })
  isoCurrency?: string;

  @Prop({ type: String, default: 'plaid' })
  source!: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
// One transaction per (owner, txnId) — makes sync idempotent.
TransactionSchema.index({ owner: 1, txnId: 1 }, { unique: true });
