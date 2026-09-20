"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Share2, Copy, Check, Calendar, ExternalLink, RefreshCw } from "lucide-react";
import { validateReferralCode, getReferralsForRoom, ReferralEntryData } from "../lib/firebase";
import { CompactFooter } from "./CompactFooter";


interface ReferralRoomPageProps {
  onBack: () => void;
  referralCode: string;
}

export function ReferralRoomPage({ onBack, referralCode }: ReferralRoomPageProps) {
  const [loading, setLoading] = useState(true);
  const [roomInfo, setRoomInfo] = useState<{ teamName?: string; leaderName?: string; totalReferrals?: number } | null>(null);
  const [referrals, setReferrals] = useState<ReferralEntryData[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cleanCode = (referralCode || "").trim().toUpperCase();
  const shareRegistrationLink = `https://yodha.aidajecc.in/register?ref=${encodeURIComponent(cleanCode)}`;

  const fetchData = async () => {
    if (!cleanCode) {
      setErrorMsg("No referral code specified in the link.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setErrorMsg(null);

    try {
      const roomRes = await validateReferralCode(cleanCode);
      if (roomRes.valid && roomRes.roomData) {
        setRoomInfo({
          teamName: roomRes.roomData.teamName,
          leaderName: roomRes.roomData.leaderName,
          totalReferrals: roomRes.roomData.totalReferrals || 0,
        });
        const list = await getReferralsForRoom(cleanCode);
        setReferrals(list);
      } else {
        setErrorMsg(roomRes.error || `Invalid Referral Code "${cleanCode}". No active room found for this code.`);
      }
    } catch (err) {
      console.warn("Error fetching referral room data:", err);
      setErrorMsg("Unable to load referral room data. Please verify your code.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    fetchData();
  }, [cleanCode]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareRegistrationLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
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

  return (
    <div className="w-full min-h-screen bg-[#03060d] text-white font-sans relative overflow-x-hidden flex flex-col justify-between select-none">
      {/* AMBIENT BACKGROUND HILLS & RADIAL GLOW */}
      <div className="fixed inset-0 w-screen h-screen pointer-events-none z-0 overflow-hidden">
        <img
          src="/bg-hills-night-pc.webp"
          alt="Night Hills Background"
          className="w-full h-full object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-slate-950/65 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-blue-600/15 rounded-full blur-[220px] pointer-events-none" />
      </div>

      {/* TOP FLOATING NAVIGATION BAR */}
      <header className="relative z-30 max-w-6xl mx-auto w-full px-4 sm:px-8 pt-6 sm:pt-8 pb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          aria-label="Return to Main Portal"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-slate-950/90 border border-blue-500/50 text-blue-300 hover:text-white hover:border-blue-400 backdrop-blur-2xl transition-all cursor-pointer shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95 text-xs font-mono font-bold gap-2"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          <span>RETURN TO PORTAL</span>
        </button>

        <button
          onClick={fetchData}
          title="Refresh Referral List"
          className="p-2.5 rounded-full bg-slate-950/90 border border-blue-500/40 text-slate-300 hover:text-white hover:border-blue-400 backdrop-blur-2xl transition-all cursor-pointer shadow-md"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-400" : ""}`} />
        </button>
      </header>

      {/* MAIN DEDICATED REFERRAL ROOM CONTENT (FRAMELESS, NATURAL SITE THEME) */}
      <main className="relative z-10 w-full flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-10"
        >
          {/* TOP SECTION: TITLE & ROOM DETAILS */}
          <div className="text-center sm:text-left space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-white tracking-tight uppercase">
              REFERRAL ROOM <span className="text-blue-400 font-mono drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]">{cleanCode || "DASHBOARD"}</span>
            </h1>

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-300 font-mono text-xs flex items-center gap-3 shadow-lg">
                <span className="font-bold">⚠️ NOTICE:</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {roomInfo && (
              <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
                Room Captain: <strong className="text-white font-bold">{roomInfo.leaderName}</strong> &nbsp;|&nbsp; Team: <strong className="text-blue-300 font-bold">{roomInfo.teamName}</strong> &nbsp;|&nbsp; Referred Teams: <strong className="text-emerald-400 font-mono font-black">{referrals.length}</strong>
              </p>
            )}

            {/* ACTION BAR: COPY LINK & SHARE VIA WHATSAPP */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 bg-slate-950/90 border border-blue-500/30 rounded-2xl px-4 py-3 font-mono text-xs text-slate-300 flex items-center gap-3 truncate shadow-lg">
                <Share2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="truncate font-sans font-medium text-white">{shareRegistrationLink}</span>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                  <span>{copiedLink ? "Link Copied!" : "Copy Link"}</span>
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `🚀 Join YODHA 2.0 – Warriors of AI Hackathon!\n\nUse my Warrior Referral Code: ${cleanCode}\n\nRegister your team here:\n${shareRegistrationLink}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                >
                  <ExternalLink className="w-4 h-4 text-white" />
                  <span>Share via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* REFERRED TEAMS LIST TABLE (NO CARD BOX WRAPPER, SLEEK MINIMALIST SITE STYLE) */}
          <div className="w-full space-y-4 pt-2">
            <div className="flex items-center justify-between pb-3 border-b border-blue-500/30">
              <h3 className="text-base sm:text-xl font-black font-heading text-white uppercase tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>REFERRED TEAMS ({referrals.length})</span>
              </h3>
            </div>

            {loading ? (
              <div className="py-20 text-center text-blue-400 font-mono text-xs animate-pulse tracking-wider">
                FETCHING REFERRED TEAMS...
              </div>
            ) : referrals.length === 0 ? (
              <div className="py-16 px-4 text-center rounded-2xl bg-slate-950/40 border border-slate-800 space-y-4">
                <Users className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-lg font-bold text-white">No teams registered under code {cleanCode} yet</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Share your referral link on WhatsApp or email! Once another team registers using your code, their team name, captain, and registered time will automatically appear here.
                </p>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `🚀 Join YODHA 2.0 – Warriors of AI Hackathon!\n\nUse my Warrior Referral Code: ${cleanCode}\n\nRegister your team here:\n${shareRegistrationLink}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase transition-all shadow-md mt-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Share Link on WhatsApp</span>
                </a>
              </div>
            ) : (
              <div className="w-full">
                {/* TABLE VIEW FOR PC & MOBILE */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left border-collapse font-mono">
                    <thead>
                      <tr className="border-b border-blue-500/30 text-[11px] text-blue-300 font-bold uppercase tracking-widest">
                        <th className="py-3.5 px-4">REGISTERED TEAM NAME</th>
                        <th className="py-3.5 px-4">TEAM CAPTAIN</th>
                        <th className="py-3.5 px-4 text-right">REGISTERED TIME</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-950/40 text-xs">
                      {referrals.map((item, idx) => (
                        <tr
                          key={item.teamId || idx}
                          className="hover:bg-blue-950/30 transition-colors group"
                        >
                          <td className="py-4 px-4 font-black text-white text-base group-hover:text-blue-300 transition-colors">
                            {item.teamName}
                          </td>
                          <td className="py-4 px-4 text-slate-300 font-medium text-sm">
                            {item.leaderName}
                          </td>
                          <td className="py-4 px-4 text-right text-slate-400 text-xs">
                            <span className="inline-flex items-center gap-1.5 font-mono text-slate-300">
                              <Calendar className="w-3.5 h-3.5 text-blue-400" />
                              <span>{formatTimestamp(item.registeredAt)}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* MOBILE LIST VIEW (CLEAN & MINIMALIST) */}
                <div className="sm:hidden space-y-3">
                  {referrals.map((item, idx) => (
                    <div
                      key={item.teamId || idx}
                      className="p-4 rounded-2xl bg-slate-950/70 border border-blue-500/20 space-y-2 text-xs font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-white text-base">{item.teamName}</span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-blue-400" />
                          <span>{formatTimestamp(item.registeredAt)}</span>
                        </span>
                      </div>
                      <div className="text-slate-300 text-xs font-sans">
                        Captain: <strong className="text-white">{item.leaderName}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* REFERRAL GIFT RULES SECTION */}
          <div className="w-full bg-slate-50/5 border border-slate-700/50 rounded-3xl p-6 sm:p-10 shadow-2xl text-slate-300 text-sm sm:text-base font-sans leading-relaxed space-y-5 mt-8 backdrop-blur-sm">
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase border-b-2 border-slate-700/50 pb-3 mb-6 flex items-center gap-2">
              <span className="text-amber-400">🎁</span> Referral Gift Rules
            </h3>
            <ol className="list-decimal pl-5 space-y-4 font-medium">
              <li>Each team receives a unique referral code.</li>
              <li>Other participants can register for the hackathon using a team's referral code.</li>
              <li><strong className="text-amber-400">Qualification Requirement:</strong> Teams must have at least 2 valid referred teams to be qualified for referral rewards.</li>
              <li>The team with the highest number of valid referrals is eligible to receive the referral gift.</li>
              <li>Only shortlisted teams are eligible for the gift.</li>
              <li>If a non-shortlisted team has the highest referral count, they will not be eligible for the gift. The gift will instead go to the highest-referring shortlisted team.</li>
              <li>Fake, duplicate, spam, or otherwise invalid registrations will not be counted toward a team's referral total.</li>
              <li>The organizers reserve the right to verify referral registrations before declaring the winner.</li>
            </ol>

            <div className="mt-8 bg-slate-900/50 border border-slate-700 p-6 rounded-2xl shadow-inner">
              <h4 className="font-bold text-white uppercase mb-4 text-lg flex items-center gap-2">
                <span className="text-blue-400">ℹ️</span> Example
              </h4>
              <ul className="space-y-3 font-mono text-sm bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300">
                <li><span className="font-bold text-white">Team A</span> — 50 valid referrals — shortlisted ✅ (Eligible &amp; Winner)</li>
                <li><span className="font-bold text-white">Team B</span> — 70 valid referrals — not shortlisted ❌ (Not eligible)</li>
                <li><span className="font-bold text-white">Team C</span> — 1 valid referral — shortlisted ❌ (Below minimum 2 referrals)</li>
              </ul>
              <p className="mt-4 font-black text-emerald-400 bg-emerald-950/30 px-4 py-3 rounded-lg border border-emerald-500/30 inline-block">
                Winner: Team A, because Team B is not shortlisted and Team A meets the 2+ referrals requirement.
              </p>
            </div>

            <p className="mt-8 pt-6 border-t border-slate-700/50 text-center font-bold text-slate-200 text-lg">
              Each team gets a unique referral code. Participants can share their code to bring new registrations to the hackathon. Teams must have at least 2 valid referred teams to qualify, and the shortlisted team with the highest number of valid referrals will receive a special gift.
            </p>
          </div>
        </motion.div>
      </main>

      {/* MINIMAL STANDARDIZED FOOTER */}
      <CompactFooter />
    </div>
  );
}


export default ReferralRoomPage;
