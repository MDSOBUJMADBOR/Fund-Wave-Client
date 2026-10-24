"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Banknote,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  User,
  CreditCard,
  Calendar,
  Loader2,
  ShieldCheck,
  RotateCw,
} from "lucide-react";

interface WithdrawalRequest {
  _id: string;
  creator_email: string;
  creator_name: string;
  withdrawal_credit: number;
  withdrawal_amount: number;
  payment_system: string;
  account_number: string | number;
  withdraw_date: string;
  status: "pending" | "approved" | "rejected" | string;
  approvedAt?: string;
  rejectedAt?: string;
}

export default function AdminWithdrawalRequestsPage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"pending" | "approved" | "all">("pending");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // ==========================================
  // FETCH WITHDRAWAL REQUESTS
  // ==========================================
  useEffect(() => {
    let ignore = false;

    async function loadWithdrawals() {
      try {
        setLoading(true);

        const res = await fetch(`${API_BASE}/withdrawals`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load withdrawal requests");
        }

        const json = await res.json();
        const dataList: WithdrawalRequest[] = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
          ? json.data
          : [];

        if (!ignore) {
          setWithdrawals(dataList);
          setLoading(false);
        }
      } catch (err: unknown) {
        console.error("Admin fetch withdrawals error:", err);
        if (!ignore) {
          setWithdrawals([]);
          setLoading(false);
        }
      }
    }

    loadWithdrawals();

    return () => {
      ignore = true;
    };
  }, [refreshTrigger, API_BASE]);

  // ==========================================
  // APPROVE WITHDRAWAL (PAYMENT SUCCESS)
  // ==========================================
  const handlePaymentSuccess = async (req: WithdrawalRequest) => {
    const confirmPayment = window.confirm(
      `Confirm Payment Success for ${req.creator_name}?\nAmount: ${req.withdrawal_credit} Credits ($${req.withdrawal_amount} USD)\nAccount: ${req.payment_system} - ${req.account_number}\n\nThis will mark the request as approved and deduct the credits from the creator's raised balance.`
    );

    if (!confirmPayment) return;

    try {
      setActionLoadingId(req._id);

      const res = await fetch(`${API_BASE}/withdrawals/approve/${req._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to approve withdrawal request");
      }

      // Update state locally
      setWithdrawals((prev) =>
        prev.map((w) =>
          w._id === req._id
            ? { ...w, status: "approved", approvedAt: new Date().toISOString() }
            : w
        )
      );

      alert(`Payment Success confirmed for ${req.creator_name}! Status changed to "approved" and creator balance deducted.`);
    } catch (err: unknown) {
      console.error("Approve withdrawal error:", err);
      alert(err instanceof Error ? err.message : "Payment processing error");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ==========================================
  // REJECT WITHDRAWAL
  // ==========================================
  const handleReject = async (id: string, creatorName: string) => {
    const confirmReject = window.confirm(`Reject withdrawal request for ${creatorName}?`);
    if (!confirmReject) return;

    try {
      setActionLoadingId(id);

      const res = await fetch(`${API_BASE}/withdrawals/reject/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to reject withdrawal request");
      }

      setWithdrawals((prev) =>
        prev.map((w) =>
          w._id === id
            ? { ...w, status: "rejected", rejectedAt: new Date().toISOString() }
            : w
        )
      );

      alert(`Withdrawal request for ${creatorName} has been rejected.`);
    } catch (err: unknown) {
      console.error("Reject withdrawal error:", err);
      alert(err instanceof Error ? err.message : "Failed to reject withdrawal");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Summary Metrics
  const pendingRequests = useMemo(() => {
    return withdrawals.filter((w) => (w.status || "pending").toLowerCase() === "pending");
  }, [withdrawals]);

  const totalPendingDollars = useMemo(() => {
    return pendingRequests.reduce((sum, w) => sum + (Number(w.withdrawal_amount) || 0), 0);
  }, [pendingRequests]);

  const totalApprovedDollars = useMemo(() => {
    return withdrawals
      .filter((w) => (w.status || "").toLowerCase() === "approved")
      .reduce((sum, w) => sum + (Number(w.withdrawal_amount) || 0), 0);
  }, [withdrawals]);

  // Filtered List
  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter((w) => {
      const matchSearch =
        (w.creator_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (w.creator_email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(w.account_number || "").includes(searchTerm) ||
        (w.payment_system || "").toLowerCase().includes(searchTerm.toLowerCase());

      const status = (w.status || "pending").toLowerCase();
      const matchStatus =
        statusFilter === "all" ? true : status === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [withdrawals, searchTerm, statusFilter]);

  return (
    <div className="space-y-8 pb-12">
      {/* ==================================================== */}
      {/* HEADER BANNER */}
      {/* ==================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 text-white" />
              Creator Payouts & Settlement
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
              Withdrawal Requests
            </h1>
            <p className="mt-1 text-sm md:text-base text-amber-100 max-w-xl">
              Review pending payout requests submitted by campaign creators. Verify external transfers and mark Payment Success to deduct balances.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setLoading(true);
                setRefreshTrigger((k) => k + 1);
              }}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-amber-900 shadow-md transition hover:bg-amber-50 active:scale-95"
            >
              <RotateCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh Requests
            </button>
          </div>
        </div>

        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-black/10 blur-2xl" />
      </div>

      {/* ==================================================== */}
      {/* KPI METRICS */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Pending Requests */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Pending Requests
              </p>
              <h3 className="mt-2 text-3xl font-extrabold text-amber-600">
                {loading ? <Loader2 className="h-7 w-7 animate-spin text-amber-600" /> : pendingRequests.length}
              </h3>
              <p className="mt-1 text-xs text-gray-400">Awaiting disbursement review</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Pending Settlement Volume */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Pending Payout Volume
              </p>
              <h3 className="mt-2 text-3xl font-extrabold text-gray-900">
                {loading ? <Loader2 className="h-7 w-7 animate-spin text-gray-400" /> : `$${totalPendingDollars.toFixed(2)}`}
              </h3>
              <p className="mt-1 text-xs text-gray-400">USD to be disbursed</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 border border-orange-100">
              <Banknote className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Completed Disbursements */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Total Settled Payouts
              </p>
              <h3 className="mt-2 text-3xl font-extrabold text-emerald-600">
                {loading ? <Loader2 className="h-7 w-7 animate-spin text-emerald-600" /> : `$${totalApprovedDollars.toFixed(2)}`}
              </h3>
              <p className="mt-1 text-xs text-gray-400">Approved historical payouts</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* WITHDRAWAL REQUESTS TABLE */}
      {/* ==================================================== */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Withdrawal Requests</h2>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                {filteredWithdrawals.length} Shown
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Verify the payment destination and click &quot;Payment Success&quot; once funds are sent to the creator.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search creator / account..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-9 pr-3 py-2 text-xs text-gray-800 outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
              />
            </div>

            {/* Filter Tabs */}
            <div className="inline-flex rounded-xl bg-gray-100 p-1">
              <button
                onClick={() => setStatusFilter("pending")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  statusFilter === "pending"
                    ? "bg-white text-amber-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Pending ({pendingRequests.length})
              </button>
              <button
                onClick={() => setStatusFilter("approved")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  statusFilter === "approved"
                    ? "bg-white text-emerald-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setStatusFilter("all")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  statusFilter === "all"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                All
              </button>
            </div>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            <p className="text-sm text-gray-500 font-medium">Loading withdrawal requests...</p>
          </div>
        ) : filteredWithdrawals.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex min-h-[200px] flex-col items-center justify-center py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-3 border border-amber-100">
              <Banknote className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              {statusFilter === "pending"
                ? "No Pending Withdrawal Requests"
                : "No Withdrawal Requests Found"}
            </h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              {statusFilter === "pending"
                ? "All creator payouts have been settled and approved."
                : "Try adjusting your search query or filter selection."}
            </p>
          </div>
        ) : (
          /* TABULAR FORMAT */
          <div className="overflow-x-auto mt-4">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3.5 px-4 rounded-l-xl">Creator</th>
                  <th className="py-3.5 px-4">Amount (Credits & USD)</th>
                  <th className="py-3.5 px-4">Payout Method</th>
                  <th className="py-3.5 px-4">Account Number</th>
                  <th className="py-3.5 px-4">Request Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredWithdrawals.map((req) => {
                  const isProcessing = actionLoadingId === req._id;
                  const isPending = (req.status || "pending").toLowerCase() === "pending";
                  const isApproved = (req.status || "").toLowerCase() === "approved";
                  const isRejected = (req.status || "").toLowerCase() === "rejected";

                  const dateStr = req.withdraw_date
                    ? new Date(req.withdraw_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recent";

                  return (
                    <tr key={req._id} className="hover:bg-amber-50/20 transition-colors">
                      {/* Creator */}
                      <td className="py-4 px-4 font-semibold text-gray-900">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-bold text-xs shrink-0">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="block font-bold text-gray-900">
                              {req.creator_name || "Creator"}
                            </span>
                            <span className="text-xs text-gray-400 font-normal">
                              {req.creator_email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-gray-900 text-sm">
                            ${(Number(req.withdrawal_amount) || 0).toFixed(2)} USD
                          </span>
                          <span className="text-xs text-amber-700 font-semibold">
                            {req.withdrawal_credit} Credits
                          </span>
                        </div>
                      </td>

                      {/* Payment Method */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-800 capitalize">
                          <CreditCard className="h-3.5 w-3.5 text-gray-500" />
                          {req.payment_system}
                        </span>
                      </td>

                      {/* Account Number */}
                      <td className="py-4 px-4 font-mono text-xs text-gray-800 font-bold">
                        {req.account_number}
                      </td>

                      {/* Request Date */}
                      <td className="py-4 px-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          <span>{dateStr}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            Approved
                          </span>
                        ) : isRejected ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                            <XCircle className="h-3.5 w-3.5 text-red-600" />
                            Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                            Pending Payment
                          </span>
                        )}
                      </td>

                      {/* Action: Payment Success Button */}
                      <td className="py-4 px-4 text-right">
                        {isPending ? (
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handlePaymentSuccess(req)}
                              disabled={isProcessing}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-95 transition disabled:opacity-50"
                            >
                              {isProcessing ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              )}
                              Payment Success
                            </button>

                            <button
                              onClick={() => handleReject(req._id, req.creator_name)}
                              disabled={isProcessing}
                              className="inline-flex items-center rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 px-2.5 py-1.5 text-xs font-semibold transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium italic">
                            Settled
                          </span>
                        )}
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