"use client";
import { motion } from "framer-motion";
import {
  Users,
  CreditCard,
  MapPin,
  Code2,
  Leaf,
  Link2,
  FileText,
  BarChart3,
  Calendar,
  ShieldCheck,
} from "lucide-react";

interface GuidelineItem {
  id: string;
  icon: typeof Users;
  text: string;
}

const GUIDELINES: GuidelineItem[] = [
  {
    id: "01",
    icon: Users,
    text: "Each team must consist of 4 members from any college across India.",
  },
  {
    id: "02",
    icon: CreditCard,
    text: "A registration fee of ₹700 per team is mandatory to confirm participation.",
  },
  {
    id: "03",
    icon: MapPin,
    text: "Selected teams must attend the 48-hour offline hackathon at Jyothi Engineering College, Cheruthuruthy.",
  },
  {
    id: "04",
    icon: Code2,
    text: "Participants should have basic knowledge of Python, Machine Learning, and Web Development.",
  },
  {
    id: "05",
    icon: Leaf,
    text: "All ideas must align with the theme — Healthcare.",
  },
  {
    id: "06",
    icon: Link2,
    text: "Use of open-source libraries, APIs, and frameworks is allowed with proper credit.",
  },
  {
    id: "07",
    icon: FileText,
    text: "Projects must be original and developed entirely during the hackathon period.",
  },
  {
    id: "08",
    icon: BarChart3,
    text: "Teams will be evaluated on innovation, execution, and real-world impact.",
  },
  {
    id: "09",
    icon: Calendar,
    text: "Participants must adhere to the event schedule and submit projects before the deadline.",
  },
  {
    id: "10",
    icon: ShieldCheck,
    text: "Any form of plagiarism, misconduct, or violation of rules will lead to disqualification.",
  },
];

export function GuidelinesSection() {
  return (
    <section
      id="guidelines"
      className="relative w-full py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-12 z-20 select-none overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative">
        {/* MAIN CONTAINER */}
        <div className="w-full flex flex-col items-center">
          {/* HEADER AREA */}
          <div className="text-center mb-10 sm:mb-14 space-y-2.5 w-full">
            {/* SUBTITLE TRACKING LABEL */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 sm:w-12 h-[1px] bg-slate-700/60" />
              <span className="text-xs font-mono font-medium tracking-[0.35em] text-slate-400 uppercase">
                GUIDELINES
              </span>
              <div className="w-8 sm:w-12 h-[1px] bg-slate-700/60" />
            </div>

            {/* MAIN CINEMATIC SERIF GUIDELINES TITLE */}
            <motion.h2
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 py-1 drop-shadow-[0_4px_25px_rgba(0,0,0,0.5)]"
            >
              GUIDELINES
            </motion.h2>

            {/* A FEW THINGS TO KEEP IN MIND */}
            <p className="text-[11px] sm:text-xs font-mono tracking-[0.35em] text-slate-400 uppercase">
              A FEW THINGS TO KEEP IN MIND
            </p>
          </div>

          {/* 10 GUIDELINE CARDS (2-COLUMN GRID ON DESKTOP/TABLET, 1-COLUMN ON MOBILE) */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {GUIDELINES.map((item, index) => {
              const IconComponent = item.icon;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  className="w-full"
                >
                  <div className="w-full h-full p-4 sm:p-5 rounded-2xl transition-all duration-300 backdrop-blur-xl bg-[#070e1c]/45 hover:bg-[#091224]/60 border border-slate-700/40 hover:border-slate-500/50 shadow-[0_6px_24px_rgba(0,0,0,0.3)] hover:-translate-y-1 group flex items-center gap-3.5 sm:gap-4">
                    {/* MONOCHROME LINE ICON */}
                    <IconComponent className="w-5 h-5 text-slate-300/90 group-hover:text-white transition-colors shrink-0 stroke-[1.75] self-center" />

                    {/* TEXT CONTENT */}
                    <p className="text-xs sm:text-sm font-normal text-slate-200 group-hover:text-white transition-colors leading-relaxed font-sans flex-1 self-center">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default GuidelinesSection;
