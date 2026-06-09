import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AgentRunDocument = HydratedDocument<AgentRun>;

export interface AgentStepData {
  key: string;
  label: string;
  status: 'pending' | 'running' | 'done' | 'error';
  detail?: string;
  startedAt?: Date;
  finishedAt?: Date;
}

@Schema({
  collection: 'agent_runs',
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
export class AgentRun {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  owner!: Types.ObjectId;

  @Prop({ type: String, default: 'financial_review' })
  type!: string;

  @Prop({
    type: String,
    enum: ['running', 'done', 'error'],
    default: 'running',
  })
  status!: 'running' | 'done' | 'error';

  @Prop({ type: [Object], default: [] })
  steps!: AgentStepData[];

  @Prop({ trim: true })
  reportId?: string;

  @Prop({ trim: true })
  model?: string;

  @Prop({ trim: true })
  error?: string;
}

export const AgentRunSchema = SchemaFactory.createForClass(AgentRun);
