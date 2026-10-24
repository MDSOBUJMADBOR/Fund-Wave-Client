"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CreditCard,
  Coins,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Loader2,
  AlertCircle,
  BadgeCheck,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface CreditPackage {
  credits: number;
  price: number;
  label: string;
  popular?: boolean;
  bestValue?: boolean;
  perCredit: string;
}

const creditPackages: CreditPackage[] = [
  {
    credits: 100,
    price: 10,
    label: "Starter Pack",
    perCredit: "$0.10 / credit",
  },
  {
    credits: 300,
    price: 25,
    label: "Popular Pack",
    popular: true,
    perCredit: "$0.083 / credit",
  },
  {
    credits: 800,
    price: 60,
    label: "Super Backer",
    bestValue: true,
    perCredit: "$0.075 / credit",
  },
  {
    credits: 1500,
    price: 110,
    label: "Ultimate Benefactor",
    perCredit: "$0.073 / credit",
  },
];

function PurchaseCreditInner() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const searchParams = useSearchParams();

  const [availableCredits, setAvailableCredits] = useState<number>(0);
  const [loadingCredits, setLoadingCredits] = useState<boolean>(true);
  const [purchasingCredits, setPurchasingCredits] = useState<number | null>(null);

  // Success / Canceled states from Stripe redirect
  const [successInfo, setSuccessInfo] = useState<{
    credits?: number;
    amount?: number;
    sessionId?: string;
  } | null>(null);
  const [dismissCancelNotice, setDismissCancelNotice] = useState(false);
  const showCancelNotice = searchParams.get("canceled") === "true" && !dismissCancelNotice;
  const [statusMessage, setStatusMessage] = useState("");
  const [refreshCreditsTrigger, setRefreshCreditsTrigger] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // ==========================================
  // FETCH USER CREDITS
  // ==========================================
  useEffect(() => {
    let ignore = false;

    async function loadUserCredits() {
      if (!user?.email) {
        if (!ignore) setLoadingCredits(false);
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE}/users/credits/${encodeURIComponent(user.email)}`
        );
        const data = await res.json();
        if (!ignore && data.success && data.credits !== undefined) {
          setAvailableCredits(Number(data.credits));
        }
      } catch (err: unknown) {
        console.error("Failed to load user credits:", err);
      } finally {
        if (!ignore) {
          setLoadingCredits(false);
        }
      }
    }

    loadUserCredits();

    return () => {
      ignore = true;
    };
  }, [user?.email, refreshCreditsTrigger, API_BASE]);

  // ==========================================
  // HANDLE STRIPE REDIRECT (SUCCESS)
  // ==========================================
  useEffect(() => {
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");

    const userEmail = user?.email;
    if (success && sessionId && userEmail) {
      let ignore = false;

      async function verifyStripePayment() {
        try {
          // 1. Fetch Session from Stripe backend
          const sessionRes = await fetch(`${API_BASE}/payments/session/${sessionId}`);
          const sessionJson = await sessionRes.json();

          if (sessionJson.success && sessionJson.data) {
            const data = sessionJson.data;
            const creditsPurchased = Number(data.metadata?.credits || 0);

            // 2. Post fallback record to ensure credited
            await fetch(`${API_BASE}/payments`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                stripeSessionId: sessionId,
                paymentIntentId: data.payment_intent,
                email: userEmail,
                credits: creditsPurchased,
                amountTotal: data.amount_total,
                currency: data.currency || "usd",
                paymentStatus: data.payment_status || "paid",
                checkoutStatus: data.status || "complete",
              }),
            });

            if (!ignore) {
              setSuccessInfo({
                credits: creditsPurchased,
                amount: data.amount_total ? data.amount_total / 100 : undefined,
                sessionId: sessionId || undefined,
              });

              // Refresh user credit balance
              setRefreshCreditsTrigger((k) => k + 1);
            }
          }
        } catch (err: unknown) {
          console.error("Payment verification error:", err);
        }
      }

      verifyStripePayment();

      return () => {
        ignore = true;
      };
    }
  }, [searchParams, user?.email, API_BASE]);

  // ==========================================
  // INITIATE STRIPE CHECKOUT
  // ==========================================
  const handlePurchase = async (pkg: CreditPackage) => {
    if (!user?.email) {
      alert("Please login before purchasing credits.");
      return;
    }

    setStatusMessage("");
    setPurchasingCredits(pkg.credits);

    try {
      const response = await fetch(`${API_BASE}/payments/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          credits: pkg.credits,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to start Stripe checkout session");
      }

      if (data.url) {
        // Redirect to Stripe Checkout page
        window.location.assign(data.url);
      } else {
        throw new Error("No checkout URL returned from payment server");
      }
    } catch (err: unknown) {
      console.error("Purchase error:", err);
      const msg = err instanceof Error ? err.message : "Payment initialization failed";
      setStatusMessage(msg);
      setPurchasingCredits(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ==================================================== */}
      {/* HEADER & BALANCE BANNER */}
      {/* ==================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Official Credit Store
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
              Purchase Support Credits
            </h1>
            <p className="mt-1 text-sm md:text-base text-cyan-100 max-w-xl">
              Buy credits securely with Stripe to pledge to visionary campaigns and help creators reach their goals.
            </p>
          </div>

          {/* Current Balance Card */}
          <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-5 border border-white/20 backdrop-blur-md shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400 text-amber-950 font-extrabold shadow">
              <Coins className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-cyan-200">Your Current Balance</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl font-black text-white">
                  {loadingCredits ? <Loader2 className="h-6 w-6 animate-spin text-white" /> : availableCredits}
                </span>
                <span className="text-xs font-semibold text-cyan-100">Credits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative blur elements */}
        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-black/10 blur-2xl" />
      </div>

      {/* ==================================================== */}
      {/* ALERTS: SUCCESS OR CANCELED NOTICES */}
      {/* ==================================================== */}
      {successInfo && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shrink-0 shadow">
              <BadgeCheck className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-950">
                Payment Successful! Credits Added 🎉
              </h3>
              <p className="text-sm text-emerald-700 mt-0.5">
                {successInfo.credits ? `+${successInfo.credits} credits` : "Your credits"} have been added to your balance. Session: {successInfo.sessionId?.slice(0, 18)}...
              </p>
            </div>
          </div>
          <button
            onClick={() => setSuccessInfo(null)}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
          >
            Dismiss
          </button>
        </div>
      )}

      {showCancelNotice && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">
              The Stripe checkout session was canceled. No charges were made to your card.
            </p>
          </div>
          <button
            onClick={() => setDismissCancelNotice(true)}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900"
          >
            ✕
          </button>
        </div>
      )}

      {statusMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* ==================================================== */}
      {/* CREDIT PACKAGES GRID (100, 300, 800, 1500) */}
      {/* ==================================================== */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-500" />
            Select a Credit Package
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Choose a package to securely checkout with Stripe. Credits are instantly added to your account upon payment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {creditPackages.map((pkg) => {
            const isProcessing = purchasingCredits === pkg.credits;

            return (
              <div
                key={pkg.credits}
                className={`relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  pkg.popular
                    ? "border-2 border-cyan-500 bg-gradient-to-b from-cyan-50/50 via-white to-white shadow-md ring-4 ring-cyan-100"
                    : pkg.bestValue
                    ? "border-2 border-emerald-500 bg-gradient-to-b from-emerald-50/50 via-white to-white shadow-md ring-4 ring-emerald-100"
                    : "border border-gray-200 bg-white shadow-sm"
                }`}
              >
                {/* Popular / Best Value Ribbon */}
                {pkg.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                    ⭐ Most Popular
                  </span>
                )}
                {pkg.bestValue && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                    💎 Best Value
                  </span>
                )}

                <div className="space-y-4 pt-1">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{pkg.label}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{pkg.perCredit}</p>
                  </div>

                  {/* Credits & Price */}
                  <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100 text-center space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-2xl font-black text-gray-900">
                      <Coins className="h-6 w-6 text-amber-500" />
                      <span>{pkg.credits}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 block">Credits</span>
                  </div>

                  <div className="text-center pt-1">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-extrabold text-gray-900">${pkg.price}</span>
                      <span className="text-xs font-bold text-gray-500">USD</span>
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Instant balance top-up</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Back any verified project</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Encrypted Stripe checkout</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  type="button"
                  onClick={() => handlePurchase(pkg)}
                  disabled={isProcessing}
                  className={`mt-6 w-full rounded-2xl py-3 px-4 text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 ${
                    pkg.popular
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:opacity-95 shadow-cyan-200"
                      : pkg.bestValue
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-95 shadow-emerald-200"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Connecting Stripe...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      <span>Buy for ${pkg.price}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================================================== */}
      {/* SECURITY ASSURANCE */}
      {/* ==================================================== */}
      <div className="rounded-3xl border border-gray-100 bg-gray-50/70 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm text-cyan-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-gray-800">Guaranteed 256-Bit SSL Encryption</p>
            <p className="text-gray-500">Payments are processed directly by Stripe. Card numbers are never stored on our servers.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
          <span>Visa</span> • <span>Mastercard</span> • <span>Amex</span> • <span>Stripe Verified</span>
        </div>
      </div>
    </div>
  );
}

export default function PurchaseCreditPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[350px] items-center justify-center gap-3 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
          <span>Loading credit store...</span>
        </div>
      }
    >
      <PurchaseCreditInner />
    </Suspense>
  );
}