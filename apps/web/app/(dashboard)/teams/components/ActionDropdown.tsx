"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export const ActionDropdown = ({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2e2e2e] bg-[#1a1a1a] text-zinc-400 transition-colors hover:bg-[#252525] hover:text-white"
        aria-label="Actions"
      >
        <MoreHorizontal size={15} />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 min-w-32.5 rounded-xl border border-[#2e2e2e] bg-[#161616] py-1.5 shadow-2xl">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-zinc-300 transition-colors hover:bg-[#202020] hover:text-white"
          >
            <Pencil size={14} className="text-zinc-400" />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-red-400 transition-colors hover:bg-[#202020] hover:text-red-300"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
