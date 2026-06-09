import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ActionTaskDocument = HydratedDocument<ActionTask>;

@Schema({
  collection: 'action_tasks',
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
export class ActionTask {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  owner!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ trim: true })
  detail?: string;

  @Prop({ type: Date })
  dueDate?: Date;

  @Prop({
    type: String,
    enum: ['open', 'done', 'dismissed'],
    default: 'open',
  })
  status!: 'open' | 'done' | 'dismissed';

  @Prop({ type: String, enum: ['agent', 'user'], default: 'agent' })
  source!: 'agent' | 'user';

  @Prop({ trim: true, index: true })
  reportId?: string;
}

export const ActionTaskSchema = SchemaFactory.createForClass(ActionTask);
