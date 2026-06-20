/**
 * On-device AI for the Suite desktop app, powered entirely by the QVAC SDK
 * (@qvac/sdk). All inference runs locally on the user's machine — there is no
 * cloud AI dependency. The Electron main process loads a GGUF model once and
 * exposes `chat` / `insights` to the renderer over IPC (see main.ts / preload.ts).
 *
 * Model selection: set QVAC_MODEL to either a built-in model constant name
 * (e.g. "QWEN3_1_7B_INST_Q4", "LLAMA_3_2_1B_INST_Q4_0", "QWEN3_600M_INST_Q4")
 * or a custom modelSrc (a local *.gguf path or a remote URL to any
 * llama.cpp-compatible GGUF — e.g. a QVAC / MedPsy model). Defaults to a small
 * instruct model that downloads out-of-the-box.
 */

import * as audit from './audit';

// The SDK ships as an ESM package with native (Bare) addons. Import it through
// an indirection so TypeScript's CommonJS emit doesn't rewrite it to require().
const dynamicImport = new Function(
  'specifier',
  'return import(specifier)',
) as (specifier: string) => Promise<typeof import('@qvac/sdk')>;

const DEFAULT_MODEL = 'QWEN3_1_7B_INST_Q4';

const SYSTEM_PROMPT =
  'You are Suite AI, a concise, friendly finance operations assistant for a ' +
  'small business. Answer in 1-4 short sentences. Be practical and specific.';

export interface Severity {
  severity: 'info' | 'warning' | 'critical';
}

export interface ReviewContext {
  revenue: number;
  expenses: number;
  cashFlow: number;
  taxEstimate: number;
  topCategories: { category: string; amount: number }[];
  anomalies: { detail?: string }[];
}

export interface Insights {
  summaryText: string;
  recommendations: {
    title: string;
    rationale: string;
    severity: 'info' | 'warning' | 'critical';
  }[];
}

export interface QvacStatus {
  state: 'idle' | 'loading' | 'ready' | 'error';
  model: string;
  progress: number; // 0..1
  error?: string;
}

type Sdk = Awaited<ReturnType<typeof dynamicImport>>;

let sdkPromise: Promise<Sdk> | null = null;
let modelIdPromise: Promise<string> | null = null;
const MODEL_NAME = process.env.QVAC_MODEL ?? DEFAULT_MODEL;
const status: QvacStatus = {
  state: 'idle',
  model: MODEL_NAME,
  progress: 0,
};

// Record a session marker so a single demo run is easy to slice from the log.
audit.sessionStart(MODEL_NAME);

function loadSdk(): Promise<Sdk> {
  if (!sdkPromise) sdkPromise = dynamicImport('@qvac/sdk');
  return sdkPromise;
}

/** Resolve QVAC_MODEL to a built-in descriptor constant or a raw modelSrc. */
function resolveModelSrc(sdk: Sdk): unknown {
  const name = process.env.QVAC_MODEL ?? DEFAULT_MODEL;
  const known = (sdk as unknown as Record<string, unknown>)[name];
  // A bare name that isn't an exported constant is treated as a custom
  // modelSrc (local *.gguf path or remote GGUF URL).
  return known ?? name;
}

/** Lazily load the model exactly once; surfaces download progress in `status`. */
function ensureModel(): Promise<string> {
  if (!modelIdPromise) {
    status.state = 'loading';
    modelIdPromise = (async () => {
      const startedAt = Date.now();
      try {
        const sdk = await loadSdk();
        const modelId = await sdk.loadModel({
          modelSrc: resolveModelSrc(sdk) as never,
          onProgress: (p: { progress?: number } | number) => {
            const value = typeof p === 'number' ? p : (p?.progress ?? 0);
            status.progress = value;
          },
        });
        status.state = 'ready';
        status.progress = 1;
        audit.modelLoad({
          model: MODEL_NAME,
          modelId,
          ok: true,
          durationMs: Date.now() - startedAt,
        });
        return modelId;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        status.state = 'error';
        status.error = message;
        modelIdPromise = null; // allow a retry on the next call
        audit.modelLoad({
          model: MODEL_NAME,
          ok: false,
          durationMs: Date.now() - startedAt,
          error: message,
        });
        throw err;
      }
    })();
  }
  return modelIdPromise;
}

/** Free-form finance assistant reply, generated on-device. */
export async function chat(message: string, context?: string): Promise<string> {
  const sdk = await loadSdk();
  const modelId = await ensureModel();
  const userContent = context ? `${context}\n\nQuestion: ${message}` : message;
  const prompt = `${SYSTEM_PROMPT}\n\n${userContent}`;
  const text = await runCompletion(sdk, 'chat', prompt, modelId, {
    modelId,
    history: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ],
    stream: false,
  });
  return text.trim() || "Sorry, I couldn't generate a response.";
}

/**
 * Run one completion and write a structured audit record (prompt, prompt /
 * generated tokens, TTFT, tokens/sec, total latency, backend device). The
 * audit never alters the result the caller gets back.
 */
async function runCompletion(
  sdk: Sdk,
  kind: 'chat' | 'insights',
  prompt: string,
  modelId: string,
  params: Parameters<Sdk['completion']>[0],
): Promise<string> {
  const startedAt = Date.now();
  const run = sdk.completion(params);
  try {
    const text = await run.text;
    const stats = await run.stats.catch(() => undefined);
    audit.inference({
      model: MODEL_NAME,
      modelId,
      kind,
      requestId: run.requestId,
      prompt,
      totalMs: Date.now() - startedAt,
      stats: {
        timeToFirstTokenMs: stats?.timeToFirstToken,
        tokensPerSecond: stats?.tokensPerSecond,
        promptTokens: stats?.promptTokens,
        generatedTokens: stats?.generatedTokens,
        backendDevice: stats?.backendDevice,
      },
    });
    return text;
  } catch (err) {
    audit.inferenceError({
      model: MODEL_NAME,
      modelId,
      kind,
      requestId: run.requestId,
      prompt,
      totalMs: Date.now() - startedAt,
      error: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}

/** Turn the computed review numbers into a summary + recommendations on-device. */
export async function insights(ctx: ReviewContext): Promise<Insights> {
  const sdk = await loadSdk();
  const modelId = await ensureModel();
  const prompt = `You are a finance operations analyst for a small business.
Given this month's figures, write a 1-2 sentence executive summary and 2-3
specific, actionable recommendations.

Revenue: $${ctx.revenue}
Expenses: $${ctx.expenses}
Net cash flow: $${ctx.cashFlow}
Estimated tax: $${ctx.taxEstimate}
Top expense categories: ${JSON.stringify(ctx.topCategories)}
Anomalies: ${JSON.stringify(ctx.anomalies.map((a) => a.detail).filter(Boolean))}

Respond ONLY with JSON of the shape:
{"summaryText": string, "recommendations": [{"title": string, "rationale": string, "severity": "info"|"warning"|"critical"}]}`;

  const raw = await runCompletion(sdk, 'insights', prompt, modelId, {
    modelId,
    history: [{ role: 'user', content: prompt }],
    stream: false,
  });
  return parseInsights(raw);
}

const ALLOWED: Insights['recommendations'][number]['severity'][] = [
  'info',
  'warning',
  'critical',
];

/** Defensive JSON extraction — small local models may wrap or pad the JSON. */
function parseInsights(raw: string): Insights {
  let parsed: Partial<Insights> = {};
  try {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    parsed =
      start >= 0 && end > start
        ? (JSON.parse(raw.slice(start, end + 1)) as Partial<Insights>)
        : {};
  } catch {
    parsed = {};
  }
  return {
    summaryText: typeof parsed.summaryText === 'string' ? parsed.summaryText : '',
    recommendations: (parsed.recommendations ?? [])
      .filter((r) => r && r.title && r.rationale)
      .map((r) => ({
        title: String(r.title),
        rationale: String(r.rationale),
        severity: ALLOWED.includes(r.severity) ? r.severity : 'info',
      })),
  };
}

export function getStatus(): QvacStatus {
  return status;
}

/** Free the model on app quit. */
export async function unload(): Promise<void> {
  if (!modelIdPromise) return;
  const startedAt = Date.now();
  let modelId: string | undefined;
  try {
    const sdk = await loadSdk();
    modelId = await modelIdPromise;
    await sdk.unloadModel({ modelId });
    audit.modelUnload({
      model: MODEL_NAME,
      modelId,
      durationMs: Date.now() - startedAt,
    });
  } catch {
    // best-effort on shutdown
  } finally {
    modelIdPromise = null;
    status.state = 'idle';
    status.progress = 0;
  }
}
