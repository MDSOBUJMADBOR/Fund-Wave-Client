"use client";

import Link from "next/link";
import {
  Bot,
  Sparkles,
  Coins,
  Rocket,
  ShieldCheck,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  Zap,
} from "lucide-react";

export default function AIChatPage() {
  const capabilities = [
    {
      icon: Coins,
      title: "Credit Mechanics",
      desc: "Understand 1:1 USD credit pegging, purchasing with Stripe, and escrow safeguards.",
    },
    {
      icon: Rocket,
      title: "Campaign Guidance",
      desc: "Tips on drafting successful goals, writing stories, and submitting for approval.",
    },
    {
      icon: ShieldCheck,
      title: "Refunds & Security",
      desc: "Learn about automatic backer refunds when pledges are rejected or unfulfilled.",
    },
    {
      icon: HelpCircle,
      title: "Creator Payouts",
      desc: "Detailed instructions on requesting and receiving creator milestone disbursements.",
    },
  ];

  return (
    <div className="relative min-h-[80vh] overflow-hidden bg-gradient-to-b from-purple-50/60 via-white to-purple-50/30 py-16 sm:py-24">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-purple-300/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-700 shadow-sm backdrop-blur-md mb-6">
          <Sparkles className="h-3.5 w-3.5 text-purple-600 animate-pulse" />
          <span>Interactive AI Companion</span>
        </div>

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white shadow-xl shadow-purple-600/30 mb-6">
          <Bot className="h-10 w-10 animate-pulse" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Meet Your <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">FundWave AI</span> Assistant
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
          The floating assistant on the bottom-right is active and ready to guide you. Ask any question about campaign funding, credit transfers, or creator payouts for immediate answers.
        </p>

        {/* Feature Highlights Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left max-w-4xl mx-auto">
          {capabilities.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-purple-300 hover:shadow-md transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Prompt Callout */}
        <div className="mt-12 inline-flex items-center gap-2 rounded-2xl bg-purple-100/70 border border-purple-200 px-5 py-3 text-xs sm:text-sm font-bold text-purple-900 shadow-sm">
          <Zap className="h-4 w-4 text-purple-600" />
          <span>Click the floating bubble at the bottom-right corner to start chatting anytime!</span>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/explorecampaigns"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-purple-600/25 hover:bg-purple-700 transition-all"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Explore Campaigns</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}