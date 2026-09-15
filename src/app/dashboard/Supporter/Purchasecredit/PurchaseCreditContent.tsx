"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

interface CreditPackage {
  credits: number;
  price: number;
  popular: boolean;
}

interface UserWithCredits {
  email: string;
  name?: string;
  credits?: number;
}

interface CheckoutResponse {
  success?: boolean;
  url?: string;
  sessionId?: string;
  message?: string;
}

interface PaymentSessionData {
  id?: string;
  payment_status?: string;
  status?: string;
  customer_email?: string;
  amount_total?: number;
  currency?: string;

  metadata?: {
    email?: string;
    credits?: string;
  };

  payment_intent?: string | null;
  created?: number;
}

interface PaymentSessionResponse {
  success?: boolean;
  data?: PaymentSessionData;
  message?: string;
}

const creditPackages: CreditPackage[] = [
  {
    credits: 100,
    price: 10,
    popular: false,
  },
  {
    credits: 300,
    price: 25,
    popular: true,
  },
  {
    credits: 800,
    price: 60,
    popular: false,
  },
  {
    credits: 1500,
    price: 110,
    popular: false,
  },
];

const PurchaseCreditContent = () => {
  /*
   * =====================================================
   * SEARCH PARAMS
   * =====================================================
   */

  const searchParams = useSearchParams();

  /*
   * =====================================================
   * STATES
   * =====================================================
   */

  const [availableCredits, setAvailableCredits] =
    useState(0);

  const [loadingPackage, setLoadingPackage] =
    useState<number | null>(null);

  const [loadingCredits, setLoadingCredits] =
    useState(true);

  const [paymentSuccess, setPaymentSuccess] =
    useState(false);

  const [paymentCanceled, setPaymentCanceled] =
    useState(false);

  const [error, setError] = useState("");

  /*
   * =====================================================
   * AUTH SESSION
   * =====================================================
   */

  const { data: session, isPending } =
    authClient.useSession();

  const user = session?.user as
    | UserWithCredits
    | undefined;

  const userEmail = user?.email;

  /*
   * =====================================================
   * FETCH CURRENT CREDITS
   * =====================================================
   */

  useEffect(() => {
    if (!userEmail) {
      setLoadingCredits(false);
      return;
    }

    const loadCredits = async () => {
      try {
        setLoadingCredits(true);

        const response = await fetch(
          `${API_URL}/users/credits/${encodeURIComponent(
            userEmail
          )}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch current credits"
          );
        }

        const result = await response.json();

        const credits = Number(
          result?.credits ??
            user?.credits ??
            0
        );

        setAvailableCredits(credits);
      } catch (err) {
        console.error(
          "❌ Credits fetch error:",
          err
        );

        setAvailableCredits(
          Number(user?.credits ?? 0)
        );
      } finally {
        setLoadingCredits(false);
      }
    };

    loadCredits();
  }, [userEmail, user?.credits]);

  /*
   * =====================================================
   * STRIPE SUCCESS / CANCEL
   * =====================================================
   */

  useEffect(() => {
    const success =
      searchParams.get("success");

    const canceled =
      searchParams.get("canceled");

    const sessionId =
      searchParams.get("session_id");

    /*
     * =================================================
     * PAYMENT CANCELED
     * =================================================
     */

    if (canceled === "true") {
      setPaymentCanceled(true);
      setPaymentSuccess(false);
      setLoadingPackage(null);

      console.log("❌ PAYMENT CANCELED");

      return;
    }

    /*
     * =================================================
     * PAYMENT SUCCESS CHECK
     * =================================================
     */

    if (success !== "true") {
      return;
    }

    /*
     * =================================================
     * SESSION ID CHECK
     * =================================================
     */

    if (!sessionId) {
      setError(
        "Payment session information not found."
      );

      console.error(
        "❌ Stripe session_id not found"
      );

      return;
    }

    /*
     * =================================================
     * GET PAYMENT DATA
     * =================================================
     */

    const getPaymentData = async () => {
      try {
        setError("");

        console.log(
          "🔎 Getting Stripe payment data..."
        );

        const response = await fetch(
          `${API_URL}/payments/session/${encodeURIComponent(
            sessionId
          )}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result: PaymentSessionResponse =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch payment information"
          );
        }

        const paymentData = result.data;

        if (!paymentData) {
          throw new Error(
            "Payment data not found"
          );
        }

        /*
         * =================================================
         * CONSOLE PAYMENT DATA
         * =================================================
         */

        console.log(
          "===================================="
        );

        console.log(
          "💳 PAYMENT SUCCESSFUL"
        );

        console.log(
          "Stripe Session ID:",
          paymentData.id
        );

        console.log(
          "Payment Status:",
          paymentData.payment_status
        );

        console.log(
          "Checkout Status:",
          paymentData.status
        );

        console.log(
          "Customer Email:",
          paymentData.customer_email
        );

        console.log(
          "Amount:",
          paymentData.amount_total
        );

        console.log(
          "Currency:",
          paymentData.currency
        );

        console.log(
          "Payment Intent:",
          paymentData.payment_intent
        );

        console.log(
          "Purchased Credits:",
          paymentData.metadata?.credits
        );

        console.log(
          "Payment Metadata:",
          paymentData.metadata
        );

        console.log(
          "Created:",
          paymentData.created
        );

        console.log(
          "📦 Complete Stripe Payment Data:",
          paymentData
        );

        console.log(
          "===================================="
        );

        /*
         * IMPORTANT:
         *
         * Do NOT POST payment again to /payments.
         *
         * Stripe webhook already handles:
         * 1. Payment verification
         * 2. Credit update
         * 3. Payment history insert
         */

        setPaymentSuccess(true);
        setPaymentCanceled(false);
        setLoadingPackage(null);

        /*
         * Refresh current credits after payment.
         *
         * Webhook may need a short time to update
         * MongoDB, so we fetch again.
         */

        if (userEmail) {
          setTimeout(async () => {
            try {
              const creditsResponse =
                await fetch(
                  `${API_URL}/users/credits/${encodeURIComponent(
                    userEmail
                  )}`,
                  {
                    method: "GET",
                    cache: "no-store",
                  }
                );

              if (creditsResponse.ok) {
                const creditsResult =
                  await creditsResponse.json();

                setAvailableCredits(
                  Number(
                    creditsResult?.credits || 0
                  )
                );
              }
            } catch (creditsError) {
              console.error(
                "❌ Failed to refresh credits:",
                creditsError
              );
            }
          }, 1500);
        }
      } catch (err) {
        console.error(
          "❌ Payment data error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to process payment information."
        );

        setLoadingPackage(null);
      }
    };

    getPaymentData();
  }, [searchParams, userEmail]);

  /*
   * =====================================================
   * BUY NOW
   * =====================================================
   */

  const handlePurchase = async (
    creditPackage: CreditPackage
  ) => {
    if (!userEmail) {
      setError(
        "Please login to purchase credits."
      );

      return;
    }

    try {
      setLoadingPackage(
        creditPackage.credits
      );

      setError("");
      setPaymentSuccess(false);
      setPaymentCanceled(false);

      console.log(
        "🛒 BUY NOW CLICKED"
      );

      console.log(
        "Credits:",
        creditPackage.credits
      );

      console.log(
        "Price:",
        creditPackage.price
      );

      /*
       * =================================================
       * CREATE STRIPE CHECKOUT SESSION
       * =================================================
       */

      const response = await fetch(
        `${API_URL}/payments/create-checkout-session`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: userEmail,
            credits:
              creditPackage.credits,
          }),
        }
      );

      const result: CheckoutResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Payment session failed"
        );
      }

      if (!result.url) {
        throw new Error(
          "Stripe checkout URL not found"
        );
      }

      console.log(
        "✅ Stripe Checkout Session Created"
      );

      console.log(
        "Session ID:",
        result.sessionId
      );

      /*
       * =================================================
       * REDIRECT TO STRIPE
       * =================================================
       */

      window.location.href =
        result.url;
    } catch (err: unknown) {
      console.error(
        "❌ Payment error:",
        err
      );

      const message =
        err instanceof Error
          ? err.message
          : "Unable to start payment. Please try again.";

      setError(message);

      setLoadingPackage(null);
    }
  };

  /*
   * =====================================================
   * SESSION LOADING
   * =====================================================
   */

  if (isPending) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center gap-2 text-sm text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" />

        Loading...
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
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f8fafc] px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <Wallet className="mx-auto h-12 w-12 text-emerald-600" />

          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Login Required
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Please login to purchase
            credits.
          </p>
        </div>
      </main>
    );
  }

  /*
   * =====================================================
   * MAIN UI
   * =====================================================
   */

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="text-center">
          <p className="text-sm font-semibold text-emerald-600">
            Supporter Wallet
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Purchase Credit
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
            Purchase credits and support
            meaningful campaigns. Choose a
            package that works best for you.
          </p>
        </div>

        {/* CURRENT CREDITS */}

        <div className="mx-auto mt-6 flex max-w-md items-center justify-between rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <Wallet className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Available Credits
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {loadingCredits
                  ? "..."
                  : availableCredits.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* PAYMENT SUCCESS */}

        {paymentSuccess && (
          <div className="mx-auto mt-6 flex max-w-md items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

            <div>
              <p className="text-sm font-semibold text-emerald-800">
                Payment Successful!
              </p>

              <p className="mt-1 text-xs text-emerald-700">
                Your payment has been
                completed successfully.
              </p>
            </div>
          </div>
        )}

        {/* PAYMENT CANCELED */}

        {paymentCanceled && (
          <div className="mx-auto mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-center text-sm text-yellow-700">
            Payment was canceled.
          </div>
        )}

        {/* ERROR */}

        {error && (
          <p className="mx-auto mt-5 max-w-md rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        {/* CREDIT PACKAGES */}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {creditPackages.map(
            (creditPackage) => {
              const isLoading =
                loadingPackage ===
                creditPackage.credits;

              return (
                <div
                  key={
                    creditPackage.credits
                  }
                  className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                    creditPackage.popular
                      ? "border-emerald-500 ring-1 ring-emerald-500"
                      : "border-gray-200"
                  }`}
                >
                  {/* MOST POPULAR */}

                  {creditPackage.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-600 px-4 py-1 text-xs font-bold text-white">
                      Most Popular
                    </span>
                  )}

                  {/* ICON */}

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                    <CreditCard className="h-6 w-6 text-emerald-600" />
                  </div>

                  {/* CREDIT AMOUNT */}

                  <h2 className="mt-5 text-2xl font-bold text-gray-900">
                    {creditPackage.credits.toLocaleString()}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Credits
                  </p>

                  {/* PRICE */}

                  <div className="mt-5">
                    <span className="text-3xl font-bold text-gray-900">
                      $
                      {
                        creditPackage.price
                      }
                    </span>

                    <span className="ml-1 text-sm text-gray-500">
                      USD
                    </span>
                  </div>

                  <div className="my-5 h-px bg-gray-100" />

                  {/* FEATURES */}

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />

                      Instant credit
                      purchase
                    </div>

                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />

                      Secure payment
                    </div>

                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />

                      Support campaigns
                    </div>
                  </div>

                  {/* BUY BUTTON */}

                  <button
                    type="button"
                    disabled={
                      loadingPackage !==
                      null
                    }
                    onClick={() =>
                      handlePurchase(
                        creditPackage
                      )
                    }
                    className="mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />

                        Redirecting...
                      </>
                    ) : (
                      "Buy Now"
                    )}
                  </button>
                </div>
              );
            }
          )}
        </div>

        {/* SECURITY NOTICE */}

        <div className="mx-auto mt-10 flex max-w-2xl items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

          <p className="text-xs leading-5 text-gray-500">
            Payments are processed securely
            through Stripe. Your payment
            information is protected by
            Stripe.
          </p>
        </div>
      </div>
    </main>
  );
};

export default PurchaseCreditContent;