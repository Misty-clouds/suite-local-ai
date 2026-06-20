/**
 * Structured, append-only audit log for on-device QVAC inference.
 *
 * Writes one JSON object per line (NDJSON / JSON Lines) so a full demo run can
 * be replayed and inspected. It captures exactly the events an on-device-AI
 * audit trail needs:
 *   • model_load   — model id / source, load duration, ok|error
 *   • model_unload — model id, unload duration
 *   • inference    — kind (chat|insights), the prompt, prompt + generated token
 *                    counts, time-to-first-token (ms), tokens/sec, total
 *                    latency (ms), and the backend device (cpu|gpu)
 *
 * Every record shares: { ts (ISO), event, runId, model } plus event-specific
 * fields. Each process start emits a `session_start` marker so a single demo
 * run is easy to slice out of the file.
 *
 * Log location (first that resolves):
 *   1. $QVAC_AUDIT_LOG                      — explicit file path
 *   2. <electron userData>/qvac-audit.log   — packaged / normal desktop run
 *   3. ./qvac-audit.log                      — cwd fallback (e.g. tests)
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { randomUUID } from 'node:crypto';

export interface InferenceStats {
  timeToFirstTokenMs?: number;
  tokensPerSecond?: number;
  promptTokens?: number;
  generatedTokens?: number;
  backendDevice?: 'cpu' | 'gpu';
}

type AuditRecord = Record<string, unknown> & {
  ts: string;
  event:
    | 'session_start'
    | 'model_load'
    | 'model_unload'
    | 'inference'
    | 'inference_error';
};

const SESSION_ID = randomUUID();

let resolvedPath: string | null = null;

/** Resolve the audit log path once, creating the parent dir if needed. */
function logPath(): string {
  if (resolvedPath) return resolvedPath;

  let file = process.env.QVAC_AUDIT_LOG;
  if (!file) {
    let dir = process.cwd();
    try {
      // Avoid a hard dependency on electron so this module stays unit-testable.
      const { app } = require('electron') as typeof import('electron');
      if (app?.getPath) dir = app.getPath('userData');
    } catch {
      // not running inside electron — fall back to cwd
    }
    file = path.join(dir, 'qvac-audit.log');
  }

  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
  } catch {
    // best-effort; write() below will surface any real problem
  }
  resolvedPath = file;
  return file;
}

/** Append one record as a single NDJSON line. Never throws into a caller. */
function write(record: AuditRecord): void {
  try {
    fs.appendFileSync(logPath(), JSON.stringify(record) + '\n');
  } catch (err) {
    // Auditing must never break inference; surface to stderr only.
    console.error('[qvac-audit] failed to write audit record:', err);
  }
}

function base(event: AuditRecord['event'], model: string) {
  return { ts: new Date().toISOString(), session: SESSION_ID, event, model };
}

/** Emitted once per process start so a demo run is easy to isolate. */
export function sessionStart(model: string): void {
  write({
    ...base('session_start', model),
    pid: process.pid,
    platform: process.platform,
    arch: process.arch,
    auditLog: logPath(),
  });
}

export function modelLoad(args: {
  model: string;
  ok: boolean;
  durationMs: number;
  modelId?: string;
  error?: string;
}): void {
  write({
    ...base('model_load', args.model),
    modelId: args.modelId,
    ok: args.ok,
    durationMs: Math.round(args.durationMs),
    ...(args.error ? { error: args.error } : {}),
  });
}

export function modelUnload(args: {
  model: string;
  modelId?: string;
  durationMs: number;
}): void {
  write({
    ...base('model_unload', args.model),
    modelId: args.modelId,
    durationMs: Math.round(args.durationMs),
  });
}

export function inference(args: {
  model: string;
  modelId?: string;
  kind: 'chat' | 'insights';
  requestId?: string;
  prompt: string;
  totalMs: number;
  stats: InferenceStats;
}): void {
  write({
    ...base('inference', args.model),
    modelId: args.modelId,
    kind: args.kind,
    requestId: args.requestId,
    prompt: args.prompt,
    promptChars: args.prompt.length,
    promptTokens: args.stats.promptTokens,
    generatedTokens: args.stats.generatedTokens,
    timeToFirstTokenMs: round(args.stats.timeToFirstTokenMs),
    tokensPerSecond: round(args.stats.tokensPerSecond),
    totalMs: Math.round(args.totalMs),
    backendDevice: args.stats.backendDevice,
  });
}

export function inferenceError(args: {
  model: string;
  modelId?: string;
  kind: 'chat' | 'insights';
  requestId?: string;
  prompt: string;
  totalMs: number;
  error: string;
}): void {
  write({
    ...base('inference_error', args.model),
    modelId: args.modelId,
    kind: args.kind,
    requestId: args.requestId,
    promptChars: args.prompt.length,
    totalMs: Math.round(args.totalMs),
    error: args.error,
  });
}

function round(n: number | undefined): number | undefined {
  return typeof n === 'number' ? Math.round(n * 100) / 100 : undefined;
}

/** Absolute path of the active audit log (for surfacing in UI / docs). */
export function auditLogPath(): string {
  return logPath();
}
