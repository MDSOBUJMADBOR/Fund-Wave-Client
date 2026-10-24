"use client";

import React, { useEffect, useState } from "react";
import { Table } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import EditModal from "@/components/EditModal";
import AddCampaignsDelete from "@/components/AddCampaignsDelete";
import Image from "next/image";
import Link from "next/link";
import { Campaign } from "@/types/campaign";
import { PlusCircle, Loader2, Calendar, Target, Coins } from "lucide-react";

const MYcampaigns = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const reloadCampaigns = () => setRefreshTrigger((prev) => prev + 1);

  // ================= FETCH MY CAMPAIGNS =================
  useEffect(() => {
    let ignore = false;

    async function loadCampaigns() {
      if (!user?.email) {
        if (!ignore) setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `${API_BASE}/campaigns/email/${encodeURIComponent(user?.email || "")}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch campaigns");
        }

        const data: Campaign[] = await res.json();

        // Ensure descending order based on deadline
        const sorted = [...data].sort((a, b) => {
          const timeA = a.deadline ? new Date(a.deadline).getTime() : 0;
          const timeB = b.deadline ? new Date(b.deadline).getTime() : 0;
          return timeB - timeA;
        });

        if (!ignore) {
          setCampaigns(sorted);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        if (!ignore) {
          setCampaigns([]);
          setLoading(false);
        }
      }
    }

    loadCampaigns();

    return () => {
      ignore = true;
    };
  }, [user?.email, refreshTrigger, API_BASE]);

  // ================= STATUS COLOR =================
  const getStatusBadge = (status?: string) => {
    const s = status?.toLowerCase() || "pending";
    if (s === "approved") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Approved
        </span>
      );
    }

    if (s === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
        Pending Review
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        <p className="text-sm font-semibold text-gray-500">Loading your campaigns...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* ===================================================== */}
      {/* HEADER SECTION */}
      {/* ===================================================== */}
      <div className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              My Campaigns
            </h1>
            <span className="rounded-full bg-violet-100 px-3 py-0.5 text-xs font-bold text-violet-700">
              {campaigns.length} Total
            </span>
          </div>

          <p className="mt-1.5 max-w-2xl text-sm text-gray-500">
            Manage your campaigns, track raised contributions, and update details. Sorted by deadline (latest first).
          </p>
        </div>

        <div>
          <Link
            href="/dashboard/Creator/Addnewcampaign"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-violet-700 hover:shadow-lg active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            Add New Campaign
          </Link>
        </div>
      </div>

      {/* ===================================================== */}
      {/* DESKTOP TABLE */}
      {/* ===================================================== */}
      <div className="hidden overflow-x-auto md:block rounded-2xl border border-gray-200 bg-white shadow-sm">
        <Table className="min-w-[950px] w-full">
          <Table.ScrollContainer>
            <Table.Content>
              <Table.Header>
                <Table.Column className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Campaign
                </Table.Column>
                <Table.Column className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Goal (Credits)
                </Table.Column>
                <Table.Column className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Raised (Credits)
                </Table.Column>
                <Table.Column className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Deadline
                </Table.Column>
                <Table.Column className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Status
                </Table.Column>
                <Table.Column className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">
                  Actions
                </Table.Column>
              </Table.Header>

              <Table.Body>
                {campaigns.length > 0 ? (
                  campaigns.map((camp) => (
                    <Table.Row key={camp._id} className="border-b border-gray-100 hover:bg-violet-50/20 transition-colors">
                      {/* TITLE & IMAGE */}
                      <Table.Cell className="py-4 px-5">
                        <div className="flex items-center gap-3.5">
                          <Image
                            src={camp.campaign_image_url || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=100"}
                            alt={camp.campaign_title}
                            width={52}
                            height={52}
                            className="h-12 w-12 rounded-xl object-cover border border-gray-100 shadow-sm"
                          />
                          <div className="max-w-[260px]">
                            <span className="font-bold text-gray-900 block truncate" title={camp.campaign_title}>
                              {camp.campaign_title}
                            </span>
                            <span className="text-xs text-gray-400 capitalize">
                              {camp.category || "General"}
                            </span>
                          </div>
                        </div>
                      </Table.Cell>

                      {/* FUNDING GOAL */}
                      <Table.Cell className="py-4 px-4 font-semibold text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <Target className="h-4 w-4 text-gray-400" />
                          <span>{camp.funding_goal}</span>
                        </div>
                      </Table.Cell>

                      {/* RAISED CREDITS */}
                      <Table.Cell className="py-4 px-4">
                        <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                          <Coins className="h-3.5 w-3.5" />
                          <span>{camp.amount_raised ?? 0}</span>
                        </div>
                      </Table.Cell>

                      {/* DEADLINE */}
                      <Table.Cell className="py-4 px-4 text-xs font-medium text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          <span>
                            {camp.deadline
                              ? new Date(camp.deadline).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </span>
                        </div>
                      </Table.Cell>

                      {/* STATUS */}
                      <Table.Cell className="py-4 px-4">
                        {getStatusBadge(camp.status)}
                      </Table.Cell>

                      {/* ACTIONS */}
                      <Table.Cell className="py-4 px-5">
                        <div className="flex items-center justify-center gap-2">
                          <EditModal book={camp} onUpdated={reloadCampaigns} />
                          <AddCampaignsDelete user={camp} onDeleted={reloadCampaigns} />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={6} className="py-14 text-center">
                      <p className="text-lg font-bold text-gray-800">No campaigns added yet</p>
                      <p className="text-xs text-gray-400 mt-1">Start by adding your first project to raise funding.</p>
                      <Link
                        href="/dashboard/Creator/Addnewcampaign"
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-violet-700"
                      >
                        + Add Campaign
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>

      {/* ===================================================== */}
      {/* MOBILE CAMPAIGN CARDS */}
      {/* ===================================================== */}
      <div className="space-y-4 md:hidden">
        {campaigns.length > 0 ? (
          campaigns.map((camp) => (
            <div key={camp._id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-start gap-3.5">
                <Image
                  src={camp.campaign_image_url || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=100"}
                  alt={camp.campaign_title}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-xl object-cover border border-gray-100 shadow-sm shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold text-gray-900 truncate">
                    {camp.campaign_title}
                  </h2>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">
                    {camp.category || "General"}
                  </p>
                  <div className="mt-2">
                    {getStatusBadge(camp.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-xl bg-gray-50 p-3 text-center border border-gray-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Goal</span>
                  <span className="text-sm font-bold text-gray-800">{camp.funding_goal}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Raised</span>
                  <span className="text-sm font-bold text-amber-700">{camp.amount_raised ?? 0}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Deadline</span>
                  <span className="text-xs font-semibold text-gray-700">
                    {camp.deadline
                      ? new Date(camp.deadline).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <EditModal book={camp} onUpdated={reloadCampaigns} />
                <AddCampaignsDelete user={camp} onDeleted={reloadCampaigns} />
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white py-12 text-center p-6">
            <p className="text-base font-bold text-gray-800">No Campaigns Found</p>
            <p className="text-xs text-gray-400 mt-1">Get started by launching your first campaign.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MYcampaigns;
