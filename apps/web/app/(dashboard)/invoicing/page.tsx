"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  MoreHorizontal,
  Search,
  Filter,
  ListFilter,
  Copy,
  Trash2,
  Eye,
  Download,
  CheckCircle2,
  CreditCard,
  Check,
  Loader2,
  FileText,
} from "lucide-react";
import type { Invoice, InvoiceDisplayStatus } from "@suite/types";
import Header from "../../../components/Header";
import Pagination from "../../../components/Pagination";
import RecordPaymentModal from "../../../components/RecordPaymentModal";
import { invoicesApi } from "@/lib/invoices-api";

const PAGE_SIZE = 10;

const money = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const fmtDate = (iso?: string) =>
  iso
    ? new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(iso))
    : "—";

const dateRange = (invoice: Invoice) => {
  if (!invoice.issueDate && !invoice.dueDate) return "—";
  return `${fmtDate(invoice.issueDate)} – ${fmtDate(invoice.dueDate)}`;
};

// Maps the API's lowercase displayStatus to a label + badge styling.
const STATUS_META: Record<
  InvoiceDisplayStatus,
  { label: string; styles: string }
> = {
  overdue: { label: "Overdue", styles: "bg-rose-500/15 text-rose-500" },
  paid: { label: "Paid", styles: "bg-emerald-500/15 text-emerald-500" },
  partially_paid: {
    label: "Partially paid",
    styles: "bg-amber-500/15 text-amber-400",
  },
  draft: { label: "Draft", styles: "bg-zinc-500/15 text-zinc-400" },
  sent: { label: "Sent", styles: "bg-blue-500/15 text-blue-400" },
  viewed: { label: "Viewed", styles: "bg-lime-500/15 text-lime-500" },
  cancelled: { label: "Cancelled", styles: "bg-rose-500/10 text-rose-400" },
};

function StatusBadge({ status }: { status: InvoiceDisplayStatus }) {
  const meta = STATUS_META[status] ?? STATUS_META.draft;
  return (
    <span
      className={`inline-flex items-center justify-center rounded px-2 py-0.5 text-[11px] font-medium ${meta.styles}`}
    >
      {meta.label}
    </span>
  );
}

function InvoiceRow({
  invoice,
  isSelected,
  onSelectChange,
  onMarkPaid,
  onRecordPayment,
  onDelete,
}: {
  invoice: Invoice;
  isSelected: boolean;
  onSelectChange: (next: boolean) => void;
  onMarkPaid: (id: string) => void;
  onRecordPayment: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const email = invoice.client.email ?? "";

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
          className="appearance-none h-4 w-4 rounded border border-zinc-700 bg-zinc-800 checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-zinc-900"
        />
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">
        {invoice.invoiceNumber}
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-linear-to-tr from-blue-400 via-pink-500 to-orange-400 shrink-0" />
          {invoice.client.name}
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">
        <div className="flex items-center gap-2">
          {email || "—"}
          {email && (
            <button
              type="button"
              aria-label="Copy email"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(email);
                  setIsCopied(true);
                } catch {
                  // no-op
                }
              }}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {isCopied ? <Check size={12} /> : <Copy size={12} />}
            </button>
          )}
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">
        {dateRange(invoice)}
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">
        {money(invoice.total)}
      </td>
      <td className="whitespace-nowrap px-4 py-4">
        <StatusBadge status={invoice.displayStatus} />
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-300">
        {invoice.projectName || "—"}
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
              <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-zinc-300 hover:bg-[#272727] hover:text-white transition-colors">
                <Eye size={14} className="text-zinc-400" />
                View
              </button>
              <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-zinc-300 hover:bg-[#272727] hover:text-white transition-colors">
                <Download size={14} className="text-zinc-400" />
                Download as PDF
              </button>
              {invoice.status !== "paid" && invoice.status !== "cancelled" && (
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onMarkPaid(invoice.id);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-zinc-300 hover:bg-[#272727] hover:text-white transition-colors"
                >
                  <CheckCircle2 size={14} className="text-zinc-400" />
                  Mark as paid
                </button>
              )}
              {invoice.status !== "paid" && invoice.status !== "cancelled" && (
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onRecordPayment(invoice);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-zinc-300 hover:bg-[#272727] hover:text-white transition-colors"
                >
                  <CreditCard size={14} className="text-zinc-400" />
                  Record payment
                </button>
              )}
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onDelete(invoice.id);
                }}
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
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const selectAllRef = useRef<HTMLInputElement | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await invoicesApi.list({
        page: currentPage,
        pageSize: PAGE_SIZE,
        search: search.trim() || undefined,
      });
      setInvoices(res.items);
      setTotal(res.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

  // Debounce search; reset to page 1 when the query changes.
  useEffect(() => {
    const t = window.setTimeout(load, search ? 300 : 0);
    return () => window.clearTimeout(t);
  }, [load, search]);

  const allSelected =
    invoices.length > 0 && selectedIds.size === invoices.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const handleMarkPaid = async (id: string) => {
    try {
      const updated = await invoicesApi.markPaid(id);
      setInvoices((prev) => prev.map((i) => (i.id === id ? updated : i)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not mark as paid");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await invoicesApi.remove(id);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      void load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete invoice");
    }
  };

  return (
    <div className="flex h-full flex-col">
      <Header />

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-[#0A0A0A] scrollbar-thumb-[#272727] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-95">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              size={16}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setCurrentPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search ID, subject, client"
              className="w-full rounded-lg bg-transparent border-none py-2 pl-10 pr-4 text-sm text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:ring-0"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="w-px h-6 bg-[#272727]" />
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

        {error && (
          <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
            {error}
          </div>
        )}

        <div className="w-full border-t border-[#272727]">
          <table className="w-full text-left text-[13px] text-zinc-400">
            <thead className="border-b border-[#272727] text-zinc-500">
              <tr>
                <th className="py-4 pl-4 pr-2 font-medium w-12 text-center">
                  <input
                    type="checkbox"
                    ref={selectAllRef}
                    checked={allSelected}
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked
                          ? new Set(invoices.map((i) => i.id))
                          : new Set(),
                      )
                    }
                    className="appearance-none h-4 w-4 rounded border border-zinc-700 bg-zinc-800 checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-zinc-900"
                  />
                </th>
                <th className="px-4 py-4 font-normal">Invoice ID</th>
                <th className="px-4 py-4 font-normal">Client</th>
                <th className="px-4 py-4 font-normal">Email</th>
                <th className="px-4 py-4 font-normal">
                  Date issued &amp; Date due
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
              {invoices.map((invoice) => (
                <InvoiceRow
                  key={invoice.id}
                  invoice={invoice}
                  isSelected={selectedIds.has(invoice.id)}
                  onSelectChange={(next) =>
                    setSelectedIds((prev) => {
                      const copy = new Set(prev);
                      if (next) copy.add(invoice.id);
                      else copy.delete(invoice.id);
                      return copy;
                    })
                  }
                  onMarkPaid={handleMarkPaid}
                  onRecordPayment={setPaymentInvoice}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>

          {/* Loading / empty states */}
          {loading && (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-zinc-500">
              <Loader2 size={16} className="animate-spin" /> Loading invoices…
            </div>
          )}
          {!loading && invoices.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-[#161616] text-zinc-500">
                <FileText size={20} />
              </div>
              <p className="text-sm text-zinc-400">No invoices yet</p>
              <Link
                href="/invoicing/create"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} /> Create your first invoice
              </Link>
            </div>
          )}

          {!loading && invoices.length > 0 && (
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="py-5"
            />
          )}
        </div>
      </div>

      {paymentInvoice && (
        <RecordPaymentModal
          invoice={paymentInvoice}
          onClose={() => setPaymentInvoice(null)}
          onRecorded={load}
        />
      )}
    </div>
  );
}
