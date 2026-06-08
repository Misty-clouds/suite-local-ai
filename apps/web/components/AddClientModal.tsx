import { X } from "lucide-react";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddClientModal({
  isOpen,
  onClose,
}: AddClientModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="w-[480px] rounded-2xl bg-[#141414] p-6 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-[15px] font-medium text-white mb-1">
              Add new client
            </h2>
            <p className="text-[13px] text-zinc-500">
              Fill details below to add a new client
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto scrollbar-hide py-1">
          <div>
            <label className="mb-2 block text-[13px] text-zinc-300">
              Client name
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-[#272727] bg-[#1a1a1a] px-3 py-2.5 text-[13px] text-white focus:border-zinc-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] text-zinc-300">
              Email address
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-[#272727] bg-[#1a1a1a] px-3 py-2.5 text-[13px] text-white focus:border-zinc-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] text-zinc-300">
              Phone number
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-[#272727] bg-[#1a1a1a] px-3 py-2.5 text-[13px] text-white focus:border-zinc-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] text-zinc-300">
              Address
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-[#272727] bg-[#1a1a1a] px-3 py-2.5 text-[13px] text-white focus:border-zinc-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] text-zinc-300">
              Upload client profile photo (Optional)
            </label>
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#272727] bg-[#141414] py-8 w-full">
              <div className="mb-4 h-14 w-14 rounded-full bg-[#272727]"></div>
              <button className="rounded-lg border border-[#272727] bg-transparent px-4 py-1.5 text-[13px] text-zinc-300 hover:bg-[#1C1C1C] transition-colors">
                Select file
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-[#272727] bg-transparent py-2.5 text-[13px] font-medium text-white hover:bg-[#1a1a1a] transition-colors"
          >
            Cancel
          </button>
          <button className="flex-1 rounded-lg bg-blue-600 py-2.5 text-[13px] font-medium text-white hover:bg-blue-700 transition-colors">
            Add and select
          </button>
        </div>
      </div>
    </div>
  );
}
