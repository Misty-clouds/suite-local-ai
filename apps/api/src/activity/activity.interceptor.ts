import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ACTIVITY_KEY } from './decorators/activity.decorator';
import { ActivityService } from './activity.service';

interface ActivityMeta {
  message: string;
  type?: string;
}

/**
 * Records an activity entry after any handler decorated with `@Activity()`
 * completes successfully, attributed to the authenticated user.
 */
@Injectable()
export class ActivityInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly activities: ActivityService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const meta = this.reflector.get<ActivityMeta | undefined>(
      ACTIVITY_KEY,
      context.getHandler(),
    );
    return next.handle().pipe(
      tap(() => {
        if (!meta) return;
        const req = context.switchToHttp().getRequest<{
          user?: { userId?: string };
        }>();
        const userId = req.user?.userId;
        if (userId) void this.activities.log(userId, meta.message, meta.type);
      }),
    );
  }
}
