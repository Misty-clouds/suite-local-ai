import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { randomBytes, randomUUID } from 'crypto';
import { R2Service } from '../storage/r2.service';
import { DocumentItem, DocumentItemDocument } from './schemas/document.schema';
import { CreateDocumentDto } from './dto/create-document.dto';

/** A resolved share target: either redirect to a URL, or stream raw bytes. */
export interface SharedContent {
  name: string;
  redirectUrl?: string;
  buffer?: Buffer;
  contentType?: string;
}

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(DocumentItem.name)
    private readonly model: Model<DocumentItemDocument>,
    private readonly r2: R2Service,
  ) {}

  async create(
    owner: string,
    dto: CreateDocumentDto,
  ): Promise<DocumentItemDocument> {
    const base = {
      owner: new Types.ObjectId(owner),
      name: dto.name,
      type: dto.type,
      size: dto.size ?? 0,
      sourceUrl: dto.sourceUrl,
    };

    // Prefer Cloudflare R2 for uploaded files; fall back to inline base64.
    if (dto.dataUrl && this.r2.configured) {
      const parsed = this.parseDataUrl(dto.dataUrl);
      if (parsed) {
        const safe = dto.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const key = `documents/${owner}/${randomUUID()}-${safe}`;
        await this.r2.upload(key, parsed.buffer, parsed.contentType);
        return this.model.create({
          ...base,
          type: dto.type ?? parsed.contentType,
          size: dto.size ?? parsed.buffer.length,
          storageKey: key,
        });
      }
    }

    return this.model.create({ ...base, dataUrl: dto.dataUrl });
  }

  findAll(owner: string): Promise<DocumentItemDocument[]> {
    return this.model
      .find({ owner: new Types.ObjectId(owner) })
      .sort({ createdAt: -1 })
      .exec();
  }

  /** A downloadable URL for a document (signed R2 URL, source URL, or data URL). */
  async content(owner: string, id: string): Promise<string | null> {
    const doc = await this.model
      .findOne({ _id: id, owner: new Types.ObjectId(owner) })
      .select('+dataUrl')
      .exec();
    if (!doc) throw new NotFoundException('Document not found');
    if (doc.storageKey) return this.r2.signedUrl(doc.storageKey);
    return doc.dataUrl ?? doc.sourceUrl ?? null;
  }

  /** Creates (or returns) a public share token for a document. */
  async ensureShareToken(owner: string, id: string): Promise<string> {
    const doc = await this.model
      .findOne({ _id: id, owner: new Types.ObjectId(owner) })
      .exec();
    if (!doc) throw new NotFoundException('Document not found');
    if (!doc.shareToken) {
      doc.shareToken = randomBytes(16).toString('hex');
      await doc.save();
    }
    return doc.shareToken;
  }

  /** Resolves a public share token to a redirect URL or raw bytes. */
  async resolveShare(token: string): Promise<SharedContent> {
    const doc = await this.model
      .findOne({ shareToken: token })
      .select('+dataUrl')
      .exec();
    if (!doc) throw new NotFoundException('Shared document not found');
    if (doc.storageKey) {
      return {
        name: doc.name,
        redirectUrl: await this.r2.signedUrl(doc.storageKey),
      };
    }
    if (doc.sourceUrl) return { name: doc.name, redirectUrl: doc.sourceUrl };
    if (doc.dataUrl) {
      const parsed = this.parseDataUrl(doc.dataUrl);
      if (parsed) {
        return {
          name: doc.name,
          buffer: parsed.buffer,
          contentType: parsed.contentType,
        };
      }
    }
    throw new NotFoundException('Shared document has no content');
  }

  async remove(owner: string, id: string): Promise<void> {
    const doc = await this.model
      .findOne({ _id: id, owner: new Types.ObjectId(owner) })
      .exec();
    if (!doc) throw new NotFoundException('Document not found');
    if (doc.storageKey) await this.r2.remove(doc.storageKey);
    await doc.deleteOne();
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

  private parseDataUrl(
    dataUrl: string,
  ): { buffer: Buffer; contentType?: string } | null {
    const match = /^data:([^;]+);base64,(.*)$/s.exec(dataUrl);
    if (!match) return null;
    return { contentType: match[1], buffer: Buffer.from(match[2], 'base64') };
  }
}
