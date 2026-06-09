import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReportDocument = HydratedDocument<Report>;

const baseToJSON = {
  virtuals: true,
  versionKey: false,
  transform: (_doc: unknown, ret: Record<string, unknown>) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.owner;
    return ret;
  },
};

@Schema({ timestamps: true, toJSON: baseToJSON })
export class Report {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  owner!: Types.ObjectId;

  @Prop({ type: Object, required: true })
  period!: { start: Date; end: Date };

  @Prop({ default: 0 })
  revenue!: number;

  @Prop({ default: 0 })
  expenses!: number;

  @Prop({ default: 0 })
  net!: number;

  @Prop({ default: 0 })
  cashFlow!: number;

  @Prop({ default: 0 })
  taxEstimate!: number;

  @Prop({ type: [Object], default: [] })
  budgetVariance!: Record<string, unknown>[];

  @Prop({ type: [Object], default: [] })
  anomalies!: Record<string, unknown>[];

  @Prop({ trim: true, default: '' })
  summaryText!: string;

  @Prop({ type: Object, default: {} })
  kpis!: Record<string, unknown>;

  @Prop({ type: String, enum: ['draft', 'complete'], default: 'draft' })
  status!: 'draft' | 'complete';

  @Prop({ trim: true })
  agentRunId?: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
