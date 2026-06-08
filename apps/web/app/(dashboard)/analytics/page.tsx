"use client";

import { useState } from "react";
import Header from "@/components/Header";
import AddTransactionModal from "@/components/AddTransactionModal";
import { OverviewCharts } from "@/components/charts/OverviewCharts";
import { TransactionsTable } from "@/components/TransactionsTable";
import { transactionsData } from "@/lib/chartData";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"analytics" | "transactions">("analytics");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <Header />

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-[#0A0A0A] scrollbar-thumb-[#272727]">
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#272727] px-6">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "analytics"
                ? "border-white text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded border border-zinc-700 text-[10px]">
              ≡
            </span>
            Overview
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "transactions"
                ? "border-white text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded border border-zinc-700 text-[10px]">
              ◎
            </span>
            Transactions
          </button>
        </div>

        {activeTab === "analytics" && <OverviewCharts />}

        {activeTab === "transactions" && (
          <TransactionsTable
            transactions={transactionsData}
            onNewTransaction={() => setIsAddModalOpen(true)}
          />
        )}
      </div>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
}
