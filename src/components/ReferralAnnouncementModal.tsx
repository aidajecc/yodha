"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, AlertCircle, ArrowRight, Clock } from "lucide-react";

interface ReferralAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
}

export function ReferralAnnouncementModal({
  isOpen,
  onClose,
  onRegister,
}: ReferralAnnouncementModalProps) {
  const [mounted, setMounted] = useState(false);

  // Live countdown timer targeting Early Bird deadline: 21 September 2026 23:59:59 IST
  const [earlyBirdTime, setEarlyBirdTime] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isEnded: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEnded: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Live Countdown to September 21, 2026 23:59:59 IST
  useEffect(() => {
    const targetDate = new Date("2026-09-21T23:59:59+05:30").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setEarlyBirdTime({ days, hours, minutes, seconds, isEnded: false });
      } else {
        setEarlyBirdTime({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  if (typeof window !== "undefined") {
    const path = window.location.pathname.toLowerCase();
    const search = window.location.search.toLowerCase();
    if (path.includes("pay") || search.includes("teamid") || search.includes("payid")) {
      return null;
    }
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="announcement-modal-title"
          className="fixed inset-0 z-[99999999] flex items-center justify-center p-2.5 sm:p-5 bg-slate-950/75 backdrop-blur-md overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg max-h-[95vh] max-h-[95dvh] bg-white rounded-3xl p-4 sm:p-6 text-slate-900 shadow-[0_25px_60px_rgba(0,0,0,0.4)] border border-slate-200 flex flex-col justify-between z-[100000000] select-text my-auto overflow-hidden"
          >
            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Announcement"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-sm z-20 hover:scale-105 active:scale-95 select-none"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>

            {/* MODAL HEADER (SPECIAL ANNOUNCEMENT PILL REMOVED PER USER SPECIFICATION) */}
            <div className="shrink-0 text-center space-y-1.5 pb-2.5 sm:pb-3 border-b border-slate-100 px-6 sm:px-8">
              <h2
                id="announcement-modal-title"
                className="font-heading text-xl sm:text-2xl lg:text-3xl font-black text-slate-950 tracking-tight uppercase"
              >
                Referral Rewards &amp; <span className="text-blue-600 font-extrabold">Early Bird</span>
              </h2>

              <div className="h-1 w-16 bg-gradient-to-r from-blue-600 via-sky-400 to-amber-500 rounded-full mx-auto" />
            </div>

            {/* SCROLLABLE BODY CONTENT (NEATLY FITS WITHIN 95VH IN MOBILE VIEW) */}
            <div className="flex-1 overflow-y-auto min-h-0 my-3 py-1 space-y-3.5 text-slate-800 font-sans text-xs sm:text-sm leading-relaxed pr-1 custom-scrollbar">
              
              {/* REFERRAL DETAILS */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-slate-950 font-bold font-heading text-sm sm:text-base uppercase">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
                  <span>Referral Rewards Program</span>
                </div>
                <ul className="space-y-1.5 text-slate-700 pl-1 text-xs sm:text-[13px]">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Every team receives a unique <strong>Warrior Referral Code</strong> upon registering.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Invite other teams to enter your code during registration to earn referral points.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>The shortlisted team with the highest number of valid referrals wins an exclusive <strong>Referral Gift</strong>.</span>
                  </li>
                </ul>
              </div>

              {/* MANDATORY QUALIFICATION REQUIREMENT HIGHLIGHT */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start gap-2.5 shadow-xs">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[11px] font-mono font-black uppercase text-amber-800 tracking-wide block">
                    Important Qualification Requirement
                  </span>
                  <p className="text-xs sm:text-[13px] font-semibold text-amber-900 leading-snug">
                    Teams must have at least <strong>2 valid referred teams</strong> to be qualified for referral rewards.
                  </p>
                </div>
              </div>

              {/* EARLY BIRD OFFER WITH LIVE COUNTDOWN TIMER */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50/70 border-2 border-amber-300 shadow-xs space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-600 text-sm sm:text-base font-bold">⚡</span>
                    <span className="font-heading font-black text-slate-950 text-xs sm:text-sm uppercase tracking-wide">
                      Early Bird Registration
                    </span>
                  </div>

                  {/* LIVE COUNTDOWN TIMER BADGE */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 font-mono text-[11px] sm:text-xs font-bold shadow-xs">
                    <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0 animate-pulse" />
                    {earlyBirdTime.isEnded ? (
                      <span className="text-[10px] sm:text-[11px] font-black uppercase text-amber-900">Offer Ended</span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] uppercase tracking-wider text-amber-800 font-extrabold mr-0.5">Ends In</span>
                        <span className="font-black text-amber-950">{earlyBirdTime.days}d</span>
                        <span className="opacity-40 font-bold">:</span>
                        <span className="font-black text-amber-950">{String(earlyBirdTime.hours).padStart(2, "0")}h</span>
                        <span className="opacity-40 font-bold">:</span>
                        <span className="font-black text-amber-950">{String(earlyBirdTime.minutes).padStart(2, "0")}m</span>
                        <span className="opacity-40 font-bold">:</span>
                        <span className="font-black text-amber-700">{String(earlyBirdTime.seconds).padStart(2, "0")}s</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed">
                  Register for <strong className="text-slate-950 font-bold">₹700 per team</strong> instead of <span className="line-through text-slate-500">₹1,000</span> (Save ₹300). Early bird offer ends on <strong>September 21</strong>, after which the fee returns to ₹1,000 per team.
                </p>
              </div>

            </div>

            {/* MODAL ACTIONS FOOTER */}
            <div className="shrink-0 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer select-none"
              >
                GOT IT
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRegister();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-105 active:scale-95 select-none"
              >
                <span>REGISTER NOW (₹700)</span>
                <ArrowRight className="w-4 h-4 text-white stroke-[3]" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default ReferralAnnouncementModal;
