import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DocumentItem, DocumentItemDocument } from './schemas/document.schema';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(DocumentItem.name)
    private readonly model: Model<DocumentItemDocument>,
  ) {}

  create(owner: string, dto: CreateDocumentDto): Promise<DocumentItemDocument> {
    return this.model.create({
      owner: new Types.ObjectId(owner),
      name: dto.name,
      type: dto.type,
      size: dto.size ?? 0,
      dataUrl: dto.dataUrl,
      sourceUrl: dto.sourceUrl,
    });
  }

  findAll(owner: string): Promise<DocumentItemDocument[]> {
    return this.model
      .find({ owner: new Types.ObjectId(owner) })
      .sort({ createdAt: -1 })
      .exec();
  }

  /** Returns the stored content (data URL or source URL) for a document. */
  async content(owner: string, id: string): Promise<string | null> {
    const doc = await this.model
      .findOne({ _id: id, owner: new Types.ObjectId(owner) })
      .select('+dataUrl')
      .exec();
    if (!doc) throw new NotFoundException('Document not found');
    return doc.dataUrl ?? doc.sourceUrl ?? null;
  }

  async remove(owner: string, id: string): Promise<void> {
    const res = await this.model
      .deleteOne({ _id: id, owner: new Types.ObjectId(owner) })
      .exec();
    if (res.deletedCount === 0)
      throw new NotFoundException('Document not found');
  }

  async stats(owner: string) {
    const docs = await this.findAll(owner);
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const createdAt = (d: DocumentItemDocument): number => {
      const ts = (d as unknown as { createdAt?: Date }).createdAt;
      return ts ? new Date(ts).getTime() : 0;
    };
    return {
      total: docs.length,
      external: docs.filter((d) => !!d.sourceUrl).length,
      recent: docs.filter((d) => createdAt(d) > weekAgo).length,
    };
  }
}
