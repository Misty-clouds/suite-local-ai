"use client";

import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";

interface StatsCardProps {
  icon: string;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  subtext: string;
}

export function StatsCard({ icon, title, value, change, trend, subtext }: StatsCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#272727] bg-[#161616] p-5 shadow-lg transition-transform hover:scale-[1.01]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-[10px] font-bold text-zinc-400">
            {icon}
          </span>
          {title}
        </div>
        <button className="text-zinc-500 hover:text-white">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-3xl font-semibold text-white">{value}</h3>
        <span
          className={`flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-medium ${
            trend === "up"
              ? "bg-green-500/10 text-green-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {trend === "up" ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {change}
        </span>
      </div>
      <p className="text-xs text-zinc-500">{subtext}</p>
    </div>
  );
}
