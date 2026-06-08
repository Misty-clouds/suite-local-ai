"use client";
import { Clock, CheckCircle2, Users as UsersIcon, Trophy, Plus, Bell } from "lucide-react";
import { FaRobot } from "react-icons/fa";
import { useState } from "react";
import { LuSparkle } from "react-icons/lu";
import { FaRegLightbulb } from "react-icons/fa";
export default function RightPanel({ isEmpty = false }: { isEmpty?: boolean }) {
  const [filter, setFilter] = useState("1W");

  const clients = [
    { name: "Atlas.inc", value: 12000, max: 15000, color: "#FFB700" },
    { name: "Novatech", value: 8000, max: 15000, color: "#909090" },
    { name: "Greyline", value: 8000, max: 15000, color: "#E26A00" },
  ];

  const activities = [
    {
      id: 1,
      type: "Task finished",
      title: 'Giwa just marked "Cloudsuites website redesign" as completed',
      time: "3hr ago",
      icon: CheckCircle2,
      color: "bg-blue-500",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    {
      id: 2,
      type: "Invoice paid",
      title: "Invoice INV8409 has been paid, $2,400 added to your revenue",
      time: "3hr ago",
      icon: CheckCircle2,
      color: "bg-blue-500",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    {
      id: 3,
      type: "Proposal drafted",
      title: 'Giwa just marked "Cloudsuites website redesign" as completed',
      time: "3hr ago",
      icon: CheckCircle2,
      color: "bg-blue-500",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
    },
    {
      id: 4,
      type: "Task finished",
      title: 'Giwa just marked "Cloudsuites website redesign" as completed',
      time: "3hr ago",
      icon: CheckCircle2,
      color: "bg-blue-500",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
  ];

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
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-[#161616] rounded-[7px]">
              <div className="mb-4 flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-[#1C1C1C] border border-[#2A2A2A] text-zinc-400">
                <LuSparkle size={20} />
              </div>
              <p className="text-[13px] leading-relaxed text-[#6E7B82] max-w-[220px]">
                Add projects and connect financials to unlock AI-powered insights about your business.
              </p>
            </div>
          ) : (
            <>
              {/* AI Business Assistant */}
              <div className="bg-[#161616] p-2 rounded-[7px]">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-400 text-xs">
                <FaRegLightbulb size={14} />
                <span>AI Business Assistant</span>
              </div>
              <div className="flex border border-zinc-800 rounded bg-[#0A0A0A] p-0.5">
                {["1M", "1W", "1D"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-2 py-0.5 text-[10px] rounded ${filter === f ? "bg-[#222] text-white" : "text-zinc-500 hover:text-white"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex gap-1.5 text-xs text-[#6E7B82]">
                <div className="mt-0.5">
                  <LuSparkle size={12} className="text-green-500" />
                </div>
                <p>Top client by revenue: Atlas Inc. ($12,500)</p>
              </div>
              <div className="flex gap-3 text-xs text-[#6E7B82]">
                <div className="mt-0.5">
                  <LuSparkle size={12} className="text-green-500" />
                </div>
                <p>3 projects are nearing deadline within 5 days</p>
              </div>
              <div className="flex gap-3 text-xs text-[#6E7B82]">
                <div className="mt-0.5">
                  <LuSparkle size={12} className="text-orange-500" />
                </div>
                <p>
                  You can improve invoice payment time by 20% using
                  auto-reminders.
                </p>
              </div>
            </div>
          </div>
          </>
          )}

          {/* Client Stats */}
          <div className="flex flex-col gap-2 rounded-[7px] bg-[#161616]">
            <div className="flex items-center justify-between text-xs text-zinc-400 bg-[#0C0C0C] p-2 rounded-t-[7px]">
              <div className="flex items-center gap-2">
                <UsersIcon size={14} />
                <span>Client Stats</span>
              </div>
              <div className="flex border border-zinc-800 rounded bg-[#0A0A0A] p-0.5">
                {["1M", "1W", "1D"].map((f) => (
                  <button
                    key={f + "client"}
                    className={`px-2 py-0.5 text-[10px] rounded ${filter === "1W" && f === "1W" ? "bg-[#222] text-white" : "text-zinc-500 hover:text-white"}`} // Just static for demo
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center py-8">
                 <p className="mb-4 text-sm text-[#6E7B82]">No clients yet</p>
                 <button className="text-[13px] text-blue-500 hover:text-blue-400 flex items-center gap-1.5">
                    <Plus size={16} /> Add your first client
                 </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-2">
                {clients.map((client) => (
                <div
                  key={client.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 w-24">
                    {/* Trophy/User Icon placeholder */}
                    <div>
                      <Trophy size={12} color={client.color} />
                    </div>
                    <span className="text-[#6E7B82]">{client.name}</span>
                  </div>
                  <div className="flex-1 mx-3 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-[${client.color}]`}
                      style={{ width: `${(client.value / client.max) * 100}%` }}
                    />
                  </div>
                  <span className="text-white font-medium w-14 text-right">
                    ${client.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Activities */}
      <div className="rounded-lg border border-[#272727] bg-[#222222] shadow-lg flex-1">
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#6E7B82]">
            <Clock size={20} color="#6E7B82" />
            <span className="text-[#DEDEDE]">Activities</span>
          </div>
        </div>

        <div className="space-y-6 relative p-3 h-full">
          {isEmpty ? (
             <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-[#1C1C1C] border border-[#2A2A2A] text-zinc-400">
                   <Bell size={20} />
                </div>
                <p className="text-[13px] leading-relaxed text-[#6E7B82] max-w-[220px]">
                  Your recent activity will appear here once you start working on projects.
                </p>
             </div>
          ) : (
            <>
              {/* Vertical Line */}
              {/* <div className="absolute left-[15px] top-2 bottom-2 w-px bg-zinc-800 -z-10"></div> */}

              {activities.map((activity) => (
            <div key={activity.id} className="flex gap-2 relative">
              <div className="relative mt-1">
                <div className="h-6 w-6 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800 relative z-10">
                  <img
                    src={activity.avatar}
                    alt="User"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-blue-500 border border-[#161616] flex items-center justify-center">
                    {/* Small icon if needed */}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className="text-sm font-semibold text-[#DEDEDE]">
                    {activity.type}
                  </h4>
                  <span className="text-[12px] text-[#6E7B82]">
                    {activity.time}
                  </span>
                </div>
                <p className="text-sm text-[#6E7B82] leading-snug line-clamp-2">
                  {activity.title}
                </p>
              </div>
            </div>
          ))}
          </>
          )}
        </div>
      </div>
    </div>
  );
}

// Icons
