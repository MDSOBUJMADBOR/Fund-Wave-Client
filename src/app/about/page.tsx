"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HeartHandshake,
  ShieldCheck,
  Users,
  Target,
  Sparkles,
  TrendingUp,
  Award,
  Globe2,
  Lock,
  ArrowRight,
  CheckCircle2,
  Rocket,
  Compass,
} from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Community Raised", value: "$500K+", icon: TrendingUp },
    { label: "Active Backers", value: "10,000+", icon: Users },
    { label: "Funded Projects", value: "500+", icon: Rocket },
    { label: "Campaign Success", value: "98%", icon: Award },
  ];

  const coreValues = [
    {
      icon: HeartHandshake,
      title: "Community First",
      description:
        "Every campaign is powered by genuine human connections. We build bridges between dreamers and believers.",
    },
    {
      icon: ShieldCheck,
      title: "Radical Transparency",
      description:
        "Transparent credit ledgers, strict admin screening, and verifiable milestone disbursements protect every single dollar.",
    },
    {
      icon: Lock,
      title: "Guaranteed Escrow Protection",
      description:
        "Pledged credits remain securely guarded until creators confirm contributions. Unapproved pledges are refunded instantly.",
    },
    {
      icon: Globe2,
      title: "Borderless Innovation",
      description:
        "Great ideas are everywhere. We empower creators across Tech, Arts, Education, Health, and Community to make a lasting impact.",
    },
  ];

  const milestones = [
    {
      year: "Phase 1",
      title: "Platform Conception",
      description:
        "Built with a vision to eliminate high middlemen fees and bring 1:1 credit-backed micro-crowdfunding to local and global innovators.",
    },
    {
      year: "Phase 2",
      title: "Escrow & Security Engine",
      description:
        "Architected role-based dashboards for Supporters, Creators, and Administrators with comprehensive contribution approval flows.",
    },
    {
      year: "Phase 3",
      title: "Community Milestone Expansion",
      description:
        "Surpassing 500+ verified campaigns, real-time push notification tracking, and seamless Stripe-backed credit settlements.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FCFBFE] text-slate-800">
      {/* ==================================================
          HERO BANNER
      ================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-100/50 via-white to-transparent pt-16 pb-16 sm:pt-24 sm:pb-20 border-b border-purple-100/60">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-purple-300/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-10 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="pointer-events-none absolute top-1/4 left-10 h-72 w-72 rounded-full bg-pink-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-700 shadow-sm backdrop-blur-md mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-600" />
            <span>Our Mission & Story</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]"
          >
            Empowering Visionaries, <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
              One Wave at a Time
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 max-w-3xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed"
          >
            FundWave is a next-generation crowdfunding ecosystem built to transform groundbreaking ideas into reality. Through transparent credits, verified campaigns, and community trust, we make backing and launching impactful initiatives effortless.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/explorecampaigns"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/25 hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Compass className="h-4 w-4" />
              <span>Explore Campaigns</span>
            </Link>

            <Link
              href="/howitworks"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 transition-all hover:scale-105 active:scale-95"
            >
              <span>How It Works</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ==================================================
          LIVE IMPACT STATS
      ================================================== */}
      <section className="relative -mt-8 z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 rounded-3xl border border-purple-100 bg-white p-6 sm:p-8 shadow-xl shadow-purple-500/5">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center p-3 sm:p-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 mb-3">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================
          MISSION & VISION
      ================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100">
              Why We Exist
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Bridging the Gap Between Ideas and Funding
            </h2>
            <p className="mt-5 text-base text-slate-600 leading-relaxed">
              Traditional fundraising is laden with excessive platform fees, delayed disbursements, and opaque verification. FundWave was engineered from the ground up to solve these fundamental bottlenecks.
            </p>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              By utilizing a standardized 1:1 credit ledger, our platform ensures every supporter knows exactly where their funds go, while creators gain access to an energetic audience ready to champion worthwhile projects.
            </p>

            <div className="mt-8 space-y-3.5">
              {[
                "Zero hidden deduction fees on backer pledges",
                "Instant automated refunds when contributions are declined",
                "Administrative validation ensuring only authentic projects go live",
                "Full-featured creator control center with withdrawal requests",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-1 shadow-2xl">
              <div className="rounded-[22px] bg-white p-8 sm:p-10 space-y-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                  <Target className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  Our Core Purpose
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  &ldquo;To democratize access to capital for creative pioneers, community champions, and humanitarian innovators across the world through a secure, transparent, and vibrant crowdfunding platform.&rdquo;
                </p>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">FundWave Collective</p>
                    <p className="text-xs text-slate-500">Global Crowdfunding Network</p>
                  </div>
                  <span className="text-2xl">🚀</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          CORE VALUES
      ================================================== */}
      <section className="bg-slate-50/70 border-y border-slate-200/70 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
              Guiding Principles
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              The Values That Drive Us
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-500">
              Every feature, policy, and workflow is designed around these foundational pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="group rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 mb-5">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {val.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================================================
          PLATFORM EVOLUTION MILESTONES
      ================================================== */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
            Roadmap & Heritage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How FundWave Has Grown
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            A journey rooted in community empowerment and technological rigor.
          </p>
        </div>

        <div className="space-y-6">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row gap-5 items-start sm:items-center rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-purple-200 transition-all"
            >
              <span className="shrink-0 rounded-xl bg-purple-100 px-3.5 py-1.5 text-xs font-black text-purple-700">
                {m.year}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-slate-900">{m.title}</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {m.description}
                </p>
              </div>
            </div>
          ))}
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
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to Make Waves Together?
            </h2>

            <p className="text-sm sm:text-base text-purple-100">
              Whether you want to back an inspiring project or launch a vision of your own, FundWave provides the tools to ignite change.
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
                <span>Join FundWave</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
