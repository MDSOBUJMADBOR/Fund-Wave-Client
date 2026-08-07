"use client";

import React, { useEffect, useState } from "react";
import { Table  } from "@heroui/react";
import { Eye, Trash, Pencil } from "lucide-react";
import { authClient } from "@/lib/auth-client";
// import EditModal from "@/components/EditModal";
// import AddCampaignsDelete from "@/components/AddCampaignsDelete";
import Image from "next/image";
import Link from "next/link";


type Campaign = {
  _id: string;
  campaign_title: string;
  campaign_image_url: string;
  funding_goal: number;
  minimum_contribution: number;
  deadline: string;
  status: string;
};


const MYcampaigns = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
 
const [books, setBooks] = useState<Campaign[]>([]);
  console.log(books,);

  // ✅ fetch books
  useEffect(() => {
    const getBooks = async () => { 
      if (!user?.email) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/campaigns/email/${user.email}`
        );
        const data = await res.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    getBooks();
  }, [user]);

  
const getStatusColor = (status?: string) => {
  if (status === "approved") return "bg-green-500 text-white";
  if (status === "rejected") return "bg-red-500 text-white";
  return "bg-yellow-500 text-white";
};
 

  return (
    <div className="w-full">

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">


<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
  <div>
    <h1 className="text-3xl font-bold text-gray-900">
      My Campaigns
    </h1>

    <p className="mt-2 max-w-2xl text-sm text-gray-600">
      Here are all the campaigns you have created. They are sorted by
      the deadline (latest first).
    </p>
  </div>

  <div>
<Link href={"/dashboard/Creator/Addnewcampaign"}><button className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-violet-700 hover:shadow-lg active:scale-95">
      + Add New Campaign
    </button></Link>
  </div>
</div>





        <Table className="min-w-[900px]">
          <Table.ScrollContainer>
            <Table.Content>

              <Table.Header>
                <Table.Column>Title</Table.Column>
                <Table.Column>Goal(Credits)</Table.Column>
                <Table.Column>Raised(Credits)</Table.Column>
                <Table.Column>Deadline</Table.Column>
                <Table.Column>Status</Table.Column>
                <Table.Column>Actions</Table.Column>
              </Table.Header>
              <Table.Body>
                {books.length > 0 ? (
                  books.map((book) => (
                    <Table.Row key={book._id}>
                      <Table.Cell>
  <div className="flex items-center gap-3">
    <Image
      src={book.campaign_image_url}
      alt={book.campaign_title}
      width={50}
      height={50}
      className="w-12 h-12 rounded-lg object-cover"
    />

    <span className="font-medium">
      {book.campaign_title}
    </span>
  </div>
</Table.Cell>
                      <Table.Cell>{book.funding_goal}</Table.Cell>
                      <Table.Cell>{book.minimum_contribution}</Table.Cell>
<Table.Cell>
  {new Date(book.deadline).toLocaleDateString("en-GB")}
</Table.Cell>

                      <Table.Cell>
                       
                        <span
  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
    book.status
  )}`}
>
  {book.status || "Pending"}
</span>
                      </Table.Cell>

                      <Table.Cell>
                        <div className="flex gap-2">
                                                  

                             {/* <EditModal book={book}></EditModal>  */}
                             Editmodal
                            {/* <AddCampaignsDelete user={book}></Add> */}
                            delete
                        

                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={6} className="text-center font-bold text-2xl py-10">
                      No Books Found
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>

            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>

      {/* ================= MOBILE CARD ================= */}

<div className="md:hidden flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm mb-6">
  <div>
    <h1 className="text-xl font-bold text-gray-900">
      My Campaigns
    </h1>
    <p className="text-sm text-gray-500 mt-1">
      Manage and track all your campaigns.
    </p>
  </div>

  <Link href="/dashboard/Creator/Addnewcampaign">
    <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-violet-700 hover:shadow-lg active:scale-95">
      <span className="text-lg">+</span>
      <span>Add New Campaign</span>
    </button>
  </Link>
</div>



      <div className="md:hidden space-y-4">
        {books.length > 0 ? (
          books.map((book) => (
            <div
              key={book._id}
              className="bg-white p-4 rounded-xl shadow"
            >
<div className="flex items-center gap-3">
  <Image
    src={book.campaign_image_url}
    alt={book.campaign_title}
    width={60}
    height={60}
    className="w-14 h-14 rounded-lg object-cover"
  />

  <h2 className="font-bold text-lg">
    {book.campaign_title}
  </h2>
</div>


              <p className="text-sm text-gray-500">
                Goal(Credits) : {book.funding_goal}
              </p>

              <p className="text-sm text-gray-500">
                Raised(Credits) : {book.minimum_contribution}
              </p>

<p className="text-sm text-gray-500">
  Deadline : {new Date(book.deadline).toLocaleDateString("en-GB")}
</p>

              <p className="mt-2">
                Status:{" "}
              <span
  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
    book.status
  )}`}
>
  {book.status || "Pending"}
</span>
              </p>

              <div className="flex gap-2 mt-3">


               {/* <EditModal book={book}></EditModal> */}
               EditModal 
              {/* <AddBookDelect user={book}></AddBookDelect> */}
              delete 
              </div>
            </div>
          ))
        ) : (
          <div className="text-center border rounded-2xl text-2xl py-10">
            No Books Found
          </div>
        )}
      </div>
    </div>
  );
};

export default MYcampaigns;