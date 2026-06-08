"use client";

import { useState } from "react";
import {
  X,
  MoreVertical,
  Image as ImageIcon,
  Plus,
  Paperclip,
  CheckSquare,
  ChevronDown,
  MessageCircle,
  Send,
  MoreHorizontal,
  Clock,
  Link as LinkIcon,
  FileText,
} from "lucide-react";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskModal({ isOpen, onClose }: TaskModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6">
      <div className="relative flex w-full max-w-[1000px] max-h-[90vh] flex-col overflow-hidden rounded-xl bg-[#1C1C1C] border border-[#272727] shadow-2xl md:flex-row">
        {/* Header - Absolute Positioned on top */}
        <div className="absolute top-0 left-0 right-0 z-10 flex h-14 items-center justify-between px-4 border-b border-[#272727] bg-[#1C1C1C]/90 backdrop-blur-sm">
          <button className="flex items-center gap-1 rounded bg-[#272727] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#333]">
            To do <ChevronDown size={14} />
          </button>

          <button className="flex items-center gap-2 rounded bg-black/40 px-4 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-black/60 border border-white/5 transition-colors">
            <ImageIcon size={14} /> Upload cover image
          </button>

          <div className="flex items-center gap-1">
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-zinc-400 hover:text-white hover:bg-black/60 transition-colors">
              <MoreVertical size={16} />
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-zinc-400 hover:text-white hover:bg-black/60 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Left Side: Content */}
        <div className="flex flex-1 flex-col overflow-y-auto w-full md:w-3/5 pt-14 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800">
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-xl font-semibold text-white">
                Atlas.inc website redesign and full branding
              </h2>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button className="flex items-center gap-1.5 rounded-full border border-[#272727] bg-transparent px-3 py-1.5 text-xs text-zinc-300 hover:bg-[#272727]">
                <Plus size={14} /> Add
              </button>
              <button className="flex items-center gap-1.5 rounded-full border border-[#272727] bg-transparent px-3 py-1.5 text-xs text-zinc-300 hover:bg-[#272727]">
                <Paperclip size={14} /> Attach
              </button>
              <button className="flex items-center gap-1.5 rounded-full border border-[#272727] bg-transparent px-3 py-1.5 text-xs text-zinc-300 hover:bg-[#272727]">
                <CheckSquare size={14} /> Checklist/Subtasks
              </button>
            </div>

            {/* Members & Date */}
            <div className="flex flex-wrap gap-8">
              <div>
                <span className="block mb-2 text-xs text-zinc-400">
                  Members
                </span>
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-1">
                    <img
                      src="https://i.pravatar.cc/150?u=1"
                      alt="Member"
                      className="w-6 h-6 rounded-full border border-[#1C1C1C] bg-orange-500"
                    />
                    <img
                      src="https://i.pravatar.cc/150?u=2"
                      alt="Member"
                      className="w-6 h-6 rounded-full border border-[#1C1C1C] bg-pink-500"
                    />
                    <img
                      src="https://i.pravatar.cc/150?u=3"
                      alt="Member"
                      className="w-6 h-6 rounded-full border border-[#1C1C1C] bg-blue-500"
                    />
                  </div>
                  <button className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-zinc-500 text-zinc-400 hover:text-white hover:border-zinc-400 ml-1">
                    <Plus size={12} />
                  </button>
                </div>
              </div>

              <div>
                <span className="block mb-2 text-xs text-zinc-400">Date</span>
                <button className="flex items-center gap-2 rounded border border-[#272727] bg-[#161616] px-3 py-1.5 text-xs text-zinc-300 hover:bg-[#222]">
                  Sep 1 - Sep 12, 10:30 AM <ChevronDown size={14} />
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <span className="block mb-2 text-sm text-zinc-300">
                Description
              </span>
              <div className="min-h-[80px] rounded border border-[#272727] bg-transparent p-3 text-sm text-zinc-400 focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500">
                <textarea
                  className="w-full h-full bg-transparent resize-none outline-none"
                  placeholder="This is the description of this project"
                  defaultValue="This is the description of this project"
                />
              </div>
            </div>

            {/* Attachments */}
            <div>
              <div className="flex items-center justify-between border-b border-[#272727] pb-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-white">
                  <Paperclip size={16} /> Attachments
                </div>
                <button className="flex items-center gap-1 rounded bg-[#272727] px-2 py-1 text-xs text-zinc-300 hover:text-white">
                  <Plus size={12} /> Add
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs text-zinc-500">Links</span>
                  <div className="mt-2 flex items-center justify-between group">
                    <div className="flex items-center gap-2 text-blue-400 hover:underline cursor-pointer">
                      <LinkIcon size={14} /> Brand guide
                    </div>
                    <button className="text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between group">
                    <div className="flex items-center gap-2 text-blue-400 hover:underline cursor-pointer">
                      <LinkIcon size={14} /> Logo
                    </div>
                    <button className="text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-zinc-500">Files</span>
                  <div className="mt-2 flex items-center justify-between group">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-red-500/20 text-red-400 shrink-0">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-300 mt-0.5">
                          Product requirement document
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          Added 2hrs ago
                        </p>
                      </div>
                    </div>
                    <button className="text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between group">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-fuchsia-500/20 text-fuchsia-400 shrink-0">
                        <span className="text-[10px] font-bold">JPG</span>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-300 mt-0.5">Invoice</p>
                        <p className="text-[10px] text-zinc-500">
                          Added 2hrs ago
                        </p>
                      </div>
                    </div>
                    <button className="text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Checklist */}
            <div className="pb-8">
              <div className="flex items-center justify-between border-b border-[#272727] pb-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-white">
                  <CheckSquare size={16} /> Task checklist
                </div>
                <button className="flex items-center gap-1 rounded bg-[#272727] px-2 py-1 text-xs text-zinc-300 hover:text-white">
                  <Plus size={12} /> Add task
                </button>
              </div>

              <div className="mb-4 flex items-center gap-3 text-xs text-zinc-400">
                <span>67% done</span>
                <div className="h-1.5 flex-1 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-[#4ADE80] rounded-full"
                    style={{ width: "67%" }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 rounded-lg border border-transparent hover:border-[#272727] p-2 hover:bg-[#161616] group transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-800 accent-blue-500"
                      />
                      <span className="text-sm text-zinc-300 flex-1">
                        Draw wireframes
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                      <div className="flex -space-x-1">
                        {i === 2 ? (
                          <>
                            <img
                              src="https://i.pravatar.cc/150?u=1"
                              alt="Member"
                              className="w-5 h-5 rounded-full border border-[#161616]"
                            />
                            <img
                              src="https://i.pravatar.cc/150?u=2"
                              alt="Member"
                              className="w-5 h-5 rounded-full border border-[#161616]"
                            />
                          </>
                        ) : (
                          <img
                            src="https://i.pravatar.cc/150?u=1"
                            alt="Member"
                            className="w-5 h-5 rounded-full border border-[#161616]"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-1 rounded bg-[#272727] px-1.5 py-0.5 text-[10px] text-zinc-400">
                        Sep 12 <Clock size={10} />
                      </div>
                      <button className="text-zinc-500 hover:text-white">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Comments and Activity */}
        <div className="hidden border-l border-[#272727] bg-[#111111] md:flex md:w-2/5 flex-col pt-14 text-sm relative">
          <div className="p-4 border-b border-[#272727] flex items-center gap-2 text-zinc-300 sticky top-0 z-10 bg-[#111111]">
            <MessageCircle size={16} /> Comments and activity
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800">
            {/* Activity 1 */}
            <div className="flex gap-3">
              <img
                src="https://i.pravatar.cc/150?u=4"
                alt="User"
                className="w-8 h-8 rounded-full border border-[#272727] bg-yellow-500"
              />
              <div>
                <p className="text-zinc-300 text-sm">
                  <span className="font-medium text-white">Giwa Abdullahi</span>{" "}
                  added this card to "To do"
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Sep 2, 2025, 11:06 PM
                </p>
              </div>
            </div>

            {/* Comment 1 */}
            <div className="flex gap-3">
              <img
                src="https://i.pravatar.cc/150?u=4"
                alt="User"
                className="w-8 h-8 rounded-full border border-[#272727] bg-yellow-500"
              />
              <div>
                <p className="text-zinc-300 text-sm">
                  I had issues with the api earlier, but its resolved, you can
                  now continue
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Sep 2, 2025, 11:06 PM
                </p>
              </div>
            </div>

            {/* Activity 2 (Self/Right aligned somewhat based on image, but maybe just normal activity) */}
            <div className="flex gap-3 justify-end text-right">
              <div>
                <p className="text-zinc-300 text-sm">
                  <span className="font-medium text-white">Giwa Abdullahi</span>{" "}
                  added this card to "To do"
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Sep 2, 2025, 11:06 PM
                </p>
              </div>
              <img
                src="https://i.pravatar.cc/150?u=4"
                alt="User"
                className="w-8 h-8 rounded-full border border-[#272727] bg-yellow-500"
              />
            </div>
          </div>

          {/* Comment input area */}
          <div className="p-4 bg-[#111111] border-t border-[#272727] sticky bottom-0 z-10">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Write a comment"
                className="w-full rounded-full border border-[#272727] bg-[#1C1C1C] py-2 pl-4 pr-10 text-sm text-zinc-300 focus:border-zinc-500 focus:outline-none placeholder-zinc-600"
              />
              <button className="absolute right-3 text-zinc-500 hover:text-white">
                <Send size={16} className="rotate-45" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
