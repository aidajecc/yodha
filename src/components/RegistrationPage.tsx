"use client";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { RegistrationSection } from "./RegistrationSection";

interface RegistrationPageProps {
  onBack: () => void;
  selectedTrack?: string;
  onOpenReferralDashboard?: (code: string) => void;
}

export function RegistrationPage({ onBack, selectedTrack, onOpenReferralDashboard }: RegistrationPageProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#03060d] text-white font-sans relative overflow-x-hidden flex flex-col justify-between select-none">
      {/* Dynamic Background Hills & Blue Glow matching site theme */}
      <div className="fixed inset-0 w-screen h-screen pointer-events-none z-0 overflow-hidden">
        <img
          src="/bg-hills-night-pc.webp"
          alt="Night Hills Background"
          className="w-full h-full object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-slate-950/40 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none" />
      </div>

      {/* TOP FLOATING BACK BUTTON ONLY (NO TOP NAVIGATION BAR) */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-4 sm:px-8 pt-6 sm:pt-8 pb-2">
        <button
          onClick={onBack}
          aria-label="Back"
          className="inline-flex items-center justify-center p-3 rounded-full bg-slate-950/90 border border-blue-500/50 text-blue-300 hover:text-white hover:border-blue-400 backdrop-blur-2xl transition-all cursor-pointer shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-blue-400" />
        </button>
      </div>

      {/* NORMAL SITE VIEW REGISTRATION CONTENT */}
      <main className="relative z-10 w-full flex-1 max-w-5xl mx-auto px-4 py-6 sm:py-10">
        <RegistrationSection
          selectedTrack={selectedTrack}
          onOpenReferralDashboard={onOpenReferralDashboard}
        />
      </main>
    </div>
  );
}

export default RegistrationPage;

