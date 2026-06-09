"use client";

import { useEffect, useState } from "react";
import type { Transaction as ApiTransaction } from "@suite/types";
import { plaidApi } from "@/lib/plaid-api";
import { TransactionsTable } from "./TransactionsTable";
import type { Transaction as RowTransaction } from "./TransactionRow";

function toRow(t: ApiTransaction, i: number): RowTransaction {
  const sign = t.direction === "inflow" ? "+" : "-";
  const money = (() => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: t.isoCurrency || "USD",
      }).format(t.amount);
    } catch {
      return `$${t.amount.toLocaleString()}`;
    }
  })();

  return {
    id: i + 1,
    date: new Date(t.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    type: t.direction === "inflow" ? "Income" : "Expenses",
    category: t.aiCategory || t.category?.[0] || "Uncategorized",
    description: t.merchantName || t.name,
    amount: `${sign}${money}`,
    method: "Bank",
    status: t.pending ? "Pending" : "Cleared",
  };
}

/** Transactions tab backed by real Plaid-synced data (replaces the mock). */
export function TransactionsTab({
  onNewTransaction,
}: {
  onNewTransaction: () => void;
}) {
  const [rows, setRows] = useState<RowTransaction[]>([]);

  useEffect(() => {
    plaidApi
      .listTransactions()
      .then((txns) => setRows(txns.map(toRow)))
      .catch(() => setRows([]));
  }, []);

  return (
    <TransactionsTable transactions={rows} onNewTransaction={onNewTransaction} />
  );
}
