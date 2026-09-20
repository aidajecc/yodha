"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Share2, Copy, Check, Calendar, Trophy, ExternalLink, RefreshCw } from "lucide-react";
import { validateReferralCode, getReferralsForRoom, ReferralEntryData } from "../lib/firebase";

interface ReferralDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
}

export function ReferralDashboardModal({ isOpen, onClose, referralCode }: ReferralDashboardModalProps) {
  const [loading, setLoading] = useState(true);
  const [roomInfo, setRoomInfo] = useState<{ teamName?: string; leaderName?: string; totalReferrals?: number } | null>(null);
  const [referrals, setReferrals] = useState<ReferralEntryData[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const cleanCode = (referralCode || "").trim().toUpperCase();
  const referralLink = `https://yodha.aidajecc.in/register?ref=${encodeURIComponent(cleanCode)}`;

  const fetchData = async () => {
    if (!cleanCode) return;
    setLoading(true);
    try {
      const roomRes = await validateReferralCode(cleanCode);
      if (roomRes.valid && roomRes.roomData) {
        setRoomInfo({
          teamName: roomRes.roomData.teamName,
          leaderName: roomRes.roomData.leaderName,
          totalReferrals: roomRes.roomData.totalReferrals || 0,
        });
      }
      const list = await getReferralsForRoom(cleanCode);
      setReferrals(list);
    } catch (err) {
      console.warn("Error loading referral dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && cleanCode) {
      fetchData();
    }
  }, [isOpen, cleanCode]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(cleanCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const formatTimestamp = (ts: any) => {
    if (!ts) return "Recently";
    try {
      let dateObj: Date;
      if (typeof ts === "string") {
        dateObj = new Date(ts);
      } else if (ts.seconds) {
        dateObj = new Date(ts.seconds * 1000);
      } else if (ts.toDate) {
        dateObj = ts.toDate();
      } else {
        dateObj = new Date(ts);
      }

      if (isNaN(dateObj.getTime())) return "Recently";

      return dateObj.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Recently";
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl bg-gradient-to-b from-[#070d28] via-[#04081c] to-[#020512] border border-blue-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-[0_0_60px_rgba(59,130,246,0.3)] overflow-hidden max-h-[90vh] flex flex-col justify-between"
        >
          {/* TOP ACCENT AMBIENT GLOW */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* HEADER */}
          <div className="flex items-center justify-between pb-5 border-b border-blue-500/20 relative z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-400/40 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-extrabold text-blue-400 uppercase tracking-widest block">
                  REAL-TIME LEADERBOARD & REFERRALS
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white flex items-center gap-2">
                  <span>REFERRAL DASHBOARD</span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchData}
                title="Refresh List"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700 hover:border-blue-400 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-400" : ""}`} />
              </button>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700 hover:border-rose-400 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* SCROLLABLE BODY CONTENT */}
          <div className="my-5 overflow-y-auto pr-1 space-y-6 flex-1 relative z-10">
            
            {/* REFERRAL CODE & ROOM SUMMARY BOX */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/80 via-indigo-950/60 to-slate-950/80 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  REFERRAL CODE & REFERRER DETAILS
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300 tracking-wider">
                    {cleanCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 rounded-lg text-amber-300 text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                {roomInfo && (
                  <p className="text-xs text-slate-300 font-sans mt-1">
                    Registered by Team: <strong className="text-white">{roomInfo.teamName}</strong> (Captain: {roomInfo.leaderName})
                  </p>
                )}
              </div>

              {/* TOTAL REFERRALS BADGE */}
              <div className="p-3.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-center shrink-0 w-full sm:w-auto">
                <span className="text-[9px] font-mono text-blue-300 uppercase tracking-widest block font-bold">
                  TEAMS REGISTERED
                </span>
                <span className="text-3xl font-black font-mono text-white block mt-0.5">
                  {referrals.length}
                </span>
              </div>
            </div>

            {/* QUICK LINK SHARE BAR */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 truncate">
                <Share2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-slate-400 truncate font-sans text-[11px]">{referralLink}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? "Link Copied!" : "Copy Share Link"}</span>
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`🚀 Join YODHA 2.0 – Warriors of AI Hackathon!\n\nUse my Warrior Referral Code: ${cleanCode}\n\nRegister your team here:\n${referralLink}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* MINIMUM QUALIFICATION NOTICE */}
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-400/40 text-xs font-sans text-amber-200 flex items-center gap-2.5 shadow-sm">
              <span className="text-base">⭐</span>
              <span>
                <strong>Qualification Rule:</strong> Teams must refer <strong>at least 2 valid teams</strong> to be qualified for referral rewards.
              </span>
            </div>

            {/* REFERRED TEAMS LIST TABLE / CARDS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>REFERRED TEAMS ({referrals.length})</span>
                </span>
              </div>

              {loading ? (
                <div className="py-12 text-center text-slate-400 font-mono text-xs animate-pulse">
                  Fetching referred teams from Firestore...
                </div>
              ) : referrals.length === 0 ? (
                <div className="py-10 px-4 text-center rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <Users className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-300">No teams registered under code {cleanCode} yet</p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Share your referral link on WhatsApp or email! Once another team registers using your code, they will automatically appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {referrals.map((item, idx) => (
                    <div
                      key={item.teamId || idx}
                      className="p-4 rounded-xl bg-slate-900/80 border border-blue-500/20 flex items-center justify-between gap-4 text-xs font-mono hover:border-blue-400/50 transition-colors"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="font-extrabold text-white text-sm truncate">{item.teamName}</span>
                        <span className="text-slate-400 text-xs truncate">Team Captain: <strong className="text-slate-200">{item.leaderName}</strong></span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span>{formatTimestamp(item.registeredAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>


          </div>

          {/* FOOTER ACTION */}
          <div className="pt-4 border-t border-blue-500/20 text-center relative z-10 shrink-0">
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              CLOSE DASHBOARD
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ReferralDashboardModal;
