"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  Calendar,
  Trophy,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  Zap,
  Brain,
  Leaf,
  Clock,
  Users,
  MapPin,
  RefreshCw,
  Award,
  Layers
} from "lucide-react";
import logo from "../assets/logo.webp";

interface HeroCommandCenterProps {
  onOpenRegister: (trackName?: string) => void;
}

// Official Hackathon Problem Statements Matrix
const PROJECT_IDEAS = {
  healthcare: [
    {
      title: "1. Silent Health Guardian",
      problem: "Remote clinical assessment lacks continuous vital monitoring and early warning detection for preventive care.",
      solution: "Continuous AI-powered vital monitoring, early warning detection, and personalized health alerts for preventive care.",
      techStack: ["PyTorch", "OpenCV", "WebSockets", "FastAPI"],
      impact: "Early disease prediction & preventive triage",
    },
    {
      title: "2. SafeDose Medication Companion",
      problem: "Medication errors and unmonitored drug interactions endanger millions of patients annually.",
      solution: "Smart medication reminders, harmful drug interaction detection, and adherence tracking to reduce medication errors.",
      techStack: ["MobileNet", "OCR", "Node.js", "React Native"],
      impact: "Safe, error-free medication dispensing",
    },
    {
      title: "3. MindMirror Wellness Network",
      problem: "Lack of early detection tools for workplace/student stress, anxiety, and depression.",
      solution: "AI-based stress and emotional well-being analysis, early anxiety/depression detection, and personalized wellness support.",
      techStack: ["Whisper AI", "LLaMA 3", "Python", "FastAPI"],
      impact: "Proactive mental health wellness support",
    },
    {
      title: "4. LifeFlow Hospital Optimization",
      problem: "Hospital overcrowding, ICU bed shortages, and delayed emergency staff allocation.",
      solution: "Predict patient inflow, optimize ICU beds and staff allocation, and enhance emergency response efficiency.",
      techStack: ["Time-Series ML", "Prophet", "React", "Chart.js"],
      impact: "Maximized clinical efficiency & bed management",
    },
  ],
  environmental: [
    {
      title: "1. WasteSmart Automated Recycler",
      problem: "Manual sorting of municipal & industrial waste is hazardous, slow, and inefficient.",
      solution: "AI-based smart waste segregation using computer vision to improve recycling efficiency and reduce landfill pollution.",
      techStack: ["YOLOv9", "OpenCV", "Roboflow", "TypeScript"],
      impact: "Accelerates waste circular economy",
    },
    {
      title: "2. AgriSense Crop Health Diagnostics",
      problem: "Unidentified crop diseases and nutrient deficiencies devastate agricultural yields.",
      solution: "Detect crop diseases from leaf images, identify nutrient deficiencies, and provide treatment recommendations to farmers.",
      techStack: ["TensorFlow Lite", "PyTorch", "FastAPI", "React Native"],
      impact: "Protects crop yields & empowers farmers",
    },
    {
      title: "3. AquaPure River Basin Sentinel",
      problem: "Industrial discharge and chemical runoffs contaminate river basins and drinking water sources.",
      solution: "Real-time water quality monitoring, contaminant detection, and instant alerts to support clean water management.",
      techStack: ["IoT Sensors", "Scikit-Learn", "Grafana", "FastAPI"],
      impact: "Protects community water reservoirs",
    },
    {
      title: "4. AirGuard Urban Air Quality",
      problem: "Urban air pollution hotspots lack predictive forecasting and localized health advisory alerts.",
      solution: "AI-based air pollution forecasting, hotspot identification, and health alerts for smarter urban planning.",
      techStack: ["Prophet ML", "GeoTIFF", "Python", "React"],
      impact: "Smarter urban air quality management",
    },
  ],
};

const TIMELINE_HIGHLIGHTS = [
  {
    day: "PHASE 1",
    time: "STEP 01",
    title: "Online Registration",
    desc: "Submit team details and primary area of interest (Healthcare / Environment AI).",
    status: "upcoming",
  },
  {
    day: "PHASE 2",
    time: "STEP 02",
    title: "Problem Statement Release & Proposal",
    desc: "Official problem statements released; teams submit their innovation proposals.",
    status: "key",
  },
  {
    day: "PHASE 3",
    time: "STEP 03",
    title: "Shortlisting Teams",
    desc: "Expert faculty & mentor panel reviews proposals and shortlists teams.",
    status: "normal",
  },
  {
    day: "PHASE 4",
    time: "48 HOURS",
    title: "Offline 48-Hour Coding Marathon",
    desc: "Non-stop 48-hour prototype building at Jyothi Engineering College Auditorium.",
    status: "key",
  },
  {
    day: "PHASE 5",
    time: "STEP 05",
    title: "Final Judging & Prize Ceremony",
    desc: "Live prototype demonstration to jury panel followed by grand prize distribution.",
    status: "winner",
  },
];

export function HeroCommandCenter({ onOpenRegister }: HeroCommandCenterProps) {
  const [activeTab, setActiveTab] = useState<"generator" | "timeline" | "prizes" | "specs">("generator");
  const [selectedTrack, setSelectedTrack] = useState<"healthcare" | "environmental">("healthcare");
  const [ideaIndex, setIdeaIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const currentIdea = PROJECT_IDEAS[selectedTrack][ideaIndex];

  const handleNextIdea = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIdeaIndex((prev) => (prev + 1) % PROJECT_IDEAS[selectedTrack].length);
      setIsSpinning(false);
    }, 200);
  };

  const handleCopyIdea = () => {
    const textToCopy = `YODHA 2.0 Project Idea: ${currentIdea.title}\nProblem: ${currentIdea.problem}\nSolution: ${currentIdea.solution}\nTech Stack: ${currentIdea.techStack.join(", ")}`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl bg-slate-950/85 border border-slate-800 backdrop-blur-2xl shadow-2xl overflow-hidden relative group transition-all duration-300 hover:border-slate-700">
      {/* Background Accent Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation Strip */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-sky-500/20 border border-blue-500/30 flex items-center justify-center p-1 shadow-inner">
              <img src={(logo as any)?.src || logo} alt="YODHA Logo" className="w-7 h-7 object-contain" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-white tracking-wider uppercase">
                YODHA 2.0 HUB
              </span>
              <span className="text-[9px] font-mono font-bold text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded-full uppercase">
                Interactive
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">48H National AI Hackathon</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => setActiveTab("generator")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "generator"
                ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Ideas</span>
          </button>

          <button
            onClick={() => setActiveTab("timeline")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "timeline"
                ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab("prizes")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "prizes"
                ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Prizes</span>
          </button>

          <button
            onClick={() => setActiveTab("specs")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "specs"
                ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Specs</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content Body */}
      <div className="p-5 sm:p-6 min-h-[360px] sm:min-h-[380px] flex flex-col justify-between relative z-10">
        <AnimatePresence mode="wait">
          {/* TAB 1: AI IDEA GENERATOR */}
          {activeTab === "generator" && (
            <motion.div
              key="generator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col justify-between h-full space-y-4"
            >
              {/* Track Switcher Bar */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  AI Challenge Generator
                </span>

                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
                  <button
                    onClick={() => {
                      setSelectedTrack("healthcare");
                      setIdeaIndex(0);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all flex items-center gap-1 ${
                      selectedTrack === "healthcare"
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Brain className="w-3 h-3 text-blue-400" />
                    Healthcare
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTrack("environmental");
                      setIdeaIndex(0);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all flex items-center gap-1 ${
                      selectedTrack === "environmental"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Leaf className="w-3 h-3 text-emerald-400" />
                    Environment
                  </button>
                </div>
              </div>

              {/* Dynamic Project Concept Card */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 relative overflow-hidden space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest block mb-1">
                      {selectedTrack === "healthcare" ? "Healthcare AI Track" : "Environmental AI Track"} • Concept #{ideaIndex + 1}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                      {currentIdea.title}
                    </h3>
                  </div>

                  <button
                    onClick={handleNextIdea}
                    title="Generate another idea"
                    className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all shrink-0 active:scale-95"
                  >
                    <RefreshCw className={`w-4 h-4 text-sky-400 ${isSpinning ? "animate-spin" : ""}`} />
                  </button>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-slate-400 uppercase block mb-0.5">Problem Context:</span>
                    <p className="text-slate-300 font-normal leading-relaxed">{currentIdea.problem}</p>
                  </div>

                  <div>
                    <span className="font-mono text-[11px] font-bold text-slate-400 uppercase block mb-0.5">Proposed AI Solution:</span>
                    <p className="text-sky-200 font-medium leading-relaxed">{currentIdea.solution}</p>
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div className="pt-2 flex flex-wrap items-center gap-1.5">
                  {currentIdea.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono font-bold text-slate-300 bg-slate-800/80 border border-slate-700/80 px-2.5 py-0.5 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action Strip */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleNextIdea}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-slate-800 hover:border-slate-600 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isSpinning ? "animate-spin" : ""}`} />
                  <span>Shuffle Idea</span>
                </button>

                <button
                  onClick={handleCopyIdea}
                  className="py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-all"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{isCopied ? "Copied!" : "Copy"}</span>
                </button>

                <button
                  onClick={() => onOpenRegister(selectedTrack === "healthcare" ? "Healthcare AI" : "Environmental Sustainability")}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg hover:brightness-110 transition-all"
                >
                  <span>Build This</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB 2: SCHEDULE & TIMELINE */}
          {activeTab === "timeline" && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  24-Hour Hackathon Schedule Highlights
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Sep 11-12, 2026
                </span>
              </div>

              <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1 custom-scrollbar">
                {TIMELINE_HIGHLIGHTS.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      item.status === "winner"
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-200"
                        : item.status === "key"
                        ? "bg-blue-500/10 border-blue-500/40 text-blue-200"
                        : "bg-slate-900/80 border-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950 border border-white/10 text-slate-300">
                          {item.time}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{item.day}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 font-normal">{item.desc}</p>
                    </div>

                    {item.status === "winner" ? (
                      <Award className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
                    ) : item.status === "key" ? (
                      <Zap className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0 mt-1" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: PRIZES & REWARDS */}
          {activeTab === "prizes" && (
            <motion.div
              key="prizes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  ₹75K Worth Prizes & Trophies
                </span>
                <span className="text-[10px] font-mono font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Cash Rewards
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-950/60 to-slate-900 border border-blue-500/30 relative overflow-hidden">
                  <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest block mb-1">
                    1st Prize Winner
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono">₹30,000</div>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">Winner Trophy + Cash Bounty</p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-950/60 to-slate-900 border border-emerald-500/30 relative overflow-hidden">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                    2nd Prize Winner
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono">₹20,000</div>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">Runner-Up Trophy + Cash Bounty</p>
                </div>
              </div>

              {/* Special Category Badges */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Additional Recognition & Benefits:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Best All-Girls Team Award</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Free Food & Energy Drinks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Verified E-Certificates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Mentorship & Jury Network</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: QUICK SPECS & ELIGIBILITY */}
          {activeTab === "specs" && (
            <motion.div
              key="specs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-sky-400" />
                  Key Hackathon Specifications
                </span>
                <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded-full">
                  All Undergrads Welcome
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                    <span>TEAM FORMAT</span>
                  </div>
                  <p className="font-bold text-white text-sm">2 - 4 Members</p>
                  <p className="text-[10px] text-slate-400">Inter-disciplinary teams allowed</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>LOCATION</span>
                  </div>
                  <p className="font-bold text-white text-xs sm:text-sm">JEC Auditorium</p>
                  <p className="text-[10px] text-slate-400">Jyothi Engineering College, Thrissur</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>DURATION</span>
                  </div>
                  <p className="font-bold text-white text-xs sm:text-sm">48 Hours Non-stop</p>
                  <p className="text-[10px] text-slate-400">Offline coding marathon</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ENTRY FEE</span>
                  </div>
                  <p className="font-bold text-emerald-400 text-xs sm:text-sm">100% Free</p>
                  <p className="text-[10px] text-slate-400">No hidden registration fees</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onOpenRegister()}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all"
                >
                  <span>REGISTER YOUR TEAM NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Status Dock */}
      <div className="px-5 py-2.5 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Registrations Open • yodha.aidajecc.in</span>
        </div>
        <span>Jyothi Engineering College (Autonomous)</span>
      </div>
    </div>
  );
}
