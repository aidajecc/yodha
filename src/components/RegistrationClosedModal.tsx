"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock } from "lucide-react";

interface RegistrationClosedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewTimeline?: () => void;
}

export function RegistrationClosedModal({
  isOpen,
  onClose,
}: RegistrationClosedModalProps) {
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

  // Don't show on payment route
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
          aria-labelledby="registration-closed-title"
          className="fixed inset-0 z-[99999999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md overflow-hidden select-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-white rounded-3xl p-5 sm:p-7 text-slate-900 shadow-[0_25px_60px_rgba(0,0,0,0.4)] border border-slate-200 flex flex-col justify-between z-[100000000] my-auto overflow-hidden"
          >
            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Notice"
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-sm z-20 hover:scale-105 active:scale-95 select-none"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* ANIMATED ICON */}
            <div className="flex flex-col items-center text-center">
              <div className="relative flex items-center justify-center mb-3 mt-1">
                <motion.div
                  animate={{ scale: [1, 1.35, 1], opacity: [0.45, 0, 0.45] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                  className="absolute w-20 h-20 rounded-full bg-blue-500/20"
                />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 flex items-center justify-center text-white shadow-[0_8px_25px_rgba(37,99,235,0.35)] relative z-10"
                >
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                  >
                    <Lock className="w-8 h-8 text-white stroke-[2.5]" />
                  </motion.div>
                </motion.div>
              </div>

              {/* MODAL HEADER */}
              <div className="space-y-1.5 pb-2">
                <h2
                  id="registration-closed-title"
                  className="font-heading text-xl sm:text-2xl font-black text-slate-950 tracking-tight uppercase"
                >
                  REGISTRATION <span className="text-blue-600 font-extrabold">CLOSED</span>
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600 rounded-full mx-auto" />
              </div>
            </div>

            {/* MINIMAL CONTENT */}
            <div className="my-4 text-center space-y-3.5">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans max-w-xs mx-auto">
                Online registrations for <strong className="text-slate-950 font-bold">YODHA 2.0</strong> are officially closed. Thank you for the overwhelming response!
              </p>

              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-950 text-xs font-mono font-medium flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />
                <span>Idea &amp; PPT evaluation is in progress.</span>
              </div>

              <p className="text-[11px] text-slate-500 font-sans">
                Shortlisted teams will be notified via their registered email.
              </p>
            </div>

            {/* ACTION BUTTON */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-6 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer select-none"
              >
                GOT IT
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default RegistrationClosedModal;
