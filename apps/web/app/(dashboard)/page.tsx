"use client";

import { useState } from "react";
import { Layers, DollarSign, Scale, Building, FileSearch } from "lucide-react";
import Header from "@/components/Header";
import RightPanel from "@/components/RightPanel";
import AddTransactionModal from "@/components/AddTransactionModal";
import { OverviewCharts } from "@/components/charts/OverviewCharts";
import { TransactionsTab } from "@/components/TransactionsTab";
import { BudgetTab } from "./financials/tabs/BudgetTab";
import { TaxTab } from "./financials/tabs/TaxTab";
import { AccountsTab } from "./financials/tabs/AccountsTab";

type FinancialsTab = "analytics" | "transactions" | "budget" | "accounts" | "tax";

const TABS: { key: FinancialsTab; label: string; icon: React.ReactNode }[] = [
  { key: "analytics", label: "Overview", icon: <Layers size={16} /> },
  { key: "transactions", label: "Transactions", icon: <DollarSign size={16} /> },
  { key: "budget", label: "Budget", icon: <Scale size={16} /> },
  { key: "accounts", label: "Accounts", icon: <Building size={16} /> },
  { key: "tax", label: "Tax", icon: <FileSearch size={16} /> },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<FinancialsTab>("analytics");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [txRefresh, setTxRefresh] = useState(0);

  return (
    <>
      <Header />

      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-[#0A0A0A] scrollbar-thumb-[#272727]">
        {/* Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto border-b border-[#272727] px-6 scrollbar-hide">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex shrink-0 items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${
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

        <div className="flex w-full max-w-full flex-col lg:flex-row">
          {/* Main financials column */}
          <div className="min-w-0 flex-1">
            {activeTab === "analytics" && (
              <OverviewCharts
                onConnectBank={() => setActiveTab("accounts")}
                onAddTransaction={() => setIsAddModalOpen(true)}
              />
            )}

            {activeTab === "transactions" && (
              <TransactionsTab
                key={txRefresh}
                onNewTransaction={() => setIsAddModalOpen(true)}
              />
            )}

            {activeTab === "budget" && <BudgetTab />}

            {activeTab === "accounts" && <AccountsTab />}

            {activeTab === "tax" && <TaxTab />}
          </div>

          {/* Right: AI Insights + Activities — Overview tab only */}
          {activeTab === "analytics" && (
            <aside className="w-full shrink-0 p-6 lg:w-80 lg:pl-0">
              <RightPanel />
            </aside>
          )}
        </div>
      </div>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreated={() => setTxRefresh((n) => n + 1)}
      />
    </>
  );
}
