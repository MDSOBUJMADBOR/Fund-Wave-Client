"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  UserCheck,
  Coins,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Sparkles,
  Loader2,
  ExternalLink,
  ShieldCheck,
  RotateCw,
} from "lucide-react";

interface AdminStats {
  totalSupporters: number;
  totalCreators: number;
  totalAvailableCredits: number;
  totalPaymentsCount: number;
  totalPaymentsAmount: number;
  pendingCampaignsCount: number;
  pendingWithdrawalsCount: number;
  totalCampaignsCount: number;
}

interface Campaign {
  _id: string;
  campaign_title?: string;
  title?: string;
  creator_name?: string;
  creatorName?: string;
  creator_email?: string;
  creatorEmail?: string;
  funding_goal?: number | string;
  fundingGoal?: number | string;
  category?: string;
  campaign_image_url?: string;
  image?: string;
  status: string;
  createdAt?: string;
  deadline?: string;
}

const fallbackImage =
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=600&q=80";

export default function AdminHomePage() {
  const [stats, setStats] = useState<AdminStats>({
    totalSupporters: 0,
    totalCreators: 0,
    totalAvailableCredits: 0,
    totalPaymentsCount: 0,
    totalPaymentsAmount: 0,
    pendingCampaignsCount: 0,
    pendingWithdrawalsCount: 0,
    totalCampaignsCount: 0,
  });

  const [pendingCampaigns, setPendingCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // ==========================================
  // FETCH STATS AND PENDING CAMPAIGNS
  // ==========================================
  useEffect(() => {
    let ignore = false;

    async function loadAdminData() {
      try {
        setLoading(true);

        const [statsRes, campaignsRes] = await Promise.all([
          fetch(`${API_BASE}/admin/stats`, { cache: "no-store" }),
          fetch(`${API_BASE}/campaigns`, { cache: "no-store" }),
        ]);

        const [statsJson, campaignsJson] = await Promise.all([
          statsRes.json(),
          campaignsRes.json(),
        ]);

        if (!ignore) {
          if (statsJson.success && statsJson.data) {
            setStats(statsJson.data);
          }

          const rawCampaigns: Campaign[] = Array.isArray(campaignsJson)
            ? campaignsJson
            : campaignsJson.data || [];

          // Filter only pending campaigns
          const pending = rawCampaigns.filter(
            (c) => (c.status || "pending").toLowerCase() === "pending"
          );

          setPendingCampaigns(pending);
          setLoading(false);
        }
      } catch (err: unknown) {
        console.error("Admin dashboard fetch error:", err);
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadAdminData();

    return () => {
      ignore = true;
    };
  }, [refreshTrigger, API_BASE]);

  // ==========================================
  // APPROVE CAMPAIGN
  // ==========================================
  const handleApproveCampaign = async (id: string, title: string) => {
    try {
      setActionLoadingId(id);

      const res = await fetch(`${API_BASE}/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });

      if (!res.ok) {
        throw new Error("Failed to approve campaign");
      }

      setPendingCampaigns((prev) => prev.filter((c) => c._id !== id));
      setStats((prev) => ({
        ...prev,
        pendingCampaignsCount: Math.max(0, prev.pendingCampaignsCount - 1),
      }));

      alert(`Campaign "${title}" has been approved and is now live to Supporters!`);
    } catch (err: unknown) {
      console.error("Approve campaign error:", err);
      alert(err instanceof Error ? err.message : "Failed to approve campaign");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ==========================================
  // REJECT CAMPAIGN
  // ==========================================
  const handleRejectCampaign = async (id: string, title: string) => {
    const reason = prompt(
      `Enter reason for rejecting "${title}" (this will be logged and notified to creator):`,
      "Does not meet community guidelines or verification criteria."
    );

    if (reason === null) return; // user cancelled prompt

    try {
      setActionLoadingId(id);

      const res = await fetch(`${API_BASE}/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "rejected",
          rejectionReason: reason,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to reject campaign");
      }

      setPendingCampaigns((prev) => prev.filter((c) => c._id !== id));
      setStats((prev) => ({
        ...prev,
        pendingCampaignsCount: Math.max(0, prev.pendingCampaignsCount - 1),
      }));

      alert(`Campaign "${title}" has been rejected.`);
    } catch (err: unknown) {
      console.error("Reject campaign error:", err);
      alert(err instanceof Error ? err.message : "Failed to reject campaign");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ==================================================== */}
      {/* ADMIN WELCOME BANNER */}
      {/* ==================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/15">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Platform Command Center
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
              Admin Overview
            </h1>
            <p className="mt-1 text-sm md:text-base text-blue-100 max-w-xl">
              Monitor ecosystem health, approve newly submitted campaigns, and manage creator withdrawal settlements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/Admin/Withdrawalrequests"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-xs font-bold text-gray-950 shadow-md transition active:scale-95"
            >
              <Clock className="h-4 w-4" />
              Withdrawal Requests ({stats.pendingWithdrawalsCount})
            </Link>
            <Link
              href="/dashboard/Admin/Manageusers"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white border border-white/20 hover:bg-white/20 transition active:scale-95"
            >
              <Users className="h-4 w-4" />
              Manage Users
            </Link>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      {/* ==================================================== */}
      {/* 4 REQUIRED METRIC STATES */}
      {/* ==================================================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            Key Platform States
          </h2>
          <button
            onClick={() => {
              setLoading(true);
              setRefreshTrigger((k) => k + 1);
            }}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition"
          >
            <RotateCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Total Supporters */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Total Supporters
                </p>
                <h3 className="mt-2 text-3xl font-extrabold text-gray-900">
                  {loading ? (
                    <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
                  ) : (
                    stats.totalSupporters
                  )}
                </h3>
                <p className="mt-1 text-xs text-gray-400">Pledge contributors</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-indigo-600">
              <Link href="/dashboard/Admin/Manageusers" className="hover:underline inline-flex items-center gap-1">
                View all users <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* 2. Total Creators */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Total Creators
                </p>
                <h3 className="mt-2 text-3xl font-extrabold text-blue-600">
                  {loading ? (
                    <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
                  ) : (
                    stats.totalCreators
                  )}
                </h3>
                <p className="mt-1 text-xs text-gray-400">Campaign initiators</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-blue-600">
              <Link href="/dashboard/Admin/Managecampaigns" className="hover:underline inline-flex items-center gap-1">
                View campaigns <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* 3. Total Available Credits */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Total Available Credits
                </p>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <h3 className="text-3xl font-extrabold text-amber-600">
                    {loading ? (
                      <Loader2 className="h-7 w-7 animate-spin text-amber-500" />
                    ) : (
                      stats.totalAvailableCredits.toLocaleString()
                    )}
                  </h3>
                  <span className="text-xs font-semibold text-gray-400">Credits</span>
                </div>
                <p className="mt-1 text-xs text-gray-400">Sum of all users credits</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                <Coins className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-amber-700">
              <span>≈ ${(stats.totalAvailableCredits / 20).toFixed(2)} USD</span>
            </div>
          </div>

          {/* 4. Total Payments Processed */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Payments Processed
                </p>
                <h3 className="mt-2 text-3xl font-extrabold text-emerald-600">
                  {loading ? (
                    <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
                  ) : (
                    `$${stats.totalPaymentsAmount.toFixed(2)}`
                  )}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  {stats.totalPaymentsCount} Stripe transactions
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CreditCard className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-emerald-600">
              <span>All Stripe purchases verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* CAMPAIGN APPROVALS SECTION */}
      {/* ==================================================== */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Campaign Approvals</h2>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                {pendingCampaigns.length} Pending
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Review and approve newly submitted creator campaigns before they are made public to Supporters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/Admin/Managecampaigns"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
            >
              Manage all campaigns <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="text-sm text-gray-500 font-medium">Checking pending campaigns...</p>
          </div>
        ) : pendingCampaigns.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex min-h-[200px] flex-col items-center justify-center py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-3 border border-emerald-100">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900">All Caught Up!</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              There are no pending campaigns awaiting approval at this moment.
            </p>
          </div>
        ) : (
          /* TABULAR FORMAT */
          <div className="overflow-x-auto mt-4">
            <table className="w-full min-w-[750px] text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3.5 px-4 rounded-l-xl">Campaign</th>
                  <th className="py-3.5 px-4">Creator</th>
                  <th className="py-3.5 px-4">Funding Goal</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {pendingCampaigns.map((camp) => {
                  const title = camp.campaign_title || camp.title || "Untitled Project";
                  const creator = camp.creator_name || camp.creatorName || "Creator";
                  const email = camp.creator_email || camp.creatorEmail || "N/A";
                  const goal = Number(camp.funding_goal || camp.fundingGoal || 0);
                  const image = camp.campaign_image_url || camp.image || fallbackImage;
                  const isProcessing = actionLoadingId === camp._id;

                  return (
                    <tr key={camp._id} className="hover:bg-indigo-50/30 transition-colors">
                      {/* Campaign Title & Image */}
                      <td className="py-4 px-4 font-semibold text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
                            <Image
                              src={image}
                              alt={title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="block max-w-[220px] truncate font-bold text-gray-900" title={title}>
                              {title}
                            </span>
                            <Link
                              href={`/campaigns/${camp._id}`}
                              target="_blank"
                              className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1 font-normal"
                            >
                              View preview <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      </td>

                      {/* Creator */}
                      <td className="py-4 px-4 text-gray-700">
                        <p className="font-semibold text-gray-900">{creator}</p>
                        <p className="text-xs text-gray-400">{email}</p>
                      </td>

                      {/* Funding Goal */}
                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-1 font-bold text-gray-900">
                          <Coins className="h-4 w-4 text-amber-500" />
                          <span>{goal.toLocaleString()}</span>
                          <span className="text-xs text-gray-400 font-normal">Credits</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 capitalize">
                          {camp.category || "General"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                          Pending Review
                        </span>
                      </td>

                      {/* Action Buttons: Approve and Reject */}
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleApproveCampaign(camp._id, title)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            )}
                            Approve
                          </button>

                          <button
                            onClick={() => handleRejectCampaign(camp._id, title)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1 rounded-xl bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 active:scale-95 transition disabled:opacity-50"
                          >
                            <XCircle className="h-3.5 w-3.5" />
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
    </div>
  );
}