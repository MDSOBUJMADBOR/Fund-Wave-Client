"use client";

import { authClient, useSession } from "@/lib/auth-client";
import {
  House,
  Person,
  Plus,
  Calendar,
  Circle,
  Bars,
} from "@gravity-ui/icons";

import { Button, Drawer } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";
import { ReactNode } from "react";

// Define types
type UserRole = "Supporter" | "Creator" | "Admin"; // Updated to match your actual keys

interface MenuItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

interface MenuConfig {
  [key: string]: MenuItem[];
}

export default function DashboardSidebar(): ReactNode {
  const { data: session } = useSession();
  const pathname = usePathname();

  const role = session?.user?.role as UserRole | undefined;

  // Role-based menu configuration
  const menus: MenuConfig = {
    Supporter: [
      { key: "home", label: "Home", icon: House, href: "/dashboard/Supporter/Home" },
      { key: "explore-campaigns", label: "Explore Campaigns", icon: Plus, href: "/dashboard/Supporter/Explorecampaigns" },
      { key: "my-contributions", label: "My Contributions", icon: Plus, href: "/dashboard/Supporter/Mycontributions" },
      { key: "purchase-credit", label: "Purchase Credit", icon: Plus, href: "/dashboard/Supporter/Purchasecredit" },
      { key: "payment-history", label: "Payment History", icon: Plus, href: "/dashboard/Supporter/Paymenthistory" },
    ],
    Creator: [
      { key: "home", label: "Home", icon: House, href: "/dashboard/Creator/Home" },
      { key: "add-new-campaign", label: "Add New Campaign", icon: Plus, href: "/dashboard/Creator/Addnewcampaign" },
      { key: "my-campaigns", label: "My Campaigns", icon: Plus, href: "/dashboard/Creator/Mycampaigns" },
      { key: "withdrawals", label: "Withdrawals", icon: Person, href: "/dashboard/Creator/Withdrawals" },
      { key: "payment-history", label: "Payment History", icon: Person, href: "/dashboard/Creator/Paymenthistory" },
    ],
    Admin: [
      { key: "home", label: "Home", icon: House, href: "/dashboard/Admin/Home" },
      { key: "manage-users", label: "Manage Users", icon: Person, href: "/dashboard/Admin/Manageusers" },
      { key: "manage-campaigns", label: "Manage Campaigns", icon: Person, href: "/dashboard/Admin/Managecampaigns" },
      { key: "withdrawal-requests", label: "Withdrawal Requests", icon: Person, href: "/dashboard/Admin/Withdrawalrequests" },
      { key: "reports", label: "Reports", icon: Person, href: "/dashboard/Admin/Reports" },
    ],
  };

  const navItems: MenuItem[] = (role && menus[role]) || [];

  const handleLogout = async (): Promise<void> => {
    await authClient.signOut();
    redirect("/");
  };

  // 1. Changed to a standard helper function (not a React component component)
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full  border">
<Image
  src="/fund-wave.png"
  className="w-full h-[70px] mx-auto "
  alt="Dashboard"
  width={500}
  height={250}
/>
      {/* Profile */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <div>
          <p className="text-sm font-semibold">{session?.user?.name || "User"}</p>
          <span className="text-xs text-gray-500">{role || "guest"}</span>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-1 ">
        {navItems.map((item: MenuItem) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all border ${
                isActive
                  ? "bg-[#8200db] text-white"
                  : " "
              }`}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/10 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
        >
          <House className="size-5" />
          Home
        </Link>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-white bg-red-500 hover:bg-red-600 transition-colors"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-64 h-screen border-white/10">
        {/* 2. Call the function here directly */}
        {renderSidebarContent()}
      </aside>

      {/* Mobile */}
      <Drawer>
        <Button className="lg:hidden py-8 flex items-center gap-2 rounded-none ">
          <Bars className="size-5" />
          Menu
        </Button>

        <Drawer.Backdrop>
          <Drawer.Content placement="left">
            <Drawer.Dialog>
              <Drawer.CloseTrigger />
              <Drawer.Body className="p-0">
                {/* 3. Call the function here as well */}
                {renderSidebarContent()}
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
}