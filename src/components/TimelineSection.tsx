"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, MousePointerClick } from "lucide-react";
import { TIMELINE_PHASES } from "../data/timelineData";
import type { PhaseItem } from "../data/timelineData";

interface TimelineSectionProps {
  onOpenRegister?: () => void;
}

export function TimelineSection({ onOpenRegister }: TimelineSectionProps) {
  const [continuousIndex, setContinuousIndex] = useState(0);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  const [hasEnteredView, setHasEnteredView] = useState<boolean>(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const childCount = TIMELINE_PHASES.length;
  const selectedIndex = ((continuousIndex % childCount) + childCount) % childCount;
  const selectedPhase = TIMELINE_PHASES[selectedIndex];

  // Trigger entrance animation on scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-selection every 5.5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setContinuousIndex((prev) => prev + 1);
    }, 5500);

    return () => clearInterval(intervalId);
  }, [lastInteractionTime]);

  const handleSelectPhase = (phase: PhaseItem, idx: number) => {
    let diff = idx - selectedIndex;
    if (diff > childCount / 2) diff -= childCount;
    if (diff < -childCount / 2) diff += childCount;
    
    setContinuousIndex((prev) => prev + diff);
    setLastInteractionTime(Date.now());
  };

  // Radial positioning metrics with generous clearance spacing
  const desktopRx = childCount > 6 ? 490 : 445;
  const desktopRy = childCount > 6 ? 320 : 280;

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="py-10 sm:py-14 relative overflow-hidden bg-transparent text-slate-950 select-none w-full z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center space-y-8">
        
        {/* EDITORIAL SECTION HEADER IN SDG LIGHT THEME */}
        <div className="text-center space-y-3 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center space-y-2 text-center"
          >
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-slate-950 tracking-tight uppercase">
              THE <span className="text-blue-600 font-extrabold">TIMELINE</span>
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-1 w-24 bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center max-w-2xl mx-auto pt-1"
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-300 text-blue-800 px-4 py-1.5 rounded-full text-xs font-mono font-bold shadow-sm">
              <span className="font-extrabold">{selectedPhase.phaseId}</span> • <span>Auto-playing phases</span>
            </div>
          </motion.div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* DESKTOP VIEW (≥ 1024px lg): RADIAL INTERACTIVE HUB IN SDG LIGHT THEME */}
        {/* ------------------------------------------------------------------ */}
        <div className="hidden lg:flex relative w-full h-[680px] items-center justify-center">

          {/* SVG CONNECTING LINES FROM HUB TO CARDS (BEHIND CENTER DISC) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {TIMELINE_PHASES.map((phase, idx) => {
              const angle = (2 * Math.PI * idx) / childCount - Math.PI / 2;
              const posX = Math.cos(angle) * desktopRx;
              const posY = Math.sin(angle) * desktopRy;

              const hubRadius = 185;
              const lineStartX = Math.cos(angle) * hubRadius;
              const lineStartY = Math.sin(angle) * hubRadius;

              const isHighlighted = selectedIndex === idx;

              return (
                <g key={`svg-line-${idx}`}>
                  <line
                    x1={`calc(50% + ${lineStartX}px)`}
                    y1={`calc(50% + ${lineStartY}px)`}
                    x2={`calc(50% + ${posX}px)`}
                    y2={`calc(50% + ${posY}px)`}
                    className={`transition-all duration-500 ${
                      isHighlighted
                        ? "stroke-blue-600 stroke-[3px] filter drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                        : "stroke-blue-400/50 stroke-[1.5px]"
                    }`}
                  />
                  <circle
                    cx={`calc(50% + ${posX}px)`}
                    cy={`calc(50% + ${posY}px)`}
                    r={isHighlighted ? "6" : "4"}
                    className={`transition-all duration-500 ${
                      isHighlighted ? "fill-blue-600 stroke-white stroke-2" : "fill-blue-500"
                    }`}
                  />
                </g>
              );
            })}
          </svg>

          {/* SURROUNDING CARDS (LOWER Z-INDEX z-10 THAN MAIN CENTER DISC) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
            {TIMELINE_PHASES.map((phase, idx) => {
              const angle = (2 * Math.PI * idx) / childCount - Math.PI / 2;
              const posX = Math.cos(angle) * desktopRx;
              const posY = Math.sin(angle) * desktopRy;
              const isSelected = selectedIndex === idx;

              return (
                <motion.div
                  key={`desktop-phase-${phase.id}`}
                  initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  animate={
                    hasEnteredView
                      ? { scale: isSelected ? 1.05 : 1, opacity: 1, x: posX, y: posY }
                      : { scale: 0, opacity: 0, x: 0, y: 0 }
                  }
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                  className="absolute pointer-events-auto z-10"
                >
                  <button
                    type="button"
                    onClick={() => handleSelectPhase(phase, idx)}
                    className={`w-72 rounded-3xl p-6 text-left transition-all duration-300 cursor-pointer backdrop-blur-2xl border ${
                      isSelected
                        ? "bg-blue-600 border-blue-500 shadow-[0_15px_40px_rgba(59,130,246,0.35)] text-white"
                        : "bg-white/90 border-blue-200/90 shadow-[0_10px_35px_rgba(59,130,246,0.1)] hover:bg-white hover:border-blue-400 hover:shadow-[0_20px_45px_rgba(59,130,246,0.2)] hover:scale-105"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-mono font-black uppercase tracking-widest ${isSelected ? "text-blue-200" : "text-blue-600"}`}>
                        {phase.phaseId}
                      </span>
                      {!isSelected && (
                        <motion.div
                          animate={{ opacity: [0.2, 1, 0.2], x: [0, 4, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                          className="flex items-center text-blue-600 font-mono text-[11px] font-bold"
                        >
                          <ChevronRight className="w-5 h-5 text-blue-600 stroke-[2.5]" />
                        </motion.div>
                      )}
                    </div>
                    <h4 className={`text-base font-bold font-heading leading-snug ${isSelected ? "text-white" : "text-slate-950"}`}>
                      {phase.title}
                    </h4>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* STATIONARY MAIN CENTER CIRCLE (HIGHER Z-INDEX z-40 + PURE GLASSMORPHISM WITHOUT SOLID BACKGROUND) */}
          <div className="relative z-40 flex items-center justify-center">
            <div className="w-[360px] h-[360px] rounded-full relative p-1.5 flex items-center justify-center">
              {/* Outer Glowing Blue Ring Accent */}
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/80 shadow-[0_0_45px_rgba(59,130,246,0.35)] pointer-events-none" />

              {/* Inner Pure Glass Center Disc (No solid bg fill, pure glassmorphism) */}
              <div className="w-full h-full rounded-full bg-slate-950/40 backdrop-blur-2xl border border-blue-400/50 shadow-[0_20px_60px_rgba(59,130,246,0.3)] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden text-white">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`phase-detail-${selectedPhase.id}`}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center max-w-[270px] space-y-2 relative z-10"
                  >
                    <span className="text-[10px] font-mono font-extrabold text-blue-400 tracking-[0.25em] uppercase drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">
                      {selectedPhase.phaseId}
                    </span>
                    
                    <h3 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight leading-tight drop-shadow-md">
                      {selectedPhase.title}
                    </h3>

                    <div className="w-12 h-[1px] bg-blue-400/60 my-2" />

                    <p className="text-sm text-slate-200 font-sans leading-relaxed font-normal max-w-[270px] drop-shadow-sm">
                      {selectedPhase.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------------ */}
        {/* MOBILE PRESENTATION MODE (< 1024px): RADIAL SMALL CIRCLES RING IN SDG LIGHT THEME */}
        {/* ------------------------------------------------------------------ */}
        <div className="flex lg:hidden flex-col items-center justify-center w-full min-h-[480px] relative py-4">
          
          <div className="relative w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] flex items-center justify-center">

            {/* MOBILE MAIN CENTER HUB DISC (HIGHER Z-INDEX z-40 + PURE GLASSMORPHISM WITHOUT SOLID BACKGROUND) */}
            <div className="w-[170px] h-[170px] sm:w-[200px] sm:h-[200px] rounded-full bg-slate-950/40 backdrop-blur-2xl border-4 border-blue-500/80 shadow-[0_12px_40px_rgba(59,130,246,0.3)] flex flex-col items-center justify-center p-4 text-center z-40 relative overflow-hidden text-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`mob-phase-summary-${selectedPhase.id}`}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center max-w-[140px] sm:max-w-[170px] space-y-1 relative z-10"
                >
                  <span className="text-[9px] sm:text-[10px] font-mono font-extrabold text-blue-400 tracking-wider uppercase text-center">
                    {selectedPhase.phaseId}
                  </span>

                  <h3 className="text-[11px] sm:text-sm font-black font-heading text-white leading-tight text-center line-clamp-2">
                    {selectedPhase.title}
                  </h3>

                  <div className="w-6 h-[1px] bg-blue-400/60 my-0.5" />

                  <p className="text-[8px] sm:text-[9px] text-slate-200 font-sans leading-tight font-normal text-center line-clamp-2">
                    {selectedPhase.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* SMALL ROTATING / POSITIONED SURROUNDING CIRCLES RING (LOWER Z-INDEX z-10 THAN MOBILE CENTER DISC z-40) */}
            <motion.div 
              className="absolute inset-0 pointer-events-none flex items-center justify-center z-10"
              animate={{ rotate: -continuousIndex * (360 / childCount) }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              {TIMELINE_PHASES.map((phase, idx) => {
                const mobAngle = (2 * Math.PI * idx) / childCount - Math.PI / 2;
                const mobRadius = childCount > 6 ? 145 : 140;
                const posX = Math.cos(mobAngle) * mobRadius;
                const posY = Math.sin(mobAngle) * mobRadius;
                const isSelected = selectedIndex === idx;

                return (
                  <motion.div
                    key={`mob-phase-circle-${phase.id}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: isSelected ? 1.15 : 1, opacity: 1, x: posX, y: posY }}
                    transition={{ duration: 0.45, delay: idx * 0.05 }}
                    className="absolute pointer-events-auto z-10"
                  >
                    <motion.div
                      animate={{ rotate: continuousIndex * (360 / childCount) }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectPhase(phase, idx)}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center transition-all duration-300 cursor-pointer backdrop-blur-xl border ${
                          isSelected
                            ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] ring-2 ring-blue-300"
                            : "bg-white/95 border-blue-500 text-blue-700 shadow-[0_6px_20px_rgba(59,130,246,0.25)] hover:border-blue-400"
                        }`}
                      >
                        <span className="font-mono text-[9px] sm:text-[10px] font-black uppercase leading-tight tracking-tight">
                          {phase.phaseId.replace("PHASE", "PH")}
                        </span>
                      </button>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>

          </div>

        </div>

        {/* Register Button Below the Journey */}
        <div className="mt-16 flex justify-center pb-12 relative z-20">
          <motion.button
            type="button"
            onClick={onOpenRegister}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="px-12 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-mono text-base font-black tracking-widest uppercase cursor-pointer"
          >
            REGISTER NOW
          </motion.button>
        </div>

      </div>
    </section>
  );
}

export default TimelineSection;
