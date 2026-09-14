"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  Trash2,
  X,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Campaign {
  _id: string;

  title?: string;
  campaign_title?: string;
  name?: string;

  story?: string;
  campaign_story?: string;

  category?: string;

  funding_goal?: number;
  fundingGoal?: number;

  amount_raised?: number;
  amountRaised?: number;

  minimum_contribution?: number;
  minimumContribution?: number;

  deadline?: string;
  status?: string;

  campaign_image_url?: string;
  campaignImage?: string;
  image?: string;

  creator_name?: string;
  creatorName?: string;

  creator_email?: string;
  creatorEmail?: string;

  creator_photo?: string;
  creatorPhoto?: string;

  photo_url?: string;
}

type Status = "pending" | "approved" | "rejected";
type StatusFilter = "all" | Status;

interface ApiResponse {
  success?: boolean;
  data?: Campaign[];
  campaigns?: Campaign[];
}

const fallbackImages = [
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&q=80",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80",
  "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=500&q=80",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80",
];

const getTitle = (campaign: Campaign) =>
  campaign.title ||
  campaign.campaign_title ||
  campaign.name ||
  "Untitled Campaign";

const getStory = (campaign: Campaign) =>
  campaign.story || campaign.campaign_story || "";

const getCreatorName = (campaign: Campaign) =>
  campaign.creator_name ||
  campaign.creatorName ||
  "Unknown Creator";

const getCreatorEmail = (campaign: Campaign) =>
  campaign.creator_email ||
  campaign.creatorEmail ||
  "";

const getImage = (campaign: Campaign, index: number) =>
  campaign.campaign_image_url ||
  campaign.campaignImage ||
  campaign.image ||
  fallbackImages[index % fallbackImages.length];

const getGoal = (campaign: Campaign) =>
  Number(campaign.funding_goal ?? campaign.fundingGoal ?? 0);

const getRaised = (campaign: Campaign) =>
  Number(
    campaign.amount_raised ??
      campaign.amountRaised ??
      campaign.minimum_contribution ??
      campaign.minimumContribution ??
      0
  );

const getStatus = (campaign: Campaign): Status => {
  const status = campaign.status?.toLowerCase();

  if (status === "approved") return "approved";
  if (status === "rejected") return "rejected";

  return "pending";
};

const formatCredits = (amount: number) =>
  new Intl.NumberFormat("en-US").format(amount);

const formatDate = (date?: string) => {
  if (!date) return "No deadline";

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

const getProgress = (raised: number, goal: number) => {
  if (goal <= 0) return 0;

  return Math.min(Math.round((raised / goal) * 100), 100);
};

export default function ManageCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState<string | null>(
    null
  );

  const [deleteModal, setDeleteModal] = useState<Campaign | null>(
    null
  );

  const itemsPerPage = 7;

  useEffect(() => {
    let cancelled = false;

    const loadCampaigns = async () => {
      try {
        const response = await fetch(`${API_URL}/campaigns`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch campaigns");
        }

        const result: ApiResponse | Campaign[] =
          await response.json();

        const data = Array.isArray(result)
          ? result
          : result.data || result.campaigns || [];

        if (!cancelled) {
          setCampaigns(data);
          setError("");
        }
      } catch (err) {
        console.error("Campaign fetch error:", err);

        if (!cancelled) {
          setError("Failed to load campaigns. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCampaigns();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateCampaignStatus = async (
    campaign: Campaign,
    status: Status
  ) => {
    const id = campaign._id;

    if (!id) return;

    try {
      setActionLoading(id);
      setOpenMenu(null);

      const response = await fetch(`${API_URL}/campaigns/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update campaign status");
      }

      setCampaigns((previous) =>
        previous.map((item) =>
          item._id === id ? { ...item, status } : item
        )
      );
    } catch (err) {
      console.error("Status update error:", err);
      alert("Could not update campaign status.");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteCampaign = async () => {
    if (!deleteModal?._id) return;

    const id = deleteModal._id;

    try {
      setActionLoading(id);

      const response = await fetch(`${API_URL}/campaigns/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete campaign");
      }

      setCampaigns((previous) =>
        previous.filter((item) => item._id !== id)
      );

      setDeleteModal(null);
      setOpenMenu(null);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Could not delete campaign.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const title = getTitle(campaign).toLowerCase();
    const creator = getCreatorName(campaign).toLowerCase();
    const category = (campaign.category || "").toLowerCase();
    const searchText = search.toLowerCase();

    const matchesSearch =
      title.includes(searchText) ||
      creator.includes(searchText) ||
      category.includes(searchText);

    const matchesStatus =
      statusFilter === "all" ||
      getStatus(campaign) === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCampaigns.length / itemsPerPage)
  );

  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;

  const paginatedCampaigns = filteredCampaigns.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilter = (value: StatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <main
      className="min-h-screen bg-[#f8fafc] px-3 py-4 sm:px-5 lg:px-8 lg:py-6"
      onClick={() => setOpenMenu(null)}
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-5 sm:mb-6">
          <h1 className="text-xl font-bold tracking-tight text-[#142e55] sm:text-2xl">
            Manage Campaigns
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review, approve, and manage all campaigns.
          </p>
        </div>

        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                handleSearch(event.target.value)
              }
              placeholder="Search campaigns..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-slate-500 sm:block">
              Status:
            </span>

            <div className="relative w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(event) =>
                  handleStatusFilter(
                    event.target.value as StatusFilter
                  )
                }
                className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm font-medium text-slate-600 outline-none focus:border-emerald-500 sm:min-w-32"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : filteredCampaigns.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-xl border border-[#dce6f2] bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#dce6f2] bg-[#f4f8fc]">
                      <th className="w-12 px-4 py-4 text-center text-xs font-bold text-[#172f54]">
                        #
                      </th>

                      <th className="px-4 py-4 text-xs font-bold text-[#172f54]">
                        Campaign
                      </th>

                      <th className="px-4 py-4 text-xs font-bold text-[#172f54]">
                        Creator
                      </th>

                      <th className="px-4 py-4 text-xs font-bold text-[#172f54]">
                        Category
                      </th>

                      <th className="px-4 py-4 text-xs font-bold text-[#172f54]">
                        Funding Goal
                      </th>

                      <th className="px-4 py-4 text-xs font-bold text-[#172f54]">
                        Amount Raised
                      </th>

                      <th className="px-4 py-4 text-xs font-bold text-[#172f54]">
                        Deadline
                      </th>

                      <th className="px-4 py-4 text-xs font-bold text-[#172f54]">
                        Status
                      </th>

                      <th className="px-4 py-4 text-xs font-bold text-[#172f54]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedCampaigns.map((campaign, index) => (
                      <CampaignTableRow
                        key={campaign._id}
                        campaign={campaign}
                        index={startIndex + index}
                        actionLoading={actionLoading}
                        openMenu={openMenu}
                        setOpenMenu={setOpenMenu}
                        onStatusChange={updateCampaignStatus}
                        onDelete={setDeleteModal}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4 md:hidden">
              {paginatedCampaigns.map((campaign, index) => (
                <CampaignMobileCard
                  key={campaign._id}
                  campaign={campaign}
                  index={startIndex + index}
                  actionLoading={actionLoading}
                  openMenu={openMenu}
                  setOpenMenu={setOpenMenu}
                  onStatusChange={updateCampaignStatus}
                  onDelete={setDeleteModal}
                />
              ))}
            </div>

            <Pagination
              page={safePage}
              totalPages={totalPages}
              totalItems={filteredCampaigns.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {deleteModal && (
        <DeleteModal
          campaign={deleteModal}
          loading={actionLoading === deleteModal._id}
          onCancel={() => setDeleteModal(null)}
          onConfirm={deleteCampaign}
        />
      )}
    </main>
  );
}

interface CampaignRowProps {
  campaign: Campaign;
  index: number;
  actionLoading: string | null;
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
  onStatusChange: (campaign: Campaign, status: Status) => void;
  onDelete: (campaign: Campaign) => void;
}

function CampaignTableRow({
  campaign,
  index,
  actionLoading,
  openMenu,
  setOpenMenu,
  onStatusChange,
  onDelete,
}: CampaignRowProps) {
  const status = getStatus(campaign);
  const goal = getGoal(campaign);
  const raised = getRaised(campaign);
  const progress = getProgress(raised, goal);
  const image = getImage(campaign, index);
  const title = getTitle(campaign);
  const story = getStory(campaign);
  const creator = getCreatorName(campaign);
  const email = getCreatorEmail(campaign);
  const isLoading = actionLoading === campaign._id;

  return (
    <tr className="border-b border-[#e5edf5] last:border-b-0 hover:bg-slate-50/60">
      <td className="px-4 py-5 text-center text-sm font-semibold text-[#17355e]">
        {index + 1}
      </td>

      <td className="px-4 py-5">
        <div className="flex min-w-[260px] items-center gap-3">
          <Image
            src={image}
            alt={title}
            width={72}
            height={72}
            unoptimized
            className="h-[72px] w-[72px] shrink-0 rounded-lg object-cover"
          />

          <div className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-bold leading-5 text-[#18365f]">
              {title}
            </h3>

            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
              {story || "No campaign description available."}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-5">
        <div className="flex min-w-[150px] items-center gap-2">
          <CreatorAvatar
            name={creator}
            image={
              campaign.creator_photo ||
              campaign.creatorPhoto ||
              campaign.photo_url
            }
          />

          <div>
            <p className="text-sm font-semibold text-[#17355e]">
              {creator}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {email || "No email"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-5">
        <CategoryBadge category={campaign.category} />
      </td>

      <td className="px-4 py-5">
        <div className="min-w-[90px]">
          <p className="text-sm font-bold text-[#17355e]">
            {formatCredits(goal)}
          </p>

          <p className="mt-1 text-xs text-slate-500">credits</p>
        </div>
      </td>

      <td className="px-4 py-5">
        <div className="min-w-[110px]">
          <p className="text-sm font-bold text-[#17355e]">
            {formatCredits(raised)}
          </p>

          <p className="mt-1 text-xs text-slate-500">credits</p>

          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-1 text-right text-[10px] text-slate-400">
            {progress}%
          </p>
        </div>
      </td>

      <td className="px-4 py-5">
        <p className="whitespace-nowrap text-xs font-medium text-slate-500">
          {formatDate(campaign.deadline)}
        </p>
      </td>

      <td className="px-4 py-5">
        <StatusBadge status={status} />
      </td>

      <td className="px-4 py-5">
        <div className="flex items-center gap-2">
          {status === "pending" ? (
            <>
              <ActionButton
                type="approve"
                loading={isLoading}
                onClick={() =>
                  onStatusChange(campaign, "approved")
                }
              />

              <ActionButton
                type="reject"
                loading={isLoading}
                onClick={() =>
                  onStatusChange(campaign, "rejected")
                }
              />
            </>
          ) : (
            <ActionButton
              type="delete"
              loading={isLoading}
              onClick={() => onDelete(campaign)}
            />
          )}

          <MoreButton
            campaignId={campaign._id}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            campaign={campaign}
          />
        </div>
      </td>
    </tr>
  );
}

function CampaignMobileCard({
  campaign,
  index,
  actionLoading,
  openMenu,
  setOpenMenu,
  onStatusChange,
  onDelete,
}: CampaignRowProps) {
  const status = getStatus(campaign);
  const goal = getGoal(campaign);
  const raised = getRaised(campaign);
  const progress = getProgress(raised, goal);
  const image = getImage(campaign, index);
  const title = getTitle(campaign);
  const creator = getCreatorName(campaign);
  const email = getCreatorEmail(campaign);
  const isLoading = actionLoading === campaign._id;

  return (
    <article className="overflow-hidden rounded-xl border border-[#dce6f2] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <span className="text-sm font-bold text-[#17355e]">
          #{index + 1}
        </span>

        <div className="flex items-center gap-2">
          <StatusBadge status={status} />

          <MoreButton
            campaignId={campaign._id}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            campaign={campaign}
          />
        </div>
      </div>

      <div className="flex gap-3 p-4">
        <Image
          src={image}
          alt={title}
          width={96}
          height={96}
          unoptimized
          className="h-24 w-24 shrink-0 rounded-lg object-cover"
        />

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-bold leading-5 text-[#17355e]">
            {title}
          </h3>

          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
            {getStory(campaign) ||
              "No campaign description available."}
          </p>

          <div className="mt-2">
            <CategoryBadge category={campaign.category} />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 px-4 py-3">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
          Creator
        </p>

        <div className="flex items-center gap-3">
          <CreatorAvatar
            name={creator}
            image={
              campaign.creator_photo ||
              campaign.creatorPhoto ||
              campaign.photo_url
            }
          />

          <div>
            <p className="text-sm font-semibold text-[#17355e]">
              {creator}
            </p>

            <p className="text-xs text-slate-500">
              {email || "No email"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-slate-100 p-4">
        <div>
          <p className="text-xs text-slate-500">Funding Goal</p>

          <p className="mt-1 text-sm font-bold text-[#17355e]">
            {formatCredits(goal)}
          </p>

          <p className="text-xs text-slate-400">credits</p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Amount Raised</p>

          <p className="mt-1 text-sm font-bold text-[#17355e]">
            {formatCredits(raised)}
          </p>

          <p className="text-xs text-slate-400">credits</p>
        </div>

        <div className="col-span-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Funding Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="col-span-2">
          <p className="text-xs text-slate-500">Deadline</p>

          <p className="mt-1 text-sm font-semibold text-[#17355e]">
            {formatDate(campaign.deadline)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-slate-50/50 p-4">
        {status === "pending" ? (
          <>
            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                onStatusChange(campaign, "approved")
              }
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check size={15} />
              Approve
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                onStatusChange(campaign, "rejected")
              }
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-rose-500 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={15} />
              Reject
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onDelete(campaign)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-rose-500 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={15} />
            Delete Campaign
          </button>
        )}
      </div>
    </article>
  );
}

function CreatorAvatar({
  name,
  image,
}: {
  name: string;
  image?: string;
}) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        width={40}
        height={40}
        unoptimized
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-[#17355e]">
      {initials}
    </div>
  );
}

function CategoryBadge({ category }: { category?: string }) {
  const categoryName = category || "Other";

  const colors: Record<string, string> = {
    health: "bg-green-100 text-green-700",
    education: "bg-blue-100 text-blue-700",
    environment: "bg-emerald-100 text-emerald-700",
    technology: "bg-sky-100 text-sky-700",
    community: "bg-pink-100 text-pink-700",
    art: "bg-rose-100 text-rose-700",
    other: "bg-slate-100 text-slate-600",
  };

  const color =
    colors[categoryName.toLowerCase()] || colors.other;

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${color}`}
    >
      {categoryName}
    </span>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-rose-100 text-rose-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function ActionButton({
  type,
  loading,
  onClick,
}: {
  type: "approve" | "reject" | "delete";
  loading: boolean;
  onClick: () => void;
}) {
  const config = {
    approve: {
      label: "Approve",
      icon: Check,
      className: "bg-emerald-600 hover:bg-emerald-700",
    },
    reject: {
      label: "Reject",
      icon: X,
      className: "bg-rose-500 hover:bg-rose-600",
    },
    delete: {
      label: "Delete",
      icon: Trash2,
      className: "bg-rose-500 hover:bg-rose-600",
    },
  };

  const item = config[type];
  const Icon = item.icon;

  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${item.className}`}
    >
      {loading ? (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <Icon size={14} />
      )}

      {item.label}
    </button>
  );
}

function MoreButton({
  campaignId,
  openMenu,
  setOpenMenu,
  onStatusChange,
  onDelete,
  campaign,
}: {
  campaignId: string;
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
  onStatusChange: (campaign: Campaign, status: Status) => void;
  onDelete: (campaign: Campaign) => void;
  campaign: Campaign;
}) {
  const isOpen = openMenu === campaignId;

  return (
    <div
      className="relative"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={() =>
          setOpenMenu(isOpen ? null : campaignId)
        }
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
        aria-label="More actions"
      >
        <MoreHorizontal size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-xl">
          <button
            type="button"
            onClick={() => {
              onStatusChange(campaign, "approved");
              setOpenMenu(null);
            }}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50"
          >
            <Check size={15} />
            Approve Campaign
          </button>

          <button
            type="button"
            onClick={() => {
              onStatusChange(campaign, "rejected");
              setOpenMenu(null);
            }}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50"
          >
            <X size={15} />
            Reject Campaign
          </button>

          <button
            type="button"
            onClick={() => {
              onDelete(campaign);
              setOpenMenu(null);
            }}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50"
          >
            <Trash2 size={15} />
            Delete Campaign
          </button>
        </div>
      )}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}) {
  const start =
    totalItems === 0 ? 0 : (page - 1) * itemsPerPage + 1;

  const end = Math.min(page * itemsPerPage, totalItems);

  return (
    <div className="mt-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-slate-500 sm:text-sm">
        Showing{" "}
        <span className="font-semibold text-slate-700">
          {start}-{end}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-700">
          {totalItems}
        </span>{" "}
        campaigns
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        )
          .slice(
            Math.max(0, page - 3),
            Math.min(totalPages, page + 2)
          )
          .map((pageNumber) => (
            <button
              type="button"
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition ${
                pageNumber === page
                  ? "bg-emerald-600 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {pageNumber}
            </button>
          ))}

        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className="h-24 animate-pulse rounded-xl border border-slate-200 bg-white"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <p className="text-base font-semibold text-slate-700">
        No campaigns found
      </p>

      <p className="mt-1 text-sm text-slate-500">
        Try changing your search or status filter.
      </p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 px-6 py-12 text-center">
      <p className="text-sm font-semibold text-rose-700">
        {message}
      </p>
    </div>
  );
}

function DeleteModal({
  campaign,
  loading,
  onCancel,
  onConfirm,
}: {
  campaign: Campaign;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-[#17355e]">
          Delete Campaign?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-700">
            {getTitle(campaign)}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}

            Delete Campaign
          </button>
        </div>
      </div>
    </div>
  );
}