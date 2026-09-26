"use client";
import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { YodhaTitleBanner } from "./YodhaTitleBanner";

interface ClosingCTAProps {
  onOpenRegister: () => void;
}

export function ClosingCTA({ onOpenRegister }: ClosingCTAProps) {
  return (
    <section id="cta" className="py-10 sm:py-14 relative overflow-hidden bg-transparent w-full text-white select-none z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          onClick={onOpenRegister}
          className="p-8 sm:p-14 rounded-3xl bg-slate-950/95 border-2 border-blue-500/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(59,130,246,0.25)] text-center relative overflow-hidden flex flex-col items-center cursor-pointer hover:border-blue-400 transition-all group"
        >
          {/* YODHA Helmet Logo Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 relative z-20"
          >
            <img src="/logo.webp" alt="YODHA Logo" className="h-16 sm:h-20 w-auto object-contain drop-shadow-[0_0_25px_rgba(59,130,246,0.7)]" />
          </motion.div>

          {/* Official Animated Y-O-D-H-A Title Banner */}
          <div className="my-3 relative z-20">
            <YodhaTitleBanner align="center" size="sm" />
          </div>

          <span className="px-4 py-1.5 bg-blue-950/80 border border-blue-500/40 rounded-full text-xs font-mono text-blue-300 font-bold uppercase tracking-widest mb-3 inline-flex items-center gap-2 shadow-md relative z-20">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>JOIN THE MOVEMENT</span>
          </span>

          <p className="mt-3 text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed relative z-20">
            Together, let's build AI solutions that save lives & protect our planet. Innovate. Impact. Be a Warrior of AI.
          </p>

          <button
            onClick={() => onOpenRegister()}
            className="mt-8 px-10 py-4 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-600 text-white font-mono font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:brightness-115 hover:scale-105 transition-all cursor-pointer relative z-30 pointer-events-auto"
          >
            <span>REGISTER TODAY</span>
            <ArrowRight className="w-5 h-5 text-white" />
          </button>

          <span className="text-xs font-mono text-slate-400 mt-6 relative z-20">
            <a href="https://www.jecc.ac.in/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 underline">Jyothi Engineering College (Autonomous)</a>, Cheruthuruthy • <a href="mailto:yodha@jecc.ac.in" className="text-blue-400 underline hover:text-blue-300">yodha@jecc.ac.in</a> • <a href="https://aidajecc.in/" target="_blank" rel="noopener noreferrer" className="text-white underline font-bold">aidajecc.in</a>
          </span>

        </div>
      </div>
    </section>
  );
}

export default ClosingCTA;
