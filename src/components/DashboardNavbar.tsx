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
  const role = user?.role || "Supporter";

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

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="border-b border-gray-200 shadow p-2 lg:px-4 w-full bg-white flex items-center justify-between sticky top-0 z-40">
      {/* Left side: Logo */}
      <Link href="/" className="flex items-center gap-2">
        {/* Updated Logo Color to match Landing Page dark blue/slate */}
        <span className="text-2xl font-extrabold text-[#0f172a] hover:text-indigo-600 transition-colors">
          FundWave
        </span>
      </Link>

      {/* Center Tagline - Made visible and color matched */}
      <div className="hidden md:block text-sm text-gray-600 font-medium">
        Empowering Change, One Donation at a Time
      </div>

      {/* Right side: Profile Dropdown / Sign In */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 p-1 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer"
            >
              {/* Keep Gradient Border, it adds a nice touch of purple from landing page */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 p-[2px] hover:scale-105 transition-transform shadow-sm">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border border-white">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon />
                  )}
                </div>
              </div>
            </button>

            {/* Dropdown Menu - Updated to Light Theme */}
            {profileOpen && (
              <div className="absolute right-0 mt-3 w-60 rounded-2xl bg-white border border-gray-100 p-4 shadow-xl animate-fade-in z-50">
                <div className="pb-3 border-b border-gray-100 mb-3">
                  <p className="text-[11px] text-gray-500 font-medium tracking-wide uppercase">
                    Signed in as
                  </p>
                  <p className="text-base font-bold text-[#0f172a] truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-600 font-normal truncate">
                    {user?.email}
                  </p>
                </div>

                {/* Dashboard Link commented out in original */}
                {/* <Link
                  href={`/dashboard/${role}/Home`}
                  onClick={() => setProfileOpen(false)}
                  className="block mb-2.5"
                >
                  <button className="w-full rounded-xl text-indigo-700 bg-indigo-50 py-2.5 cursor-pointer text-sm font-semibold hover:bg-indigo-100 transition-colors">
                    Dashboard
                   </button>
                </Link> */}

                <button
                  onClick={handleSignOut}
                  className="w-full block px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer text-center shadow-sm"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-semibold transition-colors shadow-sm"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default DashboardNavbar;