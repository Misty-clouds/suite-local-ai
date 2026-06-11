import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface FivetranStatus {
  connectorId: string;
  setupState?: string;
  syncState?: string;
  isHistoricalSync?: boolean;
  succeededAt?: string | null;
  failedAt?: string | null;
}

interface FivetranActionResponse {
  code: string;
  message: string;
}

interface FivetranConnectorResponse {
  code: string;
  data: {
    id: string;
    succeeded_at?: string | null;
    failed_at?: string | null;
    status?: {
      setup_state?: string;
      sync_state?: string;
      is_historical_sync?: boolean;
    };
  };
}

/**
 * Thin relay over the Fivetran REST API. Lets the agent's review workflow
 * trigger a connector sync and read its status with real calls. (The ADK agent
 * does the same via the Fivetran MCP; this keeps it working without GCP too.)
 */
@Injectable()
export class FivetranService {
  private readonly logger = new Logger(FivetranService.name);
  private readonly baseUrl = 'https://api.fivetran.com/v1';

  constructor(private readonly config: ConfigService) {}

  get configured(): boolean {
    return Boolean(
      this.config.get<string>('FIVETRAN_API_KEY') &&
      this.config.get<string>('FIVETRAN_API_SECRET') &&
      this.config.get<string>('FIVETRAN_CONNECTOR_ID'),
    );
  }

  private authHeader(): string {
    const key = this.config.get<string>('FIVETRAN_API_KEY') ?? '';
    const secret = this.config.get<string>('FIVETRAN_API_SECRET') ?? '';
    return `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}`;
  }

  private connectorId(override?: string): string {
    const id = override ?? this.config.get<string>('FIVETRAN_CONNECTOR_ID');
    if (!id) {
      throw new ServiceUnavailableException('FIVETRAN_CONNECTOR_ID is not set');
    }
    return id;
  }

  private async call<T>(path: string, method: 'GET' | 'POST'): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: this.authHeader(),
        'Content-Type': 'application/json',
      },
    });
    const json = (await res.json()) as { message?: string } & T;
    if (!res.ok) {
      throw new ServiceUnavailableException(
        `Fivetran API ${res.status}: ${json?.message ?? res.statusText}`,
      );
    }
    return json;
  }

  /** Triggers an incremental sync of the connector. */
  async triggerSync(connectorId?: string): Promise<{ message: string }> {
    const id = this.connectorId(connectorId);
    const json = await this.call<FivetranActionResponse>(
      `/connectors/${id}/sync`,
      'POST',
    );
    this.logger.log(`Fivetran sync triggered (${id}): ${json.message}`);
    return { message: json.message };
  }

  async getStatus(connectorId?: string): Promise<FivetranStatus> {
    const id = this.connectorId(connectorId);
    const json = await this.call<FivetranConnectorResponse>(
      `/connectors/${id}`,
      'GET',
    );
    return {
      connectorId: id,
      setupState: json.data.status?.setup_state,
      syncState: json.data.status?.sync_state,
      isHistoricalSync: json.data.status?.is_historical_sync,
      succeededAt: json.data.succeeded_at,
      failedAt: json.data.failed_at,
    };
  }
}
