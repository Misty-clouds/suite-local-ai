import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Activity, ActivityDocument } from './schemas/activity.schema';

@Injectable()
export class ActivityService {
  private readonly logger = new Logger(ActivityService.name);

  constructor(
    @InjectModel(Activity.name)
    private readonly model: Model<ActivityDocument>,
  ) {}

  /** Records an activity. Best-effort — never throws into the request path. */
  async log(owner: string, message: string, type?: string): Promise<void> {
    try {
      await this.model.create({
        owner: new Types.ObjectId(owner),
        message,
        type,
      });
    } catch (e) {
      this.logger.warn(
        `activity log failed: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }

  list(owner: string, limit = 25): Promise<ActivityDocument[]> {
    return this.model
      .find({ owner: new Types.ObjectId(owner) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}
