"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  DollarSign,
  Info,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Loader2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

type PaymentMethod = "Stripe" | "Bkash" | "Rocket" | "Nagad";

const paymentMethods: PaymentMethod[] = ["Stripe", "Bkash", "Rocket", "Nagad"];

export default function WithdrawalsPage() {
  const { data: session } = authClient.useSession();
  const userName = session?.user?.name || "Creator";
  const userEmail = session?.user?.email;

  const [loadingStats, setLoadingStats] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Dynamic earnings & credits from backend API
  const [totalRaisedCredits, setTotalRaisedCredits] = useState<number>(0);
  const [availableCredits, setAvailableCredits] = useState<number>(0);
  const [totalWithdrawnCredits, setTotalWithdrawnCredits] = useState<number>(0);

  const [credits, setCredits] = useState<string>("");
  const [paymentSystem, setPaymentSystem] = useState<PaymentMethod>("Stripe");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const [refreshEarningsIndex, setRefreshEarningsIndex] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // ==========================================
  // FETCH DYNAMIC CREATOR EARNINGS
  // ==========================================
  useEffect(() => {
    let ignore = false;

    async function loadEarnings() {
      if (!userEmail) {
        if (!ignore) setLoadingStats(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/creators/stats/${encodeURIComponent(userEmail || "")}`);
        const json = await res.json();

        if (!ignore && json.success && json.data) {
          setTotalRaisedCredits(json.data.totalAmountRaised || 0);
          setAvailableCredits(json.data.availableCredits ?? (json.data.totalAmountRaised || 0));
          setTotalWithdrawnCredits(json.data.totalWithdrawnCredits || 0);
          setLoadingStats(false);
        }
      } catch (err: unknown) {
        console.error("Failed to load creator earnings:", err);
        if (!ignore) {
          setLoadingStats(false);
        }
      }
    }

    loadEarnings();

    return () => {
      ignore = true;
    };
  }, [userEmail, refreshEarningsIndex, API_BASE]);

  // ==========================================
  // AUTOMATIC DOLLAR CONVERSION (20 Credits = $1)
  // ==========================================
  const withdrawalAmount = useMemo(() => {
    const creditValue = Number(credits);
    if (!creditValue || creditValue <= 0) {
      return 0;
    }
    return Number((creditValue / 20).toFixed(2));
  }, [credits]);

  const creditValue = Number(credits);
  const hasMinimumCredits = availableCredits >= 200;

  const handleCreditsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setErrorMsg("");
    setSuccessMsg("");

    if (val === "") {
      setCredits("");
      return;
    }

    const num = Number(val);
    if (num < 0) return;

    if (num > availableCredits) {
      setErrorMsg(`Withdrawal cannot exceed your available raised credits (${availableCredits} credits).`);
    }

    setCredits(val);
  };

  // ==========================================
  // SUBMIT WITHDRAWAL
  // ==========================================
  const handleWithdraw = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!userEmail) {
      setErrorMsg("Please log in to submit a withdrawal request.");
      return;
    }

    if (!hasMinimumCredits) {
      setErrorMsg("Insufficient credit. Minimum withdrawal is 200 credits ($10).");
      return;
    }

    if (!creditValue || creditValue < 200) {
      setErrorMsg("Minimum withdrawal is 200 credits ($10).");
      return;
    }

    if (creditValue > availableCredits) {
      setErrorMsg(`You cannot withdraw more than your available credits (${availableCredits} credits).`);
      return;
    }

    if (!accountNumber.trim()) {
      setErrorMsg("Please enter your account number or Stripe payout email.");
      return;
    }

    const withdrawalData = {
      creator_email: userEmail,
      creator_name: userName,
      withdrawal_credit: creditValue,
      withdrawal_amount: withdrawalAmount,
      payment_system: paymentSystem,
      account_number: accountNumber.trim(),
      withdraw_date: new Date().toISOString(),
      status: "pending",
    };

    try {
      setSubmitting(true);

      const response = await fetch(`${API_BASE}/withdrawals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(withdrawalData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit withdrawal request");
      }

      setSuccessMsg(
        `Withdrawal request for ${creditValue} credits ($${withdrawalAmount.toFixed(
          2
        )}) submitted successfully! It is pending review.`
      );
      setCredits("");
      setAccountNumber("");

      // Refresh earnings stats
      setRefreshEarningsIndex((prev) => prev + 1);
    } catch (err: unknown) {
      console.error("Withdrawal error:", err);
      const msg = err instanceof Error ? err.message : "Failed to submit withdrawal. Please try again.";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen space-y-8 pb-12">
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
            Withdraw Earnings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Convert your campaign raised credits into real money.{" "}
            <span className="font-semibold text-violet-600">20 Credits = $1 USD</span>
          </p>
        </div>

        <Link
          href="/dashboard/Creator/Paymenthistory"
          className="self-start sm:self-auto rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition active:scale-95"
        >
          View Withdrawal History →
        </Link>
      </div>

      {/* ================= CREATOR TOTAL EARNINGS ================= */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* Total Raised Credits */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 border border-violet-100">
              <Wallet size={26} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Total Raised Credits
              </p>
              <h2 className="mt-1 text-3xl font-extrabold text-gray-900">
                {loadingStats ? <Loader2 className="h-7 w-7 animate-spin text-violet-500" /> : totalRaisedCredits}
              </h2>
              <p className="text-xs text-gray-500 font-medium">Lifetime raised across campaigns</p>
            </div>
          </div>
        </div>

        {/* Available Withdrawal Amount in Dollars */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <DollarSign size={28} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Available To Withdraw
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <h2 className="text-3xl font-extrabold text-emerald-600">
                  ${(availableCredits / 20).toFixed(2)}
                </h2>
                <span className="text-xs font-bold text-emerald-700">USD</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                {availableCredits} credits ÷ 20 {totalWithdrawnCredits > 0 ? `(${totalWithdrawnCredits} withdrawn)` : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Business Logic Explainer */}
        <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-violet-50/60 p-6">
          <div className="mb-2 flex items-center gap-2">
            <Info size={18} className="text-indigo-600" />
            <h3 className="font-bold text-indigo-950 text-sm">Platform Business Model</h3>
          </div>
          <div className="space-y-1.5 text-xs text-indigo-900/80">
            <p>• Supporters purchase <strong>10 credits for $1</strong>.</p>
            <p>• Creators withdraw <strong>$1 for every 20 credits</strong> raised.</p>
            <p>• Minimum withdrawal: <strong>200 credits ($10 USD)</strong>.</p>
          </div>
        </div>
      </div>

      {/* ================= WITHDRAWAL FORM CARD ================= */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-violet-600" />
            Request a Withdrawal
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mb-6">
            Enter the amount of credits you wish to withdraw and specify your destination payout account.
          </p>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="mb-5 flex items-center gap-2.5 rounded-2xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 flex items-center gap-2.5 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleWithdraw} className="space-y-5">
            {/* 1. Credits To Withdraw */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Credits To Withdraw
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="200"
                  max={availableCredits}
                  step="1"
                  required
                  placeholder="e.g. 200, 500, 1000"
                  value={credits}
                  onChange={handleCreditsChange}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-base outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                  Credits
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Available to withdraw:{" "}
                <span className="font-semibold text-gray-700">{availableCredits} credits</span> (Minimum: 200 credits)
              </p>
            </div>

            {/* 2. Withdraw Amount ($) - Read Only */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Withdraw Amount ($) — (Calculated Automatically: 20 credits = $1)
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                  $
                </div>
                <input
                  type="number"
                  readOnly
                  disabled
                  value={withdrawalAmount}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 pl-8 text-base font-bold text-emerald-700 cursor-not-allowed outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  USD
                </span>
              </div>
            </div>

            {/* 3. Select Payment System Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Select Payment System
              </label>
              <select
                value={paymentSystem}
                onChange={(e) => setPaymentSystem(e.target.value as PaymentMethod)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 bg-white"
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method} {method === "Stripe" ? "(Direct Bank / Card Payout)" : "(Mobile Financial Service)"}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Account Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Account Number / Payout Email
              </label>
              <input
                type="text"
                required
                placeholder={
                  paymentSystem === "Stripe"
                    ? "Enter your bank account number or Stripe email"
                    : "Enter your mobile account number (e.g., 017XXXXXXXX)"
                }
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              />
            </div>

            {/* 5. Withdraw Button or Insufficient credit notice */}
            <div className="pt-2">
              {!hasMinimumCredits ? (
                <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200 text-center">
                  <p className="text-base font-extrabold text-amber-800">Insufficient credit</p>
                  <p className="text-xs text-amber-700 mt-1">
                    You currently have {availableCredits} credits. A minimum of 200 raised credits is required to request a withdrawal.
                  </p>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={submitting || creditValue < 200 || creditValue > availableCredits}
                  className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-4 text-base font-bold text-white shadow-lg shadow-violet-200 transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting Request...
                    </span>
                  ) : (
                    `Withdraw ${creditValue ? `${creditValue} Credits ($${withdrawalAmount.toFixed(2)})` : "Credits"}`
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
