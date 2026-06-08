"use client";

import { Calendar, ChevronDown, Sparkles } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import { GaugeChart } from "./GaugeChart";
import { StatsCard } from "@/components/StatsCard";
import {
  revenueExpensesData,
  profitTrendData,
  expenseBreakdown,
  statsCards,
} from "@/lib/chartData";

export function OverviewCharts() {
  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="flex gap-5">
        {/* Revenue vs Expenses Bar Chart */}
        <div className="flex-1 min-w-0 rounded-2xl shadow bg-[#161616] p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-medium text-[#DEDEDE]">Revenue Vs. Expenses</h3>
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#AACC4E]">
                <span>✦</span>
                <span>Your net profit increased by 22% in the last 30 days</span>
              </div>
            </div>
            <button className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#272727] px-3 py-1.5 text-xs text-zinc-400 hover:text-white">
              <Calendar size={13} />
              <span>Jan - Jul, 2026</span>
              <ChevronDown size={12} />
            </button>
          </div>

          <div className="mb-3 flex items-center justify-end gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#3b82f6]" />
              Revenue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#f87171]" />
              Expenses
            </span>
          </div>

          <div className="h-65">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueExpensesData}
                margin={{ top: 0, right: 4, left: -24, bottom: 0 }}
                barGap={6}
                barCategoryGap="30%"
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#393939" />
                <XAxis
                  dataKey="month"
                  stroke="#525252"
                  fontSize={11}
                  tick={{ fill: "#6E7B82" }}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                  tickFormatter={(v) => v.slice(0, 3)}
                />
                <YAxis
                  stroke="#525252"
                  fontSize={11}
                  tick={{ fill: "#6E7B82" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v / 1000}k`}
                  ticks={[0, 5000, 10000, 15000, 20000, 25000]}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="revenue" name="Revenue" fill="#045DDF" radius={[3, 3, 0, 0]} barSize={10} />
                <Bar dataKey="expenses" name="Expenses" fill="#FB9999" radius={[3, 3, 0, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="w-72 shrink-0 rounded-2xl border border-[#272727] bg-[#161616] p-5 shadow-lg flex flex-col">
          <GaugeChart total="$3500" />
          <div className="mt-2 flex flex-col gap-3 px-1">
            {expenseBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-zinc-300">{item.name}</span>
                </div>
                <span className="text-sm text-zinc-400">
                  {item.value}%, ${item.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profit Trend Area Chart */}
      <div className="rounded-2xl border border-[#272727] bg-[#161616] p-5 shadow-lg">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="text-base font-medium text-white">Profit trend</h3>
          <button className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#272727] px-3 py-1.5 text-xs text-zinc-400 hover:text-white">
            <Calendar size={13} />
            <span>Last year</span>
            <ChevronDown size={12} />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-2 text-xs text-[#AACC4E]">
          <Sparkles size={12} />
          <span>
            &ldquo;Your spending increased 12% this month due to marketing tools. Predicted burn rate for next quarter: $8,050/month.&rdquo;
          </span>
        </div>

        <div className="h-65">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={profitTrendData} margin={{ top: 5, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#393939" />
              <XAxis
                dataKey="month"
                stroke="#525252"
                fontSize={11}
                tick={{ fill: "#6E7B82" }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#525252"
                fontSize={11}
                tick={{ fill: "#6E7B82" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v / 1000}k`}
                ticks={[10000, 20000, 30000, 40000, 50000, 60000]}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ stroke: "#4ade80", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <Area
                type="monotone"
                dataKey="profit"
                name="Profit"
                stroke="#4ade80"
                strokeWidth={2.5}
                fill="url(#profitGradient)"
                dot={false}
                activeDot={{ r: 4, fill: "#4ade80", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
