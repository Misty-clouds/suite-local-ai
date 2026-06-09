import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

/**
 * Service-to-service auth for the agent tool endpoints. The ADK agent sends
 * `x-agent-token` (shared secret) and `x-owner-id` (the user the run is for).
 */
@Injectable()
export class AgentServiceGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.header('x-agent-token');
    const expected = this.config.get<string>('AGENT_SERVICE_TOKEN');
    if (!expected || token !== expected) {
      throw new UnauthorizedException('Invalid agent service token');
    }
    return true;
  }
}
