"use client";

import { X } from "lucide-react";

interface SortDropdownProps {
  onClose: () => void;
  isOpen: boolean;
}

export default function SortDropdown({ onClose, isOpen }: SortDropdownProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full mt-2 left-0 z-50 w-75 rounded-xl border border-[#272727] bg-[#121212] shadow-2xl shadow-black/50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <h3 className="text-base font-medium text-zinc-200">Sort</h3>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="max-h-150 overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {/* Due date 1 */}
        <div className="mt-2 text-sm">
          <h4 className="mb-4 text-base font-medium text-zinc-500">Due date</h4>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="dueDate1"
                  className="peer h-5 w-5 appearance-none rounded-full border border-zinc-700 bg-[#1C1C1C] checked:border-blue-600 checked:bg-blue-600 focus:outline-none transition-colors"
                />
                <div className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-zinc-600 peer-checked:bg-white transition-colors" />
              </div>
              <span className="text-zinc-300 group-hover:text-white transition-colors">
                Ascending
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="dueDate1"
                  defaultChecked
                  className="peer h-5 w-5 appearance-none rounded-full border border-zinc-700 bg-[#1C1C1C] checked:border-blue-600 checked:bg-blue-600 focus:outline-none transition-colors"
                />
                <div className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-zinc-600 peer-checked:bg-white transition-colors" />
              </div>
              <span className="text-zinc-300 group-hover:text-white transition-colors">
                Descending
              </span>
            </label>
          </div>
        </div>

        {/* Due date 2 - replicated exactly as in the design */}
        <div className="mt-6 text-sm">
          <h4 className="mb-4 text-base font-medium text-zinc-500">Due date</h4>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="dueDate2"
                  className="peer h-5 w-5 appearance-none rounded-full border border-zinc-700 bg-[#1C1C1C] checked:border-blue-600 checked:bg-blue-600 focus:outline-none transition-colors"
                />
                <div className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-zinc-600 peer-checked:bg-white transition-colors" />
              </div>
              <span className="text-zinc-300 group-hover:text-white transition-colors">
                Ascending
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="dueDate2"
                  defaultChecked
                  className="peer h-5 w-5 appearance-none rounded-full border border-zinc-700 bg-[#1C1C1C] checked:border-blue-600 checked:bg-blue-600 focus:outline-none transition-colors"
                />
                <div className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-zinc-600 peer-checked:bg-white transition-colors" />
              </div>
              <span className="text-zinc-300 group-hover:text-white transition-colors">
                Descending
              </span>
            </label>
          </div>
        </div>

        {/* Created date */}
        <div className="mt-6 text-sm">
          <h4 className="mb-4 text-base font-medium text-zinc-500">
            Created date
          </h4>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="createdDate"
                  className="peer h-5 w-5 appearance-none rounded-full border border-zinc-700 bg-[#1C1C1C] checked:border-blue-600 checked:bg-blue-600 focus:outline-none transition-colors"
                />
                <div className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-zinc-600 peer-checked:bg-white transition-colors" />
              </div>
              <span className="text-zinc-300 group-hover:text-white transition-colors">
                Ascending
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="createdDate"
                  defaultChecked
                  className="peer h-5 w-5 appearance-none rounded-full border border-zinc-700 bg-[#1C1C1C] checked:border-blue-600 checked:bg-blue-600 focus:outline-none transition-colors"
                />
                <div className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-zinc-600 peer-checked:bg-white transition-colors" />
              </div>
              <span className="text-zinc-300 group-hover:text-white transition-colors">
                Descending
              </span>
            </label>
          </div>
        </div>

        {/* Priority */}
        <div className="mt-6 text-sm">
          <h4 className="mb-4 text-base font-medium text-zinc-500">Priority</h4>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="priority"
                  className="peer h-5 w-5 appearance-none rounded-full border border-zinc-700 bg-[#1C1C1C] checked:border-blue-600 checked:bg-blue-600 focus:outline-none transition-colors"
                />
                <div className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-zinc-600 peer-checked:bg-white transition-colors" />
              </div>
              <span className="text-zinc-300 group-hover:text-white transition-colors">
                High to low
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="priority"
                  defaultChecked
                  className="peer h-5 w-5 appearance-none rounded-full border border-zinc-700 bg-[#1C1C1C] checked:border-blue-600 checked:bg-blue-600 focus:outline-none transition-colors"
                />
                <div className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-zinc-600 peer-checked:bg-white transition-colors" />
              </div>
              <span className="text-zinc-300 group-hover:text-white transition-colors">
                Low to high
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#272727] p-4 flex gap-3 bg-[#121212] rounded-b-xl">
        <button
          onClick={onClose}
          className="flex-1 rounded-lg border border-[#333] py-2.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-[#272727] transition-colors"
        >
          Reset
        </button>
        <button
          onClick={onClose}
          className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
