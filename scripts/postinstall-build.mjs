// Builds the API on deploy hosts (pxxl/Railway/Render) that only run
// `install` + `start` and prune devDependencies. No-op for local dev & CI.
//
// On the server NODE_ENV=production, so the host's install skips devDeps and
// never compiles. Here we (1) re-install the API subtree WITH devDeps
// (--prod=false), ignoring scripts to avoid recursing into this hook, then
// (2) run `nest build` to produce apps/api/dist.
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

// Local dev / CI: do nothing (they build via turbo as usual).
if (process.env.NODE_ENV !== 'production') process.exit(0);
// Already compiled in this filesystem: skip.
if (existsSync('apps/api/dist/main.js')) process.exit(0);

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });
try {
  run(
    'pnpm install --frozen-lockfile --filter @suite/api... --prod=false --ignore-scripts',
  );
  run('pnpm run build:api');
} catch (err) {
  console.error('[postinstall-build] failed:', err?.message ?? err);
  process.exit(1);
}
