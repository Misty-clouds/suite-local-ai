"use client";

import { useEffect, useState } from "react";
import { Clock, Users as UsersIcon, Trophy, Plus, Bell } from "lucide-react";
import { FaRobot } from "react-icons/fa";
import { LuSparkle } from "react-icons/lu";
import { FaRegLightbulb } from "react-icons/fa";
import type { Client, FinancialReport } from "@suite/types";
import { clientsApi } from "@/lib/clients-api";
import { reportsApi } from "@/lib/reports-api";
import { activitiesApi, type ActivityItem } from "@/lib/activities-api";

const TROPHY_COLORS = ["#FFB700", "#909090", "#E26A00", "#66A4FF", "#4ADE80"];

const ACTIVITY_LABEL: Record<string, string> = {
  transaction: "Transaction",
  document: "Document",
  budget: "Budget",
  invoice: "Invoice",
  payment: "Payment",
  client: "Client",
  account: "Account",
  agent: "AI Agent",
  tax: "Tax",
  profile: "Profile",
};
const ACTIVITY_COLOR: Record<string, string> = {
  transaction: "#4ADE80",
  document: "#66A4FF",
  budget: "#FFB700",
  invoice: "#A78BFA",
  payment: "#4ADE80",
  client: "#E26A00",
  account: "#66A4FF",
  agent: "#A78BFA",
  tax: "#F87171",
  profile: "#909090",
};

function timeAgo(iso?: string): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}hr ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function RightPanel() {
  const [clients, setClients] = useState<Client[]>([]);
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    clientsApi.list().then(setClients).catch(() => setClients([]));
    reportsApi.latest().then(setReport).catch(() => setReport(null));
    activitiesApi.list().then(setActivities).catch(() => setActivities([]));
  }, []);

  const insights: string[] = report
    ? [
        report.summaryText,
        ...report.anomalies.map((a) => a.detail),
      ].filter(Boolean)
    : [];

  return (
    <div className="flex w-full flex-col gap-6">
      {/* AI Insights + Top Stats */}
      <div className="rounded-lg border border-[#272727] bg-[#222222] p-3 shadow flex flex-col gap-2">
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <FaRobot size={20} className="text-[#6E7B82]" />
            <h3 className="text-sm font-semibold text-[#DEDEDE]">
              AI Insights + Top Stats
            </h3>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* AI Business Assistant */}
          <div className="bg-[#161616] p-2 rounded-[7px]">
            <div className="mb-3 flex items-center gap-2 text-zinc-400 text-xs">
              <FaRegLightbulb size={14} />
              <span>AI Business Assistant</span>
            </div>

            {insights.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
                <div className="mb-3 flex h-[40px] w-[40px] items-center justify-center rounded-xl bg-[#1C1C1C] border border-[#2A2A2A] text-zinc-400">
                  <LuSparkle size={18} />
                </div>
                <p className="text-[12px] leading-relaxed text-[#6E7B82] max-w-[220px]">
                  Run a Financial Review to unlock AI-powered insights about your
                  business.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {insights.slice(0, 4).map((line, i) => (
                  <div key={i} className="flex gap-1.5 text-xs text-[#6E7B82]">
                    <div className="mt-0.5">
                      <LuSparkle size={12} className="text-green-500" />
                    </div>
                    <p>{line}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Client Stats */}
          <div className="flex flex-col gap-2 rounded-[7px] bg-[#161616]">
            <div className="flex items-center justify-between text-xs text-zinc-400 bg-[#0C0C0C] p-2 rounded-t-[7px]">
              <div className="flex items-center gap-2">
                <UsersIcon size={14} />
                <span>Client Stats</span>
              </div>
              <span className="text-[10px] text-zinc-500">
                {clients.length} total
              </span>
            </div>
            {clients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="mb-4 text-sm text-[#6E7B82]">No clients yet</p>
                <button className="text-[13px] text-blue-500 hover:text-blue-400 flex items-center gap-1.5">
                  <Plus size={16} /> Add your first client
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-2">
                {clients.slice(0, 5).map((client, i) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Trophy
                        size={12}
                        color={TROPHY_COLORS[i % TROPHY_COLORS.length]}
                      />
                      <span className="text-[#DEDEDE]">{client.name}</span>
                    </div>
                    <span className="text-[#6E7B82] truncate max-w-[120px] text-right">
                      {client.company || client.email || "—"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activities */}
      <div className="flex flex-1 flex-col min-h-[380px] rounded-lg border border-[#272727] bg-[#222222] shadow-lg">
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#6E7B82]">
            <Clock size={20} color="#6E7B82" />
            <span className="text-[#DEDEDE]">Activities</span>
          </div>
        </div>

        <div className="space-y-6 relative flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-track-[#161616] scrollbar-thumb-[#333]">
          {activities.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-[#1C1C1C] border border-[#2A2A2A] text-zinc-400">
                <Bell size={20} />
              </div>
              <p className="text-[13px] leading-relaxed text-[#6E7B82] max-w-[220px]">
                Your recent activity will appear here as you add transactions,
                documents, invoices and more.
              </p>
            </div>
          ) : (
            activities.slice(0, 8).map((a) => (
              <div key={a.id} className="flex gap-2 relative">
                <div className="relative mt-1">
                  <div
                    className="h-6 w-6 rounded-full border border-zinc-700 bg-[#1C1C1C] flex items-center justify-center"
                    style={{ color: ACTIVITY_COLOR[a.type ?? ""] ?? "#66A4FF" }}
                  >
                    <LuSparkle size={12} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className="text-sm font-semibold text-[#DEDEDE]">
                      {ACTIVITY_LABEL[a.type ?? ""] ?? "Activity"}
                    </h4>
                    <span className="text-[12px] text-[#6E7B82]">
                      {timeAgo(a.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-[#6E7B82] leading-snug line-clamp-2">
                    {a.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
