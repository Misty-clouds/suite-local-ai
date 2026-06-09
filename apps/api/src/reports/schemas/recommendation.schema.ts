import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RecommendationDocument = HydratedDocument<Recommendation>;

@Schema({
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
export class Recommendation {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  owner!: Types.ObjectId;

  @Prop({ trim: true, index: true })
  reportId?: string;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, trim: true })
  rationale!: string;

  @Prop({ trim: true })
  impact?: string;

  @Prop({
    type: String,
    enum: ['info', 'warning', 'critical'],
    default: 'info',
  })
  severity!: 'info' | 'warning' | 'critical';
}

export const RecommendationSchema =
  SchemaFactory.createForClass(Recommendation);
