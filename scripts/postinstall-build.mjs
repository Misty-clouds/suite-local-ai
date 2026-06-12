// Builds the API on deploy hosts (pxxl/Railway/Render) that run `install` +
// `start` but no build step. No-op for local dev & CI.
//
// The API's build toolchain (@nestjs/cli, @nestjs/schematics, typescript,
// @types/*, @suite/config) lives in `dependencies`, so it survives the host's
// production install — we can compile directly here without a nested install.
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

// Local dev / CI: do nothing (they build via turbo as usual).
if (process.env.NODE_ENV !== 'production') process.exit(0);
// Already compiled in this filesystem: skip.
if (existsSync('apps/api/dist/main.js')) process.exit(0);

try {
  execSync('pnpm run build:api', { stdio: 'inherit' });
} catch (err) {
  console.error('[postinstall-build] failed:', err?.message ?? err);
  process.exit(1);
}
