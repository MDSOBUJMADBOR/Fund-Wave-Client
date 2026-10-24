"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { usePathname } from "next/navigation";
import {
  Bot,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Minimize2,
  Maximize2,
  HelpCircle,
  Coins,
  Rocket,
  ShieldCheck,
  Loader2,
} from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_QUESTIONS = [
  { icon: Coins, text: "How do platform credits work?" },
  { icon: Rocket, text: "How can I launch a campaign?" },
  { icon: ShieldCheck, text: "How do refunds and escrow work?" },
  { icon: HelpCircle, text: "How do creators withdraw funds?" },
];

export default function AIChatBox() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! 👋 I am your FundWave AI Assistant. How can I help you with campaigns, credits, or withdrawals today?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Automatically open the chat when user navigates directly to /aichat
  useEffect(() => {
    if (pathname === "/aichat") {
      startTransition(() => {
        setIsOpen(true);
      });
    }
  }, [pathname]);

  // Auto-scroll to the bottom of the conversation
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  const sendMessage = async (overrideMessage?: string) => {
    const textToSend = (overrideMessage || input).trim();
    if (!textToSend || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: textToSend }]);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate AI response");
      }

      const botReply =
        data.reply ||
        "I am here to help! Could you please clarify your question regarding FundWave?";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: botReply,
        },
      ]);
    } catch (error: unknown) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I had trouble connecting to the assistant. On FundWave: 1 Credit = $1.00 USD, contributions are held safely in escrow, and creators can withdraw upon reaching milestones!",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Chat reset! 👋 How can I help you with campaigns, credits, or withdrawals?",
      },
    ]);
  };

  return (
    <>
      {/* ==================================================
          ALWAYS-VISIBLE FLOATING LAUNCHER (BOTTOM-RIGHT)
      ================================================== */}
      {!isOpen && (
        <aside
          aria-label="FundWave AI Assistant"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
        >
          {/* Helpful callout pill */}
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 rounded-full border border-purple-200/80 bg-white/95 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xl shadow-purple-500/10 backdrop-blur-md hover:text-purple-600 hover:border-purple-300 transition-all cursor-pointer hover:scale-105"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-600 animate-pulse" />
            <span>Ask FundWave AI</span>
          </div>

          {/* Floating Circle Button */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Chat Assistant"
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white shadow-2xl shadow-purple-600/40 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          >
            {/* Pulsing Outer Glow */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 opacity-40 blur-sm group-hover:opacity-75 transition-opacity animate-pulse" />

            <Bot className="relative z-10 h-7 w-7 transition-transform duration-300 group-hover:rotate-12" />

            {/* Online Green Indicator Dot */}
            <span className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
          </button>
        </aside>
      )}

      {/* ==================================================
          EXPANDABLE CHAT MODAL / POPUP
      ================================================== */}
      {isOpen && (
        <section
          aria-label="AI Chat Assistant Window"
          className={`fixed bottom-5 right-5 z-50 flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl transition-all duration-300 ${
            isExpanded
              ? "h-[700px] w-[500px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-40px)]"
              : "h-[560px] w-[380px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-40px)]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 px-5 py-4 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-md">
                <Bot className="h-6 w-6" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-purple-700 bg-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-extrabold tracking-tight">
                    FundWave AI
                  </h2>
                  <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-400/30">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-purple-200">
                  Instant Crowdfunding Answers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Reset Messages */}
              <button
                onClick={handleResetChat}
                title="Reset conversation"
                className="rounded-xl p-1.5 text-purple-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                aria-label="Reset chat"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              {/* Expand / Minimize Toggle */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse" : "Expand"}
                className="hidden sm:inline-flex rounded-xl p-1.5 text-purple-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                aria-label="Toggle size"
              >
                {isExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="rounded-xl p-1.5 text-purple-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/70 p-4">
            {messages.map((message, index) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={index}
                  className={`flex items-end gap-2 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xs shadow-xs mb-1">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-xs"
                        : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}

            {/* Typing Loader Indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-purple-700 bg-white border border-purple-100 px-3.5 py-2.5 rounded-2xl w-fit shadow-xs">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Thinking & analyzing platform data...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips (Visible when chat is young) */}
          {messages.length <= 2 && !loading && (
            <div className="bg-white border-t border-slate-100 p-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
                Suggested Questions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_QUESTIONS.map((q, idx) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => sendMessage(q.text)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-purple-100 bg-purple-50/70 px-2.5 py-1 text-[11px] font-semibold text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer"
                    >
                      <Icon className="h-3 w-3 text-purple-600" />
                      <span>{q.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-slate-200 bg-white p-3">
            <div className="flex items-end gap-2 rounded-2xl bg-slate-50 border border-slate-200 p-1.5 focus-within:border-purple-500 focus-within:bg-white focus-within:ring-3 focus-within:ring-purple-100 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about credits, campaigns, rules..."
                rows={1}
                disabled={loading}
                className="flex-1 max-h-24 min-h-[38px] resize-none bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none"
              />

              <button
                type="button"
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-slate-400">
              Press <kbd className="font-mono bg-slate-100 px-1 rounded">Enter</kbd> to send • Powered by FundWave AI
            </p>
          </div>
        </section>
      )}
    </>
  );
}