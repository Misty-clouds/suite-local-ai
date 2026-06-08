"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CreateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = ["Payroll", "Marketing", "Operations", "Software", "Travel", "Human Resources"];

const PERIODS = ["Weekly", "Monthly", "Quarterly", "Yearly", "+ Custom"] as const;

const BANK_ACCOUNTS = [
  "Chase ***890B",
  "Bank of America ***2345",
  "Wells Fargo ***7689",
  "Citi Bank ***1234",
];

const TEAM_MEMBERS = [
  { id: 1, name: "Abdullahi G.", color: "#f97316" },
  { id: 2, name: "Jessica T.", color: "#a855f7" },
  { id: 3, name: "Michael R.", color: "#3b82f6" },
  { id: 4, name: "Sofia L.", color: "#ec4899" },
];

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        checked ? "bg-blue-600" : "bg-[#333333]"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ─── Range Slider ─────────────────────────────────────────────────────────────
function RangeSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    updateValue(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    updateValue(e.clientX);
  };

  const updateValue = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    onChange(Math.round(pct * 100));
  };

  return (
    <div
      ref={trackRef}
      className="relative h-1.5 w-full rounded-full bg-[#333333] cursor-pointer select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      {/* Filled track */}
      <div
        className="absolute left-0 top-0 h-full rounded-full bg-blue-600"
        style={{ width: `${value}%` }}
      />
      {/* Thumb */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-md border-2 border-blue-600 transition-none"
        style={{ left: `${value}%` }}
      />
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export function CreateBudgetModal({ isOpen, onClose }: CreateBudgetModalProps) {
  const [budgetName, setBudgetName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [linkedAccount, setLinkedAccount] = useState("");
  const [period, setPeriod] = useState<string>("Monthly");
  const [autoRenew, setAutoRenew] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState(80);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([1, 2, 3, 4]);
  const [notes, setNotes] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setBudgetName("");
      setSelectedCategory(null);
      setAmount("");
      setLinkedAccount("");
      setPeriod("Monthly");
      setAutoRenew(true);
      setAlertThreshold(80);
      setSelectedMembers([1, 2, 3, 4]);
      setNotes("");
      setAccountOpen(false);
    }
  }, [isOpen]);

  const toggleMember = (id: number) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const handleSubmit = () => {
    // TODO: wire up to real data layer
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-[#2a2a2a] bg-[#141414] shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-6 pb-5 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-white">Create New Budget</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Set a limit and track where your money goes</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 hover:bg-[#252525] hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 pb-2 space-y-5 scrollbar-thin scrollbar-track-[#141414] scrollbar-thumb-[#2a2a2a]">

          {/* Budget Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Budget Name</label>
            <input
              type="text"
              placeholder="e.g Payroll, Market Supplies"
              value={budgetName}
              onChange={(e) => setBudgetName(e.target.value)}
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#1c1c1c] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          {/* Category */}
          <div className="space-y-2.5">
            <label className="text-sm font-medium text-white">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${
                    selectedCategory === cat
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-[#2a2a2a] bg-[#1c1c1c] text-zinc-300 hover:border-zinc-500 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                type="button"
                className="rounded-full px-4 py-1.5 text-sm font-medium border border-[#2a2a2a] bg-[#1c1c1c] text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
              >
                + Custom
              </button>
            </div>
          </div>

          {/* Budget Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Budget Amount</label>
            <div className="flex items-center gap-0 rounded-xl border border-[#2a2a2a] bg-[#1c1c1c] overflow-hidden focus-within:border-zinc-500 transition-colors">
              <span className="px-4 py-3 text-sm text-zinc-500 border-r border-[#2a2a2a] select-none">$</span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* Linked Bank Account */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Linked Bank Account</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen(!accountOpen)}
                className="w-full flex items-center justify-between rounded-xl border border-[#2a2a2a] bg-[#1c1c1c] px-4 py-3 text-sm text-left transition-colors hover:border-zinc-500"
              >
                <span className={linkedAccount ? "text-white" : "text-zinc-600"}>
                  {linkedAccount || "Select Account"}
                </span>
                <svg
                  className={`w-4 h-4 text-zinc-500 transition-transform ${accountOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {accountOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setAccountOpen(false)} />
                  <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-xl border border-[#2a2a2a] bg-[#1c1c1c] shadow-2xl overflow-hidden">
                    {BANK_ACCOUNTS.map((acc) => (
                      <button
                        key={acc}
                        type="button"
                        onClick={() => { setLinkedAccount(acc); setAccountOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-[#272727] hover:text-white transition-colors"
                      >
                        {acc}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Budget Period */}
          <div className="space-y-2.5">
            <label className="text-sm font-medium text-white">Budget Period</label>
            <div className="flex flex-wrap gap-2">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${
                    period === p
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-[#2a2a2a] bg-[#1c1c1c] text-zinc-300 hover:border-zinc-500 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-renew + Alert Threshold */}
          <div className="grid grid-cols-2 gap-3">
            {/* Auto-renew */}
            <div className="rounded-xl border border-[#2a2a2a] bg-[#1c1c1c] px-4 py-3.5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">Auto-renew</p>
                <p className="text-xs text-zinc-500 mt-0.5">Repeat each period</p>
              </div>
              <Toggle checked={autoRenew} onChange={setAutoRenew} />
            </div>

            {/* Alert Threshold */}
            <div className="rounded-xl border border-[#2a2a2a] bg-[#1c1c1c] px-4 py-3.5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-white">Alert Threshold</p>
                <span className="text-sm font-semibold text-white">{alertThreshold}%</span>
              </div>
              <RangeSlider value={alertThreshold} onChange={setAlertThreshold} />
            </div>
          </div>

          {/* Assigned To */}
          <div className="space-y-2.5">
            <label className="text-sm font-medium text-white">
              Assigned To <span className="text-zinc-500 font-normal">(Optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TEAM_MEMBERS.map((member) => {
                const isSelected = selectedMembers.includes(member.id);
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleMember(member.id)}
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                      isSelected
                        ? "border-[#2a2a2a] bg-[#1c1c1c] text-zinc-200"
                        : "border-[#2a2a2a] bg-[#1c1c1c] text-zinc-500 opacity-50"
                    }`}
                  >
                    {/* Avatar */}
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.name.charAt(0)}
                    </span>
                    {member.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">
              Notes <span className="text-zinc-500 font-normal">(Optional)</span>
            </label>
            <textarea
              placeholder="Add context or notes for this budget"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#1c1c1c] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors resize-none"
            />
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex gap-3 px-6 py-5 shrink-0 border-t border-[#1e1e1e]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#2a2a2a] bg-transparent py-3 text-sm font-medium text-white hover:bg-[#1e1e1e] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
          >
            Create Budget
          </button>
        </div>
      </div>
    </div>
  );
}
