import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BigQuery } from '@google-cloud/bigquery';

export interface BqTransaction {
  name: string;
  merchantName?: string;
  amount: number;
  direction: 'inflow' | 'outflow';
  aiCategory?: string;
  category: string[];
  date: string;
}

interface BqRow {
  name?: string;
  merchantName?: string;
  amount?: number;
  direction?: string;
  aiCategory?: string;
  categoryJson?: string;
  date?: string;
}

/**
 * Reads the Fivetran-synced transactions out of BigQuery. Fivetran's MongoDB
 * connector lands each document in a `data` JSON column, so we extract fields
 * with JSON_VALUE. Auth is Application Default Credentials (gcloud / SA key).
 */
@Injectable()
export class BigQueryService {
  private readonly logger = new Logger(BigQueryService.name);
  private client?: BigQuery;

  constructor(private readonly config: ConfigService) {}

  get configured(): boolean {
    return Boolean(
      this.config.get<string>('GOOGLE_CLOUD_PROJECT') &&
      this.config.get<string>('BIGQUERY_DATASET'),
    );
  }

  private bq(): BigQuery {
    if (!this.client) {
      this.client = new BigQuery({
        projectId: this.config.get<string>('GOOGLE_CLOUD_PROJECT'),
      });
    }
    return this.client;
  }

  async listTransactions(owner: string, limit = 500): Promise<BqTransaction[]> {
    const dataset =
      this.config.get<string>('BIGQUERY_DATASET') ?? 'mongo_suite';
    const sql = `
      SELECT
        JSON_VALUE(data, '$.name') AS name,
        JSON_VALUE(data, '$.merchantName') AS merchantName,
        CAST(JSON_VALUE(data, '$.amount') AS FLOAT64) AS amount,
        JSON_VALUE(data, '$.direction') AS direction,
        JSON_VALUE(data, '$.aiCategory') AS aiCategory,
        JSON_QUERY(data, '$.category') AS categoryJson,
        JSON_VALUE(data, '$.date') AS date
      FROM \`${dataset}.transactions\`
      WHERE _fivetran_deleted = false
        AND JSON_VALUE(data, '$.owner') = @owner
      ORDER BY date DESC
      LIMIT @lim`;

    const [rows] = await this.bq().query({
      query: sql,
      params: { owner, lim: limit },
    });

    return (rows as BqRow[]).map((r) => {
      let category: string[] = [];
      try {
        category = r.categoryJson
          ? (JSON.parse(r.categoryJson) as string[])
          : [];
      } catch {
        category = [];
      }
      return {
        name: r.name ?? '',
        merchantName: r.merchantName ?? undefined,
        amount: Number(r.amount ?? 0),
        direction: r.direction === 'inflow' ? 'inflow' : 'outflow',
        aiCategory: r.aiCategory ?? undefined,
        category,
        date: r.date ?? new Date().toISOString(),
      };
    });
  }
}
