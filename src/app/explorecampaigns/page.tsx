"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  RotateCcw,
  Clock,
  Compass,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface Campaign {
  _id: string;
  campaign_title: string;
  campaign_story?: string;
  category?: string;
  funding_goal: number;
  amount_raised?: number;
  minimum_contribution?: number;
  deadline?: string;
  reward_info?: string;
  campaign_image_url?: string;
  status?: string;
  creatorEmail?: string;
  creatorName?: string;
  creator_name?: string;
  createdAt?: string;
}

const fallbackImage =
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80";

const DEFAULT_CATEGORIES = [
  "All",
  "Technology",
  "Education",
  "Health",
  "Community",
  "Art",
  "Environment",
];

// Amount Raised helper
const getAmountRaised = (campaign: Campaign) => {
  return Number(
    campaign.amount_raised ??
      campaign.minimum_contribution ??
      0
  );
};

// Progress helper
const getProgress = (campaign: Campaign) => {
  const raised = getAmountRaised(campaign);
  const goal = Number(campaign.funding_goal || 0);
  if (!goal) return 0;
  return Math.min(Math.round((raised / goal) * 100), 100);
};

// Days left calculation
const getDaysLeft = (deadline?: string) => {
  if (!deadline) return null;
  const now = new Date();
  const end = new Date(deadline);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default function ExploreCampaignsPage() {
  const router = useRouter();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<
    "most-raised" | "newest" | "goal-high" | "goal-low" | "ending-soon" | "progress"
  >("most-raised");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "urgent">("all");
  const [fundingFilter, setFundingFilter] = useState<"all" | "under-1k" | "1k-5k" | "5k-plus">("all");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    let isMounted = true;

    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch approved campaigns
        const response = await fetch(`${API_BASE}/campaignss`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch campaigns");
        }

        const result = await response.json();
        const campaignData: Campaign[] = Array.isArray(result)
          ? result
          : result.data || [];

        if (isMounted) {
          setCampaigns(campaignData);
        }
      } catch (err: unknown) {
        console.error("Campaign fetch error:", err);
        if (isMounted) {
          setError("Unable to load campaigns. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCampaigns();

    return () => {
      isMounted = false;
    };
  }, [API_BASE]);

  // Available Categories (combining defaults and existing categories)
  const availableCategories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    campaigns.forEach((c) => {
      if (c.category && c.category.trim()) {
        const normalized =
          c.category.trim().charAt(0).toUpperCase() +
          c.category.trim().slice(1).toLowerCase();
        set.add(normalized);
      }
    });
    return Array.from(set);
  }, [campaigns]);

  // Main Filtered & Sorted Campaigns
  const filteredAndSortedCampaigns = useMemo(() => {
    const now = new Date();

    const filtered = campaigns.filter((campaign) => {
      // 1. Text Search (title, creator, story, category)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const titleMatch = campaign.campaign_title.toLowerCase().includes(query);
        const creatorMatch = (campaign.creatorName || campaign.creator_name || "")
          .toLowerCase()
          .includes(query);
        const storyMatch = (campaign.campaign_story || "").toLowerCase().includes(query);
        const categoryMatch = (campaign.category || "").toLowerCase().includes(query);

        if (!titleMatch && !creatorMatch && !storyMatch && !categoryMatch) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== "All") {
        const campCat = (campaign.category || "").toLowerCase();
        if (campCat !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // 3. Status / Deadline Filter
      if (statusFilter === "active") {
        if (campaign.deadline && new Date(campaign.deadline) < now) {
          return false;
        }
      } else if (statusFilter === "urgent") {
        const daysLeft = getDaysLeft(campaign.deadline);
        if (daysLeft === null || daysLeft < 0 || daysLeft > 7) {
          return false;
        }
      }

      // 4. Funding Goal Filter
      const goal = Number(campaign.funding_goal || 0);
      if (fundingFilter === "under-1k" && goal >= 1000) return false;
      if (fundingFilter === "1k-5k" && (goal < 1000 || goal > 5000)) return false;
      if (fundingFilter === "5k-plus" && goal < 5000) return false;

      return true;
    });

    // Sort
    return [...filtered].sort((a, b) => {
      const raisedA = getAmountRaised(a);
      const raisedB = getAmountRaised(b);
      const goalA = Number(a.funding_goal || 0);
      const goalB = Number(b.funding_goal || 0);
      const progA = getProgress(a);
      const progB = getProgress(b);

      switch (sortBy) {
        case "most-raised":
          return raisedB - raisedA;
        case "newest":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case "goal-high":
          return goalB - goalA;
        case "goal-low":
          return goalA - goalB;
        case "progress":
          return progB - progA;
        case "ending-soon": {
          const daysA = getDaysLeft(a.deadline) ?? 9999;
          const daysB = getDaysLeft(b.deadline) ?? 9999;
          return daysA - daysB;
        }
        default:
          return 0;
      }
    });
  }, [campaigns, searchTerm, selectedCategory, sortBy, statusFilter, fundingFilter]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSortBy("most-raised");
    setStatusFilter("all");
    setFundingFilter("all");
  };

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedCategory !== "All" ||
    statusFilter !== "all" ||
    fundingFilter !== "all" ||
    sortBy !== "most-raised";

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US").format(amount);
  };

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "technology":
        return "bg-blue-50 text-blue-700 border-blue-200/60";
      case "education":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "health":
        return "bg-rose-50 text-rose-700 border-rose-200/60";
      case "community":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "art":
        return "bg-purple-50 text-purple-700 border-purple-200/60";
      case "environment":
        return "bg-teal-50 text-teal-700 border-teal-200/60";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200/60";
    }
  };

  const openDetailsPage = (id: string) => {
    router.push(`/campaigns/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFE] pb-20">
      {/* ==================================================
          PAGE HEADER HERO
      ================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50/70 via-white to-transparent pt-12 pb-10 sm:pt-16 sm:pb-12 border-b border-purple-100/50">
        <div className="pointer-events-none absolute -top-20 left-1/4 h-80 w-80 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 right-1/4 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-white px-4 py-1.5 text-xs font-semibold tracking-wide text-purple-700 shadow-sm backdrop-blur-md mb-4">
            <Sparkles className="h-3.5 w-3.5 text-purple-600" />
            <span>Discover Verified Crowdfunding</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Explore All <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">Campaigns</span>
          </h1>

          <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-slate-600">
            Discover impactful ideas, back passionate creators, and pledge your credits to bring transformative community and tech projects to life.
          </p>

          {/* ==================================================
              MAIN SEARCH BAR
          ================================================== */}
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="relative flex items-center rounded-2xl bg-white p-2 shadow-xl shadow-purple-500/5 border border-purple-100 transition-all focus-within:border-purple-400 focus-within:ring-4 focus-within:ring-purple-100">
              <Search className="ml-3 h-5 w-5 text-slate-400 shrink-0" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, creator, story, or category..."
                className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-slate-800 placeholder-slate-400 outline-none"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="mr-2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              <div className="hidden sm:flex items-center gap-1.5 border-l border-slate-200 pl-3 pr-2 text-xs font-medium text-slate-500">
                <Compass className="h-4 w-4 text-purple-600" />
                <span>{filteredAndSortedCampaigns.length} found</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          FILTER & CONTROL BAR
      ================================================== */}
      <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {availableCategories.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer whitespace-nowrap rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                    isSelected
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Sub Filters & Sort Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
            {/* Quick Status and Funding Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1 font-semibold text-slate-500 mr-1">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filter:
              </span>

              {/* Status Selector */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "urgent")}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-slate-300 focus:border-purple-400 focus:outline-hidden"
              >
                <option value="all">All Deadlines</option>
                <option value="active">Active Only (Ongoing)</option>
                <option value="urgent">Urgent (≤ 7 Days Left)</option>
              </select>

              {/* Funding Goal Selector */}
              <select
                value={fundingFilter}
                onChange={(e) => setFundingFilter(e.target.value as "all" | "under-1k" | "1k-5k" | "5k-plus")}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-slate-300 focus:border-purple-400 focus:outline-hidden"
              >
                <option value="all">Any Funding Goal</option>
                <option value="under-1k">Under $1,000</option>
                <option value="1k-5k">$1,000 - $5,000</option>
                <option value="5k-plus">$5,000 & Above</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 font-semibold text-slate-500">
                <ArrowUpDown className="h-3.5 w-3.5" />
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as
                      | "most-raised"
                      | "newest"
                      | "goal-high"
                      | "goal-low"
                      | "ending-soon"
                      | "progress"
                  )
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-xs hover:border-purple-300 focus:border-purple-500 focus:outline-hidden"
              >
                <option value="most-raised">Most Raised</option>
                <option value="progress">Highest Progress %</option>
                <option value="newest">Newest First</option>
                <option value="ending-soon">Ending Soonest</option>
                <option value="goal-high">Goal: High to Low</option>
                <option value="goal-low">Goal: Low to High</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          CAMPAIGNS GRID & STATES
      ================================================== */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <Loader2 className="h-9 w-9 text-purple-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-600">
              Loading verified campaigns...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50/70 p-6 text-center">
            <p className="text-sm font-bold text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredAndSortedCampaigns.length === 0 && (
          <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 mb-4">
              <Search className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No matching campaigns found
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              We couldn&apos;t find any campaigns matching your current filters. Try adjusting your search term or category.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* Results Counter */}
        {!loading && !error && filteredAndSortedCampaigns.length > 0 && (
          <div className="mb-6 flex items-center justify-between text-xs text-slate-500">
            <p>
              Showing <span className="font-bold text-slate-900">{filteredAndSortedCampaigns.length}</span> of{" "}
              <span className="font-bold text-slate-900">{campaigns.length}</span> total campaigns
            </p>

            {hasActiveFilters && (
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 font-semibold text-purple-700">
                Filtered view
              </span>
            )}
          </div>
        )}

        {/* Cards Grid */}
        {!loading && !error && filteredAndSortedCampaigns.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedCampaigns.map((campaign) => {
              const raised = getAmountRaised(campaign);
              const progress = getProgress(campaign);
              const daysLeft = getDaysLeft(campaign.deadline);

              return (
                <article
                  key={campaign._id}
                  onClick={() => openDetailsPage(campaign._id)}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer"
                >
                  {/* Top Image Section */}
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={campaign.campaign_image_url || fallbackImage}
                        alt={campaign.campaign_title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = fallbackImage;
                        }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />

                      {/* Top Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${getCategoryColor(
                            campaign.category
                          )}`}
                        >
                          {campaign.category || "General"}
                        </span>
                      </div>

                      {/* Deadline Tag */}
                      {daysLeft !== null && (
                        <div className="absolute top-3 right-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-xs backdrop-blur-md ${
                              daysLeft < 0
                                ? "bg-red-500/90 text-white"
                                : daysLeft <= 7
                                ? "bg-amber-500/90 text-white animate-pulse"
                                : "bg-black/50 text-white"
                            }`}
                          >
                            <Clock className="h-3 w-3" />
                            <span>
                              {daysLeft < 0
                                ? "Ended"
                                : daysLeft === 0
                                ? "Ends Today"
                                : `${daysLeft}d left`}
                            </span>
                          </span>
                        </div>
                      )}

                      {/* Creator overlay */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                        <p className="truncate text-xs font-semibold drop-shadow-sm">
                          By {campaign.creatorName || campaign.creator_name || "Creator"}
                        </p>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 space-y-2.5">
                      <h3 className="line-clamp-2 text-sm sm:text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors leading-snug">
                        {campaign.campaign_title}
                      </h3>

                      {campaign.campaign_story && (
                        <p className="line-clamp-2 text-xs text-slate-500 leading-relaxed">
                          {campaign.campaign_story}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Funding Details & Footer */}
                  <div className="p-4 pt-0 mt-3">
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <p className="text-[10px] uppercase font-semibold text-slate-400">
                            Raised
                          </p>
                          <p className="text-sm font-extrabold text-slate-900">
                            ${formatAmount(raised)}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] uppercase font-semibold text-slate-400">
                            Goal
                          </p>
                          <p className="text-xs font-bold text-slate-600">
                            ${formatAmount(campaign.funding_goal)}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-2.5">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              progress >= 100
                                ? "bg-emerald-500"
                                : "bg-gradient-to-r from-purple-600 to-indigo-600"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="mt-1.5 flex items-center justify-between text-[10px] font-bold">
                          <span
                            className={
                              progress >= 100 ? "text-emerald-600" : "text-purple-600"
                            }
                          >
                            {progress}% Funded
                          </span>
                          {campaign.minimum_contribution && (
                            <span className="text-slate-400">
                              Min: ${campaign.minimum_contribution}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* View Details CTA */}
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold text-purple-600 group-hover:text-purple-700">
                      <span>View Campaign</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}