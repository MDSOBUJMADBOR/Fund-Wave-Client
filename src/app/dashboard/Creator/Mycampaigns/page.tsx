"use client";

import React, { useEffect, useState } from "react";
import { Table, Button } from "@heroui/react";
import { Eye, Trash, Pencil } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
// import EditModal from "@/components/EditModal";
// import AddCampaignsDelete from "@/components/AddCampaignsDelete";
import Image from "next/image";


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