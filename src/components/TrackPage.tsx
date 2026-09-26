"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, ArrowRight, ChevronUp, CheckCircle2, Lock } from "lucide-react";
import { YodhaImage } from "./YodhaImage";
import {
  HEALTHCARE_PROBLEM_STATEMENTS,
  getPSImage,
} from "../data/problemStatements";
import type { ProblemStatement } from "../data/problemStatements";

interface TrackPageProps {
  trackType: "healthcare";
  onBack: () => void;
  onOpenRegisterWithTrack: (trackName: string) => void;
}

export function TrackPage({ onBack, onOpenRegisterWithTrack }: TrackPageProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const statements: ProblemStatement[] = HEALTHCARE_PROBLEM_STATEMENTS;

  const filteredStatements = statements.filter((st) => {
    return (
      st.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.cardDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-transparent text-white py-6 sm:py-10 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden select-text">
      
      {/* OUR NIGHT HILLS THEME BACKGROUND IMAGE LAYER */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <img
          src="/bg-hills-night-pc.webp"
          alt="Yodha Night Hills Background"
          className="w-full h-full object-cover object-center opacity-75"
        />
        <div className="absolute inset-0 bg-slate-950/55 pointer-events-none" />
      </div>

      {/* Background Aura Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-blue-600/15 blur-[200px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* TOP HEADER ROW: BACK BUTTON */}
        <div className="flex items-center justify-between mb-6 sm:mb-10 pt-2">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#081122]/80 border border-blue-500/35 text-slate-200 hover:text-white font-mono text-xs font-medium uppercase tracking-wider cursor-pointer hover:border-blue-400 transition-all shadow-lg backdrop-blur-xl select-none"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
            <span>BACK TO HOME</span>
          </button>
        </div>

        {/* SECTION HEADER AREA */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-14 space-y-3">
          {/* TRACKING SUBTITLE LABEL */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 sm:w-16 h-[1px] bg-slate-700/60" />
            <span className="text-[10px] sm:text-xs font-mono font-medium tracking-[0.35em] text-slate-400 uppercase">
              REAL CHALLENGES. BRIGHTER TOMORROW
            </span>
            <div className="w-8 sm:w-16 h-[1px] bg-slate-700/60" />
          </div>

          {/* MAIN CINEMATIC TITLE */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white py-1 drop-shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
            Healthcare AI <span className="text-blue-400">Problem Statements</span>
          </h1>

          {/* SUPPORTING DESCRIPTION */}
          <p className="text-xs sm:text-sm text-slate-300 font-normal max-w-xl mx-auto leading-relaxed">
            Explore real-world healthcare challenges and build AI solutions for a better, healthier tomorrow.
          </p>
        </div>

        {/* SEARCH BAR (NO DIFFICULTY FILTERS) */}
        <div className="max-w-7xl mx-auto mb-10">
          <div className="relative w-full bg-[#070e1c]/80 border border-blue-500/35 rounded-2xl px-4 py-3 backdrop-blur-xl focus-within:border-blue-400/80 transition-all shadow-lg">
            <div className="flex items-center">
              <Search className="w-4 h-4 text-blue-400 mr-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problem statements..."
                className="w-full bg-transparent text-xs sm:text-sm font-sans text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* PROBLEM STATEMENTS GRID (INLINE EXTENDING CARDS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 items-start">
          {filteredStatements.map((st) => {
            const psImage = getPSImage(st);
            const subCategory = st.tags[0] || st.category;
            const isExpanded = expandedId === st.id;

            return (
              <motion.div
                key={st.id}
                layout
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={`rounded-3xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between select-text ${
                  isExpanded
                    ? "col-span-1 md:col-span-2 lg:col-span-3 bg-transparent border-2 border-blue-400/80 p-6 sm:p-8 backdrop-blur-sm shadow-[0_0_50px_rgba(59,130,246,0.25)]"
                    : "col-span-1 bg-transparent border border-blue-500/35 hover:border-blue-400/80 backdrop-blur-sm p-4 sm:p-5"
                }`}
              >
                {!isExpanded ? (
                  /* COLLAPSED CARD VIEW */
                  <div>
                    {/* Image Banner */}
                    <div
                      onClick={() => toggleExpand(st.id)}
                      className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-3 bg-black border border-blue-500/20 shadow-md cursor-pointer group/img"
                    >
                      <YodhaImage
                        src={psImage}
                        alt={st.title}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
                    </div>

                    {/* Metadata Row: ID | SubCategory */}
                    <div className="text-xs font-mono mb-2 px-0.5 text-slate-400 font-medium tracking-wider text-[11px]">
                      ID #{st.id.toString().padStart(2, "0")} &nbsp;|&nbsp; {subCategory}
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => toggleExpand(st.id)}
                      className="text-lg sm:text-xl font-serif font-normal text-white mb-2 leading-snug hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      {st.title}
                    </h3>

                    {/* Card Description */}
                    <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-normal mb-4 line-clamp-3">
                      {st.cardDescription}
                    </p>

                    {/* View Challenge Link */}
                    <button
                      onClick={() => toggleExpand(st.id)}
                      className="text-blue-400 font-mono text-xs font-bold tracking-wider hover:text-blue-300 flex items-center gap-1.5 transition-colors cursor-pointer pt-1 self-start group/btn"
                    >
                      <span>View Challenge</span>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ) : (
                  /* EXPANDED INLINE CARD VIEW (HORIZONTALLY EXTENDED ON PC, VERTICALLY ON MOBILE) */
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.25 }}
                      className="w-full space-y-6 select-text"
                    >
                      {/* Top Header Controls: ID Label + Icon-Only Collapse Button */}
                      <div className="flex items-center justify-between border-b border-blue-500/25 pb-3">
                        <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-950/80 text-blue-300 border border-blue-500/40 select-text">
                          ID #{st.id.toString().padStart(2, "0")} &nbsp;|&nbsp; {subCategory}
                        </span>

                        <button
                          onClick={() => toggleExpand(st.id)}
                          className="p-1.5 sm:p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 hover:text-white transition-colors cursor-pointer select-none"
                          aria-label="Collapse"
                          title="Collapse"
                        >
                          <ChevronUp className="w-5 h-5 text-blue-300" />
                        </button>
                      </div>

                      {/* Main Grid Body: PC (Left: Image + Key Objectives, Right: Title + Context + Challenge + Register Now) */}
                      {/* Mobile Order: Image -> Title -> Context -> Challenge -> Key Objectives -> Register Now */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
                        {/* Left Column: Image Banner + Key Objectives (PC View Only under Image) */}
                        <div className="lg:col-span-5 space-y-5">
                          <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-blue-500/30 shadow-2xl bg-black">
                            <YodhaImage
                              src={psImage}
                              alt={st.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                          </div>

                          {/* Key Objectives directly under image (VISIBLE ON DESKTOP LG VIEWS ONLY) */}
                          <div className="hidden lg:block space-y-3 pt-1">
                            <h4 className="text-xs sm:text-sm font-mono text-emerald-400 uppercase tracking-widest font-bold flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              <span>KEY OBJECTIVES</span>
                            </h4>
                            <ul className="space-y-2.5">
                              {st.readMore.objectives.map((obj, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-200 leading-snug">
                                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{obj}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Right Column: Title, Context, Challenge, Key Objectives (Mobile View Only at last) & REGISTER NOW -> Button */}
                        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                          {/* Title */}
                          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-white leading-tight">
                            {st.title}
                          </h2>

                          {/* Background Context */}
                          <div className="space-y-1.5">
                            <h4 className="text-xs sm:text-sm font-mono text-blue-400 uppercase tracking-widest font-bold">
                              BACKGROUND CONTEXT
                            </h4>
                            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                              {st.readMore.background}
                            </p>
                          </div>

                          {/* The Challenge */}
                          <div className="space-y-1.5">
                            <h4 className="text-xs sm:text-sm font-mono text-blue-300 uppercase tracking-widest font-bold">
                              THE CHALLENGE
                            </h4>
                            <p className="text-sm sm:text-base text-slate-100 font-normal leading-relaxed">
                              {st.readMore.challenge}
                            </p>
                          </div>

                          {/* Key Objectives (VISIBLE ON MOBILE VIEWS AT THE LAST BEFORE BUTTON) */}
                          <div className="block lg:hidden space-y-3 pt-2">
                            <h4 className="text-xs sm:text-sm font-mono text-emerald-400 uppercase tracking-widest font-bold flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              <span>KEY OBJECTIVES</span>
                            </h4>
                            <ul className="space-y-2.5">
                              {st.readMore.objectives.map((obj, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-200 leading-snug">
                                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{obj}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* REGISTRATION CLOSED Status */}
                          <div className="pt-4">
                            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs font-bold uppercase tracking-widest shadow-md select-none">
                              <Lock className="w-4 h-4 text-red-400" />
                              <span>REGISTRATION CLOSED</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TrackPage;
