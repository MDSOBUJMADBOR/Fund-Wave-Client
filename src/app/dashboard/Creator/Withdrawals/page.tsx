"use client";

import { useMemo, useState } from "react";
import {
  
  CheckCircle2,
  ChevronDown,
  CreditCard,
  DollarSign,
  HelpCircle,
  Info,
  Lightbulb,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

type PaymentMethod = "Stripe" | "Bkash" | "Rocket" | "Nagad";



const paymentMethods: PaymentMethod[] = [
  "Stripe",
  "Bkash",
  "Rocket",
  "Nagad",
];

export default function WithdrawalsPage() {
 const { data: session } = authClient.useSession();
  const userName = session?.user?.name;
  const userEmail = session?.user?.email;
 


  // Example: get this value from your API later
  const totalRaisedCredits = 500;

  const [credits, setCredits] = useState("400");
  const [paymentSystem, setPaymentSystem] =
    useState<PaymentMethod>("Stripe");
  const [accountNumber, setAccountNumber] = useState("");

  // 20 Credits = $1
  const withdrawalAmount = useMemo(() => {
    const creditValue = Number(credits);

    if (!creditValue || creditValue < 0) {
      return 0;
    }

    return creditValue / 20;
  }, [credits]);

  const creditValue = Number(credits);

  const isBelowMinimum =
    creditValue > 0 && creditValue < 200;

  const exceedsBalance =
    creditValue > totalRaisedCredits;

  const canWithdraw =
    totalRaisedCredits >= 200 &&
    creditValue >= 200 &&
    creditValue <= totalRaisedCredits &&
    accountNumber.trim().length > 0;

  const handleCreditsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    if (value === "") {
      setCredits("");
      return;
    }

    if (Number(value) >= 0) {
      setCredits(value);
    }
  };

const handleWithdraw = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  if (totalRaisedCredits < 200) {
    alert("Insufficient credit");
    return;
  }

  if (creditValue > totalRaisedCredits) {
    alert("You cannot withdraw more than your total credits.");
    return;
  }

  if (creditValue < 200) {
    alert("Minimum withdrawal is 200 credits.");
    return;
  }

  if (!accountNumber.trim()) {
    alert("Please enter your account number.");
    return;
  }

  const withdrawalData = {
    creator_email: userEmail,
    creator_name: userName,
    withdrawal_credit: creditValue,
    payment_system: paymentSystem,
    account_number: Number(accountNumber),
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/withdrawals`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(withdrawalData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to submit withdrawal"
      );
    }

    console.log("Withdrawal response:", data);

    alert("Withdrawal request submitted successfully!");

    setCredits("");
    setAccountNumber("");
  } catch (error) {
    console.error("Withdrawal error:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Something went wrong"
    );
  }
};

  return (
    <main className="min-h-screen bg-[#f7faf9] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ================= PAGE HEADER ================= */}
        <div className="mb-7">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Withdrawals
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Turn your raised credits into real money. 20 credits = $1
          </p>
        </div>

        {/* ================= TOP CARDS ================= */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Total Raised Credits */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fuchsia-50 text-fuchsia-600">
                <Wallet size={24} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Raised Credits
                </p>

                <h2 className="mt-1 text-3xl font-bold text-slate-900">
                  {totalRaisedCredits}
                </h2>

                <p className="text-sm text-slate-400">
                  credits
                </p>
              </div>
            </div>
          </div>

          {/* Available Withdrawal */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fuchsia-50 text-fuchsia-600">
                <DollarSign size={25} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Available Withdrawal
                </p>

                <h2 className="mt-1 text-3xl font-bold text-slate-900">
                  ${(totalRaisedCredits / 20).toFixed(2)}
                </h2>

                <p className="text-sm text-slate-400">
                  ({totalRaisedCredits} credits ÷ 20)
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="rounded-2xl border border-fuchsia-200 bg-fuchsia-50/70 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Info
                size={20}
                className="text-fuchsia-400"
              />

              <h3 className="font-bold text-slate-800">
                How It Works?
              </h3>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-fuchsia-500" />

                <p>
                  Supporter purchases 10 credits for $1.
                </p>
              </div>

              <div className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-fuchsia-500" />

                <p>
                  Creator withdraws $1 for every 20 credits.
                </p>
              </div>

              <div className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-fuchsia-500" />

                <p>
                  Minimum withdrawal: 200 credits ($10).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= FORM + SIDE INFO ================= */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
          {/* ================= WITHDRAW FORM ================= */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Request a Withdrawal
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter your withdrawal details below.
              </p>
            </div>

            <form
              onSubmit={handleWithdraw}
              className="space-y-5"
            >
              {/* Credits To Withdraw */}
              <div>
                <label
                  htmlFor="credits"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Credits To Withdraw
                </label>

                <div className="relative">
                  <input
                    id="credits"
                    type="number"
                    min="0"
                    max={totalRaisedCredits}
                    value={credits}
                    onChange={handleCreditsChange}
                    placeholder="Enter credits"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3.5 pr-24 text-sm outline-none transition focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    Max: {totalRaisedCredits}
                  </span>
                </div>

                {isBelowMinimum && (
                  <p className="mt-2 text-xs text-amber-600">
                    Minimum withdrawal is 200 credits.
                  </p>
                )}

                {exceedsBalance && (
                  <p className="mt-2 text-xs text-red-500">
                    You cannot withdraw more than your total
                    raised credits.
                  </p>
                )}
              </div>

              {/* Withdraw Amount */}
              <div>
                <label
                  htmlFor="withdrawAmount"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Withdraw Amount ($)
                </label>

                <div className="relative">
                  <DollarSign
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="withdrawAmount"
                    type="text"
                    value={withdrawalAmount.toFixed(2)}
                    readOnly
                    className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-3.5 pl-11 text-sm text-slate-600 outline-none"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    Auto calculated
                  </span>
                </div>
              </div>

              {/* Payment System */}
              <div>
                <label
                  htmlFor="paymentSystem"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Select Payment System
                </label>

                <div className="relative">
                  <select
                    id="paymentSystem"
                    value={paymentSystem}
                    onChange={(event) =>
                      setPaymentSystem(
                        event.target.value as PaymentMethod
                      )
                    }
                    className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-3.5 pr-10 text-sm outline-none transition focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label
                  htmlFor="accountNumber"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Account Number
                </label>

                <div className="relative">
                  <CreditCard
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="accountNumber"
                    type="text"
                    value={accountNumber}
                    onChange={(event) =>
                      setAccountNumber(event.target.value)
                    }
                    placeholder={
                      paymentSystem === "Stripe"
                        ? "You Account Number"
                        : "017XXXXXXXX"
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3.5 pl-11 text-sm outline-none transition focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Enter your {paymentSystem} account number or
                  account ID.
                </p>
              </div>

              {/* Withdraw Button */}
              {totalRaisedCredits < 200 ? (
                <div className="rounded-lg bg-slate-100 py-3.5 text-center text-sm font-semibold text-slate-500">
                  Insufficient credit
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={!canWithdraw}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-fuchsia-600 py-3.5 text-sm font-semibold text-white transition hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <Wallet size={18} />
                  Withdraw
                </button>
              )}

              {/* Security */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck size={15} />

                <span>
                  Your information is secure and will only be used
                  for payment processing.
                </span>
              </div>
            </form>
          </section>

          {/* ================= RIGHT SIDE ================= */}
          <aside className="space-y-5">
            {/* Important Notes */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <Lightbulb
                  size={20}
                  className="text-slate-700"
                />

                <h3 className="font-bold text-slate-800">
                  Important Notes
                </h3>
              </div>

              <div className="space-y-4">
                <InfoItem text="You can withdraw when you have at least 200 credits ($10)." />

                <InfoItem text="You cannot withdraw more than your total raised credits." />

                <InfoItem text="The withdrawal amount is automatically calculated (20 credits = $1)." />

                <InfoItem text='Your withdrawal request will be saved with status "pending".' />

                <InfoItem text="Stripe can be used for real payment integration." />
              </div>
            </div>

            {/* Help Card */}
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5">
              <div className="mb-3 flex items-center gap-2">
                <HelpCircle
                  size={20}
                  className="text-sky-600"
                />

                <h3 className="font-bold text-slate-800">
                  Need Help?
                </h3>
              </div>

              <p className="text-sm leading-6 text-slate-600">
                If you face any issue with withdrawal, please
                contact our support team.
              </p>

<Link href={"/contact"}>
              <button
                type="button"
                className="mt-4 flex items-center gap-2 rounded-lg border border-sky-400 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 cursor-pointer"
              >
                <HelpCircle size={16} />
                Contact Support
              </button>
</Link>
            </div>
          </aside>
        </div>


      </div>
    </main>
  );
}

/* ================= INFO ITEM ================= */

function InfoItem({ text }: { text: string }) {
  return (
    <div className="flex gap-3">
      <CheckCircle2
        size={18}
        className="mt-0.5 shrink-0 text-fuchsia-500"
      />

      <p className="text-sm leading-5 text-slate-600">
        {text}
      </p>
    </div>
  );
}

