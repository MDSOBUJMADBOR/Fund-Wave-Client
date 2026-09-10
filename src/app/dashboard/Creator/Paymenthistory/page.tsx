"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  XCircle,
  Wallet,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type WithdrawalStatus = "pending" | "completed" | "rejected";

interface Withdrawal {
  _id: string;
  creator_email: string;
  creator_name: string;
  withdrawal_credit: number;
  withdrawal_amount: number;
  payment_system: string;
  account_number: string | number;
  withdraw_date: string;
  status: WithdrawalStatus | string;
}

const WithdrawalTable = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Creator email
    const { data: session } = authClient.useSession();
  const userEmail = session?.user?.email;


  // ================= FETCH WITHDRAWALS =================
  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/withdrawals/email/${userEmail}`
        );

        const data: Withdrawal[] = await response.json();

        console.log("API Response:", data);

        if (!response.ok) {
          throw new Error("Failed to fetch withdrawals");
        }

        setWithdrawals(data);
      } catch (error) {
        console.error("Withdrawal fetch error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  // ================= STATUS STYLE =================
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "border-amber-200 bg-amber-50 text-amber-600";

      case "completed":
        return "border-emerald-200 bg-emerald-50 text-emerald-600";

      case "rejected":
        return "border-red-200 bg-red-50 text-red-600";

      default:
        return "border-slate-200 bg-slate-50 text-slate-600";
    }
  };

  // ================= STATUS ICON =================
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock3 size={14} />;

      case "completed":
        return <CheckCircle2 size={14} />;

      case "rejected":
        return <XCircle size={14} />;

      default:
        return null;
    }
  };

  // ================= FORMAT DATE =================
  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ================= FORMAT TIME =================
  const formatTime = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  console.log("withdrawals state:", withdrawals);

  return (
    <section className="w-full bg-slate-50 px-3 py-6 sm:px-5 md:px-6 lg:px-8">
      <div className="mx-auto w-full ">
        {/* ================= HEADER ================= */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
            Withdrawal History
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View your previous withdrawal requests and their current status.
          </p>
        </div>

        {/* ================= MAIN CARD ================= */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* ================= LOADING ================= */}
          {loading && (
            <div className="flex min-h-[250px] items-center justify-center px-4">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500"></div>

                <p className="mt-3 text-sm text-slate-500">
                  Loading withdrawal history...
                </p>
              </div>
            </div>
          )}

          {/* ================= ERROR ================= */}
          {!loading && error && (
            <div className="flex min-h-[250px] items-center justify-center px-4">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                  <XCircle className="text-red-500" size={24} />
                </div>

                <h3 className="mt-3 text-base font-semibold text-slate-800">
                  Something went wrong
                </h3>

                <p className="mt-1 text-sm text-red-500">{error}</p>
              </div>
            </div>
          )}

          {/* ================= EMPTY STATE ================= */}
          {!loading && !error && withdrawals.length === 0 && (
            <div className="flex min-h-[250px] items-center justify-center px-4">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <Wallet className="text-slate-400" size={26} />
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-800">
                  No withdrawal history
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  You have not made any withdrawal request yet.
                </p>
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* ================= DESKTOP TABLE ==================== */}
          {/* ===================================================== */}

          {!loading && !error && withdrawals.length > 0 && (
            <>
              <div className="hidden w-full overflow-x-auto md:block">
                <table className="w-full  text-left">
                  {/* ================= TABLE HEADER ================= */}
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        #
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Creator
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Date
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Credits
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Amount
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Payment System
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Account
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>
                    </tr>
                  </thead>

                  {/* ================= TABLE BODY ================= */}
                  <tbody className="divide-y divide-slate-100">
                    {withdrawals.map((withdrawal, index) => (
                      <tr
                        key={withdrawal._id}
                        className="transition hover:bg-slate-50"
                      >
                        {/* Number */}
                        <td className="px-5 py-5 text-sm font-medium text-slate-500">
                          {index + 1}
                        </td>

                        {/* Creator */}
                        <td className="px-5 py-5">
                          <p className="text-sm font-semibold text-slate-800">
                            {withdrawal.creator_name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {withdrawal.creator_email}
                          </p>
                        </td>

                        {/* Date */}
                        <td className="whitespace-nowrap px-5 py-5">
                          <p className="text-sm font-medium text-slate-700">
                            {formatDate(withdrawal.withdraw_date)}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {formatTime(withdrawal.withdraw_date)}
                          </p>
                        </td>

                        {/* Credits */}
                        <td className="px-5 py-5">
                          <span className="font-semibold text-slate-800">
                            {Number(
                              withdrawal.withdrawal_credit
                            ).toLocaleString()}
                          </span>

                          <span className="ml-1 text-xs text-slate-400">
                            credits
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="px-5 py-5">
                          <span className="text-base font-bold text-emerald-600">
                            $
                            {Number(
                              withdrawal.withdrawal_amount
                            ).toFixed(2)}
                          </span>
                        </td>

                        {/* Payment System */}
                        <td className="px-5 py-5">
                          <span className="inline-flex rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                            {withdrawal.payment_system}
                          </span>
                        </td>

                        {/* Account */}
                        <td className="px-5 py-5">
                          <span className="whitespace-nowrap text-sm text-slate-600">
                            {withdrawal.account_number}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                              withdrawal.status
                            )}`}
                          >
                            {getStatusIcon(withdrawal.status)}
                            {withdrawal.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ===================================================== */}
              {/* ================= MOBILE CARDS ===================== */}
              {/* ===================================================== */}

              <div className="space-y-4 p-3 md:hidden sm:p-4">
                {withdrawals.map((withdrawal, index) => (
                  <div
                    key={withdrawal._id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    {/* ================= CARD HEADER ================= */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                      <div className="flex min-w-0 items-center gap-3">
                        {/* Number */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-600">
                          {index + 1}
                        </div>

                        {/* Creator */}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {withdrawal.creator_name}
                          </p>

                          <p className="truncate text-xs text-slate-400">
                            {withdrawal.creator_email}
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                          withdrawal.status
                        )}`}
                      >
                        {getStatusIcon(withdrawal.status)}
                        {withdrawal.status}
                      </span>
                    </div>

                    {/* ================= AMOUNT ================= */}
                    <div className="mt-4 flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3">
                      <div>
                        <p className="text-xs text-slate-500">
                          Withdrawal Amount
                        </p>

                        <p className="mt-1 text-xl font-bold text-emerald-600">
                          $
                          {Number(
                            withdrawal.withdrawal_amount
                          ).toFixed(2)}
                        </p>
                      </div>

                      <Wallet
                        size={28}
                        className="text-emerald-500"
                      />
                    </div>

                    {/* ================= DETAILS ================= */}
                    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5">
                      {/* Date */}
                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Date
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {formatDate(withdrawal.withdraw_date)}
                        </p>

                        <p className="text-xs text-slate-400">
                          {formatTime(withdrawal.withdraw_date)}
                        </p>
                      </div>

                      {/* Credits */}
                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Credits
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {Number(
                            withdrawal.withdrawal_credit
                          ).toLocaleString()}
                        </p>

                        <p className="text-xs text-slate-400">
                          credits
                        </p>
                      </div>

                      {/* Payment System */}
                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Payment System
                        </p>

                        <span className="mt-1 inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {withdrawal.payment_system}
                        </span>
                      </div>

                      {/* Account */}
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-400">
                          Account
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-slate-700">
                          {withdrawal.account_number}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default WithdrawalTable;