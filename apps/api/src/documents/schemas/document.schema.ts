import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DocumentItemDocument = HydratedDocument<DocumentItem>;

@Schema({
  collection: 'documents',
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret: Record<string, unknown>) => {
      ret.id = ret._id?.toString();
      delete ret._id;
      delete ret.owner;
      delete ret.dataUrl; // large — fetched on demand only
      return ret;
    },
  },
})
export class DocumentItem {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  owner!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ trim: true })
  type?: string;

  @Prop({ default: 0 })
  size!: number;

  // base64 data URL for inline-stored files (select:false so lists stay light).
  @Prop({ select: false })
  dataUrl?: string;

  @Prop({ trim: true })
  sourceUrl?: string;
}

export const DocumentItemSchema = SchemaFactory.createForClass(DocumentItem);
