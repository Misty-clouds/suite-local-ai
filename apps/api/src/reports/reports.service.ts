import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Report, ReportDocument } from './schemas/report.schema';
import {
  Recommendation,
  RecommendationDocument,
} from './schemas/recommendation.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name)
    private readonly reportModel: Model<ReportDocument>,
    @InjectModel(Recommendation.name)
    private readonly recommendationModel: Model<RecommendationDocument>,
  ) {}

  createReport(owner: string, data: Partial<Report>): Promise<ReportDocument> {
    return this.reportModel.create({
      ...data,
      owner: new Types.ObjectId(owner),
    });
  }

  findAll(owner: string): Promise<ReportDocument[]> {
    return this.reportModel
      .find({ owner: new Types.ObjectId(owner) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(owner: string, id: string): Promise<ReportDocument> {
    const report = await this.reportModel
      .findOne({ _id: id, owner: new Types.ObjectId(owner) })
      .exec();
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  latest(owner: string): Promise<ReportDocument | null> {
    return this.reportModel
      .findOne({ owner: new Types.ObjectId(owner) })
      .sort({ createdAt: -1 })
      .exec();
  }

  createRecommendation(
    owner: string,
    data: Partial<Recommendation>,
  ): Promise<RecommendationDocument> {
    return this.recommendationModel.create({
      ...data,
      owner: new Types.ObjectId(owner),
    });
  }

  listRecommendations(
    owner: string,
    reportId: string,
  ): Promise<RecommendationDocument[]> {
    return this.recommendationModel
      .find({ owner: new Types.ObjectId(owner), reportId })
      .sort({ createdAt: -1 })
      .exec();
  }
}
