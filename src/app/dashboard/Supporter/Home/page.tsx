"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Heart,
  Clock,
  CheckCircle2,
  Coins,
  Compass,
  CreditCard,
  Sparkles,
  Loader2,
  ArrowUpRight,
  User,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface Contribution {
  _id: string;
  campaign_id?: string;
  campaignId?: string;
  campaign_title: string;
  creator_name?: string;
  creatorName?: string;
  Contribution_amount?: number;
  amount?: number;
  status: string;
  current_date?: string;
  createdAt?: string;
}

interface SupporterStats {
  availableCredits: number;
  totalContributionsCount: number;
  totalPendingContributionsCount: number;
  totalAmountContributed: number;
}

export default function SupporterHomePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [stats, setStats] = useState<SupporterStats>({
    availableCredits: 0,
    totalContributionsCount: 0,
    totalPendingContributionsCount: 0,
    totalAmountContributed: 0,
  });

  const [approvedContributions, setApprovedContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    let ignore = false;

    async function loadSupporterDashboard() {
      if (!user?.email) {
        if (!ignore) setLoading(false);
        return;
      }

      try {
        const userEmail = encodeURIComponent(user.email);

        const [statsRes, contribRes] = await Promise.all([
          fetch(`${API_BASE}/supporters/stats/${userEmail}`),
          fetch(`${API_BASE}/contributions/supporter/${userEmail}?status=approved`),
        ]);

        const [statsData, contribData] = await Promise.all([
          statsRes.json(),
          contribRes.json(),
        ]);

        if (!ignore) {
          if (statsData.success && statsData.data) {
            setStats(statsData.data);
          }
          if (contribData.success && Array.isArray(contribData.data)) {
            setApprovedContributions(contribData.data);
          }
          setLoading(false);
        }
      } catch (err: unknown) {
        console.error("Error loading supporter home:", err);
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadSupporterDashboard();

    return () => {
      ignore = true;
    };
  }, [user?.email, refreshIndex, API_BASE]);

  return (
    <div className="space-y-8 pb-12">
      {/* ==================================================== */}
      {/* WELCOME BANNER & ACTION BAR */}
      {/* ==================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Supporter Dashboard
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
              Hello, {user?.name || "Friend"}!
            </h1>
            <p className="mt-1 text-sm md:text-base text-cyan-100 max-w-xl">
              Thank you for supporting innovative creators and community causes. Here is an overview of your contribution impact.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/Supporter/Purchasecredit"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-cyan-700 shadow-md transition-all hover:bg-cyan-50 hover:shadow-lg active:scale-95"
            >
              <CreditCard className="h-4 w-4" />
              Purchase Credits
            </Link>
            <Link
              href="/dashboard/Supporter/Explorecampaigns"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white border border-white/20 backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
            >
              <Compass className="h-4 w-4" />
              Explore Campaigns
            </Link>
          </div>
        </div>

        {/* Decorative blur elements */}
        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-black/10 blur-2xl" />
      </div>

      {/* ==================================================== */}
      {/* 1. SUPPORTER STATS (3 REQUIRED METRICS) */}
      {/* ==================================================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            Your Contribution Statistics
          </h2>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            <Coins className="h-3.5 w-3.5 text-amber-500" />
            Available Balance: <span className="font-bold text-gray-900">{stats.availableCredits} Credits</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Total Contributions Made */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Total Contributions Made
                </p>
                <h3 className="mt-2 text-3xl font-extrabold text-gray-900">
                  {loading ? <Loader2 className="h-7 w-7 animate-spin text-cyan-600" /> : stats.totalContributionsCount}
                </h3>
                <p className="mt-1 text-xs text-gray-400">Total pledges submitted by you</p>
              </div>
              <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-100">
                <Heart className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-cyan-600">
              <Link href="/dashboard/Supporter/Mycontributions" className="inline-flex items-center gap-1 hover:underline">
                View contribution history <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Total Pending Contributions */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Total Pending Contributions
                </p>
                <h3 className="mt-2 text-3xl font-extrabold text-amber-600">
                  {loading ? <Loader2 className="h-7 w-7 animate-spin text-amber-500" /> : stats.totalPendingContributionsCount}
                </h3>
                <p className="mt-1 text-xs text-gray-400">Awaiting creator review</p>
              </div>
              <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                <Clock className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-amber-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" /> Pending approval
              </span>
            </div>
          </div>

          {/* Card 3: Total Amount Contributed (Approved only) */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Total Amount Contributed
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <h3 className="text-3xl font-extrabold text-emerald-600">
                    {loading ? <Loader2 className="h-7 w-7 animate-spin text-emerald-500" /> : stats.totalAmountContributed}
                  </h3>
                  <span className="text-sm font-semibold text-gray-500">Credits</span>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Sum of your approved contributions
                </p>
              </div>
              <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-emerald-600">
              <span className="flex items-center gap-1">
                Active impact supporting creators
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. APPROVED CONTRIBUTIONS TABLE */}
      {/* ==================================================== */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Approved Contributions</h2>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                {approvedContributions.length} Approved
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Contributions approved by campaign creators that are actively funding projects.
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              setRefreshIndex((k) => k + 1);
            }}
            disabled={loading}
            className="self-start sm:self-auto rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 active:scale-95 transition"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
            <p className="text-sm text-gray-500 font-medium">Loading approved contributions...</p>
          </div>
        ) : approvedContributions.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex min-h-[200px] flex-col items-center justify-center py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-3">
              <Coins className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900">No Approved Contributions Yet</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              When campaign creators approve your pledges, they will be listed here.
            </p>
            <Link
              href="/dashboard/Supporter/Explorecampaigns"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-cyan-700 transition"
            >
              Explore Campaigns To Back
            </Link>
          </div>
        ) : (
          /* TABLE */
          <div className="overflow-x-auto mt-4">
            <table className="w-full min-w-[650px] text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3.5 px-4 rounded-l-xl">Campaign Title</th>
                  <th className="py-3.5 px-4">Contribution Amount</th>
                  <th className="py-3.5 px-4">Creator Name</th>
                  <th className="py-3.5 px-4 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {approvedContributions.map((c) => {
                  const title = c.campaign_title || "Campaign Project";
                  const amount = c.Contribution_amount ?? c.amount ?? 0;
                  const creator = c.creator_name ?? c.creatorName ?? "Creator";

                  return (
                    <tr key={c._id} className="hover:bg-cyan-50/20 transition-colors">
                      {/* Campaign Title */}
                      <td className="py-4 px-4 font-semibold text-gray-900">
                        <span className="block max-w-[280px] truncate" title={title}>
                          {title}
                        </span>
                        <span className="text-xs text-gray-400 font-normal">
                          {c.createdAt || c.current_date
                            ? new Date(c.createdAt || c.current_date || "").toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : ""}
                        </span>
                      </td>

                      {/* Contribution Amount */}
                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-700 border border-emerald-200">
                          <Coins className="h-4 w-4" />
                          <span>{amount}</span>
                          <span className="text-xs font-medium text-emerald-600">Credits</span>
                        </div>
                      </td>

                      {/* Creator Name */}
                      <td className="py-4 px-4 text-gray-700 font-medium">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                            <User className="h-3.5 w-3.5" />
                          </div>
                          <span>{creator}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          Approved
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}