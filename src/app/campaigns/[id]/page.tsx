"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock,
  HandCoins,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Wallet,
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
}

type TabType = "story" | "updates" | "supporters";

const fallbackImage =
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1200&q=80";

const CampaignDetailsPage = () => {




  
  const params = useParams();

  const campaignId = Array.isArray(params.id)
    ? params.id[0]
    : (params.id as string);

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState<TabType>("story");
  const [contributionAmount, setContributionAmount] = useState("");
  const [contributing, setContributing] = useState(false);
  const [contributionError, setContributionError] = useState("");

  // Example available credits.
  // Replace this with the logged-in user's real credit balance.
  const [availableCredits] = useState(120);

  useEffect(() => {
    if (!campaignId) return;

    let isMounted = true;

    const fetchCampaign = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/campaignss/${campaignId}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Campaign not found");
        }

        const result = await response.json();

        const campaignData = result.data || result;

        if (isMounted) {
          setCampaign(campaignData);
        }
      } catch (err) {
        console.error("Campaign fetch error:", err);

        if (isMounted) {
          setError("Campaign details could not be loaded.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCampaign();

    return () => {
      isMounted = false;
    };
  }, [campaignId]);

  const getAmountRaised = () => {
    if (!campaign) return 0;

    return Number(campaign.amount_raised ?? 0);
  };

  const getFundingGoal = () => {
    if (!campaign) return 0;

    return Number(campaign.funding_goal ?? 0);
  };

  const getMinimumContribution = () => {
    if (!campaign) return 50;

    return Number(campaign.minimum_contribution ?? 50);
  };

  const getProgress = () => {
    const goal = getFundingGoal();

    if (!goal) return 0;

    return Math.min(
      Math.round((getAmountRaised() / goal) * 100),
      100
    );
  };

  const formatCredits = (amount: number) => {
    return `${amount.toLocaleString()} Credits`;
  };

  const formatDate = (date?: string) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleContribution = async () => {
    if (!campaign) return;

    setContributionError("");

    const amount = Number(contributionAmount);
    const minimum = getMinimumContribution();

    if (!contributionAmount.trim()) {
      setContributionError("Please enter a contribution amount.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setContributionError("Please enter a valid amount.");
      return;
    }

    if (!Number.isInteger(amount)) {
      setContributionError("Credits must be a whole number.");
      return;
    }

    if (amount < minimum) {
      setContributionError(
        `Minimum contribution is ${minimum} Credits.`
      );
      return;
    }

    if (amount > availableCredits) {
      setContributionError("You do not have enough available credits.");
      return;
    }

    try {
      setContributing(true);

      /*
        এখানে আপনার contribution API call করবেন।

        Example:

        const response = await fetch(
          "http://localhost:5000/contributions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              campaignId: campaign._id,
              amount,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Contribution failed");
        }
      */

      // Temporary success simulation.
      await new Promise((resolve) => setTimeout(resolve, 800));

      alert(
        "Contribution submitted successfully! It is pending approval."
      );

      setContributionAmount("");
    } catch (err) {
      console.error("Contribution error:", err);
      setContributionError("Contribution failed. Please try again.");
    } finally {
      setContributing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center gap-3 bg-[#fafcfb] text-sm text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading campaign...
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#fafcfb] px-4 text-center">
        <p className="text-sm text-red-500">
          {error || "Campaign not found"}
        </p>

        <Link
          href="/explorecampaigns"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </Link>
      </div>
    );
  }

  const progress = getProgress();
  const raised = getAmountRaised();
  const goal = getFundingGoal();
  const minimum = getMinimumContribution();

  return (
    <main className="min-h-screen bg-[#fafcfb] pb-10 text-[#101828]">
      {/* Top Details Section */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/explorecampaigns"
            className="mb-5 inline-flex items-center gap-2 text-xs font-medium text-gray-600 transition hover:text-emerald-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Campaigns
          </Link>

          <div className="grid gap-7 lg:grid-cols-[310px_minmax(0,1fr)] lg:gap-5">
            {/* Campaign Image */}
            <div className="relative h-[280px] overflow-hidden rounded-xl sm:h-[350px] lg:h-[273px]">
              <Image
                src={campaign.campaign_image_url || fallbackImage}
                alt={campaign.campaign_title}
                fill
                priority
                unoptimized
                className="object-cover"
              />
            </div>

            {/* Campaign Information */}
            <div className="flex min-w-0 flex-col justify-center lg:pl-0">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-[#101828] sm:text-3xl">
                {campaign.campaign_title}
              </h1>

              {/* Creator */}
              <div className="mt-3 flex items-center gap-2 text-xs">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Users className="h-3.5 w-3.5" />
                </div>

                <span className="text-gray-500">By</span>

                <span className="font-semibold text-gray-900">
                  {campaign.creatorName || "Campaign Creator"}
                </span>

                <CheckCircle2 className="h-3.5 w-3.5 fill-emerald-600 text-white" />
              </div>

              {/* Story */}
              <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-700">
                {campaign.campaign_story ||
                  "We want to create a positive impact through this campaign and make a difference in our community."}
              </p>

              {/* Stats */}
              <div className="mt-5 grid grid-cols-2 border-y border-gray-200 py-3 sm:grid-cols-4">
                <div className="border-r border-gray-200 pr-3">
                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <Target className="h-3.5 w-3.5" />
                    Category
                  </div>

                  <p className="mt-1 text-xs font-semibold capitalize text-gray-900">
                    {campaign.category || "General"}
                  </p>
                </div>

                <div className="border-r border-gray-200 px-3">
                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <CircleDollarSign className="h-3.5 w-3.5" />
                    Goal
                  </div>

                  <p className="mt-1 text-xs font-semibold text-gray-900">
                    {formatCredits(goal)}
                  </p>
                </div>

                <div className="border-r border-gray-200 px-3">
                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <HandCoins className="h-3.5 w-3.5 text-emerald-600" />
                    Raised
                  </div>

                  <p className="mt-1 text-xs font-semibold text-gray-900">
                    {formatCredits(raised)}
                  </p>
                </div>

                <div className="pl-3">
                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Deadline
                  </div>

                  <p className="mt-1 text-xs font-semibold text-gray-900">
                    {formatDate(campaign.deadline)}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <span className="text-xs font-semibold text-gray-700">
                    {progress}%
                  </span>
                </div>
              </div>

              {/* Minimum */}
              <div className="mt-4 space-y-2 text-xs">
                <p className="text-gray-700">
                  <span className="font-bold text-gray-900">
                    Minimum Contribution:
                  </span>{" "}
                  {formatCredits(minimum)}
                </p>

                <p className="text-gray-700">
                  <span className="font-bold text-gray-900">
                    Reward:
                  </span>{" "}
                  {campaign.reward_info ||
                    "Thank you for supporting our campaign."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lower Content */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_290px]">
          {/* Left Content */}
          <div className="min-w-0">
            {/* Tabs */}
            <div className="flex gap-7 overflow-x-auto border-b border-gray-200">
              <button
                type="button"
                onClick={() => setActiveTab("story")}
                className={`relative whitespace-nowrap pb-3 text-xs font-semibold transition ${
                  activeTab === "story"
                    ? "text-emerald-700"
                    : "text-gray-700 hover:text-emerald-600"
                }`}
              >
                Campaign Story

                {activeTab === "story" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-emerald-600" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("updates")}
                className={`relative flex items-center gap-1 whitespace-nowrap pb-3 text-xs font-semibold transition ${
                  activeTab === "updates"
                    ? "text-emerald-700"
                    : "text-gray-700 hover:text-emerald-600"
                }`}
              >
                Updates

                <span className="text-[10px]">(3)</span>

                {activeTab === "updates" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-emerald-600" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("supporters")}
                className={`relative flex items-center gap-1 whitespace-nowrap pb-3 text-xs font-semibold transition ${
                  activeTab === "supporters"
                    ? "text-emerald-700"
                    : "text-gray-700 hover:text-emerald-600"
                }`}
              >
                Supporters

                <span className="text-[10px]">(42)</span>

                {activeTab === "supporters" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-emerald-600" />
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-0 rounded-b-lg border-x border-b border-gray-200 bg-white p-5 sm:p-6">
              {activeTab === "story" && (
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Story
                  </h2>

                  <p className="mt-4 text-xs leading-6 text-gray-700">
                    {campaign.campaign_story ||
                      "In many communities, people face challenges every day. Our project aims to create a positive impact and provide meaningful support to those who need it."}
                  </p>

                  <h3 className="mt-6 text-sm font-bold text-gray-900">
                    How Your Support Helps
                  </h3>

                  <div className="mt-4 space-y-4">
                    {[
                      "Provide clean and safe resources",
                      "Improve the quality of life",
                      "Empower communities",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 text-xs text-gray-700"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "updates" && (
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Campaign Updates
                  </h2>

                  <p className="mt-4 text-xs leading-6 text-gray-600">
                    Campaign updates will appear here. The creator can
                    share progress, news, and important information
                    about this campaign.
                  </p>

                  <div className="mt-5 rounded-lg bg-gray-50 p-4">
                    <p className="text-xs font-semibold text-gray-900">
                      No updates available yet.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "supporters" && (
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Campaign Supporters
                  </h2>

                  <p className="mt-4 text-xs leading-6 text-gray-600">
                    Supporter information will be displayed here
                    when contributions are available.
                  </p>

                  <div className="mt-5 rounded-lg bg-gray-50 p-4">
                    <p className="text-xs font-semibold text-gray-900">
                      Supporters will appear here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Contribution Card */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-base font-bold text-gray-900">
                Make a Contribution
              </h2>

              {/* Available Credits */}
              <div className="mt-4 flex items-center gap-2 text-xs">
                <Wallet className="h-4 w-4 text-emerald-600" />

                <span className="text-gray-600">
                  Your Available Credits:
                </span>

                <span className="font-bold text-emerald-600">
                  {availableCredits}
                </span>
              </div>

              {/* Input */}
              <div className="mt-6">
                <label
                  htmlFor="contributionAmount"
                  className="text-xs font-semibold text-gray-900"
                >
                  Contribution Amount (Credits)
                </label>

                <input
                  id="contributionAmount"
                  type="number"
                  min={minimum}
                  value={contributionAmount}
                  onChange={(event) => {
                    setContributionAmount(event.target.value);
                    setContributionError("");
                  }}
                  placeholder="Enter amount"
                  className="mt-2 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Minimum: {formatCredits(minimum)}
                </p>
              </div>

              {/* Error */}
              {contributionError && (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs leading-5 text-red-600">
                  {contributionError}
                </p>
              )}

              {/* Button */}
              <button
                type="button"
                onClick={handleContribution}
                disabled={contributing}
                className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {contributing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Contribute Now"
                )}
              </button>

              {/* Pending Notice */}
              <div className="mt-3 rounded-lg bg-emerald-50 p-3.5">
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />

                  <p className="text-xs leading-5 text-emerald-800">
                    After contribution, it will be pending until
                    creator approves.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default CampaignDetailsPage;