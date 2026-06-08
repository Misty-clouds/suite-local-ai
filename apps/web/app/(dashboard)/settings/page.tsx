"use client";

import Image from "next/image";
import Header from "../../../components/Header";

export default function SettingsPage() {
  return (
    <>
      <Header />

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-track-[#0A0A0A] scrollbar-thumb-[#272727]">
        <div className="mx-auto flex w-full max-w-md flex-col items-center pt-8">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border border-[#272727] bg-[#161616]">
            <Image
              src="/assets/images/dummy/img1.jpg"
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>

          <button className="mt-4 rounded-lg border border-[#272727] bg-[#161616] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#202020]">
            Replace photo
          </button>

          <form className="mt-10 w-full space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400">Name</label>
              <input
                defaultValue="giwa"
                className="w-full rounded-lg border border-[#272727] bg-[#161616] px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400">
                Email address
              </label>
              <input
                defaultValue="giwa@gmail.com"
                className="w-full rounded-lg border border-[#272727] bg-[#161616] px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                className="mx-auto flex w-44 justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
