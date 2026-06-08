import React from "react";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, Plus } from "lucide-react";

export default function StatsCards({ isEmpty = false }: { isEmpty?: boolean }) {
  type StatItem = {
    title: string;
    value: string;
    subtext: string;
    change?: string;
    trend?: string;
    action?: string;
    customRender?: () => React.ReactNode;
  };

  const stats: StatItem[] = [
    {
      title: "Total revenue",
      value: "$32,000",
      change: "+12%",
      trend: "up",
      subtext: "Up 5% compared to last month",
    },
    {
      title: "Total expenses",
      value: "$32,000",
      change: "-5%",
      trend: "down",
      subtext: "Down 5% compared to last month",
    },
    {
      title: "Active projects",
      value: "12",
      subtext: "3 delayed, 9 on schedule",
      customRender: () => (
        <div className="h-6 w-6 rounded-full border-2 border-white/20 border-t-green-500 border-r-green-500 border-b-green-500"></div>
      ),
    },
  ];

  const emptyStats: StatItem[] = [
    {
      title: "Total revenue",
      value: "--",
      subtext: "No data yet",
      action: "Connect bank",
    },
    {
      title: "Total expenses",
      value: "--",
      subtext: "No data yet",
      action: "Add expense",
    },
    {
      title: "Active projects",
      value: "--",
      subtext: "No data yet",
      action: "Create project",
    },
  ];

  const dataToRender = isEmpty ? emptyStats : stats;

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      {dataToRender.map((stat, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-2xl border border-app-border bg-app-card p-5 shadow-lg transition-transform hover:scale-[1.01]"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-[10px] text-zinc-400">
                {index === 2 ? <div className="w-2 h-2 rounded-full bg-brand-primary" /> : "$"}
              </span>
              {stat.title}
            </div>
            <button className="text-zinc-500 hover:text-white">
              <MoreHorizontal size={16} />
            </button>
          </div>

          <div className="mb-2 flex items-center justify-between">
            {!isEmpty ? (
              <h3 className={`text-3xl font-semibold ${isEmpty ? "text-white" : "text-white"}`}>
                {stat.value}
              </h3>
            ) : (
              <div className="flex items-center justify-between w-full">
                <h3 className={`text-3xl font-semibold ${isEmpty ? "text-white" : "text-white"}`}>
                  {stat.value}
                </h3>
                <p className="text-xs text-zinc-500">No data yet</p>
              </div>
            )}
            {!isEmpty && stat.change && (
              <span
                className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium ${
                  stat.trend === "up"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {stat.trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </span>
            )}
            {stat.customRender && stat.customRender()}
          </div>

          <div className="flex items-center justify-between mt-auto">
            {!isEmpty && <p className="text-xs text-zinc-500">{stat.subtext}</p>}
            {isEmpty && stat.action && (
              <button className="flex items-center gap-1 text-sm font-medium text-blue-500 hover:text-blue-400">
                <Plus size={16} /> {stat.action}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
