"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  ListFilter,
  LayoutGrid,
  List,
  Plus,
  MoreHorizontal,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { FaMoneyBill } from "react-icons/fa";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { Budget } from "@suite/types";
import { budgetsApi } from "@/lib/budgets-api";
import { plaidApi } from "@/lib/plaid-api";
import { CreateBudgetModal } from "../components/CreateBudgetModal";
import { BudgetDetailsDrawer } from "../components/BudgetDetailsDrawer";

// ─── Types ────────────────────────────────────────────────────────────────────
type BudgetStatus = "On track" | "Budget exceeded" | "Needs attention";

export interface BudgetCard {
  id: string;
  name: string;
  category: string;
  categoryColor: string;
  account: string;
  spentPct: number;
  left: string;
  spent: string;
  total: string;
  status: BudgetStatus;
  resetInfo: string;
  progress: number;
  ringColor: string;
}

const money = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const STATUS_LABEL: Record<Budget["status"], BudgetStatus> = {
  on_track: "On track",
  needs_attention: "Needs attention",
  exceeded: "Budget exceeded",
};

const STATUS_RING: Record<Budget["status"], string> = {
  on_track: "#3DBEA7",
  needs_attention: "#FCFF96",
  exceeded: "#FF7676",
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Maps an API Budget into the card view-model used by this tab.
function toCard(b: Budget): BudgetCard {
  return {
    id: b.id,
    name: b.name,
    category: b.category,
    categoryColor: b.color ?? STATUS_RING[b.status],
    account: b.linkedAccount ?? "—",
    spentPct: b.progress,
    left: money(b.remaining),
    spent: money(b.spent),
    total: money(b.amount),
    status: STATUS_LABEL[b.status],
    resetInfo: `${cap(b.period)}${b.autoRenew ? ", auto-renews" : ""}`,
    progress: b.progress,
    ringColor: STATUS_RING[b.status],
  };
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const accountBreakdown = [
  { name: "Chase ***890B", amount: "$4,500", pct: 88 },
  { name: "Bank of America ***2345", amount: "$3,200", pct: 63 },
  { name: "Wells Fargo ***7689", amount: "$2,800", pct: 55 },
  { name: "Citi Bank ***1234", amount: "$5,100", pct: 100 },
];

const mostExpenses = [
  { name: "Salary Run", category: "Payroll", amount: "$2,150", change: "-5%", up: false, color: "#3DBEA7" },
  { name: "Meta Ads", category: "Marketing", amount: "$3,100", change: "+12%", up: true, color: "#FF7676" },
  { name: "AWS Billing", category: "Software", amount: "$950", change: "-6%", up: false, color: "#60a5fa" },
  { name: "Flight for Marketing team", category: "Operations", amount: "$1,260", change: "+12%", up: true, color: "#FCFF96" },
  { name: "Feeding for Staff", category: "Operations", amount: "$1,800", change: "-5%", up: false, color: "#FCFF96" },
];

const upcomingResets = [
  { label: "4 budgets reset in", highlight: "8 days", color: "#FCFF96" },
  { label: "Software resets in", highlight: "81 days", color: "#60a5fa" },
];

// ─── Status badge styles ──────────────────────────────────────────────────────
const statusStyles: Record<BudgetStatus, string> = {
  "On track": "bg-emerald-500/15 text-emerald-400",
  "Budget exceeded": "bg-rose-500/15 text-rose-400",
  "Needs attention": "bg-[#2E2E18] text-[#FCFF96]",
};

// ─── Category badge styles ────────────────────────────────────────────────────
const categoryBg: Record<string, string> = {
  Payroll: "bg-emerald-500/15 text-emerald-400",
  Marketing: "bg-rose-500/15 text-rose-400",
  Logistics: "bg-blue-500/15 text-blue-400",
  Operations: "bg-[#2E2E18] text-[#FCFF96]",
};

// ─── Donut Ring ───────────────────────────────────────────────────────────────
function DonutRing({ pct, color }: { pct: number; color: string }) {
  const data = [
    { value: pct },
    { value: 100 - pct },
  ];
  return (
    <div className="relative w-16 h-16 shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={22}
            outerRadius={30}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#1f1f1f" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] font-semibold text-white leading-none">{pct}%</span>
        <span className="text-[8px] text-zinc-500 leading-none mt-0.5">spent</span>
      </div>
    </div>
  );
}

// ─── Monthly Overview Donut ───────────────────────────────────────────────────
function MonthlyOverviewDonut() {
  const data = [
    { value: 46, color: "#3DBEA7" },   // On track
    { value: 20, color: "#FCFF96" },   // Attention
    { value: 34, color: "#FF7676" },   // Exceeded
  ];
  return (
    <div className="relative w-44 h-44 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={58}
            outerRadius={76}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
            paddingAngle={2}
            cornerRadius={3}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-white">$2,100</span>
        <span className="text-[11px] text-zinc-500 mt-0.5">of $6,550 · 46% spent</span>
      </div>
    </div>
  );
}

// ─── Budget Card ──────────────────────────────────────────────────────────────
function BudgetCardItem({ card, onOpen }: { card: BudgetCard; onOpen: (card: BudgetCard) => void }) {
  return (
    <div
      onClick={() => onOpen(card)}
      className="rounded-xl border border-[#272727] bg-[#111111] p-4 flex flex-col gap-3 hover:bg-[#161616] transition-colors cursor-pointer"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-zinc-200">{card.name}</span>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${categoryBg[card.category] ?? "bg-zinc-700/40 text-zinc-400"}`}>
            {card.category}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-zinc-500 whitespace-nowrap">{card.account}</span>
          <button
            onClick={(e) => e.stopPropagation()}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* Middle: donut + amounts */}
      <div className="flex items-center gap-4">
        <DonutRing pct={card.spentPct} color={card.ringColor} />
        <div className="flex-1 min-w-0">
          <div className="text-[10px] text-zinc-500 mb-0.5">Left</div>
          <div className="text-lg font-semibold text-white leading-tight">{card.left}</div>
          <div className="text-xs text-zinc-400 mt-0.5">
            <span className="text-zinc-300">{card.spent}</span>
            <span className="text-zinc-600">/{card.total}</span>
          </div>
          <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium mt-1.5 ${statusStyles[card.status]}`}>
            {card.status}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-[#272727] overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.min(card.progress, 100)}%`,
            backgroundColor: card.ringColor,
          }}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-zinc-500">{card.resetInfo}</span>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-zinc-500">{card.progress}%</span>
          {/* Avatar stack */}
          <div className="flex -space-x-1.5 ml-2">
            {["#3DBEA7", "#FF7676", "#60a5fa"].map((c, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border-2 border-[#111111] flex items-center justify-center text-[8px] font-bold text-white"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Right Sidebar ────────────────────────────────────────────────────────────
function BudgetSidebar({
  health,
}: {
  health: { onTrack: number; needsAttention: number; exceeded: number };
}) {
  return (
    <div className="w-80 shrink-0 flex flex-col gap-5">
      {/* Monthly Overview */}
      <div className="rounded-xl border border-[#272727] bg-[#111111] p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-white">Monthly Overview</span>
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <MoreHorizontal size={14} />
          </button>
        </div>
        <MonthlyOverviewDonut />
        <div className="flex items-center justify-center gap-4 mt-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" /> On track
          </span>
          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-[#2E2E18] shrink-0" /> Attention
          </span>
          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" /> Exceeded
          </span>
        </div>
      </div>

      {/* Budget Health */}
      <div className="rounded-xl border border-[#272727] bg-[#111111] p-4">
        <span className="text-sm font-medium text-white block mb-3">Budget Health</span>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-emerald-400">{health.onTrack}</span>
            <span className="text-[10px] text-emerald-500">On track</span>
          </div>
          <div className="rounded-lg bg-[#2E2E18] border border-amber-500/20 p-3 flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-[#FCFF96]">{health.needsAttention}</span>
            <span className="text-[10px] text-[#FCFF96]">Attention</span>
          </div>
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-rose-400">{health.exceeded}</span>
            <span className="text-[10px] text-rose-500">Exceeded</span>
          </div>
        </div>
      </div>

      {/* Account Breakdown */}
      <div className="rounded-xl border border-[#272727] bg-[#111111] p-4">
        <span className="text-sm font-medium text-white block mb-3">Account Breakdown</span>
        <div className="flex flex-col gap-3">
          {accountBreakdown.map((acc) => (
            <div key={acc.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-400 truncate max-w-[160px]">{acc.name}</span>
                <span className="text-xs font-medium text-zinc-200 shrink-0 ml-2">{acc.amount}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#272727] overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${acc.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Resets */}
      <div className="rounded-xl border border-[#272727] bg-[#111111] p-4">
        <span className="text-sm font-medium text-white block mb-3">Upcoming Resets</span>
        <div className="flex flex-col gap-2.5">
          {upcomingResets.map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
              {r.label}{" "}
              <span className="font-medium text-zinc-200">{r.highlight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Most Expenses */}
      <div className="rounded-xl border border-[#272727] bg-[#111111] p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-white">Most expenses</span>
          <button className="flex items-center gap-1 text-[11px] text-zinc-400 border border-[#272727] rounded-lg px-2 py-1 hover:text-white transition-colors">
            <span>This month</span>
            <ChevronDown size={11} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {mostExpenses.map((exp) => (
            <div key={exp.name} className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${exp.color}20` }}
              >
                <FaMoneyBill size={13} style={{ color: exp.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-200 truncate">{exp.name}</p>
                <p className="text-[10px] text-zinc-500">{exp.category}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-medium text-zinc-200">{exp.amount}</p>
                <p className={`text-[10px] ${exp.up ? "text-rose-400" : "text-emerald-400"}`}>
                  {exp.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function BudgetTab() {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetCard | null>(null);

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, txns] = await Promise.all([
        budgetsApi.list(),
        plaidApi.listTransactions().catch(() => []),
      ]);
      setBudgets(list);
      // Total spent = all expense (outflow) transactions.
      setTotalExpenses(
        txns
          .filter((t) => t.direction === "outflow")
          .reduce((s, t) => s + t.amount, 0),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load budgets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const cards = budgets.map(toCard);
  const filtered = cards.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()),
  );

  // ── Live stats ──────────────────────────────────────────────────────────────
  // Total spent mirrors total expenses (all outflow transactions); health is the
  // intensity of the gap between what's been spent and what's allocated.
  const totalBudget = budgets.reduce((s, b) => s + (b.amount ?? 0), 0);
  const totalSpent = totalExpenses;
  const remaining = Math.max(0, totalBudget - totalSpent);
  const usedPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const health = {
    onTrack: budgets.filter((b) => b.status === "on_track").length,
    needsAttention: budgets.filter((b) => b.status === "needs_attention").length,
    exceeded: budgets.filter((b) => b.status === "exceeded").length,
  };

  const healthLabel =
    totalBudget === 0
      ? "No budget set"
      : usedPct > 100
        ? "Over budget"
        : usedPct >= 80
          ? "Needs attention"
          : "Healthy";
  const healthSub =
    totalBudget === 0
      ? "Add a budget to track health"
      : usedPct > 100
        ? `${usedPct - 100}% over allocation`
        : `${100 - usedPct}% headroom left`;

  const stats = [
    {
      icon: "$",
      title: "Total budget",
      value: money(totalBudget),
      subtext: `${budgets.length} active budget${budgets.length === 1 ? "" : "s"}`,
      noChange: true,
    },
    {
      icon: "$",
      title: "Total spent",
      value: money(totalSpent),
      subtext: totalBudget > 0 ? `${usedPct}% of budget used` : "Total expenses",
      noChange: true,
    },
    {
      icon: "$",
      title: "Remaining",
      value: money(remaining),
      subtext: `${Math.max(0, 100 - usedPct)}% still available`,
      noChange: true,
    },
    {
      icon: "♥",
      title: "Budget health",
      value: healthLabel,
      subtext: healthSub,
      noChange: true,
    },
  ];

  return (
    <div className="p-6 space-y-5">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl border border-[#272727] bg-[#161616] p-5 shadow-lg"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-[#DEDEDE]">
                <span className="flex h-4 w-4 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-[10px] font-bold text-[#6E7B82]">
                  {stat.icon}
                </span>
                {stat.title}
              </div>
              <button className="text-zinc-500 hover:text-white">
                <MoreHorizontal size={16} />
              </button>
            </div>
            <div className="flex items-end justify-between gap-2">
              <h3 className="text-2xl font-medium text-white">{stat.value}</h3>
            </div>
            <p className="text-xs text-[#6E7B82] mt-1">{stat.subtext}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-48 max-w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
          <input
            type="text"
            placeholder="Search budgets"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#272727] bg-transparent py-2 pl-9 pr-4 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button className="flex items-center gap-2 rounded-lg border border-[#272727] bg-transparent px-3.5 py-2 text-sm text-zinc-400 hover:bg-[#161616] hover:text-white transition-colors">
            <Filter size={14} /> Filter
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-[#272727] bg-transparent px-3.5 py-2 text-sm text-zinc-400 hover:bg-[#161616] hover:text-white transition-colors">
            <ListFilter size={14} /> Sort
          </button>

          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-[#272727] bg-[#161616] p-0.5">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "kanban" ? "bg-[#272727] text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <LayoutGrid size={13} /> Kanban
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "list" ? "bg-[#272727] text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <List size={13} /> List
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus size={15} /> New budget
          </button>
        </div>
      </div>

      {/* Main content: kanban grid + sidebar */}
      <div className="flex gap-5 items-start">
        {/* Budget cards grid */}
        <div className="flex-1 min-w-0">
          {error && (
            <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
              {error}
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-zinc-500">
              <Loader2 size={16} className="animate-spin" /> Loading budgets…
            </div>
          ) : viewMode === "kanban" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((card) => (
                <BudgetCardItem key={card.id} card={card} onOpen={setSelectedBudget} />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-2 py-16 text-center text-sm text-zinc-600">
                  {budgets.length === 0
                    ? "No budgets yet — create your first to start tracking spend."
                    : "No budgets match your search."}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-[#272727] overflow-hidden">
              <table className="w-full text-sm text-zinc-400">
                <thead className="border-b border-[#272727] bg-[#0c0c0c]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Spent</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Remaining</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Reset</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]">
                  {filtered.map((card) => (
                    <tr
                      key={card.id}
                      onClick={() => setSelectedBudget(card)}
                      className="hover:bg-[#161616] transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 text-zinc-200 font-medium">{card.name}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${categoryBg[card.category] ?? "bg-zinc-700/40 text-zinc-400"}`}>
                          {card.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-300">{card.spent}/{card.total}</td>
                      <td className="px-4 py-3 text-zinc-300">{card.left}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium ${statusStyles[card.status]}`}>
                          {card.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 text-xs">{card.resetInfo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <BudgetSidebar health={health} />
      </div>

      <CreateBudgetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={load}
      />

      <BudgetDetailsDrawer
        budget={selectedBudget}
        onClose={() => setSelectedBudget(null)}
      />
    </div>
  );
}
