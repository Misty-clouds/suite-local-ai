"use client";

import { useState } from "react";
import { ChevronLeft, Download, Plus, MoreHorizontal, Share2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import TaskModal from "../../../../components/TaskModal";
import ShareProjectModal from "../../../../components/ShareProjectModal";
import { OverviewTab } from "./tabs/OverviewTab";
import { TasksTab } from "./tabs/TasksTab";
import { DocumentsTab } from "./tabs/DocumentsTab";
import { InvoicesTab } from "./tabs/InvoicesTab";
import { AnalyticsTab } from "./tabs/AnalyticsTab";

const TABS = ["Overview", "Tasks", "Documents", "Invoices", "Analytics", "Automation", "Settings"];

export default function ProjectDetailsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <div className="px-6 py-4 flex items-center border-b border-[#272727]">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors bg-[#1A1A1A] border border-[#272727] px-3 py-1.5 rounded-lg"
        >
          <ChevronLeft size={16} /> Back
        </button>
      </div>

      {/* Project Header */}
      <div className="px-6 py-6 flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Cloud Migration Suite</h1>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="font-medium text-zinc-300">Client:</span> NeoTech
            <span>•</span>
            <span className="font-medium text-zinc-300">Started:</span> Sep 7, 2025
            <span>•</span>
            <span className="font-medium text-zinc-300">Due:</span> Nov 12, 2025
          </div>
        </div>

        <div className="flex items-center gap-3 w-full xl:w-auto flex-wrap pb-2 xl:pb-0">
          <button className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white bg-transparent border border-[#272727] px-4 py-2 rounded-lg whitespace-nowrap">
            <Download size={16} /> Generate report
          </button>

          <div className="relative">
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white bg-transparent border border-[#272727] px-4 py-2 rounded-lg whitespace-nowrap"
            >
              <MoreHorizontal size={16} /> More
            </button>
            {isMoreOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMoreOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[#272727] bg-[#111111] shadow-xl z-50 overflow-hidden">
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:bg-[#1A1A1A] hover:text-white transition-colors"
                    onClick={() => { setIsShareModalOpen(true); setIsMoreOpen(false); }}
                  >
                    <Share2 size={16} /> Share
                  </button>
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-[#1A1A1A] transition-colors"
                    onClick={() => setIsMoreOpen(false)}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium whitespace-nowrap shrink-0"
          >
            <Plus size={16} /> Add task card
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 flex-1 rounded-full bg-zinc-800 overflow-hidden flex">
            <div className="h-full bg-linear-to-r from-cyan-400 to-blue-500 rounded-full" style={{ width: "72%" }} />
          </div>
        </div>
        <p className="text-sm text-zinc-400">72% complete • 18 of 40 tasks remaining</p>
      </div>

      {/* Tabs */}
      <div className="z-30 bg-[#0A0A0A] px-6 border-b border-[#272727] scrollbar-hide">
        <div className="flex gap-6 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium transition-colors relative ${
                activeTab === tab ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "Overview" && <OverviewTab />}
      {activeTab === "Tasks" && <TasksTab onAddTask={() => setIsTaskModalOpen(true)} />}
      {activeTab === "Documents" && <DocumentsTab />}
      {activeTab === "Invoices" && <InvoicesTab />}
      {activeTab === "Analytics" && <AnalyticsTab />}
      {activeTab === "Automation" && (
        <div className="flex flex-1 items-center justify-center p-12 text-zinc-600 text-sm">
          Automation tab — coming soon
        </div>
      )}
      {activeTab === "Settings" && (
        <div className="flex flex-1 items-center justify-center p-12 text-zinc-600 text-sm">
          Settings tab — coming soon
        </div>
      )}

      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
      <ShareProjectModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </>
  );
}
