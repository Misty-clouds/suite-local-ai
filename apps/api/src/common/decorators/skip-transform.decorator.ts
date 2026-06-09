import { SetMetadata } from '@nestjs/common';

export const SKIP_TRANSFORM = 'skipTransform';

/** Opt a route out of the global ApiResponse envelope (e.g. SSE streams). */
export const SkipTransform = () => SetMetadata(SKIP_TRANSFORM, true);
