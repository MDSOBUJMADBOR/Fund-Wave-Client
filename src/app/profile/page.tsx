"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  User as UserIcon,
  Mail,
  BadgeCheck,
  CalendarDays,
  Edit3,
  Coins,
  ShieldCheck,
  Rocket,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Save,
  X,
  Phone,
  FileText,
  Loader2,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  CreditCard,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
  credits: number;
  phone?: string;
  bio?: string;
  createdAt?: string;
  status?: string;
  contributionsCount?: number;
  campaignsCount?: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const sessionUser = session?.user;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, startTransition] = useTransition();

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editBio, setEditBio] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch full user profile from backend
  useEffect(() => {
    let ignore = false;

    async function loadUserProfile() {
      if (!sessionUser?.email) {
        if (!sessionLoading) setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE}/users/profile/${encodeURIComponent(sessionUser.email)}`,
          { cache: "no-store" }
        );

        if (res.ok) {
          const data = await res.json();
          if (data.success && !ignore) {
            setProfile(data.user);
            setEditName(data.user.name || "");
            setEditImage(data.user.image || "");
            setEditPhone(data.user.phone || "");
            setEditBio(data.user.bio || "");
          }
        } else {
          // Fallback to session user data
          if (!ignore) {
            const fallback: UserProfile = {
              id: sessionUser.id,
              name: sessionUser.name || "User",
              email: sessionUser.email,
              image: sessionUser.image,
              role: (sessionUser as typeof sessionUser & { role?: string }).role || "Supporter",
              credits: (sessionUser as typeof sessionUser & { credits?: number }).credits || 0,
              createdAt: sessionUser.createdAt ? new Date(sessionUser.createdAt).toISOString() : undefined,
              status: "active",
            };
            setProfile(fallback);
            setEditName(fallback.name);
            setEditImage(fallback.image || "");
          }
        }
      } catch (err: unknown) {
        console.error("Failed to load user profile:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadUserProfile();

    return () => {
      ignore = true;
    };
  }, [sessionUser, sessionLoading, API_BASE]);

  // Handle Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.email) return;

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch(
        `${API_BASE}/users/profile/${encodeURIComponent(profile.email)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editName,
            image: editImage,
            phone: editPhone,
            bio: editBio,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update local state
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              name: editName,
              image: editImage,
              phone: editPhone,
              bio: editBio,
            }
          : null
      );

      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);

      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving profile";
      setErrorMessage(msg);
    } finally {
      setSaving(false);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    await authClient.signOut();
    startTransition(() => {
      router.push("/");
    });
  };

  if (sessionLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <div className="relative flex items-center justify-center">
          <div className="h-14 w-14 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
          <Coins className="absolute h-6 w-6 text-purple-600 animate-pulse" />
        </div>
        <p className="text-slate-500 text-sm font-medium">Loading your profile...</p>
      </div>
    );
  }

  if (!sessionUser && !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 mb-4">
          <UserIcon className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Sign in to view your profile</h2>
        <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">
          You need to be logged into your FundWave account to access your profile settings and activity.
        </p>
        <Link
          href="/login"
          className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-600/25 hover:bg-purple-700 transition-all"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  const role = profile?.role || "Supporter";
  const userImage = profile?.image || sessionUser?.image || null;
  const userCredits = profile?.credits ?? 0;

  const joinedFormatted = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Member";

  return (
    <div className="min-h-screen bg-[#FDFCFE] py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Success Alert Banner */}
        {successMessage && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-sm font-bold text-emerald-800 shadow-sm animate-fade-in">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ==================================================
            MAIN PROFILE HERO CARD
        ================================================== */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-purple-500/5">
          {/* Cover Header */}
          <div className="relative h-44 sm:h-56 bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />

            {/* Quick Badge */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-purple-200" />
              <span>Verified Account</span>
            </div>
          </div>

          {/* Profile Header Details */}
          <div className="relative px-6 pb-8 sm:px-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
              {/* Avatar */}
              <div className="relative">
                <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full border-4 border-white bg-slate-100 shadow-2xl overflow-hidden relative">
                  {userImage ? (
                    <Image
                      src={userImage}
                      alt={profile?.name || "User"}
                      fill
                      sizes="144px"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-purple-600 to-indigo-600 text-white text-3xl font-bold">
                      {profile?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                <div
                  className="absolute bottom-1 right-1 rounded-full p-1.5 bg-emerald-500 text-white ring-4 ring-white shadow-md"
                  title="Active status"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-50 border border-purple-200/80 px-4 py-2.5 text-xs font-bold text-purple-700 shadow-xs hover:bg-purple-100 hover:border-purple-300 transition-all cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>{isEditing ? "Close Editor" : "Edit Profile"}</span>
                </button>

                <Link
                  href={`/dashboard/${role}/Home`}
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 transition-all cursor-pointer"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>Dashboard</span>
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Name, Role & Email */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {profile?.name || "FundWave Member"}
                </h1>

                {/* Role Pill */}
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide border shadow-xs ${
                    role === "Admin"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : role === "Creator"
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                >
                  <BadgeCheck className="h-3.5 w-3.5" />
                  <span>{role}</span>
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {profile?.email}
                </span>

                <span className="flex items-center gap-1.5 font-medium">
                  <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                  Joined {joinedFormatted}
                </span>

                {profile?.phone && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    {profile.phone}
                  </span>
                )}
              </div>

              {profile?.bio && (
                <p className="mt-4 text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ==================================================
            INTERACTIVE EDIT PROFILE DRAWER / FORM
        ================================================== */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            className="rounded-3xl border border-purple-200 bg-white p-6 sm:p-8 shadow-xl shadow-purple-500/5 space-y-6 animate-fade-in"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-purple-600" />
                  <span>Edit Profile Details</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Update your display information across FundWave.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                />
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+880..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Bio / Tagline
                </label>
                <input
                  type="text"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Passionate supporter & tech innovator"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 transition-all disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ==================================================
            PLATFORM CREDITS & STATS GRID
        ================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Credits Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-purple-300 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Available Credits
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Coins className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">
              {userCredits} <span className="text-sm font-semibold text-slate-400">Credits</span>
            </p>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">1 Credit = $1.00 USD</span>
              {role === "Supporter" && (
                <Link
                  href="/dashboard/Supporter/Purchasecredit"
                  className="font-bold text-purple-600 hover:text-purple-700"
                >
                  + Top Up
                </Link>
              )}
            </div>
          </div>

          {/* Activity / Contributions */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-purple-300 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {role === "Creator" ? "Campaigns Created" : "Contributions"}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                {role === "Creator" ? (
                  <Rocket className="h-5 w-5" />
                ) : (
                  <HeartHandshake className="h-5 w-5" />
                )}
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">
              {role === "Creator"
                ? profile?.campaignsCount ?? 0
                : profile?.contributionsCount ?? 0}
            </p>
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
              {role === "Creator" ? (
                <Link
                  href="/dashboard/Creator/Mycampaigns"
                  className="font-bold text-purple-600 hover:text-purple-700"
                >
                  View campaigns →
                </Link>
              ) : (
                <Link
                  href="/dashboard/Supporter/Mycontributions"
                  className="font-bold text-purple-600 hover:text-purple-700"
                >
                  View pledges →
                </Link>
              )}
            </div>
          </div>

          {/* Account Status */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-purple-300 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Account Status
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-emerald-600 capitalize">
              {profile?.status || "Active"}
            </p>
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
              Protected by FundWave Escrow
            </div>
          </div>

          {/* Member Tier */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-purple-300 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Member Tier
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <BadgeCheck className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">{role}</p>
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
              Verified platform credentials
            </div>
          </div>
        </div>

        {/* ==================================================
            QUICK DASHBOARD ACTIONS
        ================================================== */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-purple-600" />
            <span>Quick Shortcuts for {role}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href={`/dashboard/${role}/Home`}
              className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-purple-50 hover:border-purple-200 transition-all group"
            >
              <div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                  Main Dashboard
                </p>
                <p className="text-[11px] text-slate-500">
                  Overview of stats and activities
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
            </Link>

            {role === "Supporter" && (
              <>
                <Link
                  href="/dashboard/Supporter/Purchasecredit"
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-purple-50 hover:border-purple-200 transition-all group"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                      Purchase Credits
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Top up via Stripe checkout
                    </p>
                  </div>
                  <CreditCard className="h-4 w-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                </Link>

                <Link
                  href="/dashboard/Supporter/Mycontributions"
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-purple-50 hover:border-purple-200 transition-all group"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                      My Contributions
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Track pledges and statuses
                    </p>
                  </div>
                  <HeartHandshake className="h-4 w-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                </Link>
              </>
            )}

            {role === "Creator" && (
              <>
                <Link
                  href="/dashboard/Creator/Addnewcampaign"
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-purple-50 hover:border-purple-200 transition-all group"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                      Launch New Campaign
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Submit for administrative review
                    </p>
                  </div>
                  <Rocket className="h-4 w-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                </Link>

                <Link
                  href="/dashboard/Creator/Withdrawals"
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-purple-50 hover:border-purple-200 transition-all group"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                      Withdrawal Requests
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Request payouts to bank account
                    </p>
                  </div>
                  <Coins className="h-4 w-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                </Link>
              </>
            )}

            {role === "Admin" && (
              <>
                <Link
                  href="/dashboard/Admin/Managecampaigns"
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-purple-50 hover:border-purple-200 transition-all group"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                      Approve Campaigns
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Review submitted projects
                    </p>
                  </div>
                  <Rocket className="h-4 w-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                </Link>

                <Link
                  href="/dashboard/Admin/Withdrawalrequests"
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-purple-50 hover:border-purple-200 transition-all group"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                      Withdrawal Clearance
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Disburse creator payouts
                    </p>
                  </div>
                  <Coins className="h-4 w-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}