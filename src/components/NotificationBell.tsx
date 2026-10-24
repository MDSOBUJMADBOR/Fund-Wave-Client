"use client";

import { useEffect, useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink,
  Loader2,
  Coins,
  Heart,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface NotificationItem {
  _id: string;
  message: string;
  toEmail: string;
  actionRoute?: string;
  time: string | Date;
  read?: boolean;
}

export default function NotificationBell() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [, startTransition] = useTransition();

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // ==========================================
  // FETCH NOTIFICATIONS
  // ==========================================
  const fetchNotifications = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/notifications/${encodeURIComponent(user.email)}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const json = await res.json();
      const list: NotificationItem[] = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
        ? json.data
        : [];

      setNotifications(list);
    } catch (err: unknown) {
      console.error("Fetch notifications error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and polling every 30 seconds
  useEffect(() => {
    let ignore = false;

    async function loadInitial() {
      if (!user?.email) return;
      try {
        const res = await fetch(
          `${API_BASE}/notifications/${encodeURIComponent(user.email)}`,
          { cache: "no-store" }
        );
        const json = await res.json();
        const list: NotificationItem[] = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
          ? json.data
          : [];
        if (!ignore) {
          setNotifications(list);
        }
      } catch (err) {
        console.error("Initial notifications error:", err);
      }
    }

    loadInitial();

    const interval = setInterval(loadInitial, 30000);

    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, [user?.email, API_BASE]);

  // ==========================================
  // CLOSE ON CLICK OUTSIDE (Floating Pop-up)
  // ==========================================
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Toggle pop-up
  const handleToggle = () => {
    if (!open) {
      fetchNotifications();
    }
    setOpen((prev) => !prev);
  };

  // Dismiss single notification
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await fetch(`${API_BASE}/notifications/${id}`, {
        method: "DELETE",
      });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete notification error:", err);
    }
  };

  // Clear all notifications
  const handleClearAll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.email) return;

    try {
      await fetch(`${API_BASE}/notifications/clear/${encodeURIComponent(user.email)}`, {
        method: "DELETE",
      });
      setNotifications([]);
    } catch (err) {
      console.error("Clear all notifications error:", err);
    }
  };

  // Navigate to actionRoute on click
  const handleNotificationClick = (item: NotificationItem) => {
    setOpen(false);
    if (item.actionRoute) {
      // If it says /dashboard/Supporter-home, normalize to /dashboard/Supporter/Home
      let route = item.actionRoute;
      if (route === "/dashboard/Supporter-home") {
        route = "/dashboard/Supporter/Home";
      }
      startTransition(() => {
        router.push(route);
      });
    }
  };

  // Format time display
  const formatTimeAgo = (dateInput: string | Date) => {
    const d = new Date(dateInput);
    if (Number.isNaN(d.getTime())) return "Recently";
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Pick an icon based on message keywords
  const getIcon = (msg: string) => {
    const text = msg.toLowerCase();
    if (text.includes("approved")) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shrink-0">
          <CheckCircle2 className="h-4 w-4" />
        </div>
      );
    }
    if (text.includes("rejected")) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-600 shrink-0">
          <Clock className="h-4 w-4" />
        </div>
      );
    }
    if (text.includes("withdrawal")) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600 shrink-0">
          <Coins className="h-4 w-4" />
        </div>
      );
    }
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 shrink-0">
        <Heart className="h-4 w-4" />
      </div>
    );
  };

  if (!user) return null;

  return (
    <div className="relative" ref={popoverRef}>
      {/* ==================================================== */}
      {/* NOTIFICATION ICON BUTTON */}
      {/* ==================================================== */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label="View notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition cursor-pointer"
      >
        <Bell className="h-5 w-5" />

        {/* Counter Badge */}
        {notifications.length > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-extrabold text-white shadow-sm animate-pulse">
            {notifications.length > 99 ? "99+" : notifications.length}
          </span>
        )}
      </button>

      {/* ==================================================== */}
      {/* FLOATING POP-UP */}
      {/* ==================================================== */}
      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 z-50 mt-3 w-80 sm:w-96 animate-in fade-in zoom-in-95 duration-150 rounded-3xl border border-gray-100 bg-white shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/80 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">Notifications</span>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-bold text-indigo-800">
                {notifications.length}
              </span>
            </div>

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-semibold text-gray-500 hover:text-rose-600 transition"
              >
                Clear all
              </button>
            )}
          </div>

          {/* List Area */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100">
            {loading && notifications.length === 0 ? (
              <div className="flex min-h-[160px] flex-col items-center justify-center gap-2 py-8 text-gray-400">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                <span className="text-xs">Loading notifications...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex min-h-[180px] flex-col items-center justify-center py-8 px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-2">
                  <Bell className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-900">No New Notifications</h4>
                <p className="mt-1 text-xs text-gray-400 max-w-xs">
                  When creators review your pledges or admins settle payouts, updates will appear here.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleNotificationClick(item)}
                  className="group relative flex items-start gap-3 p-4 hover:bg-indigo-50/40 cursor-pointer transition-colors"
                >
                  {getIcon(item.message)}

                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-5 text-gray-800 font-medium line-clamp-3">
                      {item.message}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400 font-normal">
                      <span>{formatTimeAgo(item.time)}</span>
                      {item.actionRoute && (
                        <span className="text-indigo-600 font-semibold group-hover:underline inline-flex items-center gap-0.5">
                          View details <ExternalLink className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dismiss Single Button */}
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, item._id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-600 p-1 transition"
                    title="Remove notification"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-2 text-center text-[11px] text-gray-400">
              Clicking anywhere on the page hides this panel
            </div>
          )}
        </div>
      )}
    </div>
  );
}
