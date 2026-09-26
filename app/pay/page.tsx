"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { PaymentPortalPage } from "@/components/PaymentPortalPage";
import { Suspense } from "react";

function PayContent() {
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

export default function PayRoutePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#03060d]" />}>
      <PayContent />
    </Suspense>
  );
}
