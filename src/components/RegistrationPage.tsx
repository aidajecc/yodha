"use client";

import { useEffect } from "react";
import { ArrowLeft, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface RegistrationPageProps {
  onBack: () => void;
  selectedTrack?: string;
  onOpenReferralDashboard?: (code: string) => void;
}

export function RegistrationPage({ onBack }: RegistrationPageProps) {
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
        <div className="absolute inset-0 bg-slate-950/60 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none" />
      </div>

      {/* TOP FLOATING BACK BUTTON */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-4 sm:px-8 pt-6 sm:pt-8 pb-2">
        <button
          onClick={onBack}
          aria-label="Back"
          className="inline-flex items-center justify-center p-3 rounded-full bg-slate-950/90 border border-blue-500/50 text-blue-300 hover:text-white hover:border-blue-400 backdrop-blur-2xl transition-all cursor-pointer shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-blue-400" />
        </button>
      </div>

      {/* REGISTRATION CLOSED CONTENT - MINIMAL & IN YODHA THEME */}
      <main className="relative z-10 w-full flex-1 max-w-lg mx-auto px-4 py-8 sm:py-16 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-[#060817]/95 border border-blue-500/35 rounded-3xl p-6 sm:p-9 backdrop-blur-3xl shadow-[0_0_50px_rgba(59,130,246,0.25)] flex flex-col items-center space-y-5"
        >
          {/* ANIMATED BLUE LOCK */}
          <div className="relative flex items-center justify-center my-1">
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.45, 0, 0.45] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="absolute w-20 h-20 rounded-full bg-blue-500/20"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 flex items-center justify-center text-white shadow-[0_8px_25px_rgba(37,99,235,0.4)] relative z-10"
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              >
                <Lock className="w-8 h-8 text-white stroke-[2.5]" />
              </motion.div>
            </motion.div>
          </div>

          {/* HEADLINE */}
          <div className="space-y-1.5">
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              REGISTRATION <span className="text-blue-400">CLOSED</span>
            </h1>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600 rounded-full mx-auto" />
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
            Online registrations for <strong className="text-white">YODHA 2.0 – Warriors of AI</strong> are officially closed.
          </p>

          <div className="p-3 w-full rounded-2xl bg-blue-950/60 border border-blue-500/30 text-blue-200 text-xs font-mono font-medium flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
            <span>Idea &amp; PPT evaluation is in progress.</span>
          </div>

          <p className="text-[11px] text-slate-400">
            Shortlisted teams will be notified via their registered email.
          </p>

          {/* RETURN HOME BUTTON */}
          <div className="pt-2 w-full">
            <button
              onClick={onBack}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-600 hover:brightness-110 text-white font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <span>RETURN TO HOME</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default RegistrationPage;
