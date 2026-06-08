import { X, ChevronDown, Calendar } from "lucide-react";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTransactionModal({
  isOpen,
  onClose,
}: AddTransactionModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[380px] rounded-2xl bg-[#141414] p-6 flex flex-col border border-[#272727] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[15px] font-medium text-white">
            Add transaction
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[13px] text-white mb-2">
              Transaction type
            </label>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-[#272727] bg-[#1a1a1a] px-3 py-2.5 text-[13px] text-zinc-300 focus:border-[#444] focus:outline-none transition-colors cursor-pointer">
                <option>Income</option>
                <option>Expenses</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] text-white mb-2">
              Category
            </label>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-[#272727] bg-[#1a1a1a] px-3 py-2.5 text-[13px] text-zinc-300 focus:border-[#444] focus:outline-none transition-colors cursor-pointer">
                <option>Client payment</option>
                <option>Tool</option>
                <option>Subscription</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] text-white mb-2">
              Description
            </label>
            <input
              type="text"
              placeholder="Invoice #34567"
              className="w-full rounded-lg border border-[#272727] bg-[#1a1a1a] px-3 py-2.5 text-[13px] text-zinc-300 placeholder:text-zinc-500 focus:border-[#444] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[13px] text-white mb-2">Amount</label>
            <div className="relative flex items-center rounded-lg border border-[#272727] bg-[#1a1a1a] px-3 focus-within:border-[#444] transition-colors">
              <span className="text-zinc-500 mr-2 text-[13px] font-medium">
                $
              </span>
              <input
                type="text"
                placeholder="4567"
                className="w-full bg-transparent py-2.5 text-[13px] text-zinc-300 placeholder:text-zinc-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] text-white mb-2">Method</label>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-[#272727] bg-[#1a1a1a] px-3 py-2.5 text-[13px] text-zinc-300 focus:border-[#444] focus:outline-none transition-colors cursor-pointer">
                <option>Stripe</option>
                <option>Card</option>
                <option>Bank Transfer</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] text-white mb-2">Date</label>
            <div className="relative">
              <input
                type="text"
                placeholder="23rd Jan, 2025"
                className="w-full rounded-lg border border-[#272727] bg-[#1a1a1a] px-3 py-2.5 text-[13px] text-zinc-300 placeholder:text-zinc-500 focus:border-[#444] focus:outline-none transition-colors pr-10"
              />
              <Calendar
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-[#272727] bg-transparent py-2.5 text-[13px] font-medium text-white hover:bg-[#1a1a1a] transition-colors"
          >
            Cancel
          </button>
          <button className="flex-1 rounded-lg bg-[#0066FF] py-2.5 text-[13px] font-medium text-white hover:bg-blue-600 transition-colors">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
