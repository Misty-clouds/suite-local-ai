"use client";

import { useRef, useState } from "react";
import { X, ChevronDown, Loader2, Paperclip } from "lucide-react";
import { plaidApi } from "@/lib/plaid-api";
import { CATEGORIES } from "@/lib/categories";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const METHODS = ["Stripe", "Card", "Bank Transfer", "Cash"];

export default function AddTransactionModal({
  isOpen,
  onClose,
  onCreated,
}: AddTransactionModalProps) {
  const [type, setType] = useState<"Income" | "Expenses">("Income");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(METHODS[0]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [receiptName, setReceiptName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const amountValue = parseFloat(amount);
  const isValid = description.trim().length > 0 && amountValue > 0;

  async function handleSave() {
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await plaidApi.createTransaction({
        type,
        description: description.trim(),
        amount: amountValue,
        category,
        method,
        date,
      });
      onCreated?.();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save transaction");
    } finally {
      setSubmitting(false);
    }
  }

  const selectClass =
    "w-full appearance-none rounded-lg border border-[#272727] bg-[#1a1a1a] px-3 py-2.5 text-[13px] text-zinc-300 focus:border-[#444] focus:outline-none transition-colors cursor-pointer";
  const inputClass =
    "w-full rounded-lg border border-[#272727] bg-[#1a1a1a] px-3 py-2.5 text-[13px] text-zinc-300 placeholder:text-zinc-500 focus:border-[#444] focus:outline-none transition-colors";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-[380px] overflow-y-auto rounded-2xl border border-[#272727] bg-[#141414] p-6 shadow-xl scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[15px] font-medium text-white">Add transaction</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 transition-colors hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-[13px] text-white">
              Transaction type
            </label>
            <div className="relative">
              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as "Income" | "Expenses")
                }
                className={selectClass}
              >
                <option>Income</option>
                <option>Expenses</option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[13px] text-white">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={selectClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[13px] text-white">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Invoice #34567"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] text-white">Amount</label>
            <div className="relative flex items-center rounded-lg border border-[#272727] bg-[#1a1a1a] px-3 transition-colors focus-within:border-[#444]">
              <span className="mr-2 text-[13px] font-medium text-zinc-500">
                $
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="4567"
                className="w-full bg-transparent py-2.5 text-[13px] text-zinc-300 placeholder:text-zinc-500 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[13px] text-white">Method</label>
            <div className="relative">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className={selectClass}
              >
                {METHODS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[13px] text-white">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`${inputClass} [color-scheme:dark]`}
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] text-white">
              Receipt <span className="text-zinc-500">(optional)</span>
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setReceiptName(e.target.files?.[0]?.name ?? null)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center gap-2 rounded-lg border border-dashed border-[#333] bg-[#1a1a1a] px-3 py-2.5 text-[13px] text-zinc-400 transition-colors hover:border-[#444] hover:text-zinc-300"
            >
              <Paperclip size={14} />
              {receiptName ?? "Attach a receipt"}
            </button>
          </div>

          {error && <p className="text-[12px] text-[#FF8080]">{error}</p>}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-[#272727] bg-transparent py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#1a1a1a]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid || submitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0066FF] py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {submitting ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
