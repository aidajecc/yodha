"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Sparkles, AlertCircle, ArrowRight, Clock, Flame } from "lucide-react";

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
          className="fixed inset-0 z-[99999999] flex items-center justify-center p-3 sm:p-6 bg-[#03060d]/90 backdrop-blur-2xl overflow-y-auto"
        >
          {/* AMBIENT BACKGROUND GLOWS */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[750px] h-[350px] bg-blue-600/15 rounded-full blur-[140px]" />
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[260px] bg-amber-500/15 rounded-full blur-[130px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-[#060c1d]/95 border-2 border-blue-500/30 rounded-3xl p-5 sm:p-8 text-white shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_45px_rgba(59,130,246,0.25)] overflow-hidden max-h-[92vh] flex flex-col justify-between z-[100000000] select-text"
          >
            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Announcement"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-slate-900/90 border border-slate-700/80 hover:border-slate-500 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer shadow-lg z-20 hover:scale-105 active:scale-95"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* MODAL HEADER */}
            <div className="pr-8 space-y-2 border-b border-slate-800/80 pb-5 shrink-0 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-amber-500/20 border border-blue-400/40 text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-blue-300 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>SPECIAL ANNOUNCEMENT • YODHA 2.0</span>
              </div>

              <h2
                id="announcement-modal-title"
                className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight uppercase leading-tight"
              >
                REFERRAL REWARDS &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">EARLY BIRD</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                Win exclusive gifts through our referral system and take advantage of our limited-time early registration offer.
              </p>
            </div>

            {/* SCROLLABLE BODY CONTENT */}
            <div className="my-5 overflow-y-auto pr-1 space-y-5 flex-1 custom-scrollbar relative z-10">
              
              {/* SECTION 1: REFERRAL REWARDS */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#091227]/85 border border-blue-500/30 space-y-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-400">
                    <Trophy className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm sm:text-base font-bold text-white uppercase tracking-wide">
                      Warriors Referral Program
                    </h3>
                    <p className="text-[11px] font-mono text-blue-300">
                      Share your code &amp; unlock mega referral gifts
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-sans text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="font-mono text-[10px] text-blue-400 font-bold block mb-1">01 • GET CODE</span>
                    <span>Register your team to instantly receive your unique referral code.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="font-mono text-[10px] text-blue-400 font-bold block mb-1">02 • INVITE</span>
                    <span>Share with peers and have them enter your code upon signup.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="font-mono text-[10px] text-blue-400 font-bold block mb-1">03 • WIN GIFTS</span>
                    <span>The shortlisted team with the highest referral count receives the gift.</span>
                  </div>
                </div>

                {/* MANDATORY QUALIFICATION REQUIREMENT HIGHLIGHT BOX */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-amber-950/40 border-2 border-amber-400/90 shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-black uppercase text-amber-300 tracking-wider block">
                      ELIGIBILITY REQUIREMENT
                    </span>
                    <p className="text-xs sm:text-[13px] text-amber-100 font-sans leading-relaxed">
                      <strong>Teams must have at least 2 valid referred teams</strong> to be qualified for referral rewards. Teams with fewer than 2 referrals will not be eligible.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 2: EARLY BIRD OFFER (ENDING SOON) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-yellow-950/20 to-slate-950/80 border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)] animate-golden-border-blink space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
                    <h3 className="font-heading text-sm sm:text-base font-black text-amber-200 uppercase tracking-wide">
                      Early Bird Offer — Ending Soon!
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/80 text-amber-300 font-mono text-[11px] font-black tracking-wider uppercase">
                    <Clock className="w-3.5 h-3.5" />
                    <span>ENDS SEPTEMBER 21</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/85 border border-amber-500/30">
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-bold text-slate-300">
                      Team Registration Fee:
                    </div>
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400">₹700</span>
                      <span className="text-sm font-mono text-slate-500 line-through">₹1,000</span>
                      <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                        SAVE ₹300
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-sans sm:max-w-xs leading-relaxed">
                    Register before <strong>September 21</strong> to lock in the ₹700 early-bird rate. Fee returns to <strong>₹1,000 per team</strong> on September 22.
                  </p>
                </div>
              </div>

            </div>

            {/* MODAL ACTIONS FOOTER */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 relative z-10">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                GOT IT — EXPLORE SITE
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRegister();
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-mono text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95"
              >
                <span>REGISTER NOW (₹700)</span>
                <ArrowRight className="w-4 h-4 text-slate-950 stroke-[3]" />
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
