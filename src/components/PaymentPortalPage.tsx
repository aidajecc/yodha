"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Search,
  ShieldCheck,
  Building,
  User,
  Mail,
  Phone,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  Lock,
  Shield
} from "lucide-react";
import { getSelectedTeamByUniqueId, updateSelectedTeamPayment, SelectedTeamData } from "../lib/firebase";
import { YodhaTitleBanner } from "./YodhaTitleBanner";
import { CompactFooter } from "./CompactFooter";

interface PaymentPortalPageProps {
  onBack: () => void;
  initialTeamId?: string;
}

export function PaymentPortalPage({ onBack, initialTeamId = "" }: PaymentPortalPageProps) {
  const [searchTeamId, setSearchTeamId] = useState<string>(initialTeamId);
  const [activeTeamId, setActiveTeamId] = useState<string>(initialTeamId);
  const [teamData, setTeamData] = useState<SelectedTeamData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isTxnCopied, setIsTxnCopied] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState<boolean>(false);

  // Dynamically load the Razorpay checkout script
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as any).Razorpay) { setRazorpayLoaded(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      console.warn("Failed to load Razorpay checkout script.");
      setPaymentError("Payment gateway could not be loaded. Please disable ad-blockers or try refreshing the page.");
    };
    document.body.appendChild(script);
  }, []);

  // Sync initial search parameter
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (initialTeamId && initialTeamId.trim()) {
      const clean = initialTeamId.trim();
      setSearchTeamId(clean);
      fetchTeam(clean);
    }
  }, [initialTeamId]);

  const fetchTeam = async (idToFetch: string) => {
    const cleanId = idToFetch.trim();
    if (!cleanId) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await getSelectedTeamByUniqueId(cleanId);
      if (res) {
        setTeamData(res);
        setActiveTeamId(res.uniqueTeamId || cleanId);
      } else {
        setTeamData(null);
        setErrorMsg(`Invalid Team ID ("${cleanId}"). No shortlisted team record was found matching this ID. Please verify your Unique Team ID or contact support.`);
      }
    } catch (err) {
      console.warn("Payment team fetch error:", err);
      setTeamData(null);
      setErrorMsg("Unable to retrieve team payment record. Please verify your Unique Team ID.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTeamId.trim()) {
      fetchTeam(searchTeamId.trim());
    }
  };

  const handleCopyLink = () => {
    const payUrl = `https://yodha.aidajecc.in/pay?teamId=${encodeURIComponent(activeTeamId || searchTeamId)}`;
    navigator.clipboard.writeText(payUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleRazorpayPayment = useCallback(async () => {
    if (!teamData || !razorpayLoaded) return;

    setPaymentError(null);
    setIsProcessingPayment(true);

    try {
      // Step 1: Create order on server
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: teamData.amountToPay,
          teamId: teamData.uniqueTeamId,
          teamName: teamData.teamName,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to create payment order.");
      }

      const { orderId, amount, currency, keyId } = orderData;

      // Step 2: Open Razorpay checkout
      const options = {
        key: keyId,
        amount,
        currency,
        name: "YODHA 2.0",
        description: `Registration Fee – ${teamData.teamName}`,
        image: "/logo.webp",
        order_id: orderId,
        prefill: {
          name: teamData.leaderName,
          email: teamData.leaderEmail,
          contact: teamData.leaderPhone,
        },
        notes: {
          teamId: teamData.uniqueTeamId,
          teamName: teamData.teamName,
        },
        theme: { color: "#2563eb" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // Step 3: Verify payment signature on server
          try {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                teamDocId: teamData.id || teamData.uniqueTeamId,
                teamId: teamData.uniqueTeamId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              // If server-side Firebase Admin SDK didn't have credentials configured,
              // write to Firestore using client SDK fallback so payment status is guaranteed saved
              if (!verifyData.dbUpdated) {
                try {
                  await updateSelectedTeamPayment(
                    teamData.id || teamData.uniqueTeamId,
                    "Completed",
                    response.razorpay_payment_id
                  );
                } catch (clientWriteErr) {
                  console.warn("Client fallback payment update:", clientWriteErr);
                }
              }

              // Update local UI state
              setTeamData({
                ...teamData,
                paymentStatus: "Completed",
                paymentTxnId: response.razorpay_payment_id,
              });
              setPaymentSuccess(true);
              setShowSuccessModal(true);
            } else {
              throw new Error(verifyData.error || "Payment verification failed.");
            }
          } catch (verifyErr: any) {
            setPaymentError(
              verifyErr?.message || "Payment was received but verification failed. Contact support with your payment ID: " + response.razorpay_payment_id
            );
          } finally {
            setIsProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        setPaymentError(`Payment failed: ${resp?.error?.description || "Unknown error. Please try again."}`);
        setIsProcessingPayment(false);
      });
      rzp.open();
    } catch (err: any) {
      setPaymentError(err?.message || "Something went wrong. Please try again.");
      setIsProcessingPayment(false);
    }
  }, [teamData, razorpayLoaded]);

  return (
    <div className="w-full min-h-screen bg-[#03060d] text-white font-sans relative overflow-x-hidden flex flex-col justify-between select-none">
      {/* AMBIENT BACKGROUND HILLS & RADIAL GLOW (OPEN SITE THEME) */}
      <div className="fixed inset-0 w-screen h-screen pointer-events-none z-0 overflow-hidden">
        <img
          src="/bg-hills-night-pc.webp"
          alt="Night Hills Background"
          className="w-full h-full object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-slate-950/65 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-blue-600/15 rounded-full blur-[220px] pointer-events-none" />
      </div>

      {/* TOP NAVIGATION BAR */}
      <header className="relative z-30 max-w-6xl mx-auto w-full px-4 sm:px-8 pt-6 sm:pt-8 pb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          aria-label="Return to Main Portal"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-slate-950/90 border border-blue-500/50 text-blue-300 hover:text-white hover:border-blue-400 backdrop-blur-2xl transition-all cursor-pointer shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95 text-xs font-mono font-bold gap-2"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          <span>RETURN TO PORTAL</span>
        </button>

        <span className="px-4 py-1.5 rounded-full bg-blue-950/90 border border-blue-500/40 text-[10px] sm:text-xs font-mono text-blue-300 font-bold uppercase tracking-widest inline-flex items-center gap-2 shadow-md backdrop-blur-2xl">
          <Lock className="w-3.5 h-3.5 text-blue-400" />
          <span>OFFICIAL PAYMENT PORTAL</span>
        </span>
      </header>

      {/* MAIN OPEN PAYMENT CONTENT (NO CARDS, PURE FLOATING HUD THEME) */}
      <main className="relative z-10 w-full flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-10"
        >
          {/* BRANDED HEADER WITH LOGO & TITLE BANNER */}
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <img
              src="/logo.webp"
              alt="YODHA Logo"
              className="h-24 sm:h-32 md:h-40 w-auto object-contain drop-shadow-[0_0_40px_rgba(59,130,246,0.8)] transition-transform hover:scale-105"
            />

            <div className="my-1">
              <YodhaTitleBanner size="sm" align="center" />
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-white tracking-tight uppercase">
              CONFIRM YOUR <span className="text-blue-400 font-mono drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]">TEAM SLOT</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-sans leading-relaxed">
              Shortlisted teams must complete their registration payment to secure their 48-hour prototype building slot for <strong className="text-white font-bold">YODHA 2.0</strong>.
            </p>
          </div>

          {/* SEARCH / INPUT UNIQUE TEAM ID BAR */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-blue-400" />
                <input
                  type="text"
                  value={searchTeamId}
                  onChange={(e) => setSearchTeamId(e.target.value)}
                  placeholder="Enter Unique Team ID (e.g. Y26-SEL-9482)"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-950/60 border border-blue-500/30 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-blue-400 transition-colors uppercase tracking-wider placeholder:text-slate-500 placeholder:normal-case placeholder:tracking-normal shadow-[0_0_20px_rgba(59,130,246,0.15)] backdrop-blur-xl"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-black tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.7)] active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>VERIFYING...</span>
                  </>
                ) : (
                  <>
                    <span>FETCH DETAILS</span>
                    <ExternalLink className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ERROR NOTIFICATION */}
          {errorMsg && (
            <div className="p-5 rounded-2xl bg-rose-950/60 border border-rose-500/30 text-rose-200 text-xs font-mono flex items-center gap-3 max-w-2xl mx-auto shadow-lg backdrop-blur-xl">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* OPEN HUD DETAILS (NO BACKGROUND CARDS OR BOX CONTAINER) */}
          {teamData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="pt-2 space-y-10"
            >
              {/* GRADIENT HAIRLINE TOP DIVIDER */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

              {/* TEAM HEADER & STATUS BADGE */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-2 text-left">
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span>SHORTLISTED TEAM CONFIRMATION</span>
                  </div>
                  <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-white tracking-tight">
                    {teamData.teamName}
                  </h2>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300 pt-1">
                    <span>Unique Team ID:</span>
                    <span className="font-bold text-cyan-300 font-mono tracking-wider">
                      {teamData.uniqueTeamId}
                    </span>
                    <button
                      onClick={handleCopyLink}
                      title="Copy Payment Portal Link"
                      className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* PAYMENT STATUS BADGE */}
                <div className="shrink-0">
                  {teamData.paymentStatus === "Completed" ? (
                    <span className="px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.25)] backdrop-blur-md">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      PAYMENT COMPLETED
                    </span>
                  ) : (
                    <span className="px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 font-mono text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.25)] backdrop-blur-md animate-pulse">
                      <Clock className="w-4 h-4 text-amber-400" />
                      PENDING PAYMENT
                    </span>
                  )}
                </div>
              </div>

              {/* TWO COLUMN OPEN FLOATING HUD (NO CARD CONTAINER CARDS) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-2">
                {/* LEFT: TEAM LEADER DETAILS */}
                <div className="space-y-5 text-left">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase tracking-widest border-b border-blue-500/30 pb-3">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    <span>TEAM LEADER DETAILS</span>
                  </div>

                  <div className="space-y-4 font-mono text-xs text-slate-300">
                    <div className="flex items-center gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Team Leader / Captain</span>
                        <span className="font-bold text-white text-base">{teamData.leaderName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Email Address</span>
                        <span className="text-slate-200 font-sans">{teamData.leaderEmail}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Contact Phone</span>
                        <span className="text-slate-200">{teamData.leaderPhone}</span>
                      </div>
                    </div>

                    {teamData.college && (
                      <div className="flex items-center gap-3.5 pt-2 border-t border-slate-800/80">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400">
                          <Building className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Institution / College</span>
                          <span className="text-slate-300 font-sans">{teamData.college}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT: REGISTRATION FEE & PAYMENT INFO */}
                <div className="space-y-5 text-left">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase tracking-widest border-b border-blue-500/30 pb-3">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>REGISTRATION FEE & DEADLINE</span>
                  </div>

                  <div className="space-y-4 font-mono">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400 uppercase tracking-wider">Registration Fee:</span>
                      <span className="text-4xl sm:text-5xl font-black text-amber-300 font-heading drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                        ₹{teamData.amountToPay}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
                      <span className="text-xs text-slate-400 uppercase tracking-wider">Payment Window:</span>
                      <span className="text-xs font-bold text-sky-300">{teamData.paymentTime || "Within 48 Hours"}</span>
                    </div>

                    {teamData.paymentTxnId && (
                      <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 text-xs">
                        <span className="text-slate-400 uppercase tracking-wider">Transaction Reference:</span>
                        <span className="text-emerald-400 font-bold">{teamData.paymentTxnId}</span>
                      </div>
                    )}

                    <p className="pt-2 text-[11px] text-slate-400 leading-relaxed font-sans border-t border-slate-800/60">
                      Payment confirms team slot allocation and grants full access to mentored prototype building sessions during YODHA 2.0.
                    </p>
                  </div>
                </div>
              </div>

              {/* BOTTOM GRADIENT LINE DIVIDER */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

              {/* ACTION BAR */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-xs font-mono text-slate-400 text-center sm:text-left">
                  <span>Official Support Email: </span>
                  <a href="mailto:yodha@jecc.ac.in" className="text-blue-400 underline hover:text-blue-300 font-bold">
                    yodha@jecc.ac.in
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  {paymentError && (
                    <div className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-sans flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{paymentError}</span>
                    </div>
                  )}

                  {teamData.paymentStatus === "Completed" ? (
                    <div className="flex items-center gap-3">
                      <span className="px-6 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        SLOT CONFIRMED
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                      <div className="text-right hidden sm:block">
                        <span className="text-[11px] text-slate-400 block font-sans">256-bit SSL encrypted</span>
                        <span className="text-[10px] text-slate-500 block font-sans">UPI • Cards • Net Banking via Razorpay</span>
                      </div>

                      <button
                        onClick={handleRazorpayPayment}
                        disabled={isProcessingPayment || !razorpayLoaded}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2.5"
                      >
                        {isProcessingPayment ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Opening Razorpay...</span>
                          </>
                        ) : !razorpayLoaded ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Loading Gateway...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>Pay ₹{teamData.amountToPay} via Razorpay</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* MINIMAL & SMOOTH PAYMENT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showSuccessModal && teamData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-white text-center space-y-6 relative overflow-hidden"
            >
              {/* SMOOTH ANIMATED CHECKMARK */}
              <div className="pt-2">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto"
                >
                  <svg className="w-10 h-10" viewBox="0 0 52 52" fill="none">
                    <motion.circle
                      cx="26"
                      cy="26"
                      r="23"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M15 27L22 34L37 19"
                      stroke="#10b981"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.35, delay: 0.35, ease: "easeOut" }}
                    />
                  </svg>
                </motion.div>
              </div>

              {/* HEADING & SUBTITLE */}
              <div className="space-y-1.5">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold tracking-widest uppercase inline-block">
                  Payment Verified
                </span>
                <h3 className="text-2xl font-bold font-heading text-white">
                  Slot Confirmed!
                </h3>
                <p className="text-xs text-slate-300 font-sans max-w-xs mx-auto leading-relaxed">
                  Your registration fee for <strong className="text-white font-bold">{teamData.teamName}</strong> has been received and verified.
                </p>
              </div>

              {/* CLEAN MINIMAL RECEIPT DETAILS */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs font-sans text-left space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Team ID</span>
                  <span className="font-mono font-bold text-slate-200">{teamData.uniqueTeamId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Amount Paid</span>
                  <span className="font-bold text-emerald-400 font-mono">₹{teamData.amountToPay}</span>
                </div>
                {teamData.paymentTxnId && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                    <span className="text-slate-400 text-[11px]">Payment ID</span>
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
                      <span>{teamData.paymentTxnId}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(teamData.paymentTxnId || "");
                          setIsTxnCopied(true);
                          setTimeout(() => setIsTxnCopied(false), 2000);
                        }}
                        className="p-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Copy Payment ID"
                      >
                        {isTxnCopied ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION BUTTON */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MINIMAL STANDARDIZED FOOTER (EXACT SITE THEME) */}
      <CompactFooter />
    </div>
  );
}

export default PaymentPortalPage;
