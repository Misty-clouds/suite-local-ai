"use client";

import { useState } from "react";
import { Layers, DollarSign, Scale, Building, FileSearch } from "lucide-react";
import Header from "@/components/Header";
import AddTransactionModal from "@/components/AddTransactionModal";
import { OverviewCharts } from "@/components/charts/OverviewCharts";
import { TransactionsTable } from "@/components/TransactionsTable";
import { transactionsData } from "@/lib/chartData";
import { BudgetTab } from "./tabs/BudgetTab";
import { TaxTab } from "./tabs/TaxTab";

type FinancialsTab = "analytics" | "transactions" | "budget" | "accounts" | "tax";

const TABS: { key: FinancialsTab; label: string; icon: React.ReactNode }[] = [
  { key: "analytics", label: "Overview", icon: <Layers size={16} /> },
  { key: "transactions", label: "Transactions", icon: <DollarSign size={16} /> },
  { key: "budget", label: "Budget", icon: <Scale size={16} /> },
  { key: "accounts", label: "Accounts", icon: <Building size={16} /> },
  { key: "tax", label: "Tax", icon: <FileSearch size={16} /> },
];

export default function FinancialsPage() {
  const [activeTab, setActiveTab] = useState<FinancialsTab>("analytics");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <Header />

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-[#0A0A0A] scrollbar-thumb-[#272727]">
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#272727] px-6">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === key
                  ? "border-white text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <span className="flex items-center justify-center">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {activeTab === "analytics" && <OverviewCharts />}

        {activeTab === "transactions" && (
          <TransactionsTable
            transactions={transactionsData}
            onNewTransaction={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === "budget" && <BudgetTab />}

        {activeTab === "accounts" && (
          <div className="flex flex-1 items-center justify-center p-12 text-zinc-600 text-sm">
            Accounts tab — coming soon
          </div>
        )}

        {activeTab === "tax" && <TaxTab />}
      </div>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
}
