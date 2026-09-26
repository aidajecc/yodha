"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { PaymentPortalPage } from "@/components/PaymentPortalPage";
import { Suspense } from "react";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const teamId =
    searchParams.get("teamId") ||
    searchParams.get("payId") ||
    searchParams.get("pay_id") ||
    searchParams.get("id") ||
    "";

  return (
    <PaymentPortalPage
      onBack={() => router.push("/")}
      initialTeamId={teamId}
    />
  );
}

export default function PaymentRoutePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#03060d]" />}>
      <PaymentContent />
    </Suspense>
  );
}
