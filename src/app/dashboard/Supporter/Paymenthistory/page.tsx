"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  CreditCard,
  CheckCircle2,
  Clock3,
  Receipt,
  Search,
  Coins,
  DollarSign,
  Loader2,
  Calendar,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface PaymentRecord {
  _id: string;
  stripeSessionId?: string;
  paymentIntentId?: string | null;
  email: string;
  credits: number;
  previousCredits?: number;
  newCredits?: number;
  amountTotal: number; // in cents, e.g. 1000 = $10.00
  currency?: string;
  paymentStatus: string;
  paymentType?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function SupporterPaymentHistoryPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    let ignore = false;

    async function fetchPaymentHistory() {
      if (!user?.email) {
        if (!ignore) setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${API_BASE}/payments/${encodeURIComponent(user.email)}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          throw new Error("Failed to load payment history");
        }

        const json = await res.json();
        const dataList: PaymentRecord[] = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
          ? json.data
          : [];

        if (!ignore) {
          setPayments(dataList);
          setLoading(false);
        }
      } catch (err: unknown) {
        console.error("Payment history error:", err);
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to retrieve payment records."
          );
          setPayments([]);
          setLoading(false);
        }
      }
    }

    fetchPaymentHistory();

    return () => {
      ignore = true;
    };
  }, [user?.email, refreshTrigger, API_BASE]);

  // Aggregate metrics
  const totalSpentInDollars = useMemo(() => {
    return (
      payments.reduce((sum, p) => sum + (Number(p.amountTotal) || 0), 0) / 100
    );
  }, [payments]);

  const totalCreditsPurchased = useMemo(() => {
    return payments.reduce((sum, p) => sum + (Number(p.credits) || 0), 0);
  }, [payments]);

  // Filtered payments by search
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const idStr = (p.paymentIntentId || p.stripeSessionId || p._id || "").toLowerCase();
      const statusStr = (p.paymentStatus || "").toLowerCase();
      const term = searchTerm.toLowerCase();

      return idStr.includes(term) || statusStr.includes(term);
    });
  }, [payments, searchTerm]);

  return (
    <div className="space-y-8 pb-12">
      {/* ==================================================== */}
      {/* HEADER BANNER */}
      {/* ==================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Financial Transactions
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
              Payment History
            </h1>
            <p className="mt-1 text-sm md:text-base text-cyan-100 max-w-xl">
              Track all your Stripe credit bundle purchases and payment receipts in one secure place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/Supporter/Purchasecredit"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-cyan-700 shadow-md transition hover:bg-cyan-50 active:scale-95"
            >
              <CreditCard className="h-4 w-4" />
              Purchase More Credits
            </Link>
          </div>
        </div>

        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-black/10 blur-2xl" />
      </div>

      {/* ==================================================== */}
      {/* METRIC CARDS */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Spent */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Total Amount Paid
              </p>
              <h3 className="mt-2 text-3xl font-extrabold text-gray-900">
                {loading ? (
                  <Loader2 className="h-7 w-7 animate-spin text-cyan-600" />
                ) : (
                  `$${totalSpentInDollars.toFixed(2)}`
                )}
              </h3>
              <p className="mt-1 text-xs text-gray-400">USD spent on credit packages</p>
            </div>
            <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Total Credits */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Total Credits Purchased
              </p>
              <h3 className="mt-2 text-3xl font-extrabold text-cyan-600">
                {loading ? (
                  <Loader2 className="h-7 w-7 animate-spin text-cyan-600" />
                ) : (
                  totalCreditsPurchased.toLocaleString()
                )}
              </h3>
              <p className="mt-1 text-xs text-gray-400">Platform contribution balance</p>
            </div>
            <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-100">
              <Coins className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Transactions Count */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Completed Transactions
              </p>
              <h3 className="mt-2 text-3xl font-extrabold text-gray-900">
                {loading ? (
                  <Loader2 className="h-7 w-7 animate-spin text-gray-400" />
                ) : (
                  payments.length
                )}
              </h3>
              <p className="mt-1 text-xs text-gray-400">Stripe checkout sessions</p>
            </div>
            <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
              <Receipt className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* PAYMENTS TABLE CONTAINER */}
      {/* ==================================================== */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Purchase Records</h2>
              <span className="rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-bold text-cyan-800">
                {filteredPayments.length} of {payments.length}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Detailed history of all Stripe payment intents, invoices, and credit allocations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-9 pr-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
              />
            </div>

            <button
              onClick={() => {
                setLoading(true);
                setRefreshTrigger((k) => k + 1);
              }}
              disabled={loading}
              className="rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 active:scale-95 transition whitespace-nowrap"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Error notice */}
        {error && (
          <div className="my-4 rounded-xl bg-red-50 p-4 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
            <p className="text-sm text-gray-500 font-medium">Loading payment records...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex min-h-[240px] flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 mb-4 border border-cyan-100">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {searchTerm ? "No Matching Payments Found" : "No Payment History Yet"}
            </h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              {searchTerm
                ? "Try searching with a different transaction ID or status keyword."
                : "When you purchase credits through Stripe, your receipts and transaction details will appear here."}
            </p>
            {!searchTerm && (
              <Link
                href="/dashboard/Supporter/Purchasecredit"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-cyan-700 active:scale-95 transition"
              >
                <CreditCard className="h-4 w-4" />
                Purchase Credits
              </Link>
            )}
          </div>
        ) : (
          /* TABULAR FORMAT */
          <div className="overflow-x-auto mt-4">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3.5 px-4 rounded-l-xl">Transaction / ID</th>
                  <th className="py-3.5 px-4">Credits Added</th>
                  <th className="py-3.5 px-4">Amount Paid</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 rounded-r-xl">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredPayments.map((p) => {
                  const txId =
                    p.paymentIntentId ||
                    (p.stripeSessionId
                      ? `${p.stripeSessionId.slice(0, 18)}...`
                      : p._id);
                  const fullTxId = p.paymentIntentId || p.stripeSessionId || p._id;
                  const priceInDollars = (Number(p.amountTotal) || 0) / 100;
                  const dateStr = p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Recent";

                  const isPaid =
                    (p.paymentStatus || "").toLowerCase() === "paid" ||
                    (p.paymentStatus || "").toLowerCase() === "complete";

                  return (
                    <tr
                      key={p._id}
                      className="hover:bg-cyan-50/20 transition-colors"
                    >
                      {/* Transaction ID */}
                      <td className="py-4 px-4 font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 font-mono text-xs">
                            <Receipt className="h-4 w-4" />
                          </div>
                          <div>
                            <span
                              className="font-mono text-xs text-gray-800 font-semibold block"
                              title={fullTxId}
                            >
                              {txId}
                            </span>
                            <span className="text-[11px] text-gray-400 capitalize">
                              {p.paymentType ? p.paymentType.replace("_", " ") : "Stripe Checkout"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Credits Added */}
                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1 font-bold text-cyan-700 border border-cyan-200">
                          <Coins className="h-4 w-4 text-cyan-600" />
                          <span>+{p.credits}</span>
                          <span className="text-xs font-normal text-cyan-600">Credits</span>
                        </div>
                        {p.previousCredits !== undefined && p.newCredits !== undefined && (
                          <div className="text-[11px] text-gray-400 mt-1 pl-1">
                            Balance: {p.previousCredits} →{" "}
                            <span className="font-semibold text-gray-600">{p.newCredits}</span>
                          </div>
                        )}
                      </td>

                      {/* Amount Paid */}
                      <td className="py-4 px-4">
                        <span className="font-extrabold text-gray-900 text-base">
                          ${priceInDollars.toFixed(2)}
                        </span>
                        <span className="ml-1 text-xs text-gray-400 uppercase">
                          {p.currency || "USD"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 capitalize">
                            <Clock3 className="h-3.5 w-3.5 text-amber-600" />
                            {p.paymentStatus || "Processing"}
                          </span>
                        )}
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          <span>{dateStr}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}