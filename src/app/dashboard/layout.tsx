
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebar from "@/components/DashboardSidebar";

import type { ReactNode } from "react";


interface DashboardLayoutProps { 
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar />
          {/* sidebar */}
        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Navbar */}
          <DashboardNavbar />
            
          {/* Page Content */}
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}