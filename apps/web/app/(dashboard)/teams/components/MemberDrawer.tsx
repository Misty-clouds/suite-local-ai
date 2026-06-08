"use client";

import { useState } from "react";
import { X, Pencil, Trash2 } from "lucide-react";
import Pagination from "../../../../components/Pagination";
import { LetterAvatar } from "./MemberAvatar";

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  projectsAssigned: number;
  status: "Active" | "Inactive";
  avatarColor: string;
  avatarInitial: string;
  addedOn: string;
}

type ProjectStatus = "To do" | "In progress" | "On hold" | "Cancelled" | "Under review" | "Overdue";
type ProjectPriority = "Low" | "Medium" | "High";

interface Project {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
}

const statusStyles: Record<ProjectStatus, string> = {
  "To do": "text-zinc-300",
  "In progress": "text-blue-400",
  "On hold": "text-zinc-400",
  Cancelled: "text-red-400",
  "Under review": "text-amber-400",
  Overdue: "text-orange-400",
};

const priorityStyles: Record<ProjectPriority, string> = {
  Low: "bg-zinc-800/70 text-zinc-400 ring-1 ring-zinc-700/50",
  Medium: "bg-[#2a2a18]/80 text-yellow-500 ring-1 ring-yellow-800/40",
  High: "bg-red-950/60 text-red-400 ring-1 ring-red-800/50",
};

const seedProjects: Project[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: "Atlas.inc website redesign and full b...",
  description: "A dual bar chart showing revenue (green) vs expens...",
  status: (["To do", "In progress", "On hold", "Cancelled", "Under review", "Overdue"] as ProjectStatus[])[i % 6],
  priority: (["Low", "Medium", "High"] as ProjectPriority[])[i % 3],
}));

const MemberDrawerContent = ({
  member,
  onClose,
  onEdit,
  onDelete,
}: {
  member: Member;
  onClose: () => void;
  onEdit: (m: Member) => void;
  onDelete: (m: Member) => void;
}) => {
  const [projPage, setProjPage] = useState(1);
  const projPageSize = 10;
  const projTotalPages = Math.max(1, Math.ceil(seedProjects.length / projPageSize));
  const projPaginated = seedProjects.slice(
    (projPage - 1) * projPageSize,
    projPage * projPageSize,
  );

  return (
    <>
      {/* Top section */}
      <div className="shrink-0 border-b border-[#1e1e1e] px-5 pt-5 pb-6">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-300">Member details</span>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-[#252525] hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <LetterAvatar initial={member.avatarInitial} />
          <div>
            <p className="text-base font-semibold text-white">{member.name}</p>
            <p className="text-xs text-zinc-500">{member.email}</p>
          </div>
          <span className="mt-1 rounded-full border border-zinc-600 px-3 py-0.5 text-xs text-zinc-300">
            {member.role}
          </span>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => onEdit(member)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#2e2e2e] bg-[#1a1a1a] py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-[#222222] hover:text-white"
          >
            <Pencil size={13} /> Edit
          </button>
          <button
            onClick={() => onDelete(member)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-700 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      {/* Actions section */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <p className="shrink-0 px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
          Actions
        </p>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-[#111111] scrollbar-thumb-[#272727]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#1e1e1e]">
                <th className="px-5 py-2.5 text-left text-xs font-medium text-zinc-600">Project</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-zinc-600">Status</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-zinc-600">Priority</th>
              </tr>
            </thead>
            <tbody>
              {projPaginated.map((p) => (
                <tr key={p.id} className="border-b border-[#181818] hover:bg-[#161616]">
                  <td className="px-5 py-2.5">
                    <p className="truncate max-w-40 text-xs font-medium text-zinc-200">{p.name}</p>
                    <p className="truncate max-w-40 text-[10px] text-zinc-600">{p.description}</p>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`text-xs font-medium ${statusStyles[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium ${priorityStyles[p.priority]}`}>
                      {p.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          page={projPage}
          totalPages={projTotalPages}
          onPageChange={setProjPage}
          size="sm"
          borderClassName="border-[#1e1e1e]"
        />
      </div>

      {/* More section */}
      <div className="shrink-0 border-t border-[#1e1e1e] px-5 py-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">More</p>
        <p className="text-[10px] text-zinc-600">Added on</p>
        <p className="text-sm font-medium text-zinc-300">{member.addedOn}</p>
      </div>
    </>
  );
};

export const MemberDrawer = ({
  member,
  onClose,
  onEdit,
  onDelete,
}: {
  member: Member | null;
  onClose: () => void;
  onEdit: (m: Member) => void;
  onDelete: (m: Member) => void;
}) => {
  const isOpen = !!member;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-105 flex flex-col border-l border-[#222222] bg-[#111111] shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {member && (
          <MemberDrawerContent
            key={member.id}
            member={member}
            onClose={onClose}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </div>
    </>
  );
};

export type { Member };
