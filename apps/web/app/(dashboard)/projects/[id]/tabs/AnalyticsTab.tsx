"use client";

import { useState } from "react";
import { ChevronDown, CircleDollarSign, Wallet, Receipt, CheckCircle2, MoreHorizontal } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const revenueTrendData = [
  { name: "January", revenue: 14000, expenses: 12000 },
  { name: "February", revenue: 17000, expenses: 11500 },
  { name: "March", revenue: 6500, expenses: 23000 },
  { name: "April", revenue: 15500, expenses: 6500 },
  { name: "May", revenue: 11500, expenses: 10500 },
  { name: "June", revenue: 17000, expenses: 13500 },
  { name: "July", revenue: 21000, expenses: 11000 },
];

const completionPct = 72;
const completionTasksText = "32/50 tasks complete";
const completionRingRadius = 16;
const completionRingStroke = 2.5;
const completionCircumference = 2 * Math.PI * completionRingRadius;
const completionDashOffset = completionCircumference - (completionPct / 100) * completionCircumference;

const analyticsCards = [
  { icon: <CircleDollarSign size={14} className="text-zinc-500" />, label: "Billed", value: "$32,000", sub: "Total invoiced for this project" },
  { icon: <Wallet size={14} className="text-zinc-500" />, label: "Collected", value: "$22,000", sub: "Payment received" },
  { icon: <Receipt size={14} className="text-zinc-500" />, label: "Outstanding", value: "$22,000", sub: "Unpaid invoices" },
];

export function AnalyticsTab() {
  const [analyticsRange, setAnalyticsRange] = useState<"30d" | "60d" | "90d">("30d");
  const [isAnalyticsRangeOpen, setIsAnalyticsRangeOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* Range selector */}
      <div className="flex items-center gap-3">
        {(["30d", "60d", "90d"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setAnalyticsRange(opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              analyticsRange === opt
                ? "bg-[#272727] text-white border-[#2F2F2F]"
                : "bg-[#111111] text-zinc-400 border-[#272727] hover:text-zinc-200"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {analyticsCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-[#272727] bg-[#111111] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#272727] bg-[#161616]">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                {card.icon}
                {card.label}
              </div>
              <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </div>
            <div className="px-4 py-4">
              <div className="text-2xl font-semibold">{card.value}</div>
              <div className="text-xs text-zinc-500 mt-1">{card.sub}</div>
            </div>
          </div>
        ))}

        {/* Completion card */}
        <div className="rounded-xl border border-[#272727] bg-[#111111] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#272727] bg-[#161616]">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <CheckCircle2 size={14} className="text-zinc-500" />
              Completion
            </div>
            <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <div className="px-4 py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-2xl font-semibold">{completionPct}%</div>
              <div className="text-xs text-zinc-500 mt-1">{completionTasksText}</div>
            </div>
            <div className="shrink-0">
              <svg width={44} height={44} viewBox="0 0 44 44" className="text-zinc-700">
                <circle cx="22" cy="22" r={completionRingRadius} fill="none" stroke="#2A2A2A" strokeWidth={completionRingStroke} />
                <circle
                  cx="22" cy="22" r={completionRingRadius}
                  fill="none" stroke="#22C55E" strokeWidth={completionRingStroke}
                  strokeLinecap="round"
                  strokeDasharray={completionCircumference}
                  strokeDashoffset={completionDashOffset}
                  transform="rotate(-90 22 22)"
                  style={{ filter: "drop-shadow(0 0 6px rgba(34,197,94,0.35))" }}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue trend chart */}
      <div className="rounded-xl border border-[#272727] bg-[#111111] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#272727] bg-[#161616]">
          <div className="text-sm font-medium text-zinc-200">Revenue trend</div>
          <div className="relative">
            <button
              onClick={() => setIsAnalyticsRangeOpen(!isAnalyticsRangeOpen)}
              className="flex items-center gap-2 text-xs text-zinc-400 border border-[#272727] bg-[#111111] hover:bg-[#1A1A1A] px-3 py-1.5 rounded-lg"
            >
              Jan - Jul, 2026 <ChevronDown size={14} />
            </button>
            {isAnalyticsRangeOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsAnalyticsRangeOpen(false)} />
                <div className="absolute right-0 mt-2 w-44 rounded-lg border border-[#272727] bg-[#111111] shadow-xl z-50 overflow-hidden">
                  {["Jan - Jul, 2026", "Aug - Dec, 2026", "Full year, 2026"].map((label) => (
                    <button
                      key={label}
                      className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-[#1A1A1A] hover:text-white transition-colors"
                      onClick={() => setIsAnalyticsRangeOpen(false)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="px-4 py-3 text-xs text-[#A3E635] border-b border-[#272727] bg-[#0c0c0c]">
          Your net profit increased by 22% in the last {analyticsRange} from this client alone
        </div>

        <div className="p-4">
          <div className="h-70 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrendData} barCategoryGap={22}>
                <CartesianGrid stroke="#272727" vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: "#71717A", fontSize: 11 }} axisLine={{ stroke: "#272727" }} tickLine={false} />
                <YAxis tick={{ fill: "#71717A", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  contentStyle={{ background: "#111111", border: "1px solid #272727", borderRadius: 10, color: "#E4E4E7", fontSize: 12 }}
                  labelStyle={{ color: "#A1A1AA" }}
                  formatter={(value: unknown, name: unknown) => {
                    const numeric = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
                    const label = name === "revenue" ? "Revenue" : "Expenses";
                    return [Number.isFinite(numeric) ? `${numeric.toLocaleString()}` : String(value), label];
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ color: "#A1A1AA", fontSize: 12 }}
                  formatter={(value) => (
                    <span style={{ color: "#A1A1AA" }}>{value === "revenue" ? "Revenue" : "Expenses"}</span>
                  )}
                />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={18} />
                <Bar dataKey="expenses" fill="#FCA5A5" radius={[4, 4, 0, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
