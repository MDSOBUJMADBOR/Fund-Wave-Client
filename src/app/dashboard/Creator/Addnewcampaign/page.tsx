"use client";

import { FormEvent, useState } from "react";
import {
  FileText,
  Layers,
  Target,
  Calendar,
  Gift,
  DollarSign,
  Type,
  UploadCloud,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

const categories = [
  "Technology",
  "Art",
  "Community",
  "Health",
  "Education",
  "Environment",
  "Business",
  "Sports",
];

const AddNewCampaign = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setUploadError("Max file size is 15MB");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const API_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;
      if (!API_KEY) {
        throw new Error("Image hosting API key is missing");
      }

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        setImageUrl(data.data.url);
      } else {
        setUploadError("Upload failed. Please try again.");
      }
    } catch (err) {
      setUploadError("Network error. Please check your connection.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!imageUrl) {
      setFormError("Please upload a campaign image first.");
      return;
    }

    if (!user) {
      setFormError("You must be logged in to create a campaign.");
      return;
    }

    setFormError("");
    setLoading(true);
    setSuccess(false);

    const form = e.currentTarget;

    const campaignData = {
      campaign_title: (
        form.elements.namedItem("campaign_title") as HTMLInputElement
      ).value,
      campaign_story: (
        form.elements.namedItem("campaign_story") as HTMLTextAreaElement
      ).value,
      category: (
        form.elements.namedItem("category") as HTMLSelectElement
      ).value,
      funding_goal: Number(
        (form.elements.namedItem("funding_goal") as HTMLInputElement).value
      ),
      minimum_contribution: Number(
        (form.elements.namedItem("minimum_contribution") as HTMLInputElement)
          .value
      ),
      deadline: (
        form.elements.namedItem("deadline") as HTMLInputElement
      ).value,
      reward_info: (
        form.elements.namedItem("reward_info") as HTMLTextAreaElement
      ).value,
      campaign_image_url: imageUrl,
      status: "pending",
      createdAt: new Date().toISOString(),
      creatorEmail: user.email,
      creatorName: user.name,
      
    };

    try {

const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaignData),
      });

    const data = await res.json();
console.log(data);
    if (data.acknowledged) {      
alert("Campaign added successfully ✅");
    };


      // 🔁 Replace this with your actual API call
      console.log("Campaign Data:", campaignData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);
      form.reset();
      setImageUrl("");
    } catch (error) {
      setFormError("Failed to create campaign. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If user is not loaded yet, show a loading skeleton
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 py-10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-cyan-600 animate-spin" />
          <p className="text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <section className=" bg-gradient-to-br from-slate-100 via-white to-slate-100 py-4">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100/50 backdrop-blur-sm transition-all">
          {/* Header */}
          {/* <div className="relative bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-700 p-8 md:p-10">
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Start a Campaign
              </h1>
             
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3"></div>
          </div> */}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
            {formError && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{formError}</span>
                <button
                  type="button"
                  onClick={() => setFormError("")}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>
                  Campaign created successfully! It's now pending review.
                </span>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="ml-auto text-green-500 hover:text-green-700"
                >
                  ×
                </button>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {/* Campaign Title */}
              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 font-semibold text-gray-700 text-xl">
                  <Type size={18} className="text-cyan-600" />
                  Campaign Title
                </label>
                <input
                  type="text"
                  name="campaign_title"
                  required
                  placeholder="e.g., Help us build a solar-powered water pump"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
                  <Layers size={18} className="text-cyan-600" />
                  Category
                </label>
                <select
                  required
                  name="category"
                  defaultValue=""
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Funding Goal */}
              <div>
                <label className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
                  <Target size={18} className="text-cyan-600" />
                  Funding Goal ($)
                </label>
                <input
                  type="number"
                  required
                  name="funding_goal"
                  placeholder="e.g., 5000"
                  min="1"
                  step="1"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                />
              </div>

              {/* Minimum Contribution */}
              <div>
                <label className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
                  <DollarSign size={18} className="text-cyan-600" />
                  Minimum Contribution ($)
                </label>
                <input
                  type="number"
                  required
                  name="minimum_contribution"
                  placeholder="e.g., 50"
                  min="1"
                  step="1"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                />
              </div>

              {/* Deadline */}
              <div>
                <label className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
                  <Calendar size={18} className="text-cyan-600" />
                  Deadline
                </label>
                <input
                  type="date"
                  required
                  name="deadline"
                  min={new Date().toISOString().split("T")[0]} // cannot be in past
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                />
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
                  <UploadCloud size={18} className="text-cyan-600" />
                  Campaign Image
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <label
                    htmlFor="campaign-image"
                    className={` relative w-50 h-20 rounded-xl border-2 border-dashed transition-all overflow-hidden flex items-center justify-center cursor-pointer
                      ${
                        imageUrl
                          ? "border-cyan-500 bg-cyan-50"
                          : "border-gray-300 hover:border-cyan-400 hover:bg-cyan-50/50"
                      }
                      ${isUploading ? "opacity-50 pointer-events-none" : ""}
                    `}
                  >
                    <input
                      id="campaign-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt="Campaign preview"
                        width={128}
                        height={128}
                        className="h-full w-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 text-xs">
                        <UploadCloud className="w-8 h-8 mb-1" />
                        <span>Upload</span>
                      </div>
                    )}
                  </label>

                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-gray-700">
                      {isUploading
                        ? "Uploading..."
                        : imageUrl
                        ? "Image uploaded successfully"
                        : "Click the box to upload an image"}
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, JPEG • Max 15MB
                    </p>
                    {uploadError && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {uploadError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Campaign Story */}
              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
                  <FileText size={18} className="text-cyan-600" />
                  Campaign Story
                </label>
                <textarea
                  required
                  rows={2}
                  name="campaign_story"
                  placeholder="Describe your campaign, why it matters, and how funds will be used..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 resize-y"
                />
              </div>

              {/* Reward Information */}
              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
                  <Gift size={18} className="text-cyan-600" />
                  Reward Information
                </label>
                <textarea
                  required
                  rows={2}
                  name="reward_info"
                  placeholder="What will backers receive? (e.g., exclusive access, merchandise, etc.)"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 resize-y"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isUploading}
              className="relative w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-4 text-lg font-semibold text-white transition-all hover:shadow-lg hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Campaign...
                </span>
              ) : (
                "Add Campaign"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddNewCampaign;