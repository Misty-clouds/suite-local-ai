"use client";

import { ChevronDown } from "lucide-react";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
  previousLabel = "Previous",
  nextLabel = "Next",
  size = "md",
  borderClassName = "border-[#272727]",
}: {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
  className?: string;
  previousLabel?: string;
  nextLabel?: string;
  size?: "sm" | "md";
  borderClassName?: string;
}) {
  const safeTotalPages = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, page), safeTotalPages);

  const rootPaddingClassName = size === "sm" ? "px-5 py-2.5" : "px-6 py-3.5";
  const textClassName = size === "sm" ? "text-xs" : "text-sm";
  const selectClassName =
    size === "sm"
      ? "rounded border border-[#2e2e2e] bg-[#1a1a1a] px-2 py-0.5 pr-5 text-xs text-white outline-none"
      : "rounded-md border border-[#2e2e2e] bg-[#161616] px-3 py-1 pr-6 text-sm text-white outline-none";
  const chevronSize = size === "sm" ? 9 : 11;
  const chevronRightClassName = size === "sm" ? "right-1" : "right-1.5";
  const buttonClassName =
    size === "sm"
      ? "rounded border border-[#272727] bg-[#161616] px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-[#222222] disabled:cursor-not-allowed disabled:opacity-40"
      : "rounded-lg border border-[#272727] bg-[#161616] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#222222] disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div
      className={`flex shrink-0 items-center justify-between border-t ${borderClassName} ${rootPaddingClassName} ${className ?? ""}`}
    >
      <div className={`flex items-center gap-2 ${textClassName} text-zinc-500`}>
        <span>Page</span>
        <div className="relative">
          <select
            value={safePage}
            onChange={(e) => onPageChange(Number(e.target.value))}
            className={`appearance-none ${selectClassName}`}
          >
            {Array.from({ length: safeTotalPages }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <ChevronDown
            size={chevronSize}
            className={`pointer-events-none absolute ${chevronRightClassName} top-1/2 -translate-y-1/2 text-zinc-500`}
          />
        </div>
        <span>of {safeTotalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, safePage - 1))}
          disabled={safePage === 1}
          className={buttonClassName}
        >
          {previousLabel}
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(safeTotalPages, safePage + 1))}
          disabled={safePage === safeTotalPages}
          className={buttonClassName}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
