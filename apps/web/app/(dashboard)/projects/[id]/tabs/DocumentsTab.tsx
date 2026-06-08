"use client";

import { useState } from "react";
import { Search, Filter, ListFilter, List, LayoutGrid, Plus, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";

const kanbanFolders = [
  { id: 1, name: "Brand assets", size: "7MB", filesCount: "12 files", isNew: false },
  { id: 2, name: "Brand assets", size: "7MB", filesCount: "12 files", isNew: false },
  { id: 3, name: "Brand assets", size: "7MB", filesCount: "12 files", isNew: false },
  { id: 4, name: "New folder", filesCount: "Create new folder", isNew: true },
  { id: 5, name: "New folder", filesCount: "Create new folder", isNew: true },
];

const listFolders = [
  { id: 1, name: "Brand assets", size: "7MB", filesCount: "2 files", isNew: false },
  { id: 2, name: "Non disclosure agreement", size: "7MB", filesCount: "2 files", isNew: false },
  { id: 3, name: "Non disclosure agreement", size: "7MB", filesCount: "2 files", isNew: false },
  { id: 4, name: "Non disclosure agreement", size: "7MB", filesCount: "2 files", isNew: false },
  { id: 5, name: "Non disclosure agreement", size: "7MB", filesCount: "2 files", isNew: false },
];

const kanbanFiles = [
  { id: 1, type: "JPG", name: "Non disclosure agree...", size: "7MB", date: "Added 2 days ago", icon: "/assets/icons/JPG.svg" },
  { id: 2, type: "PSD", name: "Non disclosure agree...", size: "7MB", date: "Added 2 days ago", icon: "/assets/icons/PSD.svg" },
  { id: 3, type: "DOC", name: "Non disclosure agree...", size: "7MB", date: "Added 2 days ago", icon: "/assets/icons/DOC.svg" },
  { id: 4, type: "SVG", name: "Non disclosure agree...", size: "7MB", date: "Added 2 days ago", icon: "/assets/icons/SVG.svg" },
  { id: 5, type: "AI", name: "Non disclosure agree...", size: "7MB", date: "Added 2 days ago", icon: "/assets/icons/AI.svg" },
  { id: 6, type: "JPG", name: "Non disclosure agree...", size: "7MB", date: "Added 2 days ago", icon: "/assets/icons/JPG.svg" },
  { id: 7, type: "XLS", name: "Non disclosure agree...", size: "7MB", date: "Added 2 days ago", icon: "/assets/icons/XLS.svg" },
  { id: 8, type: "PSD", name: "Non disclosure agree...", size: "7MB", date: "Added 2 days ago", icon: "/assets/icons/PSD.svg" },
  { id: 9, type: "PPT", name: "Non disclosure agree...", size: "7MB", date: "Added 2 days ago", icon: "/assets/icons/PPT.svg" },
  { id: 10, type: "DOC", name: "Non disclosure agree...", size: "7MB", date: "Added 2 days ago", icon: "/assets/icons/DOC.svg" },
  { id: 11, type: "AI", name: "Non disclosure agree...", size: "7MB", date: "Added 2 days ago", icon: "/assets/icons/AI.svg" },
  { id: 12, type: "SVG", name: "Non disclosure agree...", size: "7MB", date: "Added 2 days ago", icon: "/assets/icons/SVG.svg" },
  { id: 13, type: "XLS", name: "Non disclosure agree...", size: "7MB", date: "Added 2 days ago", icon: "/assets/icons/XLS.svg" },
  { id: 14, type: "PPT", name: "Non disclosure agree...", size: "7MB", date: "Added 2 days ago", icon: "/assets/icons/PPT.svg" },
];

const listFiles = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  type: "JPG",
  name: "Non disclosure agreement",
  size: "7MB",
  date: "Added 2 days ago",
  icon: "/assets/icons/JPG.svg",
}));

export function DocumentsTab() {
  const [docsViewMode, setDocsViewMode] = useState<"list" | "kanban">("kanban");
  const [isDocsFilterOpen, setIsDocsFilterOpen] = useState(false);
  const [isDocsSortOpen, setIsDocsSortOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col w-full min-w-0 overflow-hidden bg-[#0A0A0A]">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-[#272727] px-6 py-4 bg-[#0A0A0A]">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search files, folders"
              className="w-80 bg-transparent py-1.5 pl-9 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-6 w-px bg-[#272727] mx-2" />
          <button
            onClick={() => setIsDocsFilterOpen(!isDocsFilterOpen)}
            className={`flex items-center gap-2 text-sm transition-colors ${isDocsFilterOpen ? "text-white" : "text-zinc-400 hover:text-white"}`}
          >
            <Filter size={16} /> Filter
          </button>
          <button
            onClick={() => setIsDocsSortOpen(!isDocsSortOpen)}
            className={`flex items-center gap-2 text-sm ml-2 transition-colors ${isDocsSortOpen ? "text-white" : "text-zinc-400 hover:text-white"}`}
          >
            <ListFilter size={16} /> Sort
          </button>
          <div className="h-6 w-px bg-[#272727] mx-2" />

          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-[#272727] bg-[#161616] p-0.5">
            <button
              onClick={() => setDocsViewMode("list")}
              className={`flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium transition-colors ${docsViewMode === "list" ? "bg-[#272727] text-white" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <List size={14} /> List
            </button>
            <button
              onClick={() => setDocsViewMode("kanban")}
              className={`flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium transition-colors ${docsViewMode === "kanban" ? "bg-[#272727] text-white" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <LayoutGrid size={14} /> Kanban
            </button>
          </div>

          <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 ml-2">
            <Plus size={16} /> New file
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 min-h-125">
        {docsViewMode === "kanban" ? (
          <>
            {/* Folders */}
            <div className="mb-8">
              <h2 className="text-white text-[15px] font-medium mb-4">Folders</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {kanbanFolders.map((folder) =>
                  folder.isNew ? (
                    <div key={folder.id} className="rounded-xl border border-[#272727] bg-[#111111] hover:bg-[#161616] transition-colors p-4 flex flex-col justify-center cursor-pointer h-37.5">
                      <div className="flex-1 flex flex-col items-center justify-center pt-2">
                        <Plus size={24} className="text-zinc-400 mb-2" />
                        <h3 className="text-[13px] font-medium text-zinc-300">{folder.name}</h3>
                        <p className="text-[11px] text-zinc-600 mt-1">{folder.filesCount}</p>
                      </div>
                    </div>
                  ) : (
                    <div key={folder.id} className="rounded-xl border border-[#272727] bg-[#111111] hover:bg-[#161616] transition-colors p-5 flex flex-col cursor-pointer h-37.5">
                      <div className="mb-auto">
                        <Image src="/assets/icons/folder.png" alt="Folder" className="w-9 h-9 object-contain" width={36} height={36} />
                      </div>
                      <div className="mt-4">
                        <h3 className="text-[13px] font-medium text-zinc-200">{folder.name}</h3>
                        <p className="text-[11px] text-zinc-500 mt-1">{folder.size} <span className="mx-1">|</span> {folder.filesCount}</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Files */}
            <div className="pb-30">
              <h2 className="text-white text-[15px] font-medium mb-4">Files</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {kanbanFiles.map((file) => (
                  <div key={file.id} className="group relative rounded-xl border border-[#272727] bg-[#111111] hover:bg-[#161616] transition-colors p-5 flex flex-col cursor-pointer h-37.5">
                    <div className="absolute left-1/2 -top-4 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none group-hover:pointer-events-auto">
                      <div className="bg-[#1C1C1E] border border-[#2C2C2E] py-2 px-3 rounded-xl shadow-xl hover:bg-[#2C2C2E] flex items-center gap-2 cursor-pointer">
                        <Trash2 size={13} className="text-red-500" />
                        <span className="text-xs text-red-500 font-medium whitespace-nowrap">Delete file</span>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <Image src={file.icon} alt={file.type} width={40} height={40} className="w-10 h-10 object-contain" />
                    </div>
                    <div className="mt-auto">
                      <h3 className="text-[13px] font-medium text-zinc-200 truncate" title={file.name}>{file.name}</h3>
                      <p className="text-[10px] text-zinc-500 mt-1">{file.size} <span className="mx-1">|</span> {file.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-30">
            {/* Folders List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-[15px] font-medium">Folders</h2>
                <button className="h-7 w-7 flex items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-[#161616] transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {listFolders.map((folder) => (
                  <div key={folder.id} className="flex items-center justify-between p-4 rounded-xl border border-[#272727] bg-[#111111] hover:bg-[#161616] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <Image src="/assets/icons/folder.png" alt="Folder" className="w-8 h-8 object-contain" width={32} height={32} />
                      <div>
                        <h3 className="text-[13px] font-medium text-zinc-200">{folder.name}</h3>
                        <p className="text-[11px] text-zinc-500 mt-1">{folder.size} <span className="mx-1">|</span> {folder.filesCount}</p>
                      </div>
                    </div>
                    <button className="h-8 w-8 flex items-center justify-center rounded border border-transparent group-hover:border-[#272727] text-zinc-500 hover:text-zinc-300 group-hover:bg-[#1C1C1E] transition-all">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Files List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-[15px] font-medium">Files</h2>
                <button className="h-7 w-7 flex items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-[#161616] transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {listFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 rounded-xl border border-[#272727] bg-[#111111] hover:bg-[#161616] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 flex items-center justify-center rounded">
                        <Image width={32} height={32} src={file.icon} alt={file.type} className="w-8 h-8 object-contain" />
                      </div>
                      <div>
                        <h3 className="text-[13px] font-medium text-zinc-200">{file.name}</h3>
                        <p className="text-[11px] text-zinc-500 mt-1">{file.size} <span className="mx-1">|</span> {file.date}</p>
                      </div>
                    </div>
                    <button className="h-8 w-8 flex items-center justify-center rounded border border-transparent group-hover:border-[#272727] text-zinc-500 hover:text-zinc-300 group-hover:bg-[#1C1C1E] transition-all">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
