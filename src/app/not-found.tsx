"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  ArrowLeft,
  Compass,
  Search,
  Sparkles,
  LifeBuoy,
  Flame,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative min-h-[75vh] w-full overflow-hidden bg-gradient-to-b from-[#FAF8FC] via-white to-[#F5F2FA] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      {/* Background Decorative Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-purple-300/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-10 h-72 w-72 rounded-full bg-pink-200/20 blur-3xl" />

      {/* Grid Pattern overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-700 shadow-sm backdrop-blur-md mb-6"
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-600 animate-pulse" />
          <span>Error 404 • Page Missing</span>
        </motion.div>

        {/* Large 404 Typography with Gradient */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative select-none"
        >
          <h1 className="text-8xl sm:text-9xl font-black tracking-tighter bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center opacity-10 blur-xl bg-gradient-to-r from-purple-600 to-pink-600 text-8xl sm:text-9xl font-black">
            404
          </div>
        </motion.div>

        {/* Heading & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3 mt-4"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Lost in the Waves?
          </h2>
          <p className="max-w-lg mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
            The page you are looking for may have been relocated, removed, or never existed. Don&apos;t worry, you can easily find your way back!
          </p>
        </motion.div>

        {/* Primary CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-600/25 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-purple-600/30 transition-all active:scale-95"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/explorecampaigns"
            className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50/80 px-5 py-3 text-sm font-semibold text-purple-700 hover:bg-purple-100 transition-all active:scale-95"
          >
            <Compass className="h-4 w-4" />
            <span>Explore Campaigns</span>
          </Link>
        </motion.div>

        {/* Quick Help / Useful Destinations */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 pt-8 border-t border-slate-200/70"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Popular Destinations
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left">
            <Link
              href="/explorecampaigns"
              className="group flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-purple-200 hover:shadow-md transition-all"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Flame className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                  Top Campaigns
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  Explore trending ideas
                </p>
              </div>
            </Link>

            <Link
              href="/howitworks"
              className="group flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-md transition-all"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Search className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  How It Works
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  Simple 4-step guide
                </p>
              </div>
            </Link>

            <Link
              href="/contact"
              className="group flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-pink-200 hover:shadow-md transition-all"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                <LifeBuoy className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 group-hover:text-pink-600 transition-colors">
                  Contact Support
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  We are here to help
                </p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
