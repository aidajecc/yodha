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
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
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
    script.onerror = () => console.warn("Failed to load Razorpay checkout script.");
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
              // Update local UI state
              setTeamData({
                ...teamData,
                paymentStatus: "Completed",
                paymentTxnId: response.razorpay_payment_id,
              });
              setPaymentSuccess(true);
              setIsPaymentModalOpen(false);
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

                {teamData.paymentStatus === "Completed" ? (
                  <span className="px-8 py-4 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-black uppercase tracking-widest flex items-center gap-2.5 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    SLOT CONFIRMED
                  </span>
                ) : (
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full sm:w-auto px-10 py-4.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-sm font-black tracking-widest uppercase cursor-pointer shadow-[0_0_35px_rgba(59,130,246,0.6)] hover:shadow-[0_0_55px_rgba(59,130,246,0.8)] transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 hover:scale-[1.02]"
                  >
                    <CreditCard className="w-5 h-5 text-white" />
                    <span>PROCEED TO PAYMENT (₹{teamData.amountToPay})</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* PAYMENT MODAL (GATEWAY INTEGRATION DIALOG) */}
      <AnimatePresence>
        {isPaymentModalOpen && teamData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#081125] border-2 border-blue-500/50 shadow-[0_0_60px_rgba(59,130,246,0.4)] text-white space-y-6 relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-black font-heading tracking-tight">SECURE PAYMENT GATEWAY</h3>
                </div>
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
                >
                  [ CLOSE ]
                </button>
              </div>

              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
                  <ShieldCheck className="w-8 h-8 text-cyan-400 animate-pulse" />
                </div>

                <div className="space-y-1 font-mono">
                  <h4 className="text-xl font-black text-white font-heading">{teamData.teamName}</h4>
                  <p className="text-xs text-slate-400">Unique Team ID: {teamData.uniqueTeamId}</p>
                  <p className="text-2xl font-black text-amber-300 font-serif pt-2">
                    Amount: ₹{teamData.amountToPay}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 text-left space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>SECURED BY RAZORPAY</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Your payment is secured with 256-bit SSL encryption via Razorpay. Supports UPI, Cards, Net Banking, and Wallets.
                  </p>
                  {paymentError && (
                    <p className="text-[11px] text-rose-400 font-bold leading-relaxed border-t border-rose-500/30 pt-2">
                      ⚠️ {paymentError}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={handleRazorpayPayment}
                  disabled={isProcessingPayment || paymentSuccess || !razorpayLoaded}
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-black tracking-widest uppercase cursor-pointer shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>OPENING RAZORPAY...</span>
                    </>
                  ) : paymentSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>PAYMENT SUCCESSFUL!</span>
                    </>
                  ) : !razorpayLoaded ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>LOADING GATEWAY...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>PAY ₹{teamData?.amountToPay} VIA RAZORPAY</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 text-xs font-mono cursor-pointer"
                >
                  Cancel
                </button>
              </div>
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
