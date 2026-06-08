"use client";

import { X, Sparkles, ChevronRight, Timer } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis } from "recharts";
import { FaMoneyBill } from "react-icons/fa";
import type { BudgetCard } from "../tabs/BudgetTab";

interface BudgetDetailsDrawerProps {
  budget: BudgetCard | null;
  onClose: () => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const aiInsights = [
  {
    icon: "💡",
    title: "Subscription costs are predictable and stable",
    desc: "Your monthly software spend has been consistent at $2,100 for the past 3 months",
  },
  {
    icon: "💡",
    title: "Frame team plan renews May 12 — $75",
    desc: "You're using your quarterly plan. Switch to annual, shift comfortably to $850/yr",
  },
  {
    icon: "💡",
    title: "2 unused tool licenses detected",
    desc: "Slack and Notion have 2 inactive seats. Remove them to save $48/month",
  },
];

const reduceSpendOptions = [
  { id: 1, label: "Reduce spend?", active: false },
  { id: 2, label: "vs Last month", active: false },
  { id: 3, label: "Increase budget?", active: false },
];

const spendTrendData = [
  { month: "April", amount: 1800 },
  { month: "May", amount: 2200 },
  { month: "Jun", amount: 1600 },
  { month: "Jul", amount: 2400 },
  { month: "Aug", amount: 1900 },
  { month: "Sep", amount: 2100 },
  { month: "Today", amount: 2300 },
];

const mostExpenses = [
  { name: "Notion", date: "Oct 04 - Ag 2", amount: "$2,160", color: "#012158" },
  { name: "Notion", date: "Oct 04 - Ag 2", amount: "$2,160", color: "#012158" },
  { name: "Notion", date: "Oct 04 - Ag 2", amount: "$2,160", color: "#012158" },
  { name: "Notion", date: "Oct 04 - Ag 2", amount: "$2,160", color: "#012158" },
  { name: "Notion", date: "Oct 04 - Ag 2", amount: "$2,160", color: "#012158" },
];

// ─── Donut Ring (larger version) ─────────────────────────────────────────────
function LargeDonutRing({ pct, spent, total }: { pct: number; spent: string; total: string }) {
  const data = [{ value: pct }, { value: 100 - pct }];
  return (
    <div className="relative w-32 h-32 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={62}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            <Cell fill="#3DBEA7" />
            <Cell fill="#1f1f1f" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-base font-bold text-[#DEDEDE] leading-none">{pct}%</span>
        <span className="text-[10px] text-[#6E7B82] leading-none mt-1">spent</span>
      </div>
    </div>
  );
}

// ─── Main Drawer ──────────────────────────────────────────────────────────────
export function BudgetDetailsDrawer({ budget, onClose }: BudgetDetailsDrawerProps) {
  const isOpen = !!budget;

  if (!budget) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={`fixed right-0 top-0 z-50 h-screen min-w-[420px] lg:w-[500px] flex flex-col border-l border-[#222222] bg-[#0A0A0A] shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Header ── */}
        <div className="shrink-0 px-5 pt-5 pb-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-[#DEDEDE]">Budget Details</span>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-[#1e1e1e] hover:text-white"
            >
              <X size={15} />
            </button>
          </div>

          {/* Status badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center rounded-sm px-2 py-1.5 text-[10px] font-medium bg-[#B0F5FF1A] text-[#B0F5FF]">
              Marketing
            </span>
            <span className="inline-flex items-center rounded-sm px-2 py-1.5 text-[10px] font-medium bg-[#162C1E] text-[#3DBEA7]">
              On track
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-[#DEDEDE] mb-1">Software & Tools</h2>
          <p className="text-base text-[#6E7B82]">Every 1st of the month • Resets Jun 30</p>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 scrollbar-thin scrollbar-track-[#0A0A0A] scrollbar-thumb-[#272727]">
          {/* Donut + stats */}
          <div className="flex justify-between items-center w-full">
            <LargeDonutRing pct={45} spent="$2,100" total="$5,000" />
            <div className="flex flex-col items-start gap-3 min-w-[60%]">
              <div className="flex flex-col gap-2 items-start">
                <h6 className="text-[#6E7B82] text-xs">Total spent</h6>
                <p className="font-bold text-[#DEDEDE] text-lg">$2,100</p>
                <p className="text-xs text-[#6E7B82] ">of $5,000 budget</p>
              </div>

              <div className="flex w-full justify-between items-center gap-3">
                <div>
                  <p className="text-[#6E7B82] text-xs pb-2">Remaining</p>
                  <p className="font-bold text-[#3DBEA7] text-base ">$210</p>
                </div>
                <div>
                  <p className="text-[#6E7B82] text-xs pb-2">Daily Avg.</p>
                  <p className="font-bold text-[#DEDEDE] text-base ">$10</p>
                </div>
                <div>
                  <p className="text-[#6E7B82] text-xs pb-2">Transactions</p>
                  <p className="font-bold text-[#DEDEDE] text-base ">$21</p>
                </div>
              </div>
            </div>
          </div>
          <div className="py-2 px-5">
            {/* Legend progressbar */}
            <div className="w-full h-1 bg-[#4E4E4E] rounded-full flex items-center">
              <div className="h-full bg-[#FF4646] w-[40%] rounded-full"></div>
              <div className="h-full bg-[#FCFF96] w-[30%] rounded-full"></div>
            </div>
            {/* Legend */}
            <div className="flex items-center justify-start gap-4 mt-4 text-sm pl-1">
              <span className="flex items-center gap-1.5 text-[#6E7B82]">
                <span className="w-2 h-2 rounded-full bg-[#FF4646] shrink-0" /> Spent
              </span>
              <span className="flex items-center gap-1.5 text-[#6E7B82]">
                <span className="w-2 h-2 rounded-full bg-[#FCFF96] shrink-0" /> Projected
              </span>
              <span className="flex items-center gap-1.5 text-[#6E7B82]">
                <span className="w-2 h-2 rounded-full bg-[#4E4E4E] shrink-0" /> Remaining
              </span>
            </div>
          </div>

          {/* AI Insights */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-semibold text-[#DEDEDE] tracking-wider">AI Insights</h3>
            {aiInsights.map((insight, i) => (
              <div
                key={i}
                className="rounded-lg bg-[#B0F5FF1A] p-3 flex items-start gap-1.5 hover:bg-[#7ebdc61a] transition-colors cursor-pointer"
              >
                <span className="text-lg shrink-0 mt-0.5 flex justify-center items-center bg-[#B0F5FF1A] rounded-lg p-2 ">
                  <Sparkles size={16} color="#B0F5FF" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#DEDEDE] leading-snug mb-1">
                    {insight.title}
                  </p>
                  <p className="text-sm text-[#6E7B82] leading-relaxed">{insight.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Ask anything */}
          <div className="rounded-lg border border-[#222222] bg-[#161616] gap-3 flex flex-col p-3">
            <span className="text-[#DEDEDE] text-sm flex items-center gap-1">
              <Timer size={16} color="#B0F5FF" /> Ask anything about this budget
            </span>
            <div className="w-full flex justify-between items-center gap-3">
              <input
                type="text"
                placeholder="e.g Why did spend spike on the 14th?"
                className="w-full border border-[#222222] bg-[#1A1A1A] rounded-md px-4 py-3 placeholder:text-[#656565] text-[#DEDEDE]"
              />
              <button className="bg-[#045DDF] hover:bg-[#034cb9] py-3 px-2 rounded-lg text-[#DEDEDE] text-sm font-medium min-w-[82px]">
                Ask
              </button>
            </div>
            <div className="flex items-center gap-2">
              {reduceSpendOptions.map((opt) => (
                <span
                  key={opt.id}
                  className="text-sm bg-[#101213] border border-[#222222] text-[#6E7B82] rounded-full p-3 cursor-pointer hover:bg-[#050505] transition-colors"
                >
                  {opt.label}
                </span>
              ))}
            </div>
          </div>

          {/* Spend Trend */}
          <div className="p-4">
            <h3 className="text-SM font-normal text-[#DEDEDE] mb-3">Spend Trend - April</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendTrendData} barCategoryGap="20%">
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#71717A", fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Bar dataKey="amount" fill="#045DDF" radius={[3, 3, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Budget Details */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-normal text-[#DEDEDE]">Budget Details</h3>
            <div className="">
              {[
                { label: "Linked account", value: "Chase ***890B" },
                { label: "Balance available", value: "$60,000" },
                { label: "Currency", value: "USD" },
                { label: "Resets on", value: "Apr 30, 2025" },
                { label: "Auto-renew", value: "Quarterly" },
                { label: "Alert threshold", value: "80%" },
                { label: "Created", value: "Mar 1, 2025" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-[#6E7B82]">{item.label}</span>
                  <span className="text-sm font-medium text-[#DEDEDE]">{item.value}</span>
                </div>
              ))}

              <div className="pt-1 pb-2.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#6E7B82]">Assigned to</span>
                  <div className="flex items-center gap-2">
                    {["#3DBEA7", "#FF7676", "#60a5fa", "#FCFF96"].map((c, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                        style={{ backgroundColor: c }}
                      >
                        {["S", "J", "M", "A"][i]}
                      </div>
                    ))}
                  </div>
                </div>
                <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 justify-self-end pt-3">
                  View all (12) <ChevronRight size={10} />
                </button>
              </div>
            </div>
          </div>

          {/* Most expenses */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-normal text-[#DEDEDE]">Most expenses</h3>
              <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                View all (12) <ChevronRight size={10} />
              </button>
            </div>
            <div className="divide-y divide-[#1e1e1e]">
              {mostExpenses.map((exp, i) => (
                <div key={i} className="flex items-center gap-3 px-3.5 py-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${exp.color}` }}
                  >
                    <FaMoneyBill size={12} style={{ color: "#CCE1FF" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-200">{exp.name}</p>
                    <p className="text-[10px] text-zinc-500">{exp.date}</p>
                  </div>
                  <span className="text-sm font-medium text-[#DEDEDE] shrink-0">{exp.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* End of period projection */}
          <div className="rounded-lg bg-[#3DBEA71A] p-3">
            <h3 className="text-sm font-normal text-[#3DBEA7] mb-2">Spend projection</h3>
            <p className="text-2xl font-bold text-[#3DBEA7] mb-1">$4,600</p>
            <p className="text-sm text-[#6E7B82] leading-relaxed">
              Projected quarterly spend will run on $800 (17%) for action needed. Reduce spend or
              increase budget.
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 border-t border-[#1e1e1e] px-5 py-4 flex gap-3">
          <button className="flex-1 rounded-xl border border-[#2a2a2a] bg-transparent py-2.5 text-sm font-medium text-white hover:bg-[#1e1e1e] transition-colors">
            Edit Budget
          </button>
          <button className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors">
            Add Transaction
          </button>
        </div>
      </div>
    </>
  );
}
