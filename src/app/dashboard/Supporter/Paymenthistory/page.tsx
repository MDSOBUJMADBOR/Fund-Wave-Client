"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  CreditCard,
  Loader2,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Payment {
  _id?: string;

  stripeSessionId?: string;
  paymentIntentId?: string | null;

  email?: string;

  credits?: number;
  previousCredits?: number;
  newCredits?: number;

  amountTotal?: number;
  currency?: string;

  paymentStatus?: string;
  paymentType?: string;

  createdAt?: string | Date;
}

interface PaymentResponse {
  success?: boolean;
  data?: Payment[];
  message?: string;
}

interface User {
  email?: string;
  name?: string;
}

const PaymentHistory = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as User | undefined;
  const userEmail = user?.email;

  /*
   * =====================================================
   * FETCH PAYMENT HISTORY
   * =====================================================
   */

  useEffect(() => {
    if (!userEmail) {
      if (!isPending) {
        setLoading(false);
      }

      return;
    }

    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError("");

        const url = `${API_URL}/payments/${encodeURIComponent(
          userEmail
        )}`;

        console.log("💳 Payment History URL:", url);

        const response = await fetch(url, {
          method: "GET",
          cache: "no-store",
        });

        const result: PaymentResponse = await response.json();

        console.log("💳 Payment History Response:", result);

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch payment history"
          );
        }

        setPayments(result.data || []);
      } catch (err) {
        console.error("❌ Payment history error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load payment history"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [userEmail, isPending]);

  /*
   * =====================================================
   * LOADING SESSION
   * =====================================================
   */

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
          Loading...
        </div>
      </div>
    );
  }

  /*
   * =====================================================
   * LOGIN REQUIRED
   * =====================================================
   */

  if (!userEmail) {
    return (
      <main className="min-h-[70vh] bg-[#f8fafc] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <Wallet className="mx-auto h-12 w-12 text-emerald-600" />

          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Login Required
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Please login to view your payment history.
          </p>
        </div>
      </main>
    );
  }

  /*
   * =====================================================
   * FORMAT DATE
   * =====================================================
   */

  const formatDate = (date?: string | Date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /*
   * =====================================================
   * FORMAT AMOUNT
   * =====================================================
   */

  const formatAmount = (
    amount?: number,
    currency?: string
  ) => {
    const value = Number(amount || 0) / 100;

    return `${currency?.toUpperCase() || "USD"} ${value.toFixed(
      2
    )}`;
  };

  /*
   * =====================================================
   * TOTAL CALCULATIONS
   * =====================================================
   */

  const totalCredits = payments.reduce(
    (total, payment) =>
      total + Number(payment.credits || 0),
    0
  );

  const totalAmount =
    payments.reduce(
      (total, payment) =>
        total + Number(payment.amountTotal || 0),
      0
    ) / 100;

  /*
   * =====================================================
   * STATUS STYLE
   * =====================================================
   */

  const getStatusStyle = (status?: string) => {
    const currentStatus = (
      status || "paid"
    ).toLowerCase();

    if (
      currentStatus === "paid" ||
      currentStatus === "completed" ||
      currentStatus === "success"
    ) {
      return "bg-emerald-50 text-emerald-700";
    }

    if (
      currentStatus === "pending" ||
      currentStatus === "processing"
    ) {
      return "bg-yellow-50 text-yellow-700";
    }

    if (
      currentStatus === "failed" ||
      currentStatus === "cancelled" ||
      currentStatus === "rejected"
    ) {
      return "bg-red-50 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  /*
   * =====================================================
   * MAIN UI
   * =====================================================
   */

  return (
    <main className="min-h-screen bg-[#f8fafc] px-3 py-6 sm:px-5 sm:py-8 md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 sm:text-sm">
            Creator Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Payment History
          </h1>

          <p className="mt-2 max-w-2xl text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">
            View all payment transactions made by{" "}
            <span className="font-medium text-gray-700">
              {userEmail}
            </span>
            .
          </p>
        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">

          {/* TOTAL PAYMENTS */}

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 sm:h-11 sm:w-11">
                <CreditCard className="h-5 w-5 text-emerald-600" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-500">
                  Total Payments
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  {payments.length}
                </p>
              </div>
            </div>
          </div>

          {/* TOTAL CREDITS */}

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 sm:h-11 sm:w-11">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-500">
                  Total Credits Purchased
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  {totalCredits.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* TOTAL AMOUNT */}

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 sm:h-11 sm:w-11">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-500">
                  Total Amount
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  ${totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-600">
            {error}
          </div>
        )}

        {/* =================================================
            PAYMENT CONTAINER
        ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* TABLE HEADER */}

          <div className="border-b border-gray-200 px-4 py-4 sm:px-5 sm:py-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                  All Payment Transactions
                </h2>

                <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                  Complete payment history for your account.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Wallet className="h-4 w-4 text-emerald-600" />

                <span>
                  {payments.length} transaction
                  {payments.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (
            <div className="flex min-h-[250px] items-center justify-center px-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                Loading payment history...
              </div>
            </div>
          ) : payments.length === 0 ? (

            /* =================================================
               EMPTY
            ================================================= */

            <div className="flex min-h-[250px] flex-col items-center justify-center px-5 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <CreditCard className="h-6 w-6 text-gray-400" />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No Payment History
              </h3>

              <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500">
                You have not made any credit purchases yet.
              </p>
            </div>
          ) : (

            <>
              {/* =================================================
                  MOBILE CARD VIEW
                  < md
              ================================================= */}

              <div className="block divide-y divide-gray-100 md:hidden">
                {payments.map((payment, index) => (
                  <div
                    key={
                      payment._id ||
                      payment.stripeSessionId ||
                      index
                    }
                    className="p-4 transition hover:bg-gray-50 sm:p-5"
                  >
                    {/* TOP */}

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                          <CreditCard className="h-4 w-4 text-emerald-600" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {payment.paymentType ||
                              "credit_purchase"}
                          </p>

                          <p className="mt-1 truncate text-[11px] text-gray-400">
                            #{index + 1} •{" "}
                            {payment.stripeSessionId ||
                              "Payment"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${getStatusStyle(
                          payment.paymentStatus
                        )}`}
                      >
                        {payment.paymentStatus || "paid"}
                      </span>
                    </div>

                    {/* DETAILS */}

                    <div className="mt-4 grid grid-cols-2 gap-3">

                      {/* CREDITS */}

                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-[11px] text-gray-500">
                          Credits
                        </p>

                        <p className="mt-1 text-sm font-bold text-emerald-600">
                          +
                          {Number(
                            payment.credits || 0
                          ).toLocaleString()}
                        </p>
                      </div>

                      {/* AMOUNT */}

                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-[11px] text-gray-500">
                          Amount
                        </p>

                        <p className="mt-1 text-sm font-bold text-gray-900">
                          {formatAmount(
                            payment.amountTotal,
                            payment.currency
                          )}
                        </p>
                      </div>

                      {/* PREVIOUS */}

                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-[11px] text-gray-500">
                          Previous Credits
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-700">
                          {Number(
                            payment.previousCredits || 0
                          ).toLocaleString()}
                        </p>
                      </div>

                      {/* NEW BALANCE */}

                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-[11px] text-gray-500">
                          New Balance
                        </p>

                        <p className="mt-1 text-sm font-bold text-gray-900">
                          {Number(
                            payment.newCredits || 0
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* DATE */}

                    <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
                      <CalendarDays className="h-4 w-4 shrink-0 text-gray-400" />

                      <span>
                        {formatDate(payment.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* =================================================
                  TABLE VIEW
                  md+
              ================================================= */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[950px]">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200 text-left">

                      <th className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-wide text-gray-500 lg:px-5">
                        #
                      </th>

                      <th className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-wide text-gray-500 lg:px-5">
                        Payment
                      </th>

                      <th className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-wide text-gray-500 lg:px-5">
                        Credits
                      </th>

                      <th className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-wide text-gray-500 lg:px-5">
                        Amount
                      </th>

                      <th className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-wide text-gray-500 lg:px-5">
                        Previous Credits
                      </th>

                      <th className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-wide text-gray-500 lg:px-5">
                        New Balance
                      </th>

                      <th className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-wide text-gray-500 lg:px-5">
                        Status
                      </th>

                      <th className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-wide text-gray-500 lg:px-5">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {payments.map((payment, index) => (
                      <tr
                        key={
                          payment._id ||
                          payment.stripeSessionId ||
                          index
                        }
                        className="transition hover:bg-gray-50"
                      >
                        {/* NUMBER */}

                        <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-gray-700 lg:px-5">
                          {index + 1}
                        </td>

                        {/* PAYMENT */}

                        <td className="px-4 py-4 lg:px-5">
                          <div className="flex min-w-[190px] items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                              <CreditCard className="h-4 w-4 text-emerald-600" />
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[220px] truncate text-sm font-semibold text-gray-900">
                                {payment.stripeSessionId ||
                                  "Payment"}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                {payment.paymentType ||
                                  "credit_purchase"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* CREDITS */}

                        <td className="whitespace-nowrap px-4 py-4 lg:px-5">
                          <span className="font-bold text-emerald-600">
                            +
                            {Number(
                              payment.credits || 0
                            ).toLocaleString()}
                          </span>

                          <span className="ml-1 text-xs text-gray-500">
                            credits
                          </span>
                        </td>

                        {/* AMOUNT */}

                        <td className="whitespace-nowrap px-4 py-4 lg:px-5">
                          <span className="font-semibold text-gray-900">
                            {formatAmount(
                              payment.amountTotal,
                              payment.currency
                            )}
                          </span>
                        </td>

                        {/* PREVIOUS */}

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600 lg:px-5">
                          {Number(
                            payment.previousCredits || 0
                          ).toLocaleString()}
                        </td>

                        {/* NEW BALANCE */}

                        <td className="whitespace-nowrap px-4 py-4 lg:px-5">
                          <span className="font-bold text-gray-900">
                            {Number(
                              payment.newCredits || 0
                            ).toLocaleString()}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td className="whitespace-nowrap px-4 py-4 lg:px-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                              payment.paymentStatus
                            )}`}
                          >
                            {payment.paymentStatus || "paid"}
                          </span>
                        </td>

                        {/* DATE */}

                        <td className="whitespace-nowrap px-4 py-4 lg:px-5">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CalendarDays className="h-4 w-4 shrink-0 text-gray-400" />

                            {formatDate(
                              payment.createdAt
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        {!loading && payments.length > 0 && (
          <div className="mt-4 flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {payments.length} payment
              {payments.length !== 1 ? "s" : ""}
            </span>

            <span className="max-w-full truncate">
              Account: {userEmail}
            </span>
          </div>
        )}
      </div>
    </main>
  );
};

export default PaymentHistory;