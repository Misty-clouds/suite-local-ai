"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import type { Invoice, PaymentMethod } from "@suite/types";
import { invoicesApi } from "@/lib/invoices-api";

const METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "card", label: "Card" },
  { value: "cash", label: "Cash" },
  { value: "cheque", label: "Cheque" },
  { value: "other", label: "Other" },
];

export default function RecordPaymentModal({
  invoice,
  onClose,
  onRecorded,
}: {
  invoice: Invoice;
  onClose: () => void;
  onRecorded: () => void;
}) {
  const [amount, setAmount] = useState(String(invoice.amountDue || ""));
  const [method, setMethod] = useState<PaymentMethod>("bank_transfer");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value = parseFloat(amount);
  const valid = value > 0;

  async function handleSubmit() {
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await invoicesApi.recordPayment(invoice.id, { amount: value, method });
      onRecorded();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not record payment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[380px] rounded-2xl border border-[#272727] bg-[#141414] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-[15px] font-medium text-white">Record payment</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 transition-colors hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
        <p className="mb-5 text-[12px] text-zinc-500">
          {invoice.invoiceNumber} · {invoice.client.name} · $
          {invoice.amountDue.toLocaleString()} due
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-[13px] text-white">Amount</label>
            <div className="flex items-center rounded-lg border border-[#272727] bg-[#1a1a1a] px-3 focus-within:border-[#444]">
              <span className="mr-2 text-[13px] font-medium text-zinc-500">
                $
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent py-2.5 text-[13px] text-zinc-300 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[13px] text-white">Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              className="w-full rounded-lg border border-[#272727] bg-[#1a1a1a] px-3 py-2.5 text-[13px] text-zinc-300 focus:border-[#444] focus:outline-none"
            >
              {METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-[12px] text-[#FF8080]">{error}</p>}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-[#272727] py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#1a1a1a]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!valid || submitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0066FF] py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {submitting ? "Recording…" : "Record payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
