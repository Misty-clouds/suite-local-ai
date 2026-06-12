import { SetMetadata } from '@nestjs/common';

export const ACTIVITY_KEY = 'activity:message';

/**
 * Marks a controller handler so a friendly activity entry is recorded after it
 * succeeds. `type` is an optional coarse category used for the UI icon.
 */
export const Activity = (message: string, type?: string) =>
  SetMetadata(ACTIVITY_KEY, { message, type });
