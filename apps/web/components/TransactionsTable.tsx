"use client";

import { useState } from "react";
import { Search, Filter, ListFilter, Plus } from "lucide-react";
import { TransactionRow, Transaction } from "@/components/TransactionRow";
import Pagination from "@/components/Pagination";

interface TransactionsTableProps {
  transactions: Transaction[];
  onNewTransaction: () => void;
}

export function TransactionsTable({ transactions, onNewTransaction }: TransactionsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <div className="flex-1 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="relative w-85">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input
            type="text"
            placeholder="Search ID, subject"
            className="w-full rounded-lg bg-transparent border-none py-2 pl-10 pr-4 text-sm text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:ring-0"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="w-px h-6 bg-[#272727]" />
          <button className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
            <ListFilter size={16} /> Sort
          </button>
          <button
            onClick={onNewTransaction}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} /> New transaction
          </button>
        </div>
      </div>

      <div className="w-full">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="border-b border-[#272727] text-[13px] text-zinc-500">
            <tr>
              <th className="py-4 pl-4 pr-2 font-medium w-12 text-center">
                <input
                  type="checkbox"
                  className="cursor-pointer appearance-none w-4 h-4 rounded-sm border border-zinc-700 bg-transparent"
                />
              </th>
              <th className="px-4 py-4 font-normal">Date</th>
              <th className="px-4 py-4 font-normal">Type</th>
              <th className="px-4 py-4 font-normal">Category</th>
              <th className="px-4 py-4 font-normal">Description</th>
              <th className="px-4 py-4 font-normal">Amount</th>
              <th className="px-4 py-4 font-normal">Method</th>
              <th className="px-4 py-4 font-normal">Status</th>
              <th className="px-4 py-4 font-normal text-right pr-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#272727]">
            {transactions.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </tbody>
        </table>

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="py-4 mt-2"
        />
      </div>
    </div>
  );
}
