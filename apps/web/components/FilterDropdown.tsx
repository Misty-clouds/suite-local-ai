"use client";

import { X, Search } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface FilterDropdownProps {
  onClose: () => void;
  isOpen: boolean;
}

export default function FilterDropdown({
  onClose,
  isOpen,
}: FilterDropdownProps) {
  const [searchMember, setSearchMember] = useState("");

  if (!isOpen) return null;

  const statuses = [
    { label: "To do", checked: true },
    { label: "In progress", checked: false },
    { label: "Under review", checked: false },
    { label: "Completed", checked: false },
    { label: "On hold", checked: true },
    { label: "Cancelled", checked: false },
  ];

  const priorities = [
    { label: "High", checked: false },
    { label: "Medium", checked: false },
    { label: "Low", checked: false },
  ];

  const assignees = [
    {
      name: "James Cousins",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    {
      name: "James Cousins",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    {
      name: "James Cousins",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
    },
    {
      name: "James Cousins",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
  ];

  return (
    <div className="absolute top-full mt-2 left-0 z-50 w-75 rounded-xl border border-[#272727] bg-[#121212] shadow-2xl shadow-black/50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <h3 className="text-base font-medium text-zinc-200">Filter</h3>
        <button onClick={onClose} className="text-zinc-500 hover:text-white">
          <X size={18} />
        </button>
      </div>

      <div className="max-h-150 overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {/* Status */}
        <div className="mt-2 text-sm">
          <h4 className="mb-2 font-medium text-zinc-500">Status</h4>
          <div className="space-y-2">
            {statuses.map((status, i) => (
              <label
                key={i}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={status.checked}
                    className="peer h-5 w-5 appearance-none rounded border border-zinc-700 bg-[#1C1C1C] checked:border-blue-600 checked:bg-blue-600 focus:outline-none transition-colors"
                  />
                  <svg
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 3L4.5 8.5L2 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-zinc-300 group-hover:text-white transition-colors">
                  {status.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div className="mt-5 text-sm">
          <h4 className="mb-2 font-medium text-zinc-500">Priority</h4>
          <div className="space-y-2">
            {priorities.map((priority, i) => (
              <label
                key={i}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={priority.checked}
                    className="peer h-5 w-5 appearance-none rounded border border-zinc-700 bg-[#1C1C1C] checked:border-blue-600 checked:bg-blue-600 focus:outline-none transition-colors"
                  />
                  <svg
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 3L4.5 8.5L2 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-zinc-300 group-hover:text-white transition-colors">
                  {priority.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Due date */}
        <div className="mt-5">
          <h4 className="mb-2 text-sm font-medium text-zinc-500">Due date</h4>
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-1">
              <span className="text-xs text-zinc-400">From</span>
              <input
                type="text"
                placeholder="00-00-0000"
                className="w-full rounded-lg border border-zinc-800 bg-[#1C1C1C] px-3 py-2 text-sm text-zinc-300 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
              />
            </div>
            <div className="flex-1 space-y-1">
              <span className="text-xs text-zinc-400">To</span>
              <input
                type="text"
                placeholder="00-00-0000"
                className="w-full rounded-lg border border-zinc-800 bg-[#1C1C1C] px-3 py-2 text-sm text-zinc-300 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Created date */}
        <div className="mt-4">
          <h4 className="mb-2 text-sm font-medium text-zinc-500">
            Created date
          </h4>
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-1">
              <span className="text-xs text-zinc-400">From</span>
              <input
                type="text"
                placeholder="00-00-0000"
                className="w-full rounded-lg border border-zinc-800 bg-[#1C1C1C] px-3 py-2 text-sm text-zinc-300 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
              />
            </div>
            <div className="flex-1 space-y-1">
              <span className="text-xs text-zinc-400">To</span>
              <input
                type="text"
                placeholder="00-00-0000"
                className="w-full rounded-lg border border-zinc-800 bg-[#1C1C1C] px-3 py-2 text-sm text-zinc-300 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Assignee */}
        <div className="mt-5">
          <h4 className="mb-2 text-sm font-medium text-zinc-500">Assignee</h4>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
            <input
              type="text"
              placeholder="Search members"
              value={searchMember}
              onChange={(e) => setSearchMember(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-[#1C1C1C] py-2 pl-9 pr-4 text-sm text-zinc-300 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
          </div>
          <div className="space-y-3">
            {assignees.map((assignee, i) => (
              <label
                key={i}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer h-5 w-5 appearance-none rounded border border-zinc-700 bg-[#1C1C1C] checked:border-blue-600 checked:bg-blue-600 focus:outline-none transition-colors"
                  />
                  <svg
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 3L4.5 8.5L2 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="h-6 w-6 rounded-full overflow-hidden relative">
                  <Image
                    src={assignee.avatar}
                    alt={assignee.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                  {assignee.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#272727] p-4 flex gap-3 bg-[#121212] rounded-b-xl">
        <button
          onClick={onClose}
          className="flex-1 rounded-lg border border-[#333] py-2 text-sm font-medium text-white hover:bg-[#272727] transition-colors"
        >
          Reset
        </button>
        <button
          onClick={onClose}
          className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
