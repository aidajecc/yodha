"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Home,
  AlertCircle,
  Lightbulb,
  Cpu,
  Network,
  Zap,
  BarChart3,
  Users,
  TrendingUp,
  Flag,
  Upload,
  Share2,
  Globe,
  Copy,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
} from "lucide-react";

interface PptFormatGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue?: () => void;
}

export function PptFormatGuideModal({
  isOpen,
  onClose,
  onContinue,
}: PptFormatGuideModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key press
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

  const handleContinueAction = () => {
    if (onContinue) {
      onContinue();
    } else {
      onClose();
    }
  };

  const slidesData = [
    {
      id: "01",
      icon: Home,
      title: "TITLE SLIDE",
      bullets: [
        "Project Title & Team Name",
        "Team Members Roster",
        "College / Institution Name",
      ],
      tip: "Choose a clear, memorable project title that reflects your solution.",
    },
    {
      id: "02",
      icon: AlertCircle,
      title: "PROBLEM STATEMENT",
      bullets: [
        "Problem Selected & Real-World Context",
        "Why This Problem Matters",
        "Target Audience & Who is Affected",
      ],
      tip: "Clearly explain the real-world problem and why solving it is important.",
    },
    {
      id: "03",
      icon: Lightbulb,
      title: "PROPOSED SOLUTION",
      bullets: [
        "Brief Explanation of Your Solution",
        "How It Solves the Problem",
        "Key Features & Core Value",
      ],
      tip: "Focus on what your solution does and how it creates value.",
    },
    {
      id: "04",
      icon: Cpu,
      title: "TECHNOLOGY & AI APPROACH",
      bullets: [
        "Technologies & Frameworks Used",
        "AI / ML Models or Algorithms",
        "Data Sources & APIs",
      ],
      tip: "Mention the specific technologies you plan to use and their purpose.",
    },
    {
      id: "05",
      icon: Network,
      title: "SOLUTION WORKFLOW",
      bullets: [
        "Step-by-Step Architecture Flow",
        "Input → AI Processing → Output",
        "Key System Components",
      ],
      tip: "Use a simple diagram to make the solution architecture easy to digest.",
    },
    {
      id: "06",
      icon: Zap,
      title: "INNOVATION & UNIQUENESS",
      bullets: [
        "Unique Value Proposition",
        "What Makes Your Idea Stand Out",
        "Comparison with Existing Approaches",
      ],
      tip: "Highlight the originality and creative thinking behind your idea.",
    },
    {
      id: "07",
      icon: BarChart3,
      title: "FEASIBILITY & IMPLEMENTATION",
      bullets: [
        "Prototype Development Plan",
        "Resources & Technical Requirements",
        "Development Approach & Timeline",
      ],
      tip: "Demonstrate that your team has a practical plan to build a prototype.",
    },
    {
      id: "08",
      icon: Users,
      title: "EXPECTED IMPACT",
      bullets: [
        "Who Will Benefit & Applications",
        "Healthcare / Social Outcomes",
        "Measurable Improvements",
      ],
      tip: "Focus on meaningful, real-world improvements your solution creates.",
    },
    {
      id: "09",
      icon: TrendingUp,
      title: "FUTURE SCOPE",
      bullets: [
        "Scalability Beyond Prototype",
        "Future Enhancements & Features",
        "Long-Term Implementation Vision",
      ],
      tip: "Explain how your solution could evolve into a larger, practical system.",
    },
    {
      id: "10",
      icon: Flag,
      title: "CONCLUSION",
      bullets: [
        "Executive Summary of Idea",
        "Key Takeaways",
        "Final Vision Statement",
      ],
      tip: "Close with a clear statement of the impact your project aims to create.",
    },
  ];

  const sharingSteps = [
    {
      step: "01",
      title: "Upload Presentation",
      description: "Upload your completed PPT / PDF presentation to Google Drive.",
      action: "Click '+ New' → Select 'File upload'",
    },
    {
      step: "02",
      title: "Open Share Settings",
      description: "Locate the file in Google Drive, right-click, and select Share.",
      action: "Right-click file → Select 'Share'",
    },
    {
      step: "03",
      title: "Enable Public Access",
      description: "Change General Access to 'Anyone with the link' and set role to 'Viewer'.",
      action: "Set to 'Anyone with the link' → Viewer",
      highlight: true,
    },
    {
      step: "04",
      title: "Copy & Submit Link",
      description: "Click 'Copy link' and paste it into the registration form field.",
      action: "Click 'Copy link' → Paste into form",
    },
  ];

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ppt-modal-title"
          className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 bg-[#03060d]/95 backdrop-blur-xl overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl bg-[#060c1d] border border-blue-500/25 rounded-3xl p-5 sm:p-8 md:p-9 text-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between z-[1000000] select-text"
          >
            {/* MODAL HEADER (NO X CLOSE BUTTON) */}
            <div className="flex items-start justify-between pb-6 border-b border-slate-800 shrink-0 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-[1px] bg-blue-500/60" />
                  <span className="text-[11px] font-mono tracking-[0.3em] text-slate-400 uppercase">
                    YODHA 2.0 • SUBMISSION GUIDELINES
                  </span>
                </div>
                <h3
                  id="ppt-modal-title"
                  className="font-serif text-2xl sm:text-4xl text-white tracking-tight uppercase font-normal"
                >
                  IDEA SUBMISSION PPT FORMAT
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-sans">
                  Follow the structure below to create and submit your idea presentation.
                </p>
              </div>
            </div>

            {/* SCROLLABLE BODY CONTENT WITH SPACIOUS LAYOUT */}
            <div className="my-6 overflow-y-auto pr-1 sm:pr-2 space-y-9 flex-1 relative z-10 custom-scrollbar">
              
              {/* ==========================================
                  SECTION ONE: RECOMMENDED 10-SLIDE STRUCTURE
                 ========================================== */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-400 font-mono font-bold text-xs uppercase tracking-wider">
                      01 /
                    </span>
                    <h4 className="font-serif text-xl sm:text-2xl text-white tracking-wide uppercase">
                      RECOMMENDED PPT STRUCTURE
                    </h4>
                  </div>
                  <p className="text-xs font-sans text-slate-300">
                    Your presentation should cover the following 10 slides:
                  </p>
                </div>

                {/* 2-COLUMN SPACIOUS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {slidesData.map((slide) => {
                    const IconComp = slide.icon;
                    return (
                      <div
                        key={slide.id}
                        className="p-4 sm:p-5 rounded-2xl bg-[#091227]/70 border border-slate-800 hover:border-blue-500/30 transition-all flex flex-col justify-between space-y-3"
                      >
                        <div>
                          {/* HEADER ITEM */}
                          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-2.5">
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono text-xs font-extrabold text-blue-400">
                                {slide.id}
                              </span>
                              <h5 className="font-sans text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                                {slide.title}
                              </h5>
                            </div>
                            <IconComp className="w-4 h-4 text-slate-400" />
                          </div>

                          {/* BULLET POINTS */}
                          <ul className="text-xs font-sans text-slate-300 space-y-1 pl-1">
                            {slide.bullets.map((b, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-blue-400 font-bold">•</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* TIP FOOTER */}
                        <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 font-sans">
                          <span className="text-blue-400 font-mono font-semibold">Tip:</span>{" "}
                          {slide.tip}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ==========================================
                  SECTION TWO: GOOGLE DRIVE PUBLIC ACCESS GUIDE
                 ========================================== */}
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-400 font-mono font-bold text-xs uppercase tracking-wider">
                      02 /
                    </span>
                    <h4 className="font-serif text-xl sm:text-2xl text-white tracking-wide uppercase">
                      HOW TO SHARE YOUR PPT LINK
                    </h4>
                  </div>
                  <p className="text-xs font-sans text-slate-300">
                    Follow these 4 steps to ensure the organizers can view your presentation:
                  </p>
                </div>

                {/* 4 SPACIOUS STEP CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {sharingSteps.map((s) => (
                    <div
                      key={s.step}
                      className={`p-4 sm:p-5 rounded-2xl bg-[#091227]/70 border ${
                        s.highlight
                          ? "border-blue-400/60 bg-blue-950/30"
                          : "border-slate-800"
                      } flex flex-col justify-between space-y-3`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-mono text-xs font-extrabold px-2 py-0.5 rounded ${
                              s.highlight
                                ? "bg-blue-600 text-white"
                                : "bg-slate-800 text-blue-400"
                            }`}
                          >
                            STEP {s.step}
                          </span>
                          {s.highlight && (
                            <span className="text-[10px] font-mono text-blue-300 font-bold">
                              CRITICAL
                            </span>
                          )}
                        </div>

                        <h5 className="font-sans text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                          {s.title}
                        </h5>
                        <p className="text-xs font-sans text-slate-300 leading-relaxed">
                          {s.description}
                        </p>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-blue-300">
                        {s.action}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ==========================================
                  SECTION THREE: IMPORTANT INSTRUCTIONS & MOTIVATION
                 ========================================== */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
                {/* IMPORTANT INSTRUCTIONS */}
                <div className="lg:col-span-8 p-5 rounded-2xl bg-[#091227]/70 border border-amber-500/30 space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>IMPORTANT INSTRUCTIONS</span>
                  </div>
                  <ul className="text-xs text-slate-300 font-sans space-y-1.5 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span><strong>Maximum: 10 slides</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>Keep the presentation clear and concise.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>Use diagrams and visuals where necessary.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>Focus on innovation, feasibility, AI implementation, and real-world impact.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>The submitted idea should align with the AI for Healthcare theme.</span>
                    </li>
                  </ul>
                </div>

                {/* MOTIVATIONAL BANNER */}
                <div className="lg:col-span-4 p-5 rounded-2xl bg-[#091227]/70 border border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
                  <p className="font-serif italic text-base text-slate-100 leading-snug">
                    “Think boldly. Build intelligently. Create impact.”
                  </p>
                  <span className="font-mono text-xs font-bold text-blue-400 tracking-widest uppercase">
                    — YODHA 2.0
                  </span>
                </div>
              </div>

            </div>

            {/* MODAL FOOTER ACTION (ONLY DISMISS METHOD) */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 relative z-10">
              <span className="text-xs font-mono text-slate-400 text-center sm:text-left">
                Ready to submit? Paste your Google Drive link into the form.
              </span>

              <button
                type="button"
                onClick={handleContinueAction}
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
              >
                <span>GOT IT — CONTINUE</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
