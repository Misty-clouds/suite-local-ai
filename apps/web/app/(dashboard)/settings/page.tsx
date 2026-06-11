"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Check } from "lucide-react";
import Header from "../../../components/Header";
import { useAuth } from "@/components/auth/AuthProvider";
import { fileToDataUrl } from "@/lib/documents-api";

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setAvatar(user.avatarUrl ?? null);
    }
  }, [user]);

  async function pickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      setError("Image must be under 1.5MB");
      return;
    }
    setError(null);
    setAvatar(await fileToDataUrl(file));
  }

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateProfile({ name: name.trim(), avatarUrl: avatar ?? undefined });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save changes");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Header />
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-track-[#0A0A0A] scrollbar-thumb-[#272727]">
        <div className="mx-auto flex w-full max-w-md flex-col items-center pt-8">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border border-[#272727] bg-[#161616]">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src="/assets/images/dummy/img1.jpg"
                alt="Profile"
                fill
                className="object-cover"
              />
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={pickPhoto}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="mt-4 rounded-lg border border-[#272727] bg-[#161616] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#202020]"
          >
            Replace photo
          </button>

          <div className="mt-10 w-full space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-lg border border-[#272727] bg-[#161616] px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400">
                Email address
              </label>
              <input
                value={user?.email ?? ""}
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-[#272727] bg-[#101010] px-4 py-3 text-sm text-zinc-500 outline-none"
              />
            </div>

            {error && <p className="text-[12px] text-[#FF8080]">{error}</p>}

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="mx-auto flex w-44 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saved && !saving && <Check size={14} />}
                {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
