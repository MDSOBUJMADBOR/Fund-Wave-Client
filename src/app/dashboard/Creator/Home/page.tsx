"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Layers,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  Coins,
  PlusCircle,
  Wallet,
  Calendar,
  User,
  MessageSquare,
  FileText,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface Contribution {
  _id: string;
  campaignId: string;
  campaign_title: string;
  creatorEmail: string;
  supporterEmail: string;
  supporterName: string;
  amount: number;
  message?: string;
  status: "pending" | "approved" | "rejected" | string;
  createdAt: string;
}

interface CreatorStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalAmountRaised: number;
  totalWithdrawnCredits: number;
  availableCredits: number;
  withdrawableDollars: number;
}

export default function CreatorHomePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [stats, setStats] = useState<CreatorStats>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalAmountRaised: 0,
    totalWithdrawnCredits: 0,
    availableCredits: 0,
    withdrawableDollars: 0,
  });

  const [pendingContributions, setPendingContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Selected contribution for view modal
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);

  const [refreshIndex, setRefreshIndex] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // ==========================================
  // FETCH STATS AND CONTRIBUTIONS
  // ==========================================
  useEffect(() => {
    let ignore = false;

    async function loadData() {
      if (!user?.email) {
        if (!ignore) setLoading(false);
        return;
      }
      try {
        const userEmailEncoded = encodeURIComponent(user?.email || "");
        const [statsRes, contribRes] = await Promise.all([
          fetch(`${API_BASE}/creators/stats/${userEmailEncoded}`),
          fetch(`${API_BASE}/contributions/creator/${userEmailEncoded}?status=pending`),
        ]);

        const [statsJson, contribJson] = await Promise.all([
          statsRes.json(),
          contribRes.json(),
        ]);

        if (!ignore) {
          if (statsJson.success && statsJson.data) {
            setStats(statsJson.data);
          }
          if (contribJson.success && Array.isArray(contribJson.data)) {
            setPendingContributions(contribJson.data);
          }
          setLoading(false);
        }
      } catch (err: unknown) {
        console.error("Failed to load creator dashboard data:", err);
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [user?.email, refreshIndex, API_BASE]);

  // ==========================================
  // APPROVE CONTRIBUTION
  // ==========================================
  const handleApprove = async (contribution: Contribution) => {
    if (!confirm(`Are you sure you want to approve this contribution of ${contribution.amount} credits?`)) {
      return;
    }

    try {
      setActionLoadingId(contribution._id);

      const res = await fetch(`${API_BASE}/contributions/approve/${contribution._id}`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to approve contribution");
      }

      alert("✅ Contribution approved! Campaign raised credits updated.");

      // Remove from pending list
      setPendingContributions((prev) => prev.filter((item) => item._id !== contribution._id));

      // Update stats locally
      setStats((prev) => ({
        ...prev,
        totalAmountRaised: prev.totalAmountRaised + contribution.amount,
        availableCredits: prev.availableCredits + contribution.amount,
        withdrawableDollars: (prev.availableCredits + contribution.amount) / 20,
      }));

      if (selectedContribution?._id === contribution._id) {
        setSelectedContribution(null);
      }
    } catch (err: unknown) {
      console.error("Approve error:", err);
      const msg = err instanceof Error ? err.message : "Could not approve contribution";
      alert(`Error: ${msg}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // ==========================================
  // REJECT CONTRIBUTION
  // ==========================================
  const handleReject = async (contribution: Contribution) => {
    if (
      !confirm(
        `Are you sure you want to reject this contribution? ${contribution.amount} credits will be refunded back to ${contribution.supporterName}.`
      )
    ) {
      return;
    }

    try {
      setActionLoadingId(contribution._id);

      const res = await fetch(`${API_BASE}/contributions/reject/${contribution._id}`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reject contribution");
      }

      alert("Refund processed and contribution rejected.");

      // Remove from pending list
      setPendingContributions((prev) => prev.filter((item) => item._id !== contribution._id));

      if (selectedContribution?._id === contribution._id) {
        setSelectedContribution(null);
      }
    } catch (err: unknown) {
      console.error("Reject error:", err);
      const msg = err instanceof Error ? err.message : "Could not reject contribution";
      alert(`Error: ${msg}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* ==================================================== */}
      {/* WELCOME BANNER & QUICK ACTIONS */}
      {/* ==================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Creator Control Center
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || "Creator"}!
            </h1>
            <p className="mt-1 text-sm md:text-base text-violet-100 max-w-xl">
              Track your campaigns, review incoming supporter pledges, and withdraw your raised earnings seamlessly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/Creator/Addnewcampaign"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-violet-700 shadow-md transition-all hover:bg-violet-50 hover:shadow-lg active:scale-95"
            >
              <PlusCircle className="h-4 w-4 text-violet-600" />
              Add Campaign
            </Link>
            <Link
              href="/dashboard/Creator/Withdrawals"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white border border-white/20 backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
            >
              <Wallet className="h-4 w-4" />
              Withdrawals
            </Link>
          </div>
        </div>

        {/* Decorative blur elements */}
        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-black/10 blur-2xl" />
      </div>

      {/* ==================================================== */}
      {/* 1. CREATOR STATS CARDS */}
      {/* ==================================================== */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-violet-600" />
          Campaign Performance Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Total Campaigns Count */}
          <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Campaigns Launched</p>
                <h3 className="mt-2 text-3xl font-extrabold text-gray-900">
                  {loading ? <Loader2 className="h-7 w-7 animate-spin text-violet-500" /> : stats.totalCampaigns}
                </h3>
                <p className="mt-1 text-xs text-gray-400">Total campaigns created by you</p>
              </div>
              <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 border border-violet-100">
                <Layers className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-violet-600">
              <Link href="/dashboard/Creator/Mycampaigns" className="inline-flex items-center gap-1 hover:underline">
                View all campaigns <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Active Campaigns */}
          <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
                <h3 className="mt-2 text-3xl font-extrabold text-emerald-600">
                  {loading ? <Loader2 className="h-7 w-7 animate-spin text-emerald-500" /> : stats.activeCampaigns}
                </h3>
                <p className="mt-1 text-xs text-gray-400">Deadline has not passed yet</p>
              </div>
              <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Clock className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-emerald-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live accepting pledges
              </span>
            </div>
          </div>

          {/* Card 3: Total Amount Raised */}
          <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Raised Across Campaigns</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <h3 className="text-3xl font-extrabold text-amber-600">
                    {loading ? <Loader2 className="h-7 w-7 animate-spin text-amber-500" /> : stats.totalAmountRaised}
                  </h3>
                  <span className="text-sm font-semibold text-gray-500">Credits</span>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  ≈ ${(stats.totalAmountRaised / 20).toFixed(2)} USD value (20 credits = $1)
                </p>
              </div>
              <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                <Coins className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-amber-600">
              <Link href="/dashboard/Creator/Withdrawals" className="inline-flex items-center gap-1 hover:underline">
                Withdraw raised earnings <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. CONTRIBUTIONS TO REVIEW */}
      {/* ==================================================== */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Contributions To Review</h2>
              {pendingContributions.length > 0 && (
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 animate-pulse">
                  {pendingContributions.length} Pending
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Supporters who pledged credits to your campaigns awaiting your approval or rejection.
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              setRefreshIndex((prev) => prev + 1);
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
            <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
            <p className="text-sm text-gray-500 font-medium">Loading contributions to review...</p>
          </div>
        ) : pendingContributions.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex min-h-[200px] flex-col items-center justify-center py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-3">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-gray-900">All Caught Up!</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              There are currently no pending contributions to review. When supporters pledge to your campaigns, they will appear here.
            </p>
          </div>
        ) : (
          /* CONTRIBUTIONS TABLE */
          <div className="overflow-x-auto mt-4">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3.5 px-4 rounded-l-xl">Supporter Name</th>
                  <th className="py-3.5 px-4">Campaign Title</th>
                  <th className="py-3.5 px-4">Contribution Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {pendingContributions.map((contribution) => {
                  const isActing = actionLoadingId === contribution._id;

                  return (
                    <tr key={contribution._id} className="hover:bg-violet-50/30 transition-colors">
                      {/* Supporter Name */}
                      <td className="py-4 px-4 font-semibold text-gray-900">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700 font-bold text-xs uppercase">
                            {contribution.supporterName?.charAt(0) || "S"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{contribution.supporterName}</p>
                            <p className="text-xs text-gray-400">{contribution.supporterEmail}</p>
                          </div>
                        </div>
                      </td>

                      {/* Campaign Title */}
                      <td className="py-4 px-4 max-w-[240px]">
                        <p className="font-medium text-gray-800 truncate" title={contribution.campaign_title}>
                          {contribution.campaign_title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(contribution.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </td>

                      {/* Contribution Amount */}
                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 font-bold text-amber-700 border border-amber-200">
                          <Coins className="h-4 w-4" />
                          <span>{contribution.amount}</span>
                          <span className="text-xs font-medium text-amber-600">Credits</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-800">
                          <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-ping" />
                          Pending Review
                        </span>
                      </td>

                      {/* Actionable Buttons */}
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* View Contribution Detail Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedContribution(contribution)}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition active:scale-95"
                          >
                            <Eye className="h-3.5 w-3.5 text-gray-500" />
                            View
                          </button>

                          {/* Approve Button */}
                          <button
                            type="button"
                            onClick={() => handleApprove(contribution)}
                            disabled={isActing}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition active:scale-95 disabled:opacity-50"
                          >
                            {isActing ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            )}
                            Approve
                          </button>

                          {/* Reject Button */}
                          <button
                            type="button"
                            onClick={() => handleReject(contribution)}
                            disabled={isActing}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition active:scale-95 disabled:opacity-50"
                          >
                            {isActing ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5" />
                            )}
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* 3. VIEW CONTRIBUTION DETAIL MODAL */}
      {/* ==================================================== */}
      {selectedContribution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-gray-100 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Contribution Details</h3>
                  <p className="text-xs text-gray-500">ID: {selectedContribution._id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedContribution(null)}
                className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-5 space-y-4">
              {/* Campaign Title */}
              <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Campaign Target</p>
                <p className="mt-1 font-bold text-gray-900 text-base">{selectedContribution.campaign_title}</p>
              </div>

              {/* Supporter Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 uppercase">
                    <User className="h-3.5 w-3.5" /> Supporter
                  </div>
                  <p className="mt-1 font-bold text-gray-900">{selectedContribution.supporterName}</p>
                  <p className="text-xs text-gray-500 truncate">{selectedContribution.supporterEmail}</p>
                </div>

                <div className="rounded-xl bg-amber-50/70 p-3.5 border border-amber-200">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 uppercase">
                    <Coins className="h-3.5 w-3.5" /> Amount
                  </div>
                  <p className="mt-1 text-xl font-extrabold text-amber-800">
                    {selectedContribution.amount} Credits
                  </p>
                  <p className="text-xs text-amber-600">≈ ${(selectedContribution.amount / 20).toFixed(2)} USD</p>
                </div>
              </div>

              {/* Supporter Message or Note */}
              <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100">
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 uppercase mb-1.5">
                  <MessageSquare className="h-3.5 w-3.5" /> Supporter Note / Message
                </div>
                <p className="text-sm text-gray-700 italic">
                  {selectedContribution.message ? `"${selectedContribution.message}"` : "No special message provided with this contribution."}
                </p>
              </div>

              {/* Date & Status */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Submitted: {new Date(selectedContribution.createdAt).toLocaleString()}
                </span>
                <span className="rounded-full bg-yellow-100 text-yellow-800 font-semibold px-2 py-0.5">
                  Pending Review
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedContribution(null)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => handleReject(selectedContribution)}
                disabled={actionLoadingId === selectedContribution._id}
                className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
              >
                Reject & Refund
              </button>

              <button
                type="button"
                onClick={() => handleApprove(selectedContribution)}
                disabled={actionLoadingId === selectedContribution._id}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition"
              >
                Approve Contribution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}