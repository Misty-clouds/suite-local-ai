import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Cloudflare R2 object storage (S3-compatible). When unconfigured, the
 * Documents module falls back to inline base64 storage in Mongo.
 */
@Injectable()
export class R2Service {
  private readonly logger = new Logger(R2Service.name);
  private client?: S3Client;

  constructor(private readonly config: ConfigService) {}

  get configured(): boolean {
    return !!(
      this.config.get<string>('R2_ACCOUNT_ID') &&
      this.config.get<string>('R2_ACCESS_KEY_ID') &&
      this.config.get<string>('R2_SECRET_ACCESS_KEY') &&
      this.config.get<string>('R2_BUCKET')
    );
  }

  private get bucket(): string {
    return this.config.get<string>('R2_BUCKET') ?? '';
  }

  private s3(): S3Client {
    if (!this.client) {
      const accountId = this.config.get<string>('R2_ACCOUNT_ID');
      this.client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: this.config.get<string>('R2_ACCESS_KEY_ID') ?? '',
          secretAccessKey:
            this.config.get<string>('R2_SECRET_ACCESS_KEY') ?? '',
        },
      });
    }
    return this.client;
  }

  async upload(key: string, body: Buffer, contentType?: string): Promise<void> {
    await this.s3().send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  }

  /** Time-limited download URL for a stored object. */
  signedUrl(key: string, expiresIn = 3600): Promise<string> {
    return getSignedUrl(
      this.s3(),
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      { expiresIn },
    );
  }

  async remove(key: string): Promise<void> {
    try {
      await this.s3().send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
      );
    } catch (e) {
      this.logger.warn(
        `R2 delete failed for ${key}: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }
}
