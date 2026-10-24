"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  UserPlus,
  Compass,
  HeartHandshake,
  ShieldCheck,
  Rocket,
  Coins,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  Wallet,
  FileCheck,
  RefreshCw,
  Gift,
} from "lucide-react";

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<"supporters" | "creators">("supporters");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const supporterSteps = [
    {
      number: "01",
      title: "Join & Claim Credits",
      description:
        "Register your Supporter account in seconds. Get instant platform access and purchase credits securely to start backing your favorite causes.",
      icon: <UserPlus className="h-6 w-6 text-purple-600" />,
      tag: "Account Setup",
    },
    {
      number: "02",
      title: "Discover Groundbreaking Projects",
      description:
        "Browse verified campaigns across Technology, Art, Community, Education, and Healthcare. Filter by goal, deadline, or urgent causes.",
      icon: <Compass className="h-6 w-6 text-purple-600" />,
      tag: "Explore",
    },
    {
      number: "03",
      title: "Pledge Platform Credits",
      description:
        "Select your contribution amount and submit your pledge. Your credits are held securely until the creator reviews and approves your pledge.",
      icon: <Coins className="h-6 w-6 text-purple-600" />,
      tag: "Safe Pledging",
    },
    {
      number: "04",
      title: "Track Updates & Rewards",
      description:
        "Follow real-time campaign milestones, receive instant push notifications, and enjoy exclusive early backer rewards from the creators.",
      icon: <Gift className="h-6 w-6 text-purple-600" />,
      tag: "Milestones",
    },
  ];

  const creatorSteps = [
    {
      number: "01",
      title: "Draft Your Vision",
      description:
        "Set your funding goal, write your inspiring project story, upload rich banner images, and define exciting backer rewards for supporters.",
      icon: <Rocket className="h-6 w-6 text-indigo-600" />,
      tag: "Campaign Creation",
    },
    {
      number: "02",
      title: "Admin Review & Verification",
      description:
        "Our admin team thoroughly reviews your campaign for authenticity and policy compliance. Once approved, your project goes live worldwide.",
      icon: <FileCheck className="h-6 w-6 text-indigo-600" />,
      tag: "Verification",
    },
    {
      number: "03",
      title: "Manage & Approve Backers",
      description:
        "Review incoming backer contributions in real-time from your Creator Dashboard. Approve pledges to increase your total raised capital.",
      icon: <HeartHandshake className="h-6 w-6 text-indigo-600" />,
      tag: "Backer Engagement",
    },
    {
      number: "04",
      title: "Request Easy Withdrawals",
      description:
        "As funds accumulate, submit withdrawal requests directly to your payment method. Admins process payouts quickly and transparently.",
      icon: <Wallet className="h-6 w-6 text-indigo-600" />,
      tag: "Seamless Payouts",
    },
  ];

  const faqs = [
    {
      question: "How does the FundWave Credit System work?",
      answer:
        "FundWave utilizes a secure credit system where 1 Credit equals $1.00 USD. Supporters can top up credits using our secure Stripe gateway. When you contribute credits to a campaign, they are safely escrowed until the Creator accepts the contribution.",
    },
    {
      question: "What happens if a creator rejects my contribution?",
      answer:
        "Your safety is 100% guaranteed. If a creator rejects a contribution for any reason, the pledged credits are refunded immediately and automatically back into your platform balance with zero penalty fees.",
    },
    {
      question: "How long does campaign approval take?",
      answer:
        "Our dedicated administrative team reviews submitted campaigns within 24 to 48 hours. You will receive an instant notification in your dashboard bell icon as soon as your campaign is approved or if any adjustments are needed.",
    },
    {
      question: "How do creators withdraw their raised funds?",
      answer:
        "Creators can navigate to their Dashboard > Withdrawals, enter their desired credit amount, and submit a withdrawal request. Our finance administrators verify the request and disburse the payout directly to your bank account or payment provider.",
    },
    {
      question: "Can I report a campaign or suspicious activity?",
      answer:
        "Yes! Every campaign page has a Report button where users can flag any concerns. Our safety team investigates flagged campaigns immediately to ensure community trust.",
    },
  ];

  const currentSteps = activeTab === "supporters" ? supporterSteps : creatorSteps;

  return (
    <div className="min-h-screen bg-[#FCFBFE] text-slate-800">
      {/* ==================================================
          HERO SECTION
      ================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-100/40 via-white to-transparent pt-16 pb-14 sm:pt-20 sm:pb-18 border-b border-purple-100/60">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-purple-300/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-10 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-700 shadow-sm backdrop-blur-md mb-5"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-600" />
            <span>Platform Workflow Guide</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]"
          >
            How <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">FundWave</span> Powers Ideas
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed"
          >
            A transparent, credit-powered ecosystem connecting visionary creators with generous supporters. See how simple it is to launch, pledge, and bring dreams into reality.
          </motion.p>

          {/* Interactive Role Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 inline-flex items-center rounded-2xl bg-slate-100 p-1.5 shadow-inner border border-slate-200/70"
          >
            <button
              onClick={() => setActiveTab("supporters")}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all cursor-pointer ${
                activeTab === "supporters"
                  ? "bg-white text-purple-700 shadow-md shadow-purple-600/10"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <HeartHandshake className="h-4 w-4 text-purple-600" />
              <span>For Supporters</span>
            </button>

            <button
              onClick={() => setActiveTab("creators")}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all cursor-pointer ${
                activeTab === "creators"
                  ? "bg-white text-indigo-700 shadow-md shadow-indigo-600/10"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Rocket className="h-4 w-4 text-indigo-600" />
              <span>For Creators</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ==================================================
          STEP-BY-STEP WORKFLOW
      ================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
            {activeTab === "supporters" ? "Supporter Journey" : "Creator Roadmap"}
          </p>
          <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Four Simple Steps to Success
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            {activeTab === "supporters"
              ? "From creating your account to unlocking rewards, here is how you make an impact."
              : "From formulating your campaign idea to taking cash payouts to your bank."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <AnimatePresence mode="wait">
            {currentSteps.map((step, idx) => (
              <motion.div
                key={`${activeTab}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`flex h-13 w-13 items-center justify-center rounded-2xl transition-colors duration-300 ${
                        activeTab === "supporters"
                          ? "bg-purple-50 group-hover:bg-purple-600 group-hover:text-white"
                          : "bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white"
                      }`}
                    >
                      {step.icon}
                    </div>

                    <span className="text-4xl font-black text-slate-200 transition-colors group-hover:text-purple-200">
                      {step.number}
                    </span>
                  </div>

                  <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-3">
                    {step.tag}
                  </span>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors leading-snug">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-purple-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Step {idx + 1} of 4</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ==================================================
          CREDIT SYSTEM EXPLAINER
      ================================================== */}
      <section className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-950 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-purple-200 backdrop-blur-md">
              <Coins className="h-3.5 w-3.5 text-amber-300" />
              Transparent Economics
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              The FundWave Credit System
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Say goodbye to complicated conversions and opaque handling. Here is why our backer credit escrow protects both sides of every transaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300 mb-4">
                <Coins className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1:1 Value Peg</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                1 FundWave Credit equals exactly $1.00 USD. Top up your wallet in seconds with no hidden platform markup or foreign exchange surprises.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300 mb-4">
                <RefreshCw className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Refund Protection</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                If a creator rejects your pledge or if a campaign fails verification, your credits immediately return to your balance ready to support other dreams.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-400/20 text-purple-300 mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Verified Admin Payouts</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Creators request payouts upon reaching milestones. Every disbursement goes through administrative screening before money leaves platform escrow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          FAQ SECTION
      ================================================== */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12 space-y-2">
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-purple-600">
            <HelpCircle className="h-3.5 w-3.5" />
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Have Questions? We Have Answers.
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            Everything you need to know about navigating the FundWave platform.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left text-base font-bold text-slate-900 hover:text-purple-600 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-purple-600" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================
          CALL TO ACTION (CTA)
      ================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 p-8 sm:p-12 text-center text-white shadow-2xl">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-pink-500/20 blur-2xl" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <TrendingUp className="h-3.5 w-3.5 text-amber-300" />
              Ready to Dive In?
            </span>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Start Backing or Launching Today
            </h2>

            <p className="text-sm sm:text-base text-purple-100">
              Join thousands of creators and supporters building meaningful initiatives and shaping tomorrow.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/explorecampaigns"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-purple-900 shadow-lg hover:bg-purple-50 transition-all hover:scale-105 active:scale-95"
              >
                <Compass className="h-4 w-4 text-purple-600" />
                <span>Explore Campaigns</span>
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white shadow-lg backdrop-blur-md hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
              >
                <span>Create an Account</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}