"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { authClient, useSession } from "@/lib/auth-client";

// Default User Icon Component
const UserIcon = () => (
  <svg
    className="w-6 h-6 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);

const DashboardNavbar = () => {
  const { data: session } = useSession();
  const user = session?.user;

  // TypeScript fix for custom role
  const role = (user as typeof user & { role?: string })?.role || "Supporter";

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sign out
  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-gray-200 bg-white p-2 shadow lg:px-4">
      {/* ================= LEFT SIDE ================= */}
      <Link href="/" className="flex items-center gap-2">
        <span className="hidden text-2xl font-extrabold text-indigo-600 transition-colors lg:flex">
          FundWave
        </span>
      </Link>

      {/* ================= CENTER TAGLINE ================= */}
      <div className="hidden text-sm font-medium text-gray-600 md:block">
        Empowering Change, One Donation at a Time
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative" ref={profileRef}>
            {/* Profile Button */}
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex cursor-pointer items-center gap-2.5 rounded-full p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              {/* Profile Image */}
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 p-[2px] shadow-sm transition-transform hover:scale-105">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-white bg-white">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon />
                  )}
                </div>
              </div>
            </button>

            {/* ================= DROPDOWN ================= */}
            {profileOpen && (
              <div className="absolute right-0 z-50 mt-3 w-60 animate-fade-in rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
                {/* User Information */}
                <div className="mb-3 border-b border-gray-100 pb-3">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                    Signed in as
                  </p>

                  <p className="truncate text-base font-bold text-[#0f172a]">
                    {user?.name || "User"}
                  </p>

                  <p className="truncate text-xs font-normal text-gray-600">
                    {user?.email}
                  </p>

                  {/* Role */}
                  <p className="mt-1 text-xs font-semibold text-indigo-600">
                    {role}
                  </p>
                </div>

                {/* Home Button */}
                <Link
                  href="/"
                  onClick={() => setProfileOpen(false)}
                  className="mb-2.5 block"
                >
                  <button className="w-full cursor-pointer rounded-xl bg-indigo-50 py-2.5 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100">
                    Home
                  </button>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleSignOut}
                  className="block w-full cursor-pointer rounded-xl bg-red-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default DashboardNavbar;