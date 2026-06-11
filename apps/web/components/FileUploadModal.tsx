"use client";

import { useRef, useState } from "react";
import { X, UploadCloud, FileText, ImageIcon, Loader2, Trash2 } from "lucide-react";
import { documentsApi, fileToDataUrl } from "@/lib/documents-api";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded?: () => void;
}

const MAX_BYTES = 4 * 1024 * 1024; // 4MB per file

function prettySize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function FileUploadModal({
  isOpen,
  onClose,
  onUploaded,
}: FileUploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [url, setUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  function addFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);
    const tooBig = incoming.find((f) => f.size > MAX_BYTES);
    if (tooBig) {
      setError(`"${tooBig.name}" is over 4MB`);
      return;
    }
    setError(null);
    setFiles((prev) => [...prev, ...incoming]);
  }

  function reset() {
    setFiles([]);
    setUrl("");
    setError(null);
  }

  async function handleUpload() {
    if (uploading) return;
    if (files.length === 0 && !url.trim()) {
      setError("Choose a file or add a URL");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      for (const file of files) {
        const dataUrl = await fileToDataUrl(file);
        await documentsApi.create({
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl,
        });
      }
      if (url.trim()) {
        await documentsApi.create({
          name: url.split("/").pop() || url.trim(),
          sourceUrl: url.trim(),
        });
      }
      onUploaded?.();
      reset();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-[480px] rounded-[1.5rem] border border-app-border bg-app-surface p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium tracking-wide text-white">
              File Upload
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Choose a file and upload securely to proceed.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-500 transition-colors hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,application/pdf,video/mp4"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />

        {/* Drag & Drop Area */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          className={`mb-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed bg-app-card p-8 transition-colors ${
            dragging ? "border-blue-500 bg-blue-500/5" : "border-app-border hover:border-zinc-500"
          }`}
        >
          <UploadCloud size={40} className="mb-3 text-zinc-500" />
          <h3 className="mb-2 text-[15px] font-medium text-white">
            Drag and drop your files
          </h3>
          <p className="mb-5 text-[13px] uppercase tracking-wide text-zinc-500">
            JPEG, PNG, PDF, and MP4 — up to 4MB
          </p>
          <span className="rounded-xl border border-app-border bg-app-surface px-5 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white">
            Select file
          </span>
        </div>

        {/* Selected files */}
        {files.length > 0 && (
          <div className="mb-4 flex flex-col gap-2">
            {files.map((f, i) => {
              const isImage = f.type.startsWith("image/");
              return (
                <div
                  key={f.name + i}
                  className="flex items-center gap-3 rounded-xl border border-app-border bg-app-card px-3 py-2"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#1c1c1c] text-zinc-400">
                    {isImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={URL.createObjectURL(f)}
                        alt={f.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FileText size={16} />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[13px] text-white">
                      {f.name}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {prettySize(f.size)}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setFiles((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="text-zinc-500 hover:text-[#FF8080]"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* URL Upload */}
        <div className="mb-6">
          <label className="mb-3 block text-[15px] font-medium text-white">
            or upload from URL
          </label>
          <div className="relative flex items-center">
            <ImageIcon
              size={16}
              className="absolute left-4 text-zinc-500"
            />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Add file URL"
              className="w-full rounded-xl border border-app-border bg-app-card py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
            />
          </div>
        </div>

        {error && <p className="mb-4 text-[12px] text-[#FF8080]">{error}</p>}

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-app-border py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading || (files.length === 0 && !url.trim())}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#045DDF] py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#034BBB] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading && <Loader2 size={15} className="animate-spin" />}
            {uploading ? "Uploading…" : "Attach file(s)"}
          </button>
        </div>
      </div>
    </div>
  );
}
