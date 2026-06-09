import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PlaidItemDocument = HydratedDocument<PlaidItem>;

@Schema({
  collection: 'plaid_items',
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret: Record<string, unknown>) => {
      ret.id = ret._id?.toString();
      delete ret._id;
      delete ret.owner;
      delete ret.accessToken;
      return ret;
    },
  },
})
export class PlaidItem {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  owner!: Types.ObjectId;

  @Prop({ required: true, index: true })
  itemId!: string;

  // Plaid access token — never serialized.
  @Prop({ required: true, select: false })
  accessToken!: string;

  @Prop({ trim: true })
  institutionName?: string;

  // transactions/sync cursor for incremental fetches.
  @Prop({ type: String, default: null })
  cursor?: string | null;

  @Prop({ type: String, default: 'active' })
  status!: string;
}

export const PlaidItemSchema = SchemaFactory.createForClass(PlaidItem);
