"use client";

import { useCallback, useRef, useState } from "react";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  Circle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Lightbulb,
} from "lucide-react";
import type { FinancialReport, Recommendation } from "@suite/types";
import Header from "@/components/Header";
import { agentApi, type RunSnapshot, type RunStep } from "@/lib/agent-api";
import { reportsApi } from "@/lib/reports-api";

type Phase = "idle" | "running" | "done" | "error";

function money(n: number, currency = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$${n.toLocaleString()}`;
  }
}

function StepIcon({ status }: { status: RunStep["status"] }) {
  if (status === "done")
    return <CheckCircle2 size={18} className="text-[#4ADE80]" />;
  if (status === "running")
    return <Loader2 size={18} className="animate-spin text-[#045DDF]" />;
  if (status === "error") return <XCircle size={18} className="text-[#FF8080]" />;
  return <Circle size={18} className="text-zinc-700" />;
}

export default function ReviewPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [steps, setSteps] = useState<RunStep[]>([]);
  const [report, setReport] = useState<
    (FinancialReport & { recommendations: Recommendation[] }) | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const onSnapshot = useCallback((snap: RunSnapshot) => {
    setSteps(snap.steps);
    if (snap.status === "error") {
      setError(snap.error ?? "The review failed");
      setPhase("error");
    }
    if (snap.status === "done" && snap.reportId) {
      reportsApi
        .get(snap.reportId)
        .then((r) => {
          setReport(r);
          setPhase("done");
        })
        .catch(() => setPhase("done"));
    }
  }, []);

  const run = useCallback(async () => {
    setPhase("running");
    setReport(null);
    setError(null);
    setSteps([]);
    try {
      const runId = await agentApi.startReview();
      abortRef.current = new AbortController();
      await agentApi.streamRun(runId, onSnapshot, abortRef.current.signal);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start the review");
      setPhase("error");
    }
  }, [onSnapshot]);

  const cashPositive = (report?.cashFlow ?? 0) >= 0;

  return (
    <>
      <Header />
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-thin scrollbar-track-[#0A0A0A] scrollbar-thumb-[#272727]">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          {/* Hero / CTA */}
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#272727] bg-gradient-to-br from-[#13203A] to-[#161616] p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#045DDF]/15 text-[#66A4FF]">
                <Sparkles size={20} />
              </div>
              <div>
                <h1 className="text-[18px] font-medium text-[#DEDEDE]">
                  Financial Review Agent
                </h1>
                <p className="text-[13px] text-[#6E7B82]">
                  Autonomously syncs your accounts, analyzes the numbers, and
                  builds an action plan.
                </p>
              </div>
            </div>
            <button
              onClick={run}
              disabled={phase === "running"}
              className="flex shrink-0 items-center gap-2 rounded-full bg-[#045DDF] px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#034BBB] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {phase === "running" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} />
              )}
              {phase === "idle"
                ? "Generate Financial Review"
                : phase === "running"
                  ? "Working…"
                  : "Run again"}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-[#3a2222] bg-[#1f1414] px-4 py-3 text-[13px] text-[#FF8080]">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          {phase !== "idle" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
              {/* Execution timeline */}
              <div className="rounded-2xl border border-[#272727] bg-[#161616] p-5">
                <p className="mb-4 text-[12px] font-medium tracking-wide text-[#6E7B82]">
                  EXECUTION
                </p>
                <ol className="flex flex-col gap-3">
                  {steps.map((s) => (
                    <li key={s.key} className="flex items-start gap-3">
                      <span className="mt-0.5">
                        <StepIcon status={s.status} />
                      </span>
                      <div className="flex min-w-0 flex-col">
                        <span
                          className={`text-[13px] ${
                            s.status === "pending"
                              ? "text-zinc-600"
                              : "text-[#DEDEDE]"
                          }`}
                        >
                          {s.label}
                        </span>
                        {s.detail && (
                          <span className="text-[11px] text-[#6E7B82]">
                            {s.detail}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Report */}
              <div className="flex flex-col gap-5">
                {report ? (
                  <>
                    {/* KPIs */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {[
                        { label: "Revenue", value: report.revenue },
                        { label: "Expenses", value: report.expenses },
                        { label: "Net", value: report.net },
                        { label: "Tax est.", value: report.taxEstimate },
                      ].map((k) => (
                        <div
                          key={k.label}
                          className="rounded-xl border border-[#272727] bg-[#161616] p-4"
                        >
                          <p className="text-[11px] text-[#6E7B82]">{k.label}</p>
                          <p className="mt-1 text-[18px] font-semibold text-[#DEDEDE]">
                            {money(k.value)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Cash flow + summary */}
                    <div className="rounded-2xl border border-[#272727] bg-[#161616] p-5">
                      <div className="mb-2 flex items-center gap-2">
                        {cashPositive ? (
                          <TrendingUp size={16} className="text-[#4ADE80]" />
                        ) : (
                          <TrendingDown size={16} className="text-[#FF8080]" />
                        )}
                        <span className="text-[14px] font-medium text-[#DEDEDE]">
                          Cash flow {money(report.cashFlow)}
                        </span>
                      </div>
                      <p className="text-[13px] leading-relaxed text-[#6E7B82]">
                        {report.summaryText}
                      </p>
                    </div>

                    {/* Anomalies */}
                    {report.anomalies.length > 0 && (
                      <div className="flex flex-col gap-2">
                        {report.anomalies.map((a, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 rounded-xl border border-[#3a3320] bg-[#1d1a10] px-4 py-3"
                          >
                            <AlertTriangle
                              size={16}
                              className="mt-0.5 shrink-0 text-[#D7C24E]"
                            />
                            <span className="text-[13px] text-[#E5D9A6]">
                              {a.detail}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Recommendations */}
                    {report.recommendations.length > 0 && (
                      <div className="rounded-2xl border border-[#272727] bg-[#161616] p-5">
                        <div className="mb-3 flex items-center gap-2">
                          <Lightbulb size={16} className="text-[#66A4FF]" />
                          <span className="text-[14px] font-medium text-[#DEDEDE]">
                            Recommendations & action items
                          </span>
                        </div>
                        <ul className="flex flex-col">
                          {report.recommendations.map((r, i) => (
                            <li
                              key={r.id}
                              className={`flex flex-col gap-0.5 py-3 ${
                                i === report.recommendations.length - 1
                                  ? ""
                                  : "border-b border-[#272727]"
                              }`}
                            >
                              <span className="text-[13px] font-medium text-[#DEDEDE]">
                                {r.title}
                              </span>
                              <span className="text-[12px] text-[#6E7B82]">
                                {r.rationale}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-3 text-[11px] text-[#6E7B82]">
                          {report.recommendations.length} task
                          {report.recommendations.length === 1 ? "" : "s"} added
                          to your workspace.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-1 items-center justify-center rounded-2xl border border-[#272727] bg-[#161616] p-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-[#6E7B82]">
                      <Loader2 size={20} className="animate-spin" />
                      <p className="text-[13px]">
                        The agent is working through your finances…
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
