"use client";

import { ArrowLeft, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type ChatMessage = {
  id: number;
  text: string;
  isYou: boolean;
  time: string;
  showYesterday?: boolean;
};

type DividerMessage = {
  id: "divider";
  isDivider: true;
  text: string;
};

type Message = ChatMessage | DividerMessage;

type Discussion = {
  id: string;
  title: string;
  subtitle: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
};

const ChatAvatar = () => (
  <div className="relative shrink-0 flex items-center justify-center mt-1">
    <div className="flex h-9.5 w-9.5 items-center justify-center overflow-hidden rounded-full bg-[#ffcf54] relative">
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mt-3 relative z-10"
      >
        <path
          d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
          fill="#ff748e"
        />
        <path
          d="M12 13C8.68629 13 6 15.6863 6 19V21H18V19C18 15.6863 15.3137 13 12 13Z"
          fill="#0ea5e9"
        />
      </svg>
    </div>
    <div className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#0A0A0A]">
      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
    </div>
  </div>
);

export default function DiscussionsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const discussions = useMemo<Discussion[]>(
    () => [
      {
        id: "api-setup",
        title: "API connection issues",
        subtitle: "Engineering",
        lastMessage: "I am having issues connecting the api to this channel, welp!",
        updatedAt: "9 mins ago",
        unreadCount: 12,
      },
      {
        id: "invoice-bug",
        title: "Invoice totals not matching",
        subtitle: "Finance",
        lastMessage: "Totals look off when discount is applied.",
        updatedAt: "1 hour ago",
        unreadCount: 0,
      },
      {
        id: "ui-feedback",
        title: "Dashboard UI feedback",
        subtitle: "Product",
        lastMessage: "Can we make the cards more compact on mobile?",
        updatedAt: "Yesterday",
        unreadCount: 3,
      },
      {
        id: "support",
        title: "Client support thread",
        subtitle: "Support",
        lastMessage: "We need an ETA for the fix.",
        updatedAt: "2 days ago",
        unreadCount: 0,
      },
    ],
    []
  );

  const messagesByDiscussionId = useMemo<Record<string, Message[]>>(
    () => ({
      "api-setup": [
        {
          id: 1,
          text: "I am having issues connecting the api to this channel, welp!",
          isYou: false,
          time: "9 mins ago",
          showYesterday: true,
        },
        {
          id: 2,
          text: "Which endpoint is failing — auth or the main resource?",
          isYou: true,
          time: "7 mins ago",
        },
        {
          id: 3,
          text: "Auth. Getting 401 even though token is set.",
          isYou: false,
          time: "6 mins ago",
        },
        { id: "divider", isDivider: true, text: "12 NEW MESSAGES" },
        {
          id: 4,
          text: "Double-check the Authorization header format: 'Bearer <token>'.",
          isYou: true,
          time: "2 mins ago",
        },
      ],
      "invoice-bug": [
        {
          id: 1,
          text: "Totals look off when discount is applied.",
          isYou: false,
          time: "1 hour ago",
          showYesterday: true,
        },
        {
          id: 2,
          text: "Can you share a sample invoice?",
          isYou: true,
          time: "55 mins ago",
        },
      ],
      "ui-feedback": [
        {
          id: 1,
          text: "Can we make the cards more compact on mobile?",
          isYou: false,
          time: "Yesterday",
          showYesterday: true,
        },
        {
          id: 2,
          text: "Yes — we can switch to a 1-col layout and reduce padding.",
          isYou: true,
          time: "Yesterday",
        },
      ],
      support: [
        {
          id: 1,
          text: "We need an ETA for the fix.",
          isYou: false,
          time: "2 days ago",
          showYesterday: true,
        },
        {
          id: 2,
          text: "We're investigating; I'll share an update in a couple hours.",
          isYou: true,
          time: "2 days ago",
        },
      ],
    }),
    []
  );

  const selectedDiscussionId = searchParams.get("id");
  const [query, setQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");

  const filteredDiscussions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return discussions;
    return discussions.filter((d) => {
      return (
        d.title.toLowerCase().includes(q) ||
        d.subtitle.toLowerCase().includes(q) ||
        d.lastMessage.toLowerCase().includes(q)
      );
    });
  }, [discussions, query]);

  const selectedDiscussion = useMemo(() => {
    if (!selectedDiscussionId) return null;
    return discussions.find((d) => d.id === selectedDiscussionId) ?? null;
  }, [discussions, selectedDiscussionId]);

  const initialMessages = useMemo(() => {
    if (!selectedDiscussionId) return [];
    return messagesByDiscussionId[selectedDiscussionId] ?? [];
  }, [messagesByDiscussionId, selectedDiscussionId]);

  const openDiscussion = (id: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("id", id);
    router.push(`?${next.toString()}`);
  };

  const closeDiscussionOnMobile = () => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("id");
    const qs = next.toString();
    router.push(qs ? `?${qs}` : "?");
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <div
        className={
          selectedDiscussionId
            ? "hidden md:flex md:w-90 md:flex-col md:border-r md:border-[#272727]"
            : "flex w-full flex-col md:w-90 md:border-r md:border-[#272727]"
        }
      >
        <div className="px-6 pt-7 pb-4">
          <div className="text-lg font-semibold text-white">Discussions</div>
          <div className="mt-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search discussions"
              className="w-full rounded-xl border border-[#272727] bg-[#161616] px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-[#0A0A0A] scrollbar-thumb-[#272727] px-3 pb-6">
          <div className="flex flex-col gap-2">
            {filteredDiscussions.length === 0 ? (
              <div className="px-3 py-10 text-center text-sm text-zinc-500">
                No discussions found.
              </div>
            ) : (
              filteredDiscussions.map((d) => {
                const active = d.id === selectedDiscussionId;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => openDiscussion(d.id)}
                    className={
                      active
                        ? "w-full rounded-2xl border border-[#2E2E32] bg-[#161616] px-4 py-4 text-left"
                        : "w-full rounded-2xl border border-transparent bg-transparent px-4 py-4 text-left hover:bg-[#161616]/60"
                    }
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        <ChatAvatar />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-white">
                              {d.title}
                            </div>
                            <div className="truncate text-xs text-zinc-500">
                              {d.subtitle}
                            </div>
                          </div>
                          <div className="shrink-0 text-xs text-zinc-500">
                            {d.updatedAt}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <div className="min-w-0 truncate text-sm text-zinc-400">
                            {d.lastMessage}
                          </div>
                          {d.unreadCount > 0 && (
                            <div className="shrink-0 rounded-full bg-[#2E2E32] px-2.5 py-1 text-[11px] font-medium text-zinc-200">
                              {d.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div
        className={
          selectedDiscussionId
            ? "flex min-w-0 flex-1 flex-col overflow-hidden relative"
            : "hidden md:flex md:min-w-0 md:flex-1 md:flex-col md:overflow-hidden md:relative"
        }
      >
        <div className="border-b border-[#272727] px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={closeDiscussionOnMobile}
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#272727] bg-[#161616] text-zinc-200 hover:bg-[#202020]"
              aria-label="Back to discussions"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">
                {selectedDiscussion?.title ?? "Select a discussion"}
              </div>
              <div className="truncate text-xs text-zinc-500">
                {selectedDiscussion?.subtitle ?? "Pick a thread to see details"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-[#0A0A0A] scrollbar-thumb-[#272727] px-6 sm:px-8 py-8 pb-32">
          {selectedDiscussionId ? (
            <div className="flex flex-col space-y-7">
              {initialMessages.map((msg) => {
                if ("isDivider" in msg) {
                  return (
                    <div
                      key={msg.id}
                      className="w-full bg-[#202020]/60 py-2.5 text-center text-xs font-medium text-zinc-400 rounded-sm"
                    >
                      {msg.text}
                    </div>
                  );
                }

                if (msg.isYou) {
                  return (
                    <div
                      key={msg.id}
                      className="flex gap-3 justify-end relative pl-10 sm:pl-20"
                    >
                      <div className="flex flex-col items-end">
                        <div className="mb-0.5 text-xs text-zinc-500">
                          Giwa Abdullahi (You) • {msg.time}
                        </div>
                        <div className="text-[14px] text-zinc-300">{msg.text}</div>
                      </div>
                      <ChatAvatar />
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className="flex gap-3 relative pr-10 sm:pr-20">
                    <ChatAvatar />
                    <div className="flex flex-col">
                      <div className="mb-0.5 text-xs text-zinc-500">
                        Giwa Abdullahi • {msg.time}
                      </div>
                      <div className="text-[14px] text-zinc-300">{msg.text}</div>
                    </div>
                    {msg.showYesterday && (
                      <div className="absolute right-0 top-1 rounded-full bg-[#2E2E32] px-3.5 py-1 text-[11px] font-medium text-zinc-300">
                        Yesterday
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <div className="max-w-sm text-center">
                <div className="text-sm font-medium text-white">No discussion selected</div>
                <div className="mt-1 text-sm text-zinc-500">
                  Choose a discussion from the list to view messages.
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-[#272727] bg-[#0A0A0A] p-4 sm:p-6">
          <div className="mx-auto max-w-200 relative">
            <input
              type="text"
              placeholder={
                selectedDiscussionId ? "Write a comment" : "Select a discussion to reply"
              }
              disabled={!selectedDiscussionId}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="w-full rounded-full bg-[#222222] py-2 pl-3 pr-8 text-sm text-white placeholder:text-[#6E7B82] focus:border-zinc-500 focus:outline-none disabled:opacity-60"
            />
            <button
              type="button"
              disabled={!selectedDiscussionId || !messageInput.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#DEDEDE] hover:text-white transition-colors disabled:text-[#656565]"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
