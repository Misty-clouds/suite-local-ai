import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AgentRun,
  AgentRunDocument,
  AgentStepData,
} from './schemas/agent-run.schema';

@Injectable()
export class AgentRunsService {
  constructor(
    @InjectModel(AgentRun.name)
    private readonly runModel: Model<AgentRunDocument>,
  ) {}

  create(
    owner: string,
    init: { type?: string; model?: string; steps?: AgentStepData[] } = {},
  ): Promise<AgentRunDocument> {
    return this.runModel.create({
      owner: new Types.ObjectId(owner),
      type: init.type ?? 'financial_review',
      model: init.model,
      steps: init.steps ?? [],
      status: 'running',
    });
  }

  async findOne(owner: string, id: string): Promise<AgentRunDocument> {
    const run = await this.runModel
      .findOne({ _id: id, owner: new Types.ObjectId(owner) })
      .exec();
    if (!run) throw new NotFoundException('Agent run not found');
    return run;
  }

  update(
    owner: string,
    id: string,
    patch: Partial<Pick<AgentRun, 'status' | 'reportId' | 'error'>>,
  ): Promise<AgentRunDocument | null> {
    return this.runModel
      .findOneAndUpdate({ _id: id, owner: new Types.ObjectId(owner) }, patch, {
        new: true,
      })
      .exec();
  }

  /**
   * Updates a step by `key` in a single atomic write (the step is pre-created
   * as `pending` when the run starts, so the positional filter always matches).
   */
  async upsertStep(
    owner: string,
    id: string,
    step: AgentStepData,
  ): Promise<AgentRunDocument> {
    const set: Record<string, unknown> = { 'steps.$[s].status': step.status };
    if (step.label !== undefined) set['steps.$[s].label'] = step.label;
    if (step.detail !== undefined) set['steps.$[s].detail'] = step.detail;
    if (step.startedAt !== undefined)
      set['steps.$[s].startedAt'] = step.startedAt;
    if (step.finishedAt !== undefined)
      set['steps.$[s].finishedAt'] = step.finishedAt;

    const run = await this.runModel
      .findOneAndUpdate(
        { _id: id, owner: new Types.ObjectId(owner) },
        { $set: set },
        { arrayFilters: [{ 's.key': step.key }], new: true },
      )
      .exec();
    if (!run) throw new NotFoundException('Agent run not found');
    return run;
  }
}
