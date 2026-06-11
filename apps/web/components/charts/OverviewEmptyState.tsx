"use client";

import { DollarSign, FolderKanban, BarChart3, Plus, Landmark } from "lucide-react";

const STATS = [
  { icon: DollarSign, label: "Total revenue", action: "Connect bank", key: "connect" },
  { icon: DollarSign, label: "Total expenses", action: "Add expense", key: "expense" },
  { icon: FolderKanban, label: "Active projects", action: "Create project", key: "project" },
] as const;

export function OverviewEmptyState({
  onConnectBank,
  onAddTransaction,
}: {
  onConnectBank?: () => void;
  onAddTransaction?: () => void;
}) {
  const handle = (key: string) => {
    if (key === "connect") onConnectBank?.();
    else if (key === "expense") onAddTransaction?.();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Empty stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-[#272727] bg-[#161616] p-5"
            >
              <div className="flex items-center gap-2 text-[#6E7B82]">
                <div className="flex size-7 items-center justify-center rounded-lg bg-[#1c1c1c] text-zinc-400">
                  <Icon size={14} />
                </div>
                <span className="text-[13px]">{s.label}</span>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <span className="text-[28px] font-semibold text-zinc-600">
                  --
                </span>
                <span className="text-[12px] text-zinc-600">No data yet</span>
              </div>
              <button
                onClick={() => handle(s.key)}
                className="mt-3 flex items-center gap-1.5 text-[13px] text-[#3b82f6] transition-colors hover:text-[#60a5fa]"
              >
                <Plus size={14} /> {s.action}
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty chart card */}
      <div className="rounded-2xl border border-[#272727] bg-[#161616] p-5">
        <h3 className="mb-4 text-base font-medium text-[#DEDEDE]">
          Revenue Vs. Expenses
        </h3>
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#1c1c1c] text-zinc-500">
            <BarChart3 size={22} />
          </div>
          <div>
            <p className="text-[15px] font-medium text-[#DEDEDE]">
              No financial data yet
            </p>
            <p className="mx-auto mt-1 max-w-xs text-[13px] text-[#6E7B82]">
              Connect a bank account or add transactions to see your revenue and
              expenses over time.
            </p>
          </div>
          <button
            onClick={onConnectBank}
            className="mt-2 flex items-center gap-2 rounded-lg bg-[#045DDF] px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#034BBB]"
          >
            <Landmark size={15} /> Connect Bank Account
          </button>
        </div>
      </div>
    </div>
  );
}
