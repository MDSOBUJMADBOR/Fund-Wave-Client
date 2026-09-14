
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

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

const fallbackImage =
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1200&q=80";

const CampaignDetailsPage = () => {
  const params = useParams();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!campaignId) return;

    let isMounted = true;

    const fetchCampaign = async () => {
      try {
        setLoading(true);

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
        console.error(err);

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

    return Number(
      campaign.amount_raised ??
        campaign.minimum_contribution ??
        0
    );
  };

  const getProgress = () => {
    if (!campaign?.funding_goal) return 0;

    return Math.min(
      Math.round(
        (getAmountRaised() / campaign.funding_goal) * 100
      ),
      100
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading campaign...
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-red-500">
          {error || "Campaign not found"}
        </p>

        <Link
          href="/explorecampaigns"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/explorecampaigns"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-violet-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </Link>

        <div className="grid gap-8 overflow-hidden rounded-2xl bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-2">
          {/* Campaign Image */}
          <div className="relative min-h-[280px] overflow-hidden rounded-xl bg-gray-100 sm:min-h-[420px]">
            <Image
              src={campaign.campaign_image_url || fallbackImage}
              alt={campaign.campaign_title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Campaign Information */}
          <div className="flex flex-col justify-center">
            <span className="mb-4 w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-bold capitalize text-violet-700">
              {campaign.category || "General"}
            </span>

            <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              {campaign.campaign_title}
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              Created by {campaign.creatorName || "Campaign Creator"}
            </p>

            <p className="mt-6 leading-7 text-gray-600">
              {campaign.campaign_story ||
                "Support this campaign and help make a positive impact."}
            </p>

            <div className="mt-8 rounded-xl bg-gray-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${getAmountRaised().toLocaleString()}
                  </p>

                  <p className="text-sm text-gray-500">
                    raised of $
                    {campaign.funding_goal.toLocaleString()}
                  </p>
                </div>

                <p className="text-lg font-bold text-violet-600">
                  {getProgress()}%
                </p>
              </div>

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-violet-600"
                  style={{
                    width: `${getProgress()}%`,
                  }}
                />
              </div>
            </div>

            {campaign.deadline && (
              <p className="mt-5 text-sm text-gray-500">
                Deadline:{" "}
                <span className="font-semibold text-gray-800">
                  {campaign.deadline}
                </span>
              </p>
            )}

            <button className="mt-7 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-violet-700">
              Support This Campaign
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CampaignDetailsPage;