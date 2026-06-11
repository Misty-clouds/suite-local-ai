"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Sparkles, X, ArrowUp, Bot } from "lucide-react";
import { useAuth } from "./auth/AuthProvider";
import { agentApi } from "@/lib/agent-api";

interface Message {
  id: number;
  role: "assistant" | "user";
  text: string;
}

const SUGGESTIONS = [
  "Summarise this month's cash flow",
  "Which invoices are overdue?",
  "How much should I set aside for tax?",
];

export default function AiAssistant() {
  const { user } = useAuth();
  const firstName = user?.name?.trim().split(/\s+/)[0] || "there";
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 0,
      role: "assistant",
      text: `Hi ${firstName} 👋 I'm Suite AI. Ask me about your revenue, invoices, budgets, or taxes — or pick a suggestion below.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Keep latest message in view
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    const userMsg: Message = {
      id: nextId.current++,
      role: "user",
      text: trimmed,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setSending(true);
    try {
      const reply = await agentApi.chat(trimmed);
      setMessages((m) => [
        ...m,
        { id: nextId.current++, role: "assistant", text: reply },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: nextId.current++,
          role: "assistant",
          text: "Sorry, I couldn't reach Suite AI right now. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Dialog */}
      {open && (
        <div className="absolute bottom-[72px] right-0 w-[min(92vw,380px)] origin-bottom-right animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex h-[520px] max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-app-border bg-app-card px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-primary text-white">
                  <Bot size={18} />
                </span>
                <div className="leading-tight">
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-app-text-main">
                    Suite AI
                    <Sparkles size={13} className="text-brand-primary-text" />
                  </p>
                  <p className="text-xs text-app-text-muted">Your finance copilot</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-app-text-muted transition-colors hover:bg-app-card-hover hover:text-app-text-main"
                aria-label="Close assistant"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-sm bg-brand-primary text-white"
                        : "rounded-bl-sm bg-app-card text-app-text-light"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-app-card px-3.5 py-3">
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-app-text-muted [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-app-text-muted [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-app-text-muted" />
                    </span>
                  </div>
                </div>
              )}

              {/* Suggestions (only before the first user message) */}
              {messages.length === 1 && (
                <div className="flex flex-col gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-xl border border-app-border bg-app-card px-3.5 py-2.5 text-left text-sm text-app-text-muted transition-colors hover:border-brand-primary/40 hover:bg-app-card-hover hover:text-app-text-main"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-app-border bg-app-card p-3"
            >
              <div className="flex items-end gap-2 rounded-xl border border-app-border bg-app-surface px-3 py-2 focus-within:border-brand-primary/50">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Suite AI…"
                  className="flex-1 bg-transparent py-1 text-sm text-app-text-main placeholder:text-app-text-dim focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-primary text-white transition-opacity disabled:opacity-40"
                  aria-label="Send message"
                >
                  <ArrowUp size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Avatar trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Suite AI" : "Open Suite AI"}
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-app-card shadow-lg ring-1 ring-app-border transition-transform hover:scale-105 active:scale-95"
      >
        {/* pulsing halo */}
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-brand-primary/30" />
        )}
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-primary/20 to-transparent" />

        {open ? (
          <X size={22} className="relative text-app-text-main" />
        ) : (
          <Image
            src="/assets/images/logo-no-bg.png"
            alt="Suite AI"
            width={34}
            height={34}
            className="relative object-contain"
          />
        )}

        {/* sparkle badge */}
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-brand-primary text-white ring-2 ring-app-bg">
            <Sparkles size={11} />
          </span>
        )}
      </button>
    </div>
  );
}
