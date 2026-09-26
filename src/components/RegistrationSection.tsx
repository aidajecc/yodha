"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, ShieldCheck, ArrowRight, Mail, ChevronRight, Search, Check, Copy, Gift, Info, ChevronDown, ChevronUp, ExternalLink, User, FileText, BarChart3 } from "lucide-react";
import confetti from "canvas-confetti";
import { saveTeamToFirebase, isTeamNameTaken, validateReferralCode, checkParticipantDuplicate } from "../lib/firebase";
import type { TeamRegistrationData, TeamMember } from "../lib/firebase";
import { submitTeamToGoogleForms } from "../lib/googleForms";
import { sendTeamWelcomeEmails } from "../lib/emailService";
import { YodhaImage } from "./YodhaImage";
import { CyberDropdown } from "./ui/CyberDropdown";
import { PptFormatGuideModal } from "./PptFormatGuideModal";
import {
  HEALTHCARE_PROBLEM_STATEMENTS,
  getPSImage,
} from "../data/problemStatements";
import type { ProblemStatement } from "../data/problemStatements";

interface RegistrationSectionProps {
  isOpen?: boolean;
  onClose?: () => void;
  selectedTrack?: string;
  onOpenReferralDashboard?: (code: string) => void;
}

export function RegistrationSection({ selectedTrack = "Healthcare AI", onOpenReferralDashboard }: RegistrationSectionProps) {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState<number>(2);
  const [track] = useState(selectedTrack);
  const [selectedPS, setSelectedPS] = useState<ProblemStatement | null>(null);
  const [pptLink, setPptLink] = useState("");

  // PPT Modal Format Guide State & Ref
  const [isPptModalOpen, setIsPptModalOpen] = useState(false);
  const [hasOpenedPptModal, setHasOpenedPptModal] = useState(false);
  const pptInputRef = useRef<HTMLInputElement>(null);

  // PS Inline Search & Filter State
  const [psSearchQuery, setPsSearchQuery] = useState("");

  // Leader State
  const [leader, setLeader] = useState<TeamMember>({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    gender: "Male",
    yearOfStudy: "3rd Year",
    githubUrl: "",
  });

  // Additional Members State
  const [members, setMembers] = useState<TeamMember[]>([
    { fullName: "", email: "", phone: "", organization: "", gender: "Male", yearOfStudy: "3rd Year" },
    { fullName: "", email: "", phone: "", organization: "", gender: "Male", yearOfStudy: "3rd Year" },
    { fullName: "", email: "", phone: "", organization: "", gender: "Male", yearOfStudy: "3rd Year" },
  ]);

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [checkingTeamName, setCheckingTeamName] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [_emailStatus, setEmailStatus] = useState<{ dispatched: boolean; count: number }>({ dispatched: false, count: 0 });
  const [teamPassId, setTeamPassId] = useState("");

  // Warrior Referral System State
  const [usedReferralCode, setUsedReferralCode] = useState("");
  const [referralCheckState, setReferralCheckState] = useState<{
    status: "idle" | "checking" | "valid" | "invalid";
    message?: string;
    ownerName?: string;
  }>({ status: "idle" });

  // Field Duplicate Errors & Loading State
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [_checkingFields, setCheckingFields] = useState<Record<string, boolean>>({});

  // Generated Referral Code on Success
  const [generatedReferralCode, setGeneratedReferralCode] = useState("");
  const [copiedReferralCode, setCopiedReferralCode] = useState(false);

  // Referral Info & Full Details Toggle State
  const [showReferralInfo, setShowReferralInfo] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);

  // Auto-detect referral code from localStorage on mount and auto-verify
  useEffect(() => {
    try {
      const savedCode = localStorage.getItem("yodha_referral_code");
      if (savedCode && savedCode.trim()) {
        const clean = savedCode.trim().toUpperCase();
        setUsedReferralCode(clean);
        handleVerifyReferralCode(clean);
      }
    } catch (err) {
      console.warn("Error reading referral code from localStorage:", err);
    }
  }, []);

  // Validate Entered Warrior Referral Code on Click of Verify Logo/Button
  const handleVerifyReferralCode = async (codeVal: string) => {
    const trimmed = codeVal.trim().toUpperCase();
    if (!trimmed) {
      setReferralCheckState({
        status: "invalid",
        message: "Please enter a Warrior Referral Code before clicking Verify.",
      });
      return;
    }

    setReferralCheckState({ status: "checking", message: "Scanning database..." });

    const res = await validateReferralCode(trimmed);

    if (res.valid && res.roomData) {
      setReferralCheckState({
        status: "valid",
        ownerName: res.roomData.teamName,
        message: `✓ Valid Warrior Code! (Referred by Team "${res.roomData.teamName}")`,
      });
    } else {
      setUsedReferralCode("");
      setReferralCheckState({
        status: "invalid",
        message: "❌ Invalid Warrior Code! Code not found in database.",
      });
    }
  };

  // Real-time Field Duplicate Validation (In-form check ONLY - no typing network delays)
  const validateFieldInFormAndDB = (
    fieldKey: string,
    value: string,
    fieldType: "email" | "phone",
    _targetRole?: string
  ) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[fieldKey];
        return copy;
      });
      return;
    }

    const currentVal = fieldType === "email" ? trimmed.toLowerCase() : trimmed;

    // EXPLICIT TEST EXEMPTION: Allow test email (adhithyanvv2005@gmail.com) to register multiple times without any duplicate errors
    const isTestBypassEmail = Boolean(
      fieldType === "email" && (
        currentVal.includes("adhithyanvv2005") ||
        currentVal.includes("adhithyan")
      )
    );

    if (isTestBypassEmail) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[fieldKey];
        return copy;
      });
      return;
    }

    const activeMembers = members.slice(0, teamSize - 1);
    const allFormFields: { key: string; val: string; type: "email" | "phone"; label: string }[] = [
      { key: "leader_email", val: leader.email.trim().toLowerCase(), type: "email", label: "Leader Email" },
      { key: "leader_phone", val: leader.phone.trim(), type: "phone", label: "Leader Mobile" },
      ...activeMembers.map((m, i) => ({
        key: `member_${i}_email`,
        val: m.email.trim().toLowerCase(),
        type: "email" as const,
        label: `Member #${i + 2} Email`,
      })),
      ...activeMembers.map((m, i) => ({
        key: `member_${i}_phone`,
        val: m.phone.trim(),
        type: "phone" as const,
        label: `Member #${i + 2} Mobile`,
      })),
    ];

    const inFormMatch = allFormFields.find(
      (f) => f.key !== fieldKey && f.type === fieldType && f.val && f.val === currentVal
    );

    if (inFormMatch) {
      setFieldErrors((prev) => ({
        ...prev,
        [fieldKey]: `This ${fieldType === "email" ? "email" : "mobile number"} is used by another member in your team (${inFormMatch.label}).`,
      }));
      return;
    }

    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy[fieldKey];
      return copy;
    });
  };

  const filteredProblemStatements = HEALTHCARE_PROBLEM_STATEMENTS.filter((st) => {
    const q = psSearchQuery.toLowerCase();
    return (
      !q ||
      st.title.toLowerCase().includes(q) ||
      `id #${st.id}`.includes(q) ||
      st.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleLeaderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLeader({ ...leader, [e.target.name]: e.target.value });
  };

  const handleMemberChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [e.target.name]: e.target.value };
    setMembers(updated);
  };

  // Step 1 Validation & Fast Instant Transition
  const handleNextFromStep1 = async () => {
    if (!teamName.trim()) {
      setErrorMessage("Please enter your Team Name.");
      return;
    }

    if (!selectedPS) {
      setErrorMessage("Please select a problem statement below before proceeding.");
      return;
    }

    if (!pptLink.trim()) {
      setErrorMessage("Please enter your Google Drive PPT Presentation Link.");
      return;
    }

    if (!pptLink.toLowerCase().includes("drive.google.com") && !pptLink.toLowerCase().includes("docs.google.com")) {
      setErrorMessage("Please provide a valid Google Drive link (e.g. https://drive.google.com/...)");
      return;
    }

    if (usedReferralCode.trim()) {
      if (referralCheckState.status === "checking") {
        setErrorMessage("Validating Warrior Referral Code, please wait...");
        return;
      }
      if (referralCheckState.status === "invalid") {
        setErrorMessage("Invalid Referral Code. Please clear or correct the code to proceed.");
        return;
      }
    }

    // Immediately advance to Step 2 for instant UI response
    setErrorMessage("");
    setCurrentStep(2);
  };

  // Final Form Submission (Data updated ONLY on final submit, ultra-fast & non-blocking)
  const handleSubmitRegistration = async () => {
    const isTestEmail = leader.email.toLowerCase().includes("adhithyan");

    if (!isTestEmail && Object.keys(fieldErrors).length > 0) {
      setErrorMessage("Please resolve all duplicate email and phone errors before submitting.");
      return;
    }

    if (usedReferralCode.trim() && referralCheckState.status === "invalid") {
      setErrorMessage("Invalid Warrior Referral Code. Please verify the code before submitting.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const activeMembers = members.slice(0, teamSize - 1);
    const fullTrackName = selectedPS
      ? `${selectedPS.category} AI - [ID #${selectedPS.id}] ${selectedPS.title}`
      : track;

    const payload: TeamRegistrationData = {
      teamName,
      teamSize,
      track: fullTrackName,
      problemStatementId: selectedPS?.id,
      problemStatementTitle: selectedPS?.title,
      pptLink: pptLink.trim(),
      leader,
      members: activeMembers,
      usedReferralCode: usedReferralCode.trim().toUpperCase() || undefined,
    };

    try {
      // 1. SAVE TO FIREBASE ONLY NOW ON FINAL SUBMIT
      const saveRes = await saveTeamToFirebase(payload);
      if (!saveRes.success) {
        setStatus("error");
        setErrorMessage(saveRes.error || "Failed to submit team registration.");
        return;
      }

      setTeamPassId("YODHA-" + Math.floor(100000 + Math.random() * 900000));
      if (saveRes.warriorReferralCode) {
        setGeneratedReferralCode(saveRes.warriorReferralCode);
      }

      // 2. SHOW INSTANT CONFIRMATION & CONFETTI WITHOUT WAITING FOR BACKGROUND TASKS
      setStatus("success");
      confetti({
        particleCount: 140,
        spread: 85,
        origin: { y: 0.6 },
        colors: ["#38bdf8", "#818cf8", "#c084fc", "#34d399", "#fbbf24"],
      });

      // 3. RUN BACKGROUND NOTIFICATIONS ASYNCHRONOUSLY (NON-BLOCKING)
      const allParticipants = [
        { fullName: leader.fullName, email: leader.email, role: "Leader" as const, phone: leader.phone, organization: leader.organization },
        ...activeMembers.map((m) => ({ fullName: m.fullName, email: m.email, role: "Member" as const, phone: m.phone, organization: m.organization })),
      ];

      submitTeamToGoogleForms(payload).catch((err) => console.warn("Google forms bg sync:", err));
      sendTeamWelcomeEmails({
        teamName,
        track: fullTrackName,
        problemStatementId: selectedPS?.id,
        problemStatementTitle: selectedPS?.title,
        pptLink: pptLink.trim(),
        participants: allParticipants,
        warriorReferralCode: saveRes.warriorReferralCode,
      }).then((res) => {
        setEmailStatus({ dispatched: res.success, count: res.dispatchedTo.length });
      }).catch((err) => console.warn("Email bg dispatch:", err));

    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to submit team registration.");
    }
  };

  return (
    <section id="register" className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto select-none z-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full text-white"
      >
        {/* CENTERED BIG HEADER BRANDING (NO ICON) */}
        <div className="flex flex-col items-center justify-center text-center border-b border-blue-500/20 pb-6 mb-8">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-white tracking-tight uppercase">
            TEAM <span className="text-red-400">REGISTRATION CLOSED</span>
          </h2>
        </div>

        {/* SUBMISSION SUCCESS SCREEN */}
        {status === "success" ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(52,211,153,0.4)]">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <h4 className="text-2xl sm:text-3xl font-black text-white font-heading">REGISTRATION CONFIRMED!</h4>
            <p className="text-sm text-slate-300 mt-1 max-w-md">
              Welcome to YODHA 2.0! Your team record has been saved and welcome emails have been dispatched.
            </p>

            <div className="mt-4 flex items-start gap-3 px-4.5 py-3 bg-emerald-950/80 border border-emerald-400/60 rounded-xl text-xs font-mono text-emerald-300 shadow-md text-left max-w-lg">
              <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
              <div>
                <span className="font-bold text-white block text-xs uppercase tracking-wider">CONFIRMATION EMAIL SENT TO LEADER</span>
                <span className="text-emerald-300/90 text-[11px] font-sans leading-relaxed block mt-0.5">
                  A detailed confirmation pass & full submission summary have been sent to Team Leader: <strong className="text-white">{leader.fullName}</strong> ({leader.email}).
                </span>
              </div>
            </div>

            {/* WHATSAPP JOIN BUTTON */}
            <div className="mt-8 mb-2">
              <a
                href="https://chat.whatsapp.com/JyW5dGEUiX8B19JRfwRmwb"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all transform hover:scale-105 active:scale-95 group font-mono font-bold uppercase tracking-wider border border-blue-400/50"
              >
                <svg className="w-6 h-6 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.472-1.761-1.645-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>Join Official WhatsApp Group</span>
              </a>
            </div>

            {/* DIGITAL HACKER PASS WITH EXPANDABLE DETAILED ROSTER */}
            <div className="mt-8 w-full bg-gradient-to-br from-[#070c22] via-[#040716] to-[#07112e] border-2 border-blue-500/50 rounded-3xl p-5 sm:p-7 text-left shadow-[0_0_50px_rgba(59,130,246,0.3)] relative overflow-hidden backdrop-blur-2xl">
              
              {/* CORNER GLOW BADGES */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* PASS HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-blue-500/20">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] sm:text-[10px] font-mono text-blue-400 font-extrabold uppercase tracking-[0.2em] bg-blue-950/90 px-2.5 py-0.5 rounded border border-blue-500/40">
                      OFFICIAL HACKER PASS
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      VERIFIED ENTRY
                    </span>
                  </div>
                  <h5 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">{teamName}</h5>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="font-mono text-xs sm:text-sm font-black text-blue-300 bg-blue-950/90 px-3.5 py-1.5 rounded-xl border border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.4)] tracking-wider">
                    {teamPassId}
                  </span>
                </div>
              </div>

              {/* PRIMARY 4-GRID QUICK SUMMARY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono mb-5">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block mb-1 text-[10px] uppercase font-bold tracking-wider">TEAM LEADER (CAPTAIN)</span>
                  <span className="text-white font-black text-sm block">{leader.fullName}</span>
                  <span className="text-blue-300/80 text-[11px] block mt-0.5">{leader.email}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block mb-1 text-[10px] uppercase font-bold tracking-wider">PROBLEM STATEMENT</span>
                  <span className="text-blue-300 font-bold text-xs block leading-snug">
                    {selectedPS ? `[ID #${selectedPS.id}] ${selectedPS.title}` : track}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block mb-1 text-[10px] uppercase font-bold tracking-wider">ROSTER SIZE</span>
                  <span className="text-white font-bold text-xs flex items-center gap-1.5">
                    <span>{teamSize} Participants</span>
                    <span className="text-[10px] text-sky-400 font-mono bg-sky-950/80 px-2 py-0.5 rounded border border-sky-500/30">
                      {teamSize === 2 ? "DUO" : teamSize === 3 ? "TRIO" : "SQUAD"}
                    </span>
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block mb-1 text-[10px] uppercase font-bold tracking-wider">COLLEGE / INSTITUTION</span>
                  <span className="text-slate-200 font-bold text-xs block truncate">{leader.organization}</span>
                </div>
              </div>

              {/* TOGGLE EXPAND / COLLAPSE BUTTON FOR FULL DETAILS */}
              <button
                type="button"
                onClick={() => setShowFullDetails(!showFullDetails)}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600/30 via-blue-500/20 to-sky-600/30 hover:from-blue-600/40 hover:to-sky-600/40 border border-blue-400/40 text-blue-200 font-mono text-xs font-black uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer shadow-lg group active:scale-[0.99]"
              >
                <div className="flex items-center gap-2">
                  <span>{showFullDetails ? "HIDE FULL REGISTRATION DETAILS" : "VIEW FULL SUBMISSION DETAILS & ROSTER"}</span>
                </div>
                {showFullDetails ? (
                  <ChevronUp className="w-4.5 h-4.5 text-blue-400" />
                ) : (
                  <ChevronDown className="w-4.5 h-4.5 text-blue-400 group-hover:translate-y-0.5 transition-transform" />
                )}
              </button>

              {/* EXPANDABLE COMPLETE DETAILS ACCORDION */}
              <AnimatePresence>
                {showFullDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 mt-4 border-t border-blue-500/30 space-y-6 text-xs font-mono">
                      
                      {/* SUBMISSION ASSETS */}
                      <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/30">
                        <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-blue-400" />
                          <span>PPT PRESENTATION & ASSETS</span>
                        </span>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-black/60 p-3 rounded-xl border border-slate-800">
                          <span className="text-slate-300 text-xs font-sans font-medium truncate max-w-full sm:max-w-md">
                            {pptLink}
                          </span>
                          <a
                            href={pptLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-[11px] font-bold rounded-lg flex items-center gap-1.5 shrink-0 transition-all shadow-md"
                          >
                            <span>Open Drive Link</span>
                            <ExternalLink className="w-3.5 h-3.5 text-white" />
                          </a>
                        </div>
                      </div>

                      {/* LEADER COMPLETE PROFILE */}
                      <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/30">
                        <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-400" />
                          <span>TEAM LEADER COMPLETE PROFILE</span>
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div>
                            <span className="text-slate-500 text-[10px] block">FULL NAME</span>
                            <span className="text-white font-bold">{leader.fullName}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px] block">EMAIL ADDRESS</span>
                            <span className="text-slate-200">{leader.email}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px] block">MOBILE NUMBER</span>
                            <span className="text-slate-200">{leader.phone}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px] block">COLLEGE / INSTITUTION</span>
                            <span className="text-slate-200">{leader.organization}</span>
                          </div>
                          {leader.githubUrl && (
                            <div>
                              <span className="text-slate-500 text-[10px] block">GITHUB PROFILE</span>
                              <a href={leader.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline truncate block">
                                {leader.githubUrl}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* TEAM MEMBERS ROSTER */}
                      {members.slice(0, teamSize - 1).length > 0 && (
                        <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/30">
                          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-blue-400" />
                            <span>TEAM MEMBERS ROSTER ({members.slice(0, teamSize - 1).length} MEMBERS)</span>
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {members.slice(0, teamSize - 1).map((m, idx) => (
                              <div key={idx} className="p-3 rounded-xl bg-black/60 border border-slate-800 space-y-1">
                                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                                  <span className="font-bold text-white text-xs">{m.fullName || `Member #${idx + 2}`}</span>
                                  <span className="text-[9px] font-mono text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                                    MEMBER #{idx + 2}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-300 pt-1 space-y-0.5">
                                  <div><span className="text-slate-500">Email:</span> {m.email || "N/A"}</div>
                                  <div><span className="text-slate-500">Phone:</span> {m.phone || "N/A"}</div>
                                  <div><span className="text-slate-500">College:</span> {m.organization || leader.organization}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* FOOTER BADGE */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Official YODHA 2.0 Registration Complete</span>
                </span>
                <Mail className="w-4 h-4 text-blue-400" />
              </div>
            </div>


          </div>
        ) : (
          <div>
            {/* REGISTRATION CLOSED NOTICE BANNER */}
            <div className="mb-8 p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs sm:text-sm font-mono flex items-center gap-3 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
              <span className="font-bold text-white">NOTICE: Registrations are officially closed (Concluded September 26, 2026).</span>
            </div>

            {/* STEP PROGRESS BAR */}
            <div className="flex items-center justify-between mb-8 relative">
              {[1, 2, 3, 4].map((stepNum, idx) => (
                <div key={stepNum} className="flex flex-col items-center relative z-10">
                  <div
                    onClick={() => {
                      if (stepNum < currentStep) {
                        setErrorMessage("");
                        setCurrentStep(stepNum);
                      }
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all ${
                      currentStep === stepNum
                        ? "bg-blue-600 text-white border-2 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                        : currentStep > stepNum
                        ? "bg-emerald-500 text-slate-950 font-black cursor-pointer hover:scale-110"
                        : "bg-slate-900 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {currentStep > stepNum ? "✓" : idx + 1}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-1 font-semibold uppercase">
                    {stepNum === 1 ? "Track & PS" : stepNum === 2 ? "Leader" : stepNum === 3 ? `Members (${teamSize - 1})` : "Confirm"}
                  </span>
                </div>
              ))}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-800 -z-0" />
            </div>

            {/* ERROR MESSAGE DISPLAY */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-3">
                <span className="font-bold text-rose-400">ERROR:</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: TEAM NAME, TEAM SIZE, WARRIOR REFERRAL & INLINE PS SELECTOR */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold font-heading text-white">Step 1: Team & Problem Statement</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">Team Name *</label>
                    <input
                      type="text"
                      required
                      value={teamName}
                      onChange={(e) => {
                        setTeamName(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      placeholder="e.g. CyberKnights"
                      className="w-full px-4 py-3 bg-slate-900/90 border border-blue-500/30 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold">Team Size *</label>
                    <CyberDropdown
                      options={[
                        { value: 2, label: "2 Members", badge: "DUO" },
                        { value: 3, label: "3 Members", badge: "TRIO" },
                        { value: 4, label: "4 Members (Full Team)", badge: "SQUAD" },
                      ]}
                      value={teamSize}
                      onChange={(val) => setTeamSize(Number(val))}
                    />
                  </div>
                </div>

                {/* GOOGLE DRIVE PPT PRESENTATION LINK FIELD */}
                <div>
                  <div className="mb-1.5">
                    <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5 font-bold">
                      <span>Google Drive PPT Presentation Link *</span>
                    </label>
                  </div>

                  <input
                    ref={pptInputRef}
                    type="url"
                    required
                    value={pptLink}
                    onClick={() => {
                      if (!hasOpenedPptModal) {
                        setIsPptModalOpen(true);
                        setHasOpenedPptModal(true);
                      }
                    }}
                    onFocus={() => {
                      if (!hasOpenedPptModal) {
                        setIsPptModalOpen(true);
                        setHasOpenedPptModal(true);
                      }
                    }}
                    onChange={(e) => {
                      setPptLink(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                    className="w-full px-4 py-3 bg-slate-900/90 border border-blue-500/30 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400 font-mono transition-colors"
                  />

                  {/* HELPER SUBTEXT BELOW FIELD */}
                  <p className="text-[11px] font-mono text-slate-400 mt-1.5">
                    Upload your PPT to Google Drive and share it as <strong className="text-sky-300">‘Anyone with the link – Viewer’</strong>.
                  </p>
                </div>

                {/* WARRIOR REFERRAL CODE FIELD WITH (i) INFO BUTTON */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5 font-bold">
                      <Gift className="w-3.5 h-3.5 text-blue-400" />
                      <span>Warrior Referral Code (Optional)</span>
                    </label>

                    {/* CIRCULAR (i) INFO BUTTON */}
                    <button
                      type="button"
                      onClick={() => setShowReferralInfo(!showReferralInfo)}
                      className="w-6 h-6 sm:w-auto sm:h-auto p-0 sm:px-2 rounded-full bg-blue-950 border border-blue-500/40 text-blue-400 hover:text-white hover:border-blue-400 transition-all flex items-center justify-center gap-1 text-[11px] font-mono cursor-pointer"
                      title="Why use a referral code?"
                    >
                      <Info className="w-3.5 h-3.5 text-blue-400" />
                      <span className="hidden sm:inline text-[10px] font-bold">Why refer?</span>
                    </button>
                  </div>

                  {/* EXPANDABLE REFERRAL BENEFIT BRIEF */}
                  {showReferralInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-3 p-3.5 rounded-2xl bg-blue-950/80 border border-blue-400/40 text-xs font-mono text-blue-200 space-y-1.5 leading-relaxed shadow-lg"
                    >
                      <div className="font-bold text-white text-xs flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-amber-400" />
                        <span>Why enter a Warrior Referral Code?</span>
                      </div>
                      <p className="text-[11px] text-slate-200">
                        • <strong>Referral Gift:</strong> The shortlisted team with the highest number of valid referrals will receive a special gift.
                      </p>
                      <p className="text-[11px] text-amber-300 font-semibold">
                        • <strong>Qualification Requirement:</strong> Teams must have at least 2 valid referred teams to be qualified for referral rewards.
                      </p>
                      <p className="text-[11px] text-slate-200">
                        • <strong>Bonus Swag & Rewards:</strong> Gives your team higher eligibility for special innovation gifts, mentor support packs, and ambassador perks!
                      </p>
                    </motion.div>
                  )}

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <div className="relative flex-1 w-full">
                      <input
                        type="text"
                        value={usedReferralCode}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          setUsedReferralCode(val);
                          if (!val.trim()) setReferralCheckState({ status: "idle" });
                        }}
                        placeholder="e.g. WARR-X8K9"
                        className={`w-full px-4 py-3 bg-slate-900 border rounded-2xl text-sm font-mono text-white uppercase focus:outline-none transition-all ${
                          referralCheckState.status === "valid"
                            ? "border-emerald-400 bg-emerald-950/20 text-emerald-300 pr-11 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                            : referralCheckState.status === "invalid"
                            ? "border-rose-500 bg-rose-950/20 text-rose-300"
                            : "border-blue-500/30 focus:border-blue-400"
                        }`}
                      />
                      {referralCheckState.status === "valid" && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shadow-[0_0_10px_rgba(52,211,153,0.8)]">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleVerifyReferralCode(usedReferralCode)}
                      disabled={referralCheckState.status === "checking"}
                      className={`w-full sm:w-auto px-6 py-3 font-mono text-xs font-bold uppercase rounded-2xl flex items-center justify-center gap-2 border cursor-pointer shrink-0 transition-all active:scale-95 ${
                        referralCheckState.status === "valid"
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.4)]"
                          : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                      }`}
                    >
                      {referralCheckState.status === "checking" ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      ) : referralCheckState.status === "valid" ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-white" />
                      )}
                      <span>{referralCheckState.status === "valid" ? "VERIFIED ✓" : "VERIFY"}</span>
                    </button>
                  </div>
                  {referralCheckState.message && (
                    <p className={`text-xs font-mono mt-1.5 flex items-center gap-1.5 ${referralCheckState.status === "valid" ? "text-emerald-400 font-bold" : "text-rose-400"}`}>
                      {referralCheckState.status === "valid" && <Check className="w-4 h-4 text-emerald-400" />}
                      <span>{referralCheckState.message}</span>
                    </p>
                  )}
                </div>

                {/* INLINE PROBLEM STATEMENT SELECTOR (NO POPUPS) */}
                <div className="pt-4 border-t border-blue-500/20">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <label className="text-xs font-mono text-blue-300 font-bold uppercase tracking-wider flex items-center gap-2">
                        <span>SELECT YOUR PROBLEM STATEMENTS</span>
                      </label>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={psSearchQuery}
                        onChange={(e) => setPsSearchQuery(e.target.value)}
                        placeholder="Search PS ID or keyword..."
                        className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-blue-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  {/* INLINE GRID OF ALL 20 PROBLEM STATEMENTS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                    {filteredProblemStatements.map((st) => {
                      const isSelected = selectedPS?.id === st.id;

                      return (
                        <div
                          key={st.id}
                          onClick={() => setSelectedPS(st)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left flex items-center gap-3 relative ${
                            isSelected
                              ? "bg-blue-950/80 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                              : "bg-slate-900/80 border-slate-800 hover:border-blue-500/50 hover:bg-slate-900"
                          }`}
                        >
                          <div className="w-16 h-12 rounded-xl overflow-hidden border border-blue-500/30 shrink-0 relative bg-black">
                            <YodhaImage src={getPSImage(st)} alt={st.title} className="w-full h-full object-cover" />
                            <div className="absolute top-1 left-1 px-1 rounded text-[8px] font-mono font-black bg-black/80 text-blue-300">
                              #{st.id}
                            </div>
                          </div>

                          <div className="flex-1 truncate">
                            <span className="text-[9px] font-mono font-bold text-blue-400 uppercase block">
                              {st.category} AI
                            </span>
                            <h5 className="text-xs font-bold text-white truncate">{st.title}</h5>
                            <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{st.tags.join(" • ")}</span>
                          </div>

                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                              isSelected ? "bg-blue-600 border-blue-400 text-white" : "border-slate-700 text-transparent"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextFromStep1}
                    disabled={checkingTeamName}
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer"
                  >
                    {checkingTeamName ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <span>NEXT: LEADER DETAILS</span>
                        <ChevronRight className="w-4 h-4 text-white" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: LEADER DETAILS */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold font-heading text-white">Step 2: Team Leader Details</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={leader.fullName}
                      onChange={handleLeaderChange}
                      placeholder="e.g. Rahul Nair"
                      className="w-full px-4 py-3 bg-slate-900 border border-blue-500/30 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={leader.email}
                      onChange={handleLeaderChange}
                      onBlur={(e) => validateFieldInFormAndDB("leader_email", e.target.value, "email", "Leader")}
                      placeholder="rahul@jecc.ac.in"
                      className="w-full px-4 py-3 bg-slate-900 border border-blue-500/30 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400"
                    />
                    {fieldErrors["leader_email"] && (
                      <span className="text-[11px] font-mono text-rose-400 mt-1 block">{fieldErrors["leader_email"]}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Mobile Number (10 Digits) *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      maxLength={10}
                      value={leader.phone}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setLeader({ ...leader, phone: cleaned });
                      }}
                      onBlur={(e) => validateFieldInFormAndDB("leader_phone", e.target.value, "phone", "Leader")}
                      placeholder="9876543210"
                      className="w-full px-4 py-3 bg-slate-900 border border-blue-500/30 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400 font-mono"
                    />
                    {fieldErrors["leader_phone"] && (
                      <span className="text-[11px] font-mono text-rose-400 mt-1 block">{fieldErrors["leader_phone"]}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Institution / College *</label>
                    <input
                      type="text"
                      name="organization"
                      required
                      value={leader.organization}
                      onChange={handleLeaderChange}
                      placeholder="e.g. Jyothi Engineering College"
                      className="w-full px-4 py-3 bg-slate-900 border border-blue-500/30 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Gender *</label>
                    <div className="relative">
                      <select
                        name="gender"
                        value={leader.gender}
                        onChange={handleLeaderChange}
                        className="w-full px-4 py-3 bg-slate-900 border border-blue-500/30 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400 appearance-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono font-bold uppercase"
                  >
                    BACK
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!leader.fullName || !leader.email || !leader.phone || !leader.organization) {
                        setErrorMessage("Please fill all required Leader fields.");
                        return;
                      }
                      if (!/^\d{10}$/.test(leader.phone.trim())) {
                        setErrorMessage("Leader mobile number must be exactly 10 numeric digits.");
                        return;
                      }
                      setErrorMessage("");
                      setCurrentStep(3);
                    }}
                    className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    <span>NEXT: TEAM MEMBERS</span>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ADDITIONAL TEAM MEMBERS */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold font-heading text-white">Step 3: Team Members Details</h4>
                </div>

                {Array.from({ length: teamSize - 1 }).map((_, index) => (
                  <div key={index} className="p-4 rounded-2xl bg-slate-900/60 border border-blue-500/20 space-y-3">
                    <span className="text-xs font-mono font-bold text-blue-400 uppercase">MEMBER #{index + 2}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name *"
                        value={members[index]?.fullName || ""}
                        onChange={(e) => handleMemberChange(index, e)}
                        className="px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                      />
                      <div>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address *"
                          value={members[index]?.email || ""}
                          onChange={(e) => handleMemberChange(index, e)}
                          onBlur={(e) => validateFieldInFormAndDB(`member_${index}_email`, e.target.value, "email", `Member #${index + 2}`)}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                        />
                        {fieldErrors[`member_${index}_email`] && (
                          <span className="text-[10px] font-mono text-rose-400 mt-0.5 block">{fieldErrors[`member_${index}_email`]}</span>
                        )}
                      </div>
                      <div>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Mobile Number (10 Digits) *"
                          required
                          maxLength={10}
                          value={members[index]?.phone || ""}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
                            handleMemberChange(index, { target: { name: "phone", value: cleaned } } as any);
                          }}
                          onBlur={(e) => validateFieldInFormAndDB(`member_${index}_phone`, e.target.value, "phone", `Member #${index + 2}`)}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
                        />
                        {fieldErrors[`member_${index}_phone`] && (
                          <span className="text-[10px] font-mono text-rose-400 mt-0.5 block">{fieldErrors[`member_${index}_phone`]}</span>
                        )}
                      </div>
                      <input
                        type="text"
                        name="organization"
                        placeholder="College / Institution *"
                        value={members[index]?.organization || ""}
                        onChange={(e) => handleMemberChange(index, e)}
                        className="px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                      />
                      <div className="relative w-full">
                        <select
                          name="gender"
                          value={members[index]?.gender || "Male"}
                          onChange={(e) => handleMemberChange(index, e as any)}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white appearance-none"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Others">Others</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono font-bold uppercase"
                  >
                    BACK
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const activeMembers = members.slice(0, teamSize - 1);
                      for (let i = 0; i < activeMembers.length; i++) {
                        const m = activeMembers[i];
                        if (!m.fullName.trim() || !m.email.trim() || !m.phone.trim() || !m.organization.trim()) {
                          setErrorMessage(`Please fill all required fields for Member #${i + 2}.`);
                          return;
                        }
                        if (!/^\d{10}$/.test(m.phone.trim())) {
                          setErrorMessage(`Member #${i + 2} mobile number must be exactly 10 numeric digits.`);
                          return;
                        }
                      }
                      setErrorMessage("");
                      setCurrentStep(4);
                    }}
                    className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <span>NEXT: CONFIRM</span>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: CONFIRMATION & SUBMIT */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold font-heading text-white">Step 4: Confirm Registration</h4>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-blue-500/30 text-xs font-mono space-y-2">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">TEAM NAME:</span>
                    <span className="font-bold text-white">{teamName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">PROBLEM STATEMENT:</span>
                    <span className="font-bold text-blue-300 text-right">{selectedPS ? `[ID #${selectedPS.id}] ${selectedPS.title}` : track}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">TEAM LEADER:</span>
                    <span className="font-bold text-white">{leader.fullName} ({leader.email})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">TOTAL MEMBERS:</span>
                    <span className="font-bold text-white">{teamSize} Participants</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between gap-4 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono font-bold uppercase cursor-pointer hover:bg-slate-800"
                  >
                    BACK
                  </button>

                  <button
                    type="button"
                    disabled={true}
                    className="px-9 py-4 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2.5 cursor-not-allowed opacity-80"
                  >
                    <span>REGISTRATION CLOSED</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* PPT FORMAT & PUBLIC ACCESS MODAL */}
      <PptFormatGuideModal
        isOpen={isPptModalOpen}
        onClose={() => setIsPptModalOpen(false)}
        onContinue={() => {
          setIsPptModalOpen(false);
          setTimeout(() => {
            pptInputRef.current?.focus();
          }, 150);
        }}
      />
    </section>
  );
}

export default RegistrationSection;
