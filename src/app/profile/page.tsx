"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import {
  User,
  Mail,
  BadgeCheck,
  Calendar,
  Edit,
  Settings,
  LogOut,
  UserCircle,
  AtSign,
  CalendarDays,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useState } from "react";

const ProfilePage = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin animation-delay-150"></div>
        </div>
        <p className="text-gray-500 text-sm animate-pulse">Loading profile...</p>
      </div>
    );
  }

  const joinedDate = user.createdAt
    ? format(new Date(user.createdAt), "PPP")
    : "N/A";
  const joinedRelative = user.createdAt
    ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100/50 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.2)]">
          {/* Cover Image with Gradient Overlay */}
          <div className="relative h-48 md:h-56 lg:h-64 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
          </div>

          {/* Profile Section */}
          <div className="px-6 pb-8 relative">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 md:-mt-20">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full ring-4 ring-white shadow-xl bg-white p-1">
                  <Image
                    src={user.image || "/default-user.png"}
                    alt={user.name || "User"}
                    width={160}
                    height={160}
                    className="rounded-full object-cover w-full h-full"
                    priority
                  />
                </div>
                {user.emailVerified && (
                  <div className="absolute bottom-1 right-1 bg-green-500 rounded-full p-1 ring-2 ring-white shadow-md">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* User Info & Actions */}
              <div className="flex-1 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2">
                    {user.name || "No Name"}
                    {user.emailVerified && (
                      <BadgeCheck className="w-6 h-6 text-cyan-500 fill-cyan-500/20" />
                    )}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 text-gray-500 mt-1">
                    <AtSign className="w-4 h-4" />
                    <span>{user.email}</span>
                    <span className="hidden sm:inline text-gray-300">|</span>
                    <span className="flex items-center gap-1 text-sm">
                      <CalendarDays className="w-4 h-4" />
                      Joined {joinedRelative}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 rounded-xl transition-colors font-medium text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                  {/* <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button> */}
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mt-8 p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">24</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Posts</p>
              </div>
              <div className="text-center border-x border-gray-200">
                <p className="text-2xl font-bold text-gray-800">1.2k</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">342</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Following</p>
              </div>
            </div>

            {/* Info Cards Grid */}
            <div className="grid md:grid-cols-2 gap-5 mt-8">
              <InfoCard
                icon={<User className="text-cyan-600" />}
                label="Full Name"
                value={user.name || "N/A"}
              />
              <InfoCard
                icon={<Mail className="text-cyan-600" />}
                label="Email"
                value={user.email}
              />
              <InfoCard
                icon={<BadgeCheck className="text-cyan-600" />}
                label="Email Verification"
                value={
                  <span
                    className={`font-semibold ${
                      user.emailVerified ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {user.emailVerified ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Verified
                      </span>
                    ) : (
                      "Not Verified"
                    )}
                  </span>
                }
              />
              <InfoCard
                icon={<Calendar className="text-cyan-600" />}
                label="Joined"
                value={
                  <div className="flex flex-col">
                    <span>{joinedDate}</span>
                    <span className="text-xs text-gray-400">{joinedRelative}</span>
                  </div>
                }
              />
            </div>

            {/* Account Details */}
            <div className="mt-8 border rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                <UserCircle className="w-5 h-5 text-cyan-600" />
                Account Information
              </h3>
              <div className="space-y-3 divide-y divide-gray-100">
                <DetailRow label="User ID" value={user.id} />
                <DetailRow label="Name" value={user.name} />
                <DetailRow label="Email" value={user.email} />
                <DetailRow
                  label="Status"
                  value={
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      Active
                    </span>
                  }
                />
              </div>
            </div>

            {/* Edit Mode Demo */}
            {isEditing && (
              <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-2xl text-cyan-800 text-sm flex items-center gap-3">
                <Edit className="w-5 h-5 text-cyan-600" />
                <span>
                  Edit mode enabled. (This is a demo — implement your own form.)
                </span>
                <button
                  onClick={() => setIsEditing(false)}
                  className="ml-auto px-3 py-1 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition text-xs font-medium"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Secured with Better Auth • Profile last updated {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

// Helper Components
const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="group border rounded-2xl p-5 flex items-start gap-4 bg-white hover:border-cyan-200 hover:shadow-md transition-all duration-200">
    <div className="p-3 bg-cyan-50 rounded-xl text-cyan-600 group-hover:bg-cyan-100 transition-colors">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <div className="text-gray-800 font-semibold">{value}</div>
    </div>
  </div>
);

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
    <span className="text-gray-500 text-sm font-medium">{label}</span>
    <span className="text-gray-800 font-medium text-sm break-all text-right max-w-[60%]">
      {value}
    </span>
  </div>
);

export default ProfilePage;