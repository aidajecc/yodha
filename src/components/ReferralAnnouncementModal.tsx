"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, AlertCircle, ArrowRight, Clock, Sparkles } from "lucide-react";

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

  useEffect(() => {
    setMounted(true);
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

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="announcement-modal-title"
          className="fixed inset-0 z-[99999999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-[0_25px_60px_rgba(0,0,0,0.35)] border border-slate-200 overflow-hidden flex flex-col justify-between z-[100000000] select-text"
          >
            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Announcement"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-sm z-20 hover:scale-105 active:scale-95"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* MODAL HEADER */}
            <div className="text-center space-y-2.5 pb-4 border-b border-slate-100 shrink-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Special Announcement</span>
              </div>

              <h2
                id="announcement-modal-title"
                className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight uppercase"
              >
                Referral Rewards &amp; <span className="text-blue-600 font-extrabold">Early Bird</span>
              </h2>

              <div className="h-1 w-20 bg-gradient-to-r from-blue-600 via-sky-400 to-amber-500 rounded-full mx-auto" />
            </div>

            {/* CONTENT AREA */}
            <div className="my-5 space-y-4 text-slate-800 font-sans text-sm leading-relaxed">
              
              {/* REFERRAL DETAILS */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-950 font-bold font-heading text-base uppercase">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>Referral Rewards Program</span>
                </div>
                <ul className="space-y-2 text-slate-700 pl-1 text-[13px] sm:text-sm">
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
              <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start gap-3 shadow-sm">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-mono font-black uppercase text-amber-800 tracking-wide block">
                    Important Qualification Requirement
                  </span>
                  <p className="text-xs sm:text-[13px] font-semibold text-amber-900 leading-snug">
                    Teams must have at least <strong>2 valid referred teams</strong> to be qualified for referral rewards.
                  </p>
                </div>
              </div>

              {/* EARLY BIRD OFFER (ENDING SOON) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50/70 border-2 border-amber-300 shadow-sm space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-600 text-base font-bold">⚡</span>
                    <span className="font-heading font-black text-slate-950 text-sm sm:text-base uppercase tracking-wide">
                      Early Bird Registration
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-200/80 border border-amber-300 text-amber-900 font-mono text-[11px] font-bold uppercase">
                    <Clock className="w-3 h-3 text-amber-800" />
                    <span>Ends September 21</span>
                  </span>
                </div>

                <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                  Register for <strong className="text-slate-950 text-sm">₹700 per team</strong> instead of <span className="line-through text-slate-500">₹1,000</span> (Save ₹300). Early bird offer ends on <strong>September 21</strong>, after which the fee returns to ₹1,000 per team.
                </p>
              </div>

            </div>

            {/* MODAL ACTIONS FOOTER */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                GOT IT
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRegister();
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-105 active:scale-95"
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
