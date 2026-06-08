"use client";

import { useState } from "react";
import { X, ChevronDown, UserPlus, Trash2 } from "lucide-react";
import type { Member } from "./MemberDrawer";

// ─── Add Member Modal ─────────────────────────────────────────────────────────
export const AddMemberModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  if (!isOpen) return null;

  const roles = [
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Designer",
    "Product Manager",
    "DevOps Engineer",
    "QA Engineer",
  ];

  const handleInvite = () => {
    onClose();
    setName("");
    setEmail("");
    setRole("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-[#2a2a2a] bg-[#141414] p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-[#252525] hover:text-white"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        <h2 className="mb-6 text-lg font-semibold text-white">Add Member</h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-[#2e2e2e] bg-[#1a1a1a] px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-zinc-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">Email</label>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[#2e2e2e] bg-[#1a1a1a] px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-zinc-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">Role</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full appearance-none rounded-lg border border-[#2e2e2e] bg-[#1a1a1a] px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-zinc-500"
                style={{ color: role ? "white" : "#52525b" }}
              >
                <option value="" disabled style={{ color: "#52525b" }}>
                  Select a role
                </option>
                {roles.map((r) => (
                  <option key={r} value={r} style={{ color: "white", background: "#1a1a1a" }}>
                    {r}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-7 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-[#2e2e2e] bg-[#1a1a1a] py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-[#222222] hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            <UserPlus size={15} /> Invite
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
export const DeleteMemberModal = ({
  isOpen,
  member,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  member: Member | null;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!isOpen || !member) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-[#2a2a2a] bg-[#141414] p-6 shadow-2xl flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-950/60 ring-1 ring-red-800/50">
          <Trash2 size={20} className="text-red-400" />
        </div>

        <h2 className="mb-1.5 text-base font-semibold text-white">Delete Member</h2>
        <p className="mb-6 text-sm text-zinc-500">
          Are you sure you want to remove{" "}
          <span className="font-medium text-zinc-300">{member.name}</span> from the team? This action cannot be undone.
        </p>

        <div className="flex w-full gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-[#2e2e2e] bg-[#1a1a1a] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#222222]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-700 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
          >
            <Trash2 size={14} /> Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};
