import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { ActionTask, ActionTaskDocument } from './schemas/action-task.schema';

export interface CreateActionTaskInput {
  title: string;
  detail?: string;
  dueDate?: string | Date;
  source?: 'agent' | 'user';
  reportId?: string;
}

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(ActionTask.name)
    private readonly taskModel: Model<ActionTaskDocument>,
  ) {}

  create(
    owner: string,
    input: CreateActionTaskInput,
  ): Promise<ActionTaskDocument> {
    return this.taskModel.create({
      title: input.title,
      detail: input.detail,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      source: input.source ?? 'agent',
      reportId: input.reportId,
      owner: new Types.ObjectId(owner),
      status: 'open',
    });
  }

  findAll(owner: string, status?: string): Promise<ActionTaskDocument[]> {
    const filter: FilterQuery<ActionTaskDocument> = {
      owner: new Types.ObjectId(owner),
    };
    if (status) filter.status = status;
    return this.taskModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async updateStatus(
    owner: string,
    id: string,
    status: 'open' | 'done' | 'dismissed',
  ): Promise<ActionTaskDocument> {
    const task = await this.taskModel
      .findOneAndUpdate(
        { _id: id, owner: new Types.ObjectId(owner) },
        { status },
        { new: true },
      )
      .exec();
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }
}
