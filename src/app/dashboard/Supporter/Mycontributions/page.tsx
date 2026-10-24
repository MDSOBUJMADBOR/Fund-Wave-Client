"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Heart,
  CheckCircle2,
  XCircle,
  Coins,
  Search,
  User,
  Calendar,
  Loader2,
  ArrowRight,
  Filter,
  RotateCw,
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
  status: "pending" | "approved" | "rejected" | "refunded" | string;
  current_date?: string;
  createdAt?: string;
  message?: string;
}

export default function MyContributionsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    let ignore = false;

    async function fetchMyContributions() {
      if (!user?.email) {
        if (!ignore) setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE}/contributions/supporter/${encodeURIComponent(user.email)}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch contributions");
        }

        const json = await res.json();
        const data = Array.isArray(json) ? json : json.data || [];

        if (!ignore) {
          setContributions(data);
          setLoading(false);
        }
      } catch (err: unknown) {
        console.error("Fetch contributions error:", err);
        if (!ignore) {
          setContributions([]);
          setLoading(false);
        }
      }
    }

    fetchMyContributions();

    return () => {
      ignore = true;
    };
  }, [user?.email, refreshTrigger, API_BASE]);

  // Filtered contributions
  const filteredContributions = useMemo(() => {
    return contributions.filter((c) => {
      const title = (c.campaign_title || "").toLowerCase();
      const creator = (c.creator_name || c.creatorName || "").toLowerCase();
      const matchSearch =
        title.includes(searchTerm.toLowerCase()) ||
        creator.includes(searchTerm.toLowerCase());

      const status = (c.status || "").toLowerCase();
      const matchStatus =
        statusFilter === "all" || status === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [contributions, searchTerm, statusFilter]);

  // Status badge styling
  const renderStatusBadge = (status: string) => {
    const s = (status || "pending").toLowerCase();

    if (s === "approved") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          Approved
        </span>
      );
    }

    if (s === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800 border border-red-200">
          <XCircle className="h-3.5 w-3.5 text-red-600" />
          Rejected (Refunded)
        </span>
      );
    }

    if (s === "refunded") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800 border border-purple-200">
          <Coins className="h-3.5 w-3.5 text-purple-600" />
          Refunded
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
        Pending Review
      </span>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ==================================================== */}
      {/* HEADER SECTION */}
      {/* ==================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 mb-2">
            <Heart className="h-3.5 w-3.5 text-rose-500" />
            Your Impact Log
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            My Contributions
          </h1>
          <p className="mt-1 text-sm text-gray-500 max-w-xl">
            Track all the campaigns you have pledged credits to and monitor approval statuses in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setLoading(true);
              setRefreshTrigger((k) => k + 1);
            }}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition"
          >
            <RotateCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            href="/dashboard/Supporter/Explorecampaigns"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-cyan-700 transition active:scale-95"
          >
            Explore More Campaigns
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* ==================================================== */}
      {/* SEARCH & STATUS FILTER BAR */}
      {/* ==================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by campaign title or creator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="h-4 w-4 text-gray-400 shrink-0" />
          {["all", "approved", "pending", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition shrink-0 ${
                statusFilter === tab
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab === "all" ? "All Contributions" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* ==================================================== */}
      {/* CONTRIBUTIONS TABLE */}
      {/* ==================================================== */}
      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
            <p className="text-sm font-semibold text-gray-500">Loading your contributions...</p>
          </div>
        ) : filteredContributions.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-3">
              <Heart className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900">No Contributions Found</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              {searchTerm || statusFilter !== "all"
                ? "No contributions match your search or filter."
                : "You haven't made any contributions yet. Start by backing an active project."}
            </p>
            <Link
              href="/dashboard/Supporter/Explorecampaigns"
              className="mt-4 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-cyan-700"
            >
              Explore Live Campaigns
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-4 px-5">Campaign Title</th>
                  <th className="py-4 px-4">Contribution Amount</th>
                  <th className="py-4 px-4">Creator</th>
                  <th className="py-4 px-4">Contribution Date</th>
                  <th className="py-4 px-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredContributions.map((c) => {
                  const title = c.campaign_title || "Campaign Project";
                  const amount = c.Contribution_amount ?? c.amount ?? 0;
                  const creator = c.creator_name ?? c.creatorName ?? "Creator";
                  const dateStr = c.createdAt || c.current_date;

                  return (
                    <tr key={c._id} className="hover:bg-cyan-50/20 transition-colors">
                      {/* Campaign Title & Link */}
                      <td className="py-4 px-5">
                        {c.campaign_id || c.campaignId ? (
                          <Link
                            href={`/campaigns/${c.campaign_id || c.campaignId}`}
                            className="font-bold text-gray-900 hover:text-cyan-600 transition block truncate max-w-[280px]"
                            title={title}
                          >
                            {title}
                          </Link>
                        ) : (
                          <span className="font-bold text-gray-900 block truncate max-w-[280px]">
                            {title}
                          </span>
                        )}
                        {c.message && (
                          <span className="text-xs text-gray-400 italic block truncate max-w-[260px]">
                            &ldquo;{c.message}&rdquo;
                          </span>
                        )}
                      </td>

                      {/* Contribution Amount */}
                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-700 border border-emerald-200">
                          <Coins className="h-4 w-4" />
                          <span>{amount}</span>
                          <span className="text-xs font-medium text-emerald-600">Credits</span>
                        </div>
                      </td>

                      {/* Creator */}
                      <td className="py-4 px-4 text-gray-700 font-medium">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                            <User className="h-3.5 w-3.5" />
                          </div>
                          <span>{creator}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-xs font-medium text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          <span>
                            {dateStr
                              ? new Date(dateStr).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Highlighted Status */}
                      <td className="py-4 px-5 text-center">
                        {renderStatusBadge(c.status)}
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