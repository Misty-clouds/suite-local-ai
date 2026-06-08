"use client";

import { X } from "lucide-react";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FileUploadModal({
  isOpen,
  onClose,
}: FileUploadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-[480px] rounded-[1.5rem] border border-app-border bg-app-surface p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium text-white tracking-wide">
              File Upload
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Choose a file and upload securely to proceed.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drag & Drop Area */}
        <div className="mb-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-app-border bg-app-card p-8 transition-colors hover:border-zinc-500 cursor-pointer">
          <div className="mb-4 flex items-center justify-center opacity-80">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="4" y="2" width="16" height="20" rx="3" fill="#3F3F46" />
              <rect x="8" y="7" width="8" height="2" rx="1" fill="#A1A1AA" />
              <rect x="8" y="11" width="8" height="2" rx="1" fill="#A1A1AA" />
              <rect x="8" y="15" width="5" height="2" rx="1" fill="#A1A1AA" />
              <circle cx="6" cy="8" r="1" fill="#A1A1AA" />
              <circle cx="6" cy="12" r="1" fill="#A1A1AA" />
              <circle cx="6" cy="16" r="1" fill="#A1A1AA" />
            </svg>
          </div>
          <h3 className="mb-2 text-[15px] font-medium text-white">
            Drag and drop your files
          </h3>
          <p className="mb-5 text-[13px] text-zinc-500 uppercase tracking-wide">
            JPEG, PND, PDF, and MP4 formats, up to 50MB
          </p>
          <button className="rounded-xl border border-app-border bg-app-surface px-5 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white">
            Select file
          </button>
        </div>

        {/* URL Upload */}
        <div className="mb-8">
          <label className="mb-3 block text-[15px] font-medium text-white">
            or upload from URL
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Add file URL"
              className="w-full rounded-xl border border-app-border bg-app-card py-3.5 pl-4 pr-24 text-sm text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
            />
            <button className="absolute right-2 top-2 bottom-2 rounded-[10px] border border-app-border bg-app-surface px-5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white">
              Upload
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-app-border py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/5"
          >
            Cancel
          </button>
          <button className="flex-1 rounded-xl bg-brand-primary-muted py-3.5 text-sm font-medium text-brand-primary-text transition-colors cursor-not-allowed">
            Attach file(s)
          </button>
        </div>
      </div>
    </div>
  );
}
