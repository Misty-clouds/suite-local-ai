"use client";

import { useState } from "react";
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import Header from "../../../components/Header";
import Pagination from "../../../components/Pagination";
import { MemberAvatar } from "./components/MemberAvatar";
import { MemberDrawer, type Member } from "./components/MemberDrawer";
import { ActionDropdown } from "./components/ActionDropdown";
import { AddMemberModal, DeleteMemberModal } from "./components/MemberModals";

// ─── Seed Data ────────────────────────────────────────────────────────────────
const memberEmails = [
  "giwa@gmail.com", "taoheed@neotech.io", "sarah@neotech.io",
  "alex@neotech.io", "mike@neotech.io", "lisa@neotech.io",
  "james@neotech.io", "emma@neotech.io", "chris@neotech.io",
  "anna@neotech.io", "john@neotech.io", "kate@neotech.io",
];

const seedMembers: Member[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: "Neotech Solutions",
  email: memberEmails[i] ?? "member@neotech.io",
  role: "Full stack developer",
  projectsAssigned: 12,
  status: "Active",
  avatarColor: "#ffcf54",
  avatarInitial: "N",
  addedOn: "25 Jan, 2025",
}));

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TeamsPage() {
  const [members, setMembers] = useState<Member[]>(seedMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; member: Member | null }>({
    open: false,
    member: null,
  });
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [drawerMember, setDrawerMember] = useState<Member | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleRow = (id: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedRows.size === paginated.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginated.map((m) => m.id)));
    }
  };

  const handleDelete = () => {
    if (!deleteModal.member) return;
    setMembers((prev) => prev.filter((m) => m.id !== deleteModal.member!.id));
    if (drawerMember?.id === deleteModal.member.id) setDrawerMember(null);
  };

  const openDeleteFor = (member: Member) => {
    setDeleteModal({ open: true, member });
  };

  return (
    <>
      <Header />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 border-b border-[#272727] px-6 py-3.5">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search name, role"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-[#272727] bg-transparent py-2 pl-9 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-zinc-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-lg border border-[#272727] bg-transparent px-3.5 py-2 text-sm text-zinc-400 transition-colors hover:bg-[#161616] hover:text-white">
              <Filter size={14} /> Filter
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-[#272727] bg-transparent px-3.5 py-2 text-sm text-zinc-400 transition-colors hover:bg-[#161616] hover:text-white">
              <ArrowUpDown size={14} /> Sort
            </button>
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
            >
              <Plus size={15} /> New member
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-[#0A0A0A] scrollbar-thumb-[#272727]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#1e1e1e]">
                <th className="w-10 px-5 py-3.5 text-left">
                  <input
                    type="checkbox"
                    checked={paginated.length > 0 && selectedRows.size === paginated.length}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border border-[#3a3a3a] bg-[#1a1a1a] accent-blue-500 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-medium text-zinc-500 w-72">Name</th>
                <th className="px-4 py-3.5 text-left text-xs font-medium text-zinc-500">Role</th>
                <th className="px-4 py-3.5 text-left text-xs font-medium text-zinc-500">Project assigned</th>
                <th className="px-4 py-3.5 text-left text-xs font-medium text-zinc-500">Status</th>
                <th className="px-4 py-3.5 text-left text-xs font-medium text-zinc-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((member) => (
                <tr
                  key={member.id}
                  onClick={() => setDrawerMember(member)}
                  className={`border-b border-[#1a1a1a] cursor-pointer transition-colors hover:bg-[#111111] ${
                    drawerMember?.id === member.id ? "bg-[#131313]" : ""
                  }`}
                >
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedRows.has(member.id)}
                      onChange={() => toggleRow(member.id)}
                      className="h-4 w-4 rounded border border-[#3a3a3a] bg-[#1a1a1a] accent-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <MemberAvatar initial={member.avatarInitial} color={member.avatarColor} />
                      <span className="text-sm font-medium text-white">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-zinc-400">{member.role}</td>
                  <td className="px-4 py-3.5 text-sm text-zinc-400">{member.projectsAssigned}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${
                        member.status === "Active"
                          ? "bg-emerald-950/60 text-emerald-400 ring-1 ring-emerald-800/50"
                          : "bg-zinc-800/60 text-zinc-400 ring-1 ring-zinc-700/50"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <ActionDropdown
                      onEdit={() => setDrawerMember(member)}
                      onDelete={() => openDeleteFor(member)}
                    />
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-sm text-zinc-600">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <MemberDrawer
        member={drawerMember}
        onClose={() => setDrawerMember(null)}
        onEdit={(m) => setDrawerMember(m)}
        onDelete={(m) => openDeleteFor(m)}
      />

      <AddMemberModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} />
      <DeleteMemberModal
        isOpen={deleteModal.open}
        member={deleteModal.member}
        onClose={() => setDeleteModal({ open: false, member: null })}
        onConfirm={handleDelete}
      />
    </>
  );
}
