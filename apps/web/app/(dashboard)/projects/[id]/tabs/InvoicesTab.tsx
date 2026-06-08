"use client";

import { useState } from "react";
import {
  Search, Filter, ListFilter, Plus, MoreHorizontal,
  Eye, Download, CheckCircle2, Pencil, Trash2, Copy, X,
} from "lucide-react";
import Pagination from "../../../../../components/Pagination";

interface Invoice {
  id: number;
  invoiceId: string;
  client: string;
  email: string;
  date: string;
  amount: string;
  status: string;
  subject: string;
}

const invoicesData: Invoice[] = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  invoiceId: "INV-23459",
  client: "Neotech Solutions",
  email: "neotech@gmail.com",
  date: "Feb 23 - Feb 27, 2025",
  amount: "$4,900",
  status: ["Overdue", "Paid", "Draft", "Sent", "Viewed", "Cancelled", "Paid", "Viewed", "Viewed"][i],
  subject: "Website redesign",
}));

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Overdue: "bg-rose-500/15 text-rose-500",
    Paid: "bg-emerald-500/15 text-emerald-500",
    Draft: "bg-zinc-500/15 text-zinc-400",
    Sent: "bg-blue-500/15 text-blue-400",
    Viewed: "bg-lime-500/15 text-lime-500",
    Cancelled: "bg-rose-500/10 text-rose-400",
  };
  return (
    <span className={`inline-flex items-center justify-center rounded px-2 py-0.5 text-[11px] font-medium ${styles[status] ?? "bg-zinc-500/15 text-zinc-400"}`}>
      {status}
    </span>
  );
}

function InvoiceRow({ invoice }: { invoice: Invoice }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <tr className="hover:bg-[#1C1C1C] transition-colors group">
      <td className="py-4 pl-4 pr-2 text-center align-middle">
        <input type="checkbox" className="cursor-pointer appearance-none w-4 h-4 rounded-sm border border-zinc-700 bg-transparent checked:bg-blue-600 checked:border-blue-600 transition-colors" />
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">{invoice.invoiceId}</td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-linear-to-tr from-blue-400 via-pink-500 to-orange-400 shrink-0" />
          {invoice.client}
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">
        <div className="flex items-center gap-2">
          {invoice.email}
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors"><Copy size={12} /></button>
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">{invoice.date}</td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">{invoice.amount}</td>
      <td className="whitespace-nowrap px-4 py-4"><StatusBadge status={invoice.status} /></td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">{invoice.subject}</td>
      <td className="whitespace-nowrap px-4 py-4 relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#272727] bg-[#121212] shrink-0 text-zinc-400 hover:text-white hover:bg-[#272727] transition-colors"
        >
          <MoreHorizontal size={16} />
        </button>
        {isDropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
            <div className="absolute right-12 top-0 z-50 w-48 rounded-xl border border-[#272727] bg-[#18181A] p-1.5 shadow-2xl">
              {[
                { icon: <Eye size={14} className="text-zinc-400" />, label: "View" },
                { icon: <Download size={14} className="text-zinc-400" />, label: "Download as PDF" },
                { icon: <CheckCircle2 size={14} className="text-zinc-400" />, label: "Mark as paid" },
                { icon: <Pencil size={14} className="text-zinc-400" />, label: "Edit" },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-zinc-300 hover:bg-[#272727] hover:text-white transition-colors"
                >
                  {icon} {label}
                </button>
              ))}
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-red-500 hover:bg-[#272727] transition-colors"
              >
                <Trash2 size={14} className="text-red-500" /> Delete
              </button>
            </div>
          </>
        )}
      </td>
    </tr>
  );
}

export function InvoicesTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isInvoiceFilterOpen, setIsInvoiceFilterOpen] = useState(false);
  const totalPages = 10;

  return (
    <div className="flex h-full flex-col bg-[#0A0A0A] min-h-125">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-[#272727]">
        <div className="relative w-95">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input
            type="text"
            placeholder="Search ID, subject"
            className="w-full rounded-lg bg-transparent border border-[#272727] focus:border-blue-500 py-2 pl-10 pr-4 text-sm text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:ring-0"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-px h-6 bg-[#272727]" />

          <div className="relative">
            <button
              onClick={() => setIsInvoiceFilterOpen(!isInvoiceFilterOpen)}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <Filter size={16} /> Filter
            </button>
            {isInvoiceFilterOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsInvoiceFilterOpen(false)} />
                <div className="absolute right-0 top-8 z-50 w-72 rounded-xl border border-[#272727] bg-[#18181A] shadow-2xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-[#272727]">
                    <span className="text-sm font-medium text-white">Filter</span>
                    <button onClick={() => setIsInvoiceFilterOpen(false)} className="text-zinc-400 hover:text-white">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="p-4 space-y-6">
                    <div>
                      <div className="text-sm text-zinc-400 mb-3">Status</div>
                      <div className="space-y-3">
                        {["Overdue", "Paid", "Sent", "Viewed", "Cancelled", "Draft"].map((s) => (
                          <label key={s} className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded-sm border border-zinc-700 bg-transparent checked:bg-blue-600 checked:border-blue-600 appearance-none" />
                            <span className="text-sm text-zinc-300">{s}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-zinc-400 mb-3">Amount range</div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="text-xs text-zinc-500 mb-1">From</div>
                          <input type="text" placeholder="$" className="w-full bg-[#121212] border border-[#272727] rounded-lg px-3 py-1.5 focus:outline-none focus:border-zinc-500 text-sm" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-zinc-500 mb-1">To</div>
                          <input type="text" placeholder="$" className="w-full bg-[#121212] border border-[#272727] rounded-lg px-3 py-1.5 focus:outline-none focus:border-zinc-500 text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-[#272727] flex items-center gap-3">
                    <button className="flex-1 py-2 border border-[#272727] rounded-lg text-sm text-white hover:bg-[#272727] transition-colors">Reset</button>
                    <button className="flex-1 py-2 bg-blue-600 rounded-lg text-sm text-white hover:bg-blue-700 transition-colors">Apply</button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mr-2">
            <ListFilter size={16} /> Sort
          </button>

          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shrink-0">
            <Plus size={16} /> New invoice
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full flex-1 overflow-x-auto">
        <table className="w-full text-left text-[13px] text-zinc-400 min-w-250">
          <thead className="border-b border-[#272727] text-zinc-500 bg-[#0c0c0c]">
            <tr>
              <th className="py-4 pl-4 pr-2 font-medium w-12 text-center">
                <input type="checkbox" className="cursor-pointer appearance-none w-4 h-4 rounded-sm border border-zinc-700 bg-transparent checked:bg-blue-600 checked:border-blue-600" />
              </th>
              <th className="px-4 py-4 font-normal">Invoice ID</th>
              <th className="px-4 py-4 font-normal">Client</th>
              <th className="px-4 py-4 font-normal">Email</th>
              <th className="px-4 py-4 font-normal">Date issued & Due date</th>
              <th className="px-4 py-4 font-normal">Amount</th>
              <th className="px-4 py-4 font-normal">Status</th>
              <th className="px-4 py-4 font-normal">Subject</th>
              <th className="px-4 py-4 font-normal w-16 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#272727]">
            {invoicesData.map((invoice) => (
              <InvoiceRow key={invoice.id} invoice={invoice} />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className="py-5 px-6 mt-auto" />
    </div>
  );
}
