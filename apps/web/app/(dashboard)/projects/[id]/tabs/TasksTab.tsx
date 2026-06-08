"use client";

import { useState } from "react";
import { Search, Filter, ArrowUpDown, List, LayoutGrid, Plus } from "lucide-react";
import ProjectPipeline from "../../../../../components/ProjectPipeline";
import ProjectList from "../../../../../components/ProjectList";
import FilterDropdown from "../../../../../components/FilterDropdown";
import SortDropdown from "../../../../../components/SortDropdown";

interface TasksTabProps {
  onAddTask: () => void;
}

export function TasksTab({ onAddTask }: TasksTabProps) {
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col w-full min-w-0 overflow-hidden">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-[#272727] px-6 py-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search tasks"
              className="w-80 bg-transparent py-1.5 pl-9 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-6 w-px bg-[#272727] mx-2" />

          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 text-sm transition-colors ${isFilterOpen ? "text-white" : "text-zinc-400 hover:text-white"}`}
            >
              <Filter size={16} /> Filter
            </button>
            <FilterDropdown isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className={`flex items-center gap-2 text-sm ml-2 transition-colors ${isSortOpen ? "text-white" : "text-zinc-400 hover:text-white"}`}
            >
              <ArrowUpDown size={16} /> Sort
            </button>
            <SortDropdown isOpen={isSortOpen} onClose={() => setIsSortOpen(false)} />
          </div>

          <div className="h-6 w-px bg-[#272727] mx-2" />

          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-[#272727] bg-[#161616] p-0.5">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === "list" ? "bg-[#272727] text-white" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <List size={14} /> List
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === "kanban" ? "bg-[#272727] text-white" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <LayoutGrid size={14} /> Kanban
            </button>
          </div>

          <button
            onClick={onAddTask}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 ml-2"
          >
            <Plus size={16} /> New task
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto min-w-0 bg-[#0A0A0A] min-h-125">
        {viewMode === "kanban" ? <ProjectPipeline hideHeader={true} /> : <ProjectList />}
      </div>
    </div>
  );
}
