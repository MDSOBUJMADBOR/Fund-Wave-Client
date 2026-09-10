
"use client";

import React, { useEffect, useState } from "react";
import { Table } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import EditModal from "@/components/EditModal";
import AddCampaignsDelete from "@/components/AddCampaignsDelete";
import Image from "next/image";
import Link from "next/link";
import { Campaign } from "@/types/campaign";

// ================= COMPONENT =================

const MYcampaigns = () => {
  const { data: session } = authClient.useSession();

  const user = session?.user;

  const [books, setBooks] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ================= FETCH MY CAMPAIGNS =================

  useEffect(() => {
    const getBooks = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/campaigns/email/${user.email}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch campaigns");
        }

        const data = await res.json();

        setBooks(data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    getBooks();
  }, [user?.email]);

  // ================= STATUS COLOR =================

  const getStatusColor = (status?: string): string => {
    if (status === "approved") {
      return "bg-green-500 text-white";
    }

    if (status === "rejected") {
      return "bg-red-500 text-white";
    }

    return "bg-yellow-500 text-white";
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-lg font-semibold text-gray-500">
          Loading campaigns...
        </p>
      </div>
    );
  }

  // ================= RETURN =================

  return (
    <div className="w-full">
      {/* ===================================================== */}
      {/* DESKTOP HEADER */}
      {/* ===================================================== */}

      <div className="hidden md:block">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Campaigns
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              Here are all the campaigns you have created. They are
              sorted by the deadline (latest first).
            </p>
          </div>

          <div>
            <Link href="/dashboard/Creator/Addnewcampaign">
              <button
                type="button"
                className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-violet-700 hover:shadow-lg active:scale-95"
              >
                + Add New Campaign
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* DESKTOP TABLE */}
      {/* ===================================================== */}

      <div className="hidden overflow-x-auto md:block">
        <Table className="min-w-[900px]">
          <Table.ScrollContainer>
            <Table.Content>
              {/* TABLE HEADER */}

              <Table.Header>
                <Table.Column>Title</Table.Column>
                <Table.Column>Goal (Credits)</Table.Column>
                <Table.Column>Raised (Credits)</Table.Column>
                <Table.Column>Deadline</Table.Column>
                <Table.Column>Status</Table.Column>
                <Table.Column>Actions</Table.Column>
              </Table.Header>

              {/* TABLE BODY */}

              <Table.Body>
                {books.length > 0 ? (
                  books.map((book) => (
                    <Table.Row key={book._id}>
                      {/* TITLE */}

                      <Table.Cell>
                        <div className="flex items-center gap-3">
                          <Image
                            src={book.campaign_image_url}
                            alt={book.campaign_title}
                            width={50}
                            height={50}
                            className="h-12 w-12 rounded-lg object-cover"
                          />

                          <span className="font-medium">
                            {book.campaign_title}
                          </span>
                        </div>
                      </Table.Cell>

                      {/* FUNDING GOAL */}

                      <Table.Cell>
                        {book.funding_goal}
                      </Table.Cell>

                      {/* RAISED */}

                      <Table.Cell>
                        {book.minimum_contribution}
                      </Table.Cell>

                      {/* DEADLINE */}

                      <Table.Cell>
                        {book.deadline
                          ? new Date(
                              book.deadline
                            ).toLocaleDateString("en-GB")
                          : "N/A"}
                      </Table.Cell>

                      {/* STATUS */}

                      <Table.Cell>
                        <span
                          className={`rounded-full px-3 py-1 text-sm ${getStatusColor(
                            book.status
                          )}`}
                        >
                          {book.status || "Pending"}
                        </span>
                      </Table.Cell>

                      {/* ACTIONS */}

                      <Table.Cell>
                        <div className="flex gap-2">
                          <EditModal book={book} />

                          <AddCampaignsDelete user={book} />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell
                      colSpan={6}
                      className="py-10 text-center text-2xl font-bold"
                    >
                      No Campaigns Found
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>

      {/* ===================================================== */}
      {/* MOBILE HEADER */}
      {/* ===================================================== */}

      <div className="mb-6 flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:hidden">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            My Campaigns
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and track all your campaigns.
          </p>
        </div>

        <Link href="/dashboard/Creator/Addnewcampaign">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-violet-700 hover:shadow-lg active:scale-95"
          >
            <span className="text-lg">+</span>

            <span className="hidden sm:inline">
              Add New Campaign
            </span>
          </button>
        </Link>
      </div>

      {/* ===================================================== */}
      {/* MOBILE CAMPAIGN CARDS */}
      {/* ===================================================== */}

      <div className="space-y-4 md:hidden">
        {books.length > 0 ? (
          books.map((book) => (
            <div
              key={book._id}
              className="rounded-xl bg-white p-4 shadow"
            >
              {/* IMAGE + TITLE */}

              <div className="flex items-center gap-3">
                <Image
                  src={book.campaign_image_url}
                  alt={book.campaign_title}
                  width={60}
                  height={60}
                  className="h-14 w-14 rounded-lg object-cover"
                />

                <h2 className="text-lg font-bold">
                  {book.campaign_title}
                </h2>
              </div>

              {/* GOAL */}

              <p className="mt-4 text-sm text-gray-500">
                Goal (Credits):{" "}
                <span className="font-semibold text-gray-700">
                  {book.funding_goal}
                </span>
              </p>

              {/* RAISED */}

              <p className="mt-1 text-sm text-gray-500">
                Raised (Credits):{" "}
                <span className="font-semibold text-gray-700">
                  {book.minimum_contribution}
                </span>
              </p>

              {/* DEADLINE */}

              <p className="mt-1 text-sm text-gray-500">
                Deadline:{" "}
                <span className="font-semibold text-gray-700">
                  {book.deadline
                    ? new Date(
                        book.deadline
                      ).toLocaleDateString("en-GB")
                    : "N/A"}
                </span>
              </p>

              {/* STATUS */}

              <p className="mt-3">
                <span className="mr-2 text-sm text-gray-600">
                  Status:
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-sm ${getStatusColor(
                    book.status
                  )}`}
                >
                  {book.status || "Pending"}
                </span>
              </p>

              {/* ACTIONS */}

              <div className="mt-4 flex gap-2">
                <EditModal book={book} />

                <AddCampaignsDelete user={book} />
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border py-10 text-center text-2xl font-bold">
            No Campaigns Found
          </div>
        )}
      </div>
    </div>
  );
};

export default MYcampaigns;

