"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
  createdAt?: string;
}

const fallbackImage =
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80";

const TopFoundedCampaigns = () => {
  const router = useRouter();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/campaignss",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch campaigns");
        }

        const result = await response.json();

        const campaignData = Array.isArray(result)
          ? result
          : result.data || [];

        if (isMounted) {
          setCampaigns(campaignData);
        }
      } catch (err) {
        console.error("Campaign fetch error:", err);

        if (isMounted) {
          setError("Unable to load campaigns");
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
  }, []);

  const getAmountRaised = (campaign: Campaign) => {
    return Number(
      campaign.amount_raised ??
        campaign.minimum_contribution ??
        0
    );
  };

  const getProgress = (campaign: Campaign) => {
    const raised = getAmountRaised(campaign);
    const goal = Number(campaign.funding_goal || 0);

    if (!goal) return 0;

    return Math.min(Math.round((raised / goal) * 100), 100);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US").format(amount);
  };

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "technology":
        return "bg-blue-50 text-blue-700";
      case "education":
        return "bg-orange-50 text-orange-700";
      case "health":
        return "bg-red-50 text-red-700";
      case "community":
        return "bg-green-50 text-green-700";
      case "art":
        return "bg-purple-50 text-purple-700";
      case "environment":
        return "bg-emerald-50 text-emerald-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const openDetailsPage = (id: string) => {
    router.push(`/campaigns/${id}`);
  };

  if (loading) {
    return (
      <section className="w-full py-10">
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading campaigns...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-10">
        <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-center text-sm text-red-600">
          {error}
        </div>
      </section>
    );
  }

  if (campaigns.length === 0) {
    return (
      <section className="w-full py-10">
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-8 text-center text-sm text-gray-500">
          No campaigns found.
        </div>
      </section>
    );
  }

  const topCampaigns = [...campaigns]
    .sort(
      (a, b) =>
        getAmountRaised(b) - getAmountRaised(a)
    )
    .slice(0, 6);

  return (
    <section className="w-full bg-white py-8 sm:py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            Top Funded Campaigns
          </h2>

          <button
            onClick={() => router.push("/explorecampaigns")}
            className="flex items-center gap-1 text-xs font-semibold text-violet-600 transition hover:text-violet-800 sm:text-sm"
          >
            View All
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Campaign Cards */}
        <div className="grid grid-cols-1 gap-5  md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-5">
          {topCampaigns.map((campaign) => {
            const raised = getAmountRaised(campaign);
            const progress = getProgress(campaign);

            return (
              <article
                key={campaign._id}
                onClick={() => openDetailsPage(campaign._id)}
                className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative h-32 w-full overflow-hidden bg-gray-100 sm:h-36">
                  <img
                    src={campaign.campaign_image_url || fallbackImage}
                    alt={campaign.campaign_title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.src = fallbackImage;
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                {/* Card Content */}
                <div className="p-3">
                  {/* Category */}
                  <div className="mb-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-[9px] font-bold capitalize ${getCategoryColor(
                        campaign.category
                      )}`}
                    >
                      {campaign.category || "General"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="line-clamp-2 min-h-[36px] text-sm font-bold leading-5 text-gray-900">
                    {campaign.campaign_title}
                  </h3>

                  {/* Creator */}
                  <p className="mt-1 truncate text-[10px] text-gray-500">
                    {campaign.creatorName
                      ? `By ${campaign.creatorName}`
                      : "Campaign Creator"}
                  </p>

                  {/* Funding Information */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-2 text-[10px]">
                      <p className="font-bold text-gray-900">
                        ${formatAmount(raised)}
                        <span className="font-normal text-gray-400">
                          {" "}
                          / ${formatAmount(campaign.funding_goal)}
                        </span>
                      </p>

                      <span className="font-semibold text-gray-500">
                        {progress}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-violet-600 transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopFoundedCampaigns;