
"use client";

import { authClient, useSession } from "@/lib/auth-client";
import {
  House,
  Person,
  Plus,
  Bars,
} from "@gravity-ui/icons";

import { Button, Drawer } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";
import { ReactNode } from "react";

// ================= TYPES =================

type UserRole = "Supporter" | "Creator" | "Admin";

interface MenuItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

interface MenuConfig {
  [key: string]: MenuItem[];
}

// ================= COMPONENT =================

export default function DashboardSidebar(): ReactNode {
  const { data: session } = useSession();
  const pathname = usePathname();

  // ================= USER WITH ROLE =================
const user = session?.user as
  | {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      role?: UserRole;
    }
  | undefined;

const role = user?.role;

  // ================= ROLE BASED MENUS =================

  const menus: MenuConfig = {
    Supporter: [
      {
        key: "home",
        label: "Home",
        icon: House,
        href: "/dashboard/Supporter/Home",
      },
      {
        key: "explore-campaigns",
        label: "Explore Campaigns",
        icon: Plus,
        href: "/dashboard/Supporter/Explorecampaigns",
      },
      {
        key: "my-contributions",
        label: "My Contributions",
        icon: Plus,
        href: "/dashboard/Supporter/Mycontributions",
      },
      {
        key: "purchase-credit",
        label: "Purchase Credit",
        icon: Plus,
        href: "/dashboard/Supporter/Purchasecredit",
      },
      {
        key: "payment-history",
        label: "Payment History",
        icon: Plus,
        href: "/dashboard/Supporter/Paymenthistory",
      },
    ],

    Creator: [
      {
        key: "home",
        label: "Home",
        icon: House,
        href: "/dashboard/Creator/Home",
      },
      {
        key: "add-new-campaign",
        label: "Add New Campaign",
        icon: Plus,
        href: "/dashboard/Creator/Addnewcampaign",
      },
      {
        key: "my-campaigns",
        label: "My Campaigns",
        icon: Plus,
        href: "/dashboard/Creator/Mycampaigns",
      },
      {
        key: "withdrawals",
        label: "Withdrawals",
        icon: Person,
        href: "/dashboard/Creator/Withdrawals",
      },
      {
        key: "payment-history",
        label: "Payment History",
        icon: Person,
        href: "/dashboard/Creator/Paymenthistory",
      },
    ],

    Admin: [
      {
        key: "home",
        label: "Home",
        icon: House,
        href: "/dashboard/Admin/Home",
      },
      {
        key: "manage-users",
        label: "Manage Users",
        icon: Person,
        href: "/dashboard/Admin/Manageusers",
      },
      {
        key: "manage-campaigns",
        label: "Manage Campaigns",
        icon: Person,
        href: "/dashboard/Admin/Managecampaigns",
      },
      {
        key: "withdrawal-requests",
        label: "Withdrawal Requests",
        icon: Person,
        href: "/dashboard/Admin/Withdrawalrequests",
      },
      {
        key: "reports",
        label: "Reports",
        icon: Person,
        href: "/dashboard/Admin/Reports",
      },
    ],
  };

  // ================= NAV ITEMS =================

  const navItems: MenuItem[] = (role && menus[role]) || [];

  // ================= LOGOUT =================

  const handleLogout = async (): Promise<void> => {
    await authClient.signOut();
    redirect("/");
  };

  // ================= SIDEBAR CONTENT =================

  const renderSidebarContent = () => (
    <div className="flex h-full flex-col border">
      {/* Logo */}
      <Image
        src="/fund-wave.png"
        className="mx-auto h-[70px] w-full"
        alt="Dashboard"
        width={500}
        height={250}
      />

      {/* ================= PROFILE ================= */}
      <div className="flex items-center gap-3 border-b border-white/10 p-4">
        <div>
          <p className="text-sm font-semibold">
            {user?.name || "User"}
          </p>

          <span className="text-xs text-gray-500">
            {role || "guest"}
          </span>
        </div>
      </div>

      {/* ================= MENU ================= */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item: MenuItem) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-all ${
                isActive
                  ? "bg-[#8200db] text-white"
                  : ""
              }`}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ================= BOTTOM ================= */}
      <div className="space-y-2 border-t border-white/10 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg bg-red-500 px-3 py-2 text-white transition-colors hover:bg-red-600"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );

  // ================= RETURN =================

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <aside className="hidden h-screen w-64 flex-col border-white/10 lg:flex">
        {renderSidebarContent()}
      </aside>

      
{/* ================= MOBILE ================= */}
<Drawer>
  <Button
    className="absolute left-0 top-0 z-50 flex items-center gap-2 rounded-none py-8 lg:hidden"
  >
    <Bars className="size-5" />
    Menu
  </Button>

  <Drawer.Backdrop>
    <Drawer.Content placement="left">
      <Drawer.Dialog>
        <Drawer.CloseTrigger />

        <Drawer.Body className="p-0">
          {renderSidebarContent()}
        </Drawer.Body>
      </Drawer.Dialog>
    </Drawer.Content>
  </Drawer.Backdrop>
</Drawer>
    </>
  );
}

