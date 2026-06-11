"use client";

import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  List,
  LayoutGrid,
  MoreHorizontal,
  FileText,
  File,
  FileClock,
  Link2,
  Eye,
  Download,
  Link,
  Pencil,
  Trash2,
} from "lucide-react";
import Header from "../../../components/Header";
import FileUploadModal from "../../../components/FileUploadModal";
import Pagination from "../../../components/Pagination";
import { documentsApi, type DocumentItem } from "@/lib/documents-api";

export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [openActionIndex, setOpenActionIndex] = useState<number | null>(null);
  const actionsMenuRef = useRef<HTMLDivElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [stats, setStats] = useState({ total: 0, external: 0, recent: 0 });
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([documentsApi.list(), documentsApi.stats()])
      .then(([d, s]) => {
        setDocs(d);
        setStats(s);
      })
      .catch(() => setDocs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  async function openDocument(doc: DocumentItem) {
    setOpenActionIndex(null);
    try {
      const content = await documentsApi.content(doc.id);
      if (content) window.open(content, "_blank");
    } catch {
      /* ignore */
    }
  }

  async function deleteDocument(doc: DocumentItem) {
    setOpenActionIndex(null);
    try {
      await documentsApi.remove(doc.id);
      load();
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!actionsMenuRef.current) return;
      if (actionsMenuRef.current.contains(e.target as Node)) return;
      setOpenActionIndex(null);
    }

    if (openActionIndex === null) return;

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [openActionIndex]);

  const cards = [
    {
      title: "Total documents",
      value: String(stats.total),
      subtext: "All uploaded files",
      icon: FileText,
    },
    {
      title: "Shared externally",
      value: String(stats.external),
      subtext: "From a URL",
      icon: File,
    },
    {
      title: "Linked to projects",
      value: String(stats.total),
      subtext: "Available in workspace",
      icon: Link2,
    },
    {
      title: "Recent uploads",
      value: String(stats.recent),
      subtext: "This week",
      icon: FileClock,
    },
  ];

  const documents = docs.map((d) => ({
    id: d.id,
    name: d.name,
    project: d.sourceUrl ? "External link" : "—",
    type: (d.type?.split("/")[1] || d.name.split(".").pop() || "FILE")
      .slice(0, 4)
      .toUpperCase(),
    date: d.createdAt
      ? new Date(d.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—",
    raw: d,
  }));

  function handleRowAction(
    action: "view" | "download" | "link" | "rename" | "delete",
    doc: (typeof documents)[number],
  ) {
    setOpenActionIndex(null);

    switch (action) {
      case "view":
      case "download":
        void openDocument(doc.raw);
        return;
      case "delete":
        void deleteDocument(doc.raw);
        return;
      case "link":
      case "rename":
        return;
    }
  }

  return (
    <>
      <Header />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-track-[#0A0A0A] scrollbar-thumb-[#272727]">
        {/* Controls Bar */}
        <div className="flex items-center justify-between rounded-xl border border-[#272727] bg-[#101010] px-3 py-2.5 mb-6">
          <div className="flex-1 max-w-sm relative flex items-center">
            <Search className="absolute left-3 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="Search file name, project"
              className="w-full bg-transparent py-1 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-5 w-px bg-[#272727] mx-1"></div>

            <button className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
              <Filter size={16} /> Filter
            </button>

            <button className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors ml-4 focus:outline-none">
              <span className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-up-down"
                >
                  <path d="m21 16-4 4-4-4" />
                  <path d="M17 20V4" />
                  <path d="m3 8 4-4 4 4" />
                  <path d="M7 4v16" />
                </svg>
                Sort
              </span>
            </button>

            <div className="flex items-center rounded-lg border border-[#272727] bg-[#161616] p-0.5 ml-4">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-[#272727] text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <List size={14} /> List
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === "kanban"
                    ? "bg-[#272727] text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <LayoutGrid size={14} /> Kanban
              </button>
            </div>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 ml-2"
            >
              <Plus size={16} /> Upload document
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-xl border border-[#272727] bg-[#161616] p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <card.icon size={16} />
                  {card.title}
                </div>
                <button className="flex h-6 w-6 items-center justify-center rounded border border-[#272727] text-zinc-500 hover:text-white transition-colors">
                  <MoreHorizontal size={14} />
                </button>
              </div>
              <div className="text-3xl font-semibold">{card.value}</div>
              <div className="text-xs text-zinc-500">{card.subtext}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="w-full">
          {/* Table Header */}
          <div className="flex items-center px-2 py-3 text-xs text-zinc-500 border-b border-[#272727]">
            <div className="w-10 flex justify-center">
              <div className="h-4 w-4 rounded border border-[#272727] bg-[#101010]"></div>
            </div>
            <div className="flex-1 ml-4 font-medium">File name</div>
            <div className="w-[30%] font-medium">Linked project</div>
            <div className="w-[10%] font-medium">Type</div>
            <div className="w-[15%] font-medium">Uploaded</div>
            <div className="w-16 font-medium text-right pr-4">Action</div>
          </div>

          {/* Table Body */}
          <div className="flex flex-col">
            {loading ? (
              <div className="py-16 text-center text-sm text-zinc-600">
                Loading documents…
              </div>
            ) : documents.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <FileText size={28} className="text-zinc-600" />
                <p className="text-sm text-zinc-400">No documents yet</p>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="rounded-lg bg-[#045DDF] px-4 py-2 text-sm font-medium text-white hover:bg-[#034BBB]"
                >
                  Upload a file
                </button>
              </div>
            ) : (
              documents.map((doc, index) => (
              <div
                key={index}
                className="group flex items-center px-2 py-3 border-b border-[#272727] transition-colors hover:bg-white/5"
              >
                <div className="w-10 flex justify-center">
                  <div className="h-4 w-4 rounded border border-[#272727] bg-[#101010]"></div>
                </div>
                <div className="flex-1 ml-4 flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-pink-500">
                    {/* Simplified icon matching the image */}
                    <span className="text-[8px] font-bold text-white">JPG</span>
                  </div>
                  <span className="text-sm text-white">{doc.name}</span>
                </div>
                <div className="w-[30%] text-sm text-zinc-400">
                  {doc.project}
                </div>
                <div className="w-[10%] text-sm text-zinc-400">{doc.type}</div>
                <div className="w-[15%] text-sm text-zinc-400">{doc.date}</div>
                <div className="w-16 flex justify-end pr-4">
                  <div
                    className="relative"
                    ref={openActionIndex === index ? actionsMenuRef : null}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenActionIndex((prev) =>
                          prev === index ? null : index,
                        )
                      }
                      className="flex h-7 w-7 items-center justify-center rounded border border-[#272727] text-zinc-500 transition-colors group-hover:bg-[#161616] group-hover:text-white"
                      aria-haspopup="menu"
                      aria-expanded={openActionIndex === index}
                    >
                      <MoreHorizontal size={14} />
                    </button>

                    {openActionIndex === index && (
                      <div
                        role="menu"
                        className="absolute right-0 top-9 z-50 w-52 overflow-hidden rounded-lg border border-[#272727] bg-[#101010] shadow-lg"
                      >
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => handleRowAction("view", doc)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-200 hover:bg-white/5"
                        >
                          <Eye size={16} className="text-zinc-400" />
                          View
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => handleRowAction("download", doc)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-200 hover:bg-white/5"
                        >
                          <Download size={16} className="text-zinc-400" />
                          Download
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => handleRowAction("link", doc)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-200 hover:bg-white/5"
                        >
                          <Link size={16} className="text-zinc-400" />
                          Link to Project
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => handleRowAction("rename", doc)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-200 hover:bg-white/5"
                        >
                          <Pencil size={16} className="text-zinc-400" />
                          Rename
                        </button>
                        <div className="h-px bg-[#272727]" />
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => handleRowAction("delete", doc)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 size={16} className="text-red-500" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
            )}
          </div>

          {/* Pagination */}
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="pt-6 mt-2"
          />
        </div>
      </div>
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploaded={load}
      />
    </>
  );
}
