"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Plus,
  MoreHorizontal,
  Search,
  Filter,
  ListFilter,
  Pencil,
  Copy,
  Trash2,
  Eye,
  Download,
  CheckCircle2,
  Check,
} from "lucide-react";
import Header from "../../../components/Header";
import Pagination from "../../../components/Pagination";

const invoicesData = [
  {
    id: 1,
    invoiceId: "INV-23459",
    client: "Neotech Solutions",
    email: "neotech@gmail.com",
    date: "Feb 23 - Feb 27, 2025",
    amount: "$4,900",
    status: "Overdue",
    subject: "Website redesign",
  },
  {
    id: 2,
    invoiceId: "INV-23459",
    client: "Neotech Solutions",
    email: "neotech@gmail.com",
    date: "Feb 23 - Feb 27, 2025",
    amount: "$4,900",
    status: "Paid",
    subject: "Website redesign",
  },
  {
    id: 3,
    invoiceId: "INV-23459",
    client: "Neotech Solutions",
    email: "neotech@gmail.com",
    date: "Feb 23 - Feb 27, 2025",
    amount: "$4,900",
    status: "Draft",
    subject: "Website redesign",
  },
  {
    id: 4,
    invoiceId: "INV-23459",
    client: "Neotech Solutions",
    email: "neotech@gmail.com",
    date: "Feb 23 - Feb 27, 2025",
    amount: "$4,900",
    status: "Sent",
    subject: "Website redesign",
  },
  {
    id: 5,
    invoiceId: "INV-23459",
    client: "Neotech Solutions",
    email: "neotech@gmail.com",
    date: "Feb 23 - Feb 27, 2025",
    amount: "$4,900",
    status: "Viewed",
    subject: "Website redesign",
  },
  {
    id: 6,
    invoiceId: "INV-23459",
    client: "Neotech Solutions",
    email: "neotech@gmail.com",
    date: "Feb 23 - Feb 27, 2025",
    amount: "$4,900",
    status: "Cancelled",
    subject: "Website redesign",
  },
  {
    id: 7,
    invoiceId: "INV-23459",
    client: "Neotech Solutions",
    email: "neotech@gmail.com",
    date: "Feb 23 - Feb 27, 2025",
    amount: "$4,900",
    status: "Paid",
    subject: "Website redesign",
  },
  {
    id: 8,
    invoiceId: "INV-23459",
    client: "Neotech Solutions",
    email: "neotech@gmail.com",
    date: "Feb 23 - Feb 27, 2025",
    amount: "$4,900",
    status: "Paid",
    subject: "Website redesign",
  },
  {
    id: 9,
    invoiceId: "INV-23459",
    client: "Neotech Solutions",
    email: "neotech@gmail.com",
    date: "Feb 23 - Feb 27, 2025",
    amount: "$4,900",
    status: "Paid",
    subject: "Website redesign",
  },
  {
    id: 10,
    invoiceId: "INV-23459",
    client: "Neotech Solutions",
    email: "neotech@gmail.com",
    date: "Feb 23 - Feb 27, 2025",
    amount: "$4,900",
    status: "Viewed",
    subject: "Website redesign",
  },
  {
    id: 11,
    invoiceId: "INV-23459",
    client: "Neotech Solutions",
    email: "neotech@gmail.com",
    date: "Feb 23 - Feb 27, 2025",
    amount: "$4,900",
    status: "Viewed",
    subject: "Website redesign",
  },
];

function StatusBadge({ status }: { status: string }) {
  let badgeStyles = "";

  switch (status) {
    case "Overdue":
      badgeStyles = "bg-rose-500/15 text-rose-500";
      break;
    case "Paid":
      badgeStyles = "bg-emerald-500/15 text-emerald-500";
      break;
    case "Draft":
      badgeStyles = "bg-zinc-500/15 text-zinc-400";
      break;
    case "Sent":
      badgeStyles = "bg-blue-500/15 text-blue-400";
      break;
    case "Viewed":
      badgeStyles = "bg-lime-500/15 text-lime-500";
      break;
    case "Cancelled":
      badgeStyles = "bg-rose-500/10 text-rose-400";
      break;
    default:
      badgeStyles = "bg-zinc-500/15 text-zinc-400";
      break;
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded px-2 py-0.5 text-[11px] font-medium ${badgeStyles}`}
    >
      {status}
    </span>
  );
}

function InvoiceRow({
  invoice,
  isSelected,
  onSelectChange,
}: {
  invoice: (typeof invoicesData)[0];
  isSelected: boolean;
  onSelectChange: (next: boolean) => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const t = window.setTimeout(() => setIsCopied(false), 1200);
    return () => window.clearTimeout(t);
  }, [isCopied]);

  return (
    <tr className="hover:bg-[#1C1C1C] transition-colors group">
      <td className="py-4 pl-4 pr-2 text-center align-middle">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelectChange(e.target.checked)}
          className="
    appearance-none h-4 w-4 rounded border border-zinc-700 bg-zinc-800 
    checked:bg-blue-500 checked:border-blue-500 
    checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTYgMTYiIGZpbGw9IndoaXRlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMi4yMDcgNC43OTNsLTEuNDE0LTEuNDE0TDYgOC41ODYgMy4yMDcgNS43OTNMMS43OTMgNy4yMDdsNC4yMDcgNC4yMDd6Ii8+PC9zdmc+')]
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-zinc-900
  "
        />
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">
        {invoice.invoiceId}
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-linear-to-tr from-blue-400 via-pink-500 to-orange-400 shrink-0"></div>
          {invoice.client}
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">
        <div className="flex items-center gap-2">
          {invoice.email}
          <button
            type="button"
            aria-label="Copy email"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(invoice.email);
                setIsCopied(true);
              } catch {
                // no-op
              }
            }}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {isCopied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">
        {invoice.date}
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">
        {invoice.amount}
      </td>
      <td className="whitespace-nowrap px-4 py-4">
        <StatusBadge status={invoice.status} />
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">
        {invoice.subject}
      </td>
      <td className="whitespace-nowrap px-4 py-4 relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#272727] bg-[#121212] shrink-0 text-zinc-400 hover:text-white hover:bg-[#272727] transition-colors"
        >
          <MoreHorizontal size={16} />
        </button>

        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute right-12 top-0 z-50 w-48 rounded-xl border border-[#272727] bg-[#18181A] p-1.5 shadow-2xl">
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-zinc-300 hover:bg-[#272727] hover:text-white transition-colors"
              >
                <Eye size={14} className="text-zinc-400" />
                View
              </button>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-zinc-300 hover:bg-[#272727] hover:text-white transition-colors"
              >
                <Download size={14} className="text-zinc-400" />
                Download as PDF
              </button>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-zinc-300 hover:bg-[#272727] hover:text-white transition-colors"
              >
                <CheckCircle2 size={14} className="text-zinc-400" />
                Mark as paid
              </button>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-zinc-300 hover:bg-[#272727] hover:text-white transition-colors"
              >
                <Pencil size={14} className="text-zinc-400" />
                Edit
              </button>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-red-500 hover:bg-[#272727] transition-colors"
              >
                <Trash2 size={14} className="text-red-500" />
                Delete
              </button>
            </div>
          </>
        )}
      </td>
    </tr>
  );
}

export default function InvoicingPage() {
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<Set<number>>(
    () => new Set()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;
  const selectAllRef = useRef<HTMLInputElement | null>(null);

  const allSelected =
    invoicesData.length > 0 && selectedInvoiceIds.size === invoicesData.length;
  const someSelected =
    selectedInvoiceIds.size > 0 && selectedInvoiceIds.size < invoicesData.length;

  useEffect(() => {
    if (!selectAllRef.current) return;
    selectAllRef.current.indeterminate = someSelected && !allSelected;
  }, [someSelected, allSelected]);

  return (
    <div className="flex h-full flex-col">
      <Header />

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-[#0A0A0A] scrollbar-thumb-[#272727] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-95">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Search ID, subject"
              className="w-full rounded-lg bg-transparent border-none py-2 pl-10 pr-4 text-sm text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:ring-0"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="w-px h-6 bg-[#272727]"></div>
            <button className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
              <Filter size={16} /> Filter
            </button>
            <button className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mr-2">
              <ListFilter size={16} /> Sort
            </button>
            <Link
              href="/invoicing/create"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} /> New invoice
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="w-full border-t border-[#272727]">
          <table className="w-full text-left text-[13px] text-zinc-400">
            <thead className="border-b border-[#272727] text-zinc-500">
              <tr>
                <th className="py-4 pl-4 pr-2 font-medium w-12 text-center">
                  <input
                    type="checkbox"
                    ref={selectAllRef}
                    checked={allSelected}
                    onChange={(e) => {
                      const nextChecked = e.target.checked;
                      setSelectedInvoiceIds(() => {
                        if (!nextChecked) return new Set();
                        return new Set(invoicesData.map((inv) => inv.id));
                      });
                    }}
                    className="
    appearance-none h-4 w-4 rounded border border-zinc-700 bg-zinc-800 
    checked:bg-blue-500 checked:border-blue-500 
    checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTYgMTYiIGZpbGw9IndoaXRlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMi4yMDcgNC43OTNsLTEuNDE0LTEuNDE0TDYgOC41ODYgMy4yMDcgNS43OTNMMS43OTMgNy4yMDdsNC4yMDcgNC4yMDd6Ii8+PC9zdmc+')]
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-zinc-900
  "
                  />
                </th>
                <th className="px-4 py-4 font-normal">Invoice ID</th>
                <th className="px-4 py-4 font-normal">Client</th>
                <th className="px-4 py-4 font-normal">Email</th>
                <th className="px-4 py-4 font-normal">
                  Date issued & Date due
                </th>
                <th className="px-4 py-4 font-normal">Amount</th>
                <th className="px-4 py-4 font-normal">Status</th>
                <th className="px-4 py-4 font-normal">Subject</th>
                <th className="px-4 py-4 font-normal w-16 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#272727]">
              {invoicesData.map((invoice) => (
                <InvoiceRow
                  key={invoice.id}
                  invoice={invoice}
                  isSelected={selectedInvoiceIds.has(invoice.id)}
                  onSelectChange={(next) => {
                    setSelectedInvoiceIds((prev) => {
                      const copy = new Set(prev);
                      if (next) copy.add(invoice.id);
                      else copy.delete(invoice.id);
                      return copy;
                    });
                  }}
                />
              ))}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="py-5"
          />
        </div>
      </div>
    </div>
  );
}
