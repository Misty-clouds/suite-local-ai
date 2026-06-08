"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  List,
  ArrowUpDown,
  LayoutGrid,
} from "lucide-react";
import ProjectPipeline from "../../../components/ProjectPipeline";
import ProjectList from "../../../components/ProjectList";
import FilterDropdown from "../../../components/FilterDropdown";
import SortDropdown from "../../../components/SortDropdown";
import Header from "../../../components/Header";

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("projects-view-mode");
    if (savedMode === "list" || savedMode === "kanban") {
      setViewMode(savedMode);
    }
  }, []);

  const handleViewModeChange = (mode: "list" | "kanban") => {
    setViewMode(mode);
    localStorage.setItem("projects-view-mode", mode);
  };
  const [isSortOpen, setIsSortOpen] = useState(false);

  return (
    <>
      <Header />

      {/* Projects Toolbar */}
      <div className="flex flex-col md:flex-row h-auto md:h-16 items-start md:items-center justify-between border-b border-[#272727] px-4 sm:px-6 py-4 gap-4 shrink-0">
        <div className="flex items-center gap-4 w-full md:flex-1 md:w-auto">
          {/* Search Bar - Repositioned to left */}
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search projects"
              className="w-full md:w-80 bg-[#161616] md:bg-transparent rounded-lg md:rounded-none py-2 md:py-1.5 pl-9 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none border border-[#272727] md:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="hidden md:block h-6 w-px bg-[#272727] mx-2"></div>

          <div className="relative shrink-0">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 text-sm transition-colors ${isFilterOpen ? "text-white" : "text-zinc-400 hover:text-white"}`}
            >
              <Filter size={16} />{" "}
              <span className="hidden sm:inline md:hidden lg:inline">
                Filter
              </span>
            </button>
            <FilterDropdown
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>

          <div className="relative shrink-0">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className={`flex items-center gap-2 text-sm md:ml-2 transition-colors ${isSortOpen ? "text-white" : "text-zinc-400 hover:text-white"}`}
            >
              <ArrowUpDown size={16} />{" "}
              <span className="hidden sm:inline md:hidden lg:inline">Sort</span>
            </button>
            <SortDropdown
              isOpen={isSortOpen}
              onClose={() => setIsSortOpen(false)}
            />
          </div>

          <div className="hidden md:block h-6 w-px bg-[#272727] mx-2 shrink-0"></div>

          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-[#272727] bg-[#161616] p-0.5 shrink-0 ml-auto md:ml-0">
            <button
              onClick={() => handleViewModeChange("list")}
              className={`flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === "list" ? "bg-[#272727] text-white" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <List size={14} /> <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => handleViewModeChange("kanban")}
              className={`flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === "kanban" ? "bg-[#272727] text-white" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <LayoutGrid size={14} />{" "}
              <span className="hidden sm:inline">Kanban</span>
            </button>
          </div>

          <button className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 sm:px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 md:ml-2 shrink-0">
            <Plus size={16} /> <span className="hidden sm:inline">New</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden bg-[#0A0A0A]">
        {viewMode === "kanban" ? (
          <ProjectPipeline hideHeader={true} />
        ) : (
          <ProjectList />
        )}
      </div>
    </>
  );
}
