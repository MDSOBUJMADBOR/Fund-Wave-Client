"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Compass,
  Search,
  Calendar,
  Target,
  User,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface Campaign {
  _id: string;
  campaign_title: string;
  creator_name?: string;
  creatorName?: string;
  deadline?: string;
  funding_goal: number | string;
  amount_raised?: number | string;
  campaign_image_url?: string;
  category?: string;
  status?: string;
}

const fallbackImage =
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80";

export default function ExploreCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    let ignore = false;

    async function fetchApprovedCampaigns() {
      try {
        const res = await fetch(`${API_BASE}/campaignss`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch campaigns");
        }

        const data: Campaign[] = await res.json();

        // Filter: deadline has not passed AND status is "approved"
        const now = new Date();
        const activeApproved = (Array.isArray(data) ? data : []).filter((camp) => {
          const isApproved = (camp.status || "").toLowerCase() === "approved";
          const hasNotExpired = !camp.deadline || new Date(camp.deadline) >= now;
          return isApproved && hasNotExpired;
        });

        if (!ignore) {
          setCampaigns(activeApproved);
          setLoading(false);
        }
      } catch (err: unknown) {
        console.error("Explore campaigns fetch error:", err);
        if (!ignore) {
          setCampaigns([]);
          setLoading(false);
        }
      }
    }

    fetchApprovedCampaigns();

    return () => {
      ignore = true;
    };
  }, [API_BASE]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    campaigns.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return ["All", ...Array.from(set)];
  }, [campaigns]);

  // Filtered campaigns based on search & category
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((camp) => {
      const matchSearch =
        camp.campaign_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (camp.creator_name || camp.creatorName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === "All" ||
        (camp.category || "").toLowerCase() === selectedCategory.toLowerCase();

      return matchSearch && matchCategory;
    });
  }, [campaigns, searchTerm, selectedCategory]);

  return (
    <div className="space-y-8 pb-12">
      {/* ==================================================== */}
      {/* HEADER SECTION */}
      {/* ==================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 mb-2">
            <Compass className="h-3.5 w-3.5" />
            Active & Verified Projects
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Explore Campaigns
          </h1>
          <p className="mt-1 text-sm text-gray-500 max-w-xl">
            Browse and support active, approved campaigns before their deadlines expire. Back a cause you believe in.
          </p>
        </div>

        {/* Search input */}
        <div className="relative min-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns or creators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50/70 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-200"
          />
        </div>
      </div>

      {/* ==================================================== */}
      {/* CATEGORY FILTER PILLS */}
      {/* ==================================================== */}
      {categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition shrink-0 ${
                selectedCategory === cat
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* ==================================================== */}
      {/* CAMPAIGN CARDS GRID */}
      {/* ==================================================== */}
      {loading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
          <p className="text-sm font-semibold text-gray-500">Loading active campaigns...</p>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-50 text-cyan-600 mb-3">
            <Compass className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-gray-900">No Active Campaigns Found</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-sm">
            {searchTerm || selectedCategory !== "All"
              ? "Try adjusting your search query or filter category."
              : "There are currently no active campaigns accepting pledges right now."}
          </p>
          {(searchTerm || selectedCategory !== "All") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="mt-4 rounded-xl bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((camp) => {
            const raised = Number(camp.amount_raised || 0);
            const goal = Number(camp.funding_goal || 1);
            const progress = Math.min(Math.round((raised / goal) * 100), 100);
            const creator = camp.creator_name || camp.creatorName || "Verified Creator";

            return (
              <div
                key={camp._id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Cover */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={camp.campaign_image_url || fallbackImage}
                    alt={camp.campaign_title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white capitalize">
                      {camp.category || "General"}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Creator Info */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 font-bold text-[10px]">
                        <User className="h-3 w-3" />
                      </div>
                      <span className="truncate">{creator}</span>
                    </div>

                    {/* Campaign Title */}
                    <h3
                      className="text-lg font-bold text-gray-900 group-hover:text-cyan-600 transition-colors line-clamp-2"
                      title={camp.campaign_title}
                    >
                      {camp.campaign_title}
                    </h3>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
                        <span>{progress}% funded</span>
                        <span className="text-gray-400">
                          {raised} / {goal} credits
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Meta stats */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
                      {/* Funding Goal */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Goal</span>
                        <span className="font-bold text-gray-800 flex items-center gap-1 mt-0.5">
                          <Target className="h-3.5 w-3.5 text-gray-400" />
                          {goal} Credits
                        </span>
                      </div>

                      {/* Deadline */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Deadline</span>
                        <span className="font-semibold text-gray-700 flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          {camp.deadline
                            ? new Date(camp.deadline).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "No deadline"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Link
                    href={`/campaigns/${camp._id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-600 py-3 px-4 text-xs font-bold text-white shadow-sm transition hover:bg-cyan-700 active:scale-95 group/btn"
                  >
                    <span>View Details & Back</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}