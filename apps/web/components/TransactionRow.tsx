"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Copy, Trash2 } from "lucide-react";

export interface Transaction {
  id: number;
  date: string;
  type: string;
  category: string;
  description: string;
  amount: string;
  method: string;
  status: string;
}

export function TransactionRow({ tx }: { tx: Transaction }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <tr className="hover:bg-[#1C1C1C] transition-colors group">
      <td className="py-4 pl-4 pr-2 text-center align-middle">
        <input
          type="checkbox"
          className="cursor-pointer appearance-none w-4 h-4 rounded-sm border border-zinc-700 bg-transparent checked:bg-blue-600 checked:border-blue-600 transition-colors"
        />
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">{tx.date}</td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">{tx.type}</td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">{tx.category}</td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">{tx.description}</td>
      <td
        className={`whitespace-nowrap px-4 py-4 font-medium ${
          tx.amount.startsWith("+") ? "text-green-500" : "text-red-500"
        }`}
      >
        {tx.amount}
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">{tx.method}</td>
      <td className="whitespace-nowrap px-4 py-4">
        <span
          className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
            tx.status === "Received"
              ? "bg-green-500/10 text-green-500"
              : "bg-yellow-500/10 text-yellow-500"
          }`}
        >
          {tx.status}
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-right pr-4 relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#272727] bg-[#121212] shrink-0 text-zinc-400 hover:text-white hover:bg-[#272727] transition-colors"
        >
          <MoreHorizontal size={16} />
        </button>

        {isDropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
            <div className="absolute right-12 z-50 w-36 rounded-lg border border-[#272727] bg-[#1a1a1a] p-1 shadow-xl">
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-300 hover:bg-[#272727] hover:text-white transition-colors"
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-300 hover:bg-[#272727] hover:text-white transition-colors"
              >
                <Copy size={14} /> Duplicate
              </button>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-red-500 hover:bg-[#272727] transition-colors"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </>
        )}
      </td>
    </tr>
  );
}
