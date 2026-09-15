"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import PurchaseCreditContent from "./PurchaseCreditContent";

const PurchaseCreditPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
          Loading...
        </div>
      }
    >
      <PurchaseCreditContent />
    </Suspense>
  );
};

export default PurchaseCreditPage;