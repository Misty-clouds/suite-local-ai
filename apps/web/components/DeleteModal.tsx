import { Trash2 } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure you want to delete this project?",
  description = "This action cannot be undone",
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[400px] rounded-2xl bg-[#141414] p-6 shadow-2xl flex flex-col items-center text-center border border-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#ff7676] text-[#141414]">
          <span className="text-xl font-bold leading-none -mt-0.5">!</span>
        </div>

        <h2 className="mb-2 text-base font-medium text-white">{title}</h2>
        <p className="mb-6 text-sm text-zinc-500">{description}</p>

        <div className="flex w-full gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-white/10 bg-[#1c1c1c] py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#830909] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#a10e0e]"
          >
            <Trash2 size={16} />
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
