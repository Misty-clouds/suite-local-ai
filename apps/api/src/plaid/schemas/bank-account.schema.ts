import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BankAccountDocument = HydratedDocument<BankAccount>;

@Schema({
  collection: 'accounts',
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
export class BankAccount {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  owner!: Types.ObjectId;

  @Prop({ required: true, index: true })
  plaidItemId!: string;

  @Prop({ required: true, index: true })
  accountId!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ trim: true })
  mask?: string;

  @Prop({ trim: true })
  type?: string;

  @Prop({ trim: true })
  subtype?: string;

  @Prop({ type: Number, default: null })
  currentBalance?: number | null;

  @Prop({ type: Number, default: null })
  availableBalance?: number | null;

  @Prop({ trim: true })
  isoCurrency?: string;

  @Prop({ trim: true })
  institutionName?: string;
}

export const BankAccountSchema = SchemaFactory.createForClass(BankAccount);
