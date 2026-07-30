"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiHome } from "react-icons/hi2";
import { useState, useRef, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  {
    title: "Explore Campaigns",
    href: "/explorecampaigns",
  },
  {
    title: "How it Works",
    href: "/howitworks",
  },
  {
    title: "About Us",
    href: "/about",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

const LightningIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6 text-gray-800 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6 text-gray-800 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Dropdown এর বাইরে ক্লিক করলে প্রোফাইল মেনু বন্ধ হওয়া

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname.includes("/dashboard")) {
    return null;
  }

  const handleSignOut = async () => {
    await authClient.signOut();
    setProfileOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white z-50 w-full shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <HiHome className="text-3xl text-[#8200db]" />
          <h1 className="text-2xl font-bold">
            <span className="text-gray-900">Fund</span>
            <span className="text-[#8200db]">Wave</span>
          </h1>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-2 lg:gap-4">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-[#8200db] text-white"
                        : "text-gray-700 hover:bg-[#f3e8ff] hover:text-[#8200db]"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-emerald-500 p-[1.5px] hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full bg-[#0a0a16] flex items-center justify-center">
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

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl bg-[#080718] border border-white/10 p-2 shadow-2xl animate-fade-in z-50">
                  <div className="px-4 py-2 border-b border-white/10 mb-2">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    href="/dashboard/user/overview"
                    onClick={() => setProfileOpen(false)}
                    className="block mb-2"
                  >
                    <button className="w-full rounded-md text-purple-400 bg-purple-500/10 py-2 cursor-pointer text-xs font-semibold hover:bg-purple-500/20 transition-colors">
                      Dashboard
                    </button>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full block px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <button className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition">
                  Login
                </button>
              </Link>

              <Link href="/register">
                <button className="rounded-md bg-[#8200db] px-5 py-2 text-sm font-medium text-white hover:bg-[#6c00b8] cursor-pointer transition flex items-center gap-1.5">
                  <LightningIcon />
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-2 px-6 pt-4 pb-3">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-md px-4 py-2.5 text-base font-medium transition ${
                    isActive
                      ? "bg-[#8200db] text-white"
                      : "text-gray-700 hover:bg-purple-50 hover:text-[#8200db]"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>

          {/* Mobile Auth Area */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            {isPending ? (
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
            ) : !user ? (
              <div className="grid grid-cols-2 gap-3">
                <Link href={"/login"} onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full text-center px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm">
                    Login
                  </button>
                </Link>
                <Link href={"/register"} onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#8200db] text-sm font-semibold text-white shadow-md cursor-pointer hover:bg-[#6c00b8]">
                    <LightningIcon className="w-3.5 h-3.5" />
                    Register
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-emerald-500 p-[1.5px]">
                    <div className="w-full h-full rounded-full bg-[#0a0a16] flex items-center justify-center">
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
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    href={`/dashboard/user/overview`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <button className="w-full rounded-md text-[#8200db] bg-purple-100 py-2 cursor-pointer text-sm font-semibold hover:bg-purple-200 transition">
                      Dashboard
                    </button>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-center py-2 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-semibold text-red-600 cursor-pointer transition"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}