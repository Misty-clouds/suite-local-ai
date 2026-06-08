"use client";

import { Plus } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import ProjectPipeline from "../../../../../components/ProjectPipeline";

const MILESTONES = [
  { title: "API Integration", date: "Nov 12, 2025" },
  { title: "Build", date: "Oct 24, 2025 to Nov 12, 2025" },
  { title: "Discovery", date: "Oct 24, 2025 to Nov 12, 2025" },
  { title: "Test", date: "Oct 24, 2025 to Nov 12, 2025" },
];

const budgetData = [
  { name: "Spent", value: 7500, color: "#F87171" },
  { name: "Remaining", value: 4500, color: "#4ADE80" },
];

const teamMembers = [
  { name: "Giwa Abdullahi", role: "Product designer", initial: "G", color: "bg-orange-500" },
  { name: "Teoheed A.", role: "Full stack developer", initial: "T", color: "bg-red-500" },
  { name: "Giwa Abdullahi", role: "PM", initial: "G", color: "bg-orange-500" },
];

const activities = [
  {
    title: "Proposal generated",
    desc: 'Theoheed generated proposal "NeoTech Proposal v1"',
    time: "3hr ago",
    iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
    hasLine: true,
  },
  {
    title: "Invoice paid",
    desc: "Invoice INV-011 marked Paid ($3,200)",
    time: "3hr ago",
    iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    hasLine: true,
  },
  {
    title: "Proposal drafted",
    desc: 'Giwa just marked "Cloudsuites website redesign" as completed',
    time: "3hr ago",
    iconPath: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
    hasLine: true,
  },
  {
    title: "Task finished",
    desc: 'Giwa just marked "Cloudsuites website redesign" as completed',
    time: "3hr ago",
    iconPath: "M5 13l4 4L19 7",
    hasLine: false,
  },
];

const aiInsights = [
  { color: "#4ADE80", text: "3 tasks behind schedule, reassign 2 members" },
  { color: "#FACC15", text: "Auto-generate invoice after milestone completion to improve cash flow" },
  { color: "#F87171", text: "You can improve invoice payment time by 20% using auto-reminders." },
];

export function OverviewTab() {
  return (
    <div className="p-6 grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 lg:overflow-visible">
      {/* Left Column */}
      <div className="flex flex-col gap-6 w-full xl:min-w-0 pr-0 xl:pr-6 xl:border-r border-[#272727]">
        {/* Project summary */}
        <div className="space-y-4">
          <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Project summary</h3>
          <div className="space-y-4 text-sm text-zinc-300">
            <div>
              <h4 className="text-zinc-500 mb-1">Description</h4>
              <p className="leading-relaxed">
                Build and deploy an integrated billing and analytics dashboard for NeoTech to centralize subscription management.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <h4 className="flex items-center gap-2 text-zinc-500 mb-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Start date
                </h4>
                <p>Sep 07, 2025</p>
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-zinc-500 mb-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  End date
                </h4>
                <p>Nov 12, 2025</p>
              </div>
              <div>
                <h4 className="text-zinc-500 mb-1">Status</h4>
                <p className="font-medium text-blue-400">To do</p>
              </div>
              <div>
                <h4 className="text-zinc-500 mb-1">Priority</h4>
                <span className="inline-block px-2 py-0.5 mt-0.5 rounded text-xs font-medium bg-[#3F3A28] text-[#FACC15] border border-[#5E5224]">
                  Medium
                </span>
              </div>
              <div className="col-span-2">
                <h4 className="text-zinc-500 mb-1">Budget</h4>
                <p className="font-medium">
                  $15,000 • <span className="text-zinc-400">Spent: $6,820</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline/Milestones */}
        <div className="space-y-4 pt-6 border-t border-[#272727]">
          <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Timeline/Milestones</h3>
          <div className="rounded-xl border border-[#272727] bg-[#111111] overflow-hidden">
            {MILESTONES.map((milestone, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center px-4 py-3 text-sm border-b border-[#272727] last:border-0 hover:bg-[#1A1A1A] transition-colors group relative cursor-default"
              >
                <span className="text-zinc-300 group-hover:text-blue-400 transition-colors">{milestone.title}</span>
                <span className="text-zinc-500 text-xs">{milestone.date}</span>
                {milestone.title === "Build" && (
                  <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute left-10 top-full mt-2 z-10 w-64 bg-[#1C1C1C] border border-white/10 p-3 rounded-lg shadow-xl text-xs text-zinc-300">
                    This is the description if the milestone (While hovering)
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mini Pipeline */}
        <div className="space-y-4 pt-6 border-t border-[#272727] flex-1 min-h-125 flex flex-col">
          <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Project pipeline</h3>
          <div
            className="flex-1 border-t border-l border-[#272727] rounded-tl-xl overflow-hidden relative"
            style={{ marginLeft: -16, borderLeft: "none" }}
          >
            <div className="absolute inset-0 pl-4 py-0">
              <ProjectPipeline hideHeader={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-6 xl:pl-0 w-full">
        {/* Budget Circle Chart */}
        <div className="flex flex-col items-center py-4">
          <div className="relative w-48 h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                  startAngle={90}
                  endAngle={-270}
                >
                  {budgetData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      style={{ filter: `drop-shadow(0 0 8px ${entry.color}4D)` }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold">$12,000</span>
              <span className="text-xs text-zinc-500">Total budget</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-300 mb-4 px-2 text-center flex-wrap justify-center">
            <span>Spent: <strong>$7,500 <span className="text-zinc-500">(65%)</span></strong></span>
            <span className="text-zinc-600">|</span>
            <span>Remaining: <strong>$4,500 <span className="text-zinc-500">(35%)</span></strong></span>
          </div>

          <button className="px-4 py-2 border border-[#272727] bg-[#161616] hover:bg-[#222222] text-sm text-zinc-300 rounded-lg transition-colors">
            Adjust budget
          </button>
        </div>

        {/* Team Section */}
        <div className="border border-[#272727] rounded-xl bg-[#111] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#272727] bg-[#161616]">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Team
            </h3>
            <button className="flex items-center gap-1.5 text-xs text-zinc-300 border border-[#272727] px-2 py-1 rounded bg-[#111] hover:bg-[#222]">
              <Plus size={12} /> Add member
            </button>
          </div>

          <div className="divide-y divide-[#1A1A1A]">
            <div className="grid grid-cols-[30px_1fr_1fr] items-center p-3 text-xs text-zinc-500 bg-[#0c0c0c]">
              <div />
              <div>Member</div>
              <div>Role</div>
            </div>
            {teamMembers.map((member, i) => (
              <div key={i} className="grid grid-cols-[30px_1fr_1fr] items-center p-3 gap-2 hover:bg-[#161616] transition-colors">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-800 accent-blue-500" />
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white ${member.color}`}>
                    {member.initial}
                  </div>
                  <span className="text-sm text-zinc-300">{member.name}</span>
                </div>
                <div className="text-xs text-zinc-500">{member.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Activities Section */}
        <div className="border border-[#272727] rounded-xl bg-[#111] overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-[#272727] bg-[#161616]">
            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-sm font-medium text-white">Activities</h3>
          </div>
          <div className="p-4 space-y-6">
            {activities.map((activity, i) => (
              <div key={i} className={`relative flex gap-4`}>
                {activity.hasLine && (
                  <div className="absolute left-4 top-8 -bottom-6 w-px bg-[#272727]" />
                )}
                <div className="relative z-10 w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex shrink-0 items-center justify-center border border-blue-500/30">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={activity.iconPath} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-sm text-zinc-200 font-medium truncate">{activity.title}</h4>
                    <span className="text-xs text-zinc-500 shrink-0 ml-2">{activity.time}</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{activity.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Business Assistant */}
        <div className="border border-[#272727] rounded-xl bg-[#0c0c0c] overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-[#272727] bg-[#111]">
            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="text-sm font-medium text-white">AI Business Assistant</h3>
          </div>
          <div className="p-4 space-y-4">
            {aiInsights.map((insight, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="shrink-0 mt-0.5" style={{ color: insight.color }}>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <polygon points="10,0 12.5,7 20,8 14.5,13 16,20 10,16.5 4,20 5.5,13 0,8 7.5,7" />
                  </svg>
                </span>
                <p className="text-sm text-zinc-400">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
