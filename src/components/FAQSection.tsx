"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "01",
    question: "What is YODHA?",
    answer:
      "YODHA – Warriors of AI is a national-level 48-hour AI hackathon organized by the Department of Artificial Intelligence and Data Science at Jyothi Engineering College. Participants will build AI-driven solutions for real-world healthcare challenges.",
  },
  {
    id: "02",
    question: "What is the theme of the hackathon?",
    answer:
      "The theme of YODHA is Healthcare. Teams will work on guided problem statements focused on using AI and Data Science to address challenges such as disease prediction, early diagnosis, patient monitoring, and medical data management.",
  },
  {
    id: "03",
    question: "Who can participate?",
    answer:
      "The hackathon is open to college students from across India with knowledge in areas such as AI, Data Science, Python, Machine Learning, and Web Development.",
  },
  {
    id: "04",
    question: "How many members can be in a team?",
    answer:
      "Teams must consist of 2 to 4 members. Solo participation is not allowed. All shortlisted teams will be selected for the 48-hour offline hackathon.",
  },
  {
    id: "05",
    question: "When and where will YODHA take place?",
    answer:
      "YODHA will be conducted from 1 October to 3 October 2026, running continuously for 48 hours. The event will be held offline at the College Auditorium, Jyothi Engineering College, Cheruthuruthy.",
  },
  {
    id: "06",
    question: "What is the registration fee?",
    answer:
      "The registration fee is ₹700 per team. Teams must complete the online registration and submit their idea for the selection process.",
  },
  {
    id: "07",
    question: "How are teams selected?",
    answer:
      "Teams first register online and submit a brief idea based on the given problem statements. The submitted ideas are evaluated by the expert panel, and shortlisted teams are invited for the 48-hour offline hackathon.",
  },
  {
    id: "08",
    question: "What should teams build during the hackathon?",
    answer:
      "Selected teams will receive real-world healthcare problem statements from industry partners and work continuously to develop a functional prototype. Teams are expected to demonstrate their solution and explain how it addresses the given problem.",
  },
  {
    id: "09",
    question: "How will projects be evaluated?",
    answer:
      "Projects are evaluated through mid-hackathon checkpoints and final judging. Evaluation considers factors such as problem understanding, AI strategy, technical implementation, innovation, usability, scalability, real-world impact, presentation, and live demonstration.",
  },
  {
    id: "10",
    question: "What facilities are provided to participants?",
    answer:
      "Participants will receive free food and refreshments, overnight accommodation, Wi-Fi, technical support, and basic event infrastructure during the hackathon.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="relative w-full py-10 sm:py-14 px-4 sm:px-6 lg:px-12 z-20 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative">
        {/* DESKTOP EDITORIAL SIDEBARS (VISIBLE ON LG SCREENS ONLY) */}
        
        {/* LEFT COLUMN: EDITORIAL "STILL CURIOUS?" BLOCK (DESKTOP) */}
        <div className="hidden lg:flex absolute left-0 top-36 flex-col justify-start h-[520px] w-64 pr-6 text-left">
          <div className="space-y-5">
            <h3 className="font-serif text-4xl xl:text-5xl font-light text-slate-100 leading-tight tracking-tight">
              Still
              <br />
              Curious?
            </h3>
            <div className="w-8 h-[1px] bg-slate-700/60" />
            <p className="text-[10px] font-mono tracking-[0.22em] leading-relaxed text-slate-400 uppercase max-w-[210px]">
              GET THE DETAILS
              <br />
              YOU NEED AND BE
              <br />
              A PART OF SOMETHING
              <br />
              BIGGER.
            </p>
          </div>
        </div>

        {/* MAIN CONTAINER: CENTER CONTENT & ACCORDION */}
        <div className="w-full max-w-2xl lg:max-w-3xl mx-auto flex flex-col items-center">
          
          {/* HEADER AREA */}
          <div className="text-center mb-8 sm:mb-12 space-y-2.5 w-full">
            
            {/* SUBTITLE TRACKING LABEL */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 sm:w-12 h-[1px] bg-slate-700/60" />
              <span className="text-xs font-mono font-medium tracking-[0.35em] text-slate-400 uppercase">
                QUESTIONS?
              </span>
              <div className="w-8 sm:w-12 h-[1px] bg-slate-700/60" />
            </div>

            {/* MAIN CINEMATIC SERIF FAQ TITLE */}
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center space-y-2 text-center"
            >
              <h2 className="font-serif text-6xl sm:text-8xl lg:text-9xl font-normal tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 py-1 drop-shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
                FAQ
              </h2>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-1 w-24 bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]"
              />
            </motion.div>

            {/* FIND YOUR ANSWERS HERE */}
            <p className="text-[11px] sm:text-xs font-mono tracking-[0.35em] text-slate-400 uppercase">
              FIND YOUR ANSWERS HERE
            </p>

            {/* MOBILE / TABLET INTRO BLOCK ("Still Curious?" placed under FAQ Header on Mobile) */}
            <div className="block lg:hidden pt-8 pb-3 text-center space-y-3">
              <h3 className="font-serif text-3xl sm:text-4xl font-light text-slate-100">
                Still Curious?
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed max-w-sm mx-auto px-4">
                Get the details you need and be a part of something bigger.
              </p>
            </div>
          </div>

          {/* FAQ ACCORDION LIST */}
          <div className="w-full space-y-3.5 sm:space-y-4">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  className="w-full"
                >
                  <div
                    className={`w-full rounded-2xl transition-all duration-300 backdrop-blur-xl border ${
                      isOpen
                        ? "bg-[#0b162c]/65 border-sky-500/40 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)]"
                        : "bg-[#070e1c]/45 hover:bg-[#091224]/60 border-slate-700/40 hover:border-slate-500/50 shadow-[0_6px_24px_rgba(0,0,0,0.3)]"
                    }`}
                  >
                    {/* INTERACTIVE BUTTON HEADER */}
                    <button
                      type="button"
                      onClick={() => toggleFAQ(index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${item.id}`}
                      id={`faq-header-${item.id}`}
                      className="w-full min-h-[56px] sm:min-h-[64px] px-4 sm:px-6 py-4 flex items-center justify-between text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 rounded-2xl"
                    >
                      <div className="flex items-center gap-3.5 sm:gap-5 flex-1 pr-3 min-w-0">
                        {/* ITEM NUMBER */}
                        <span className="font-serif text-base sm:text-lg text-slate-300/80 font-normal tracking-wide shrink-0">
                          {item.id}
                        </span>

                        {/* THIN VERTICAL DIVIDER */}
                        <div className="w-[1px] h-4 bg-slate-700/70 shrink-0" />

                        {/* QUESTION TEXT */}
                        <span className="text-xs sm:text-sm lg:text-base font-normal text-slate-100 group-hover:text-white transition-colors leading-snug break-words">
                          {item.question}
                        </span>
                      </div>

                      {/* PLUS / ROTATING CLOSE BUTTON */}
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isOpen
                            ? "border-slate-300 text-white bg-slate-800/70 rotate-45 shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                            : "border-slate-600/70 text-slate-400 group-hover:border-slate-400 group-hover:text-slate-200 group-hover:scale-105"
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.75]" />
                      </div>
                    </button>

                    {/* EXPANDABLE ANSWER BODY */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-answer-${item.id}`}
                          role="region"
                          aria-labelledby={`faq-header-${item.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.35,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 sm:px-6 pt-2 pb-5 pl-11 sm:pl-16 text-xs sm:text-sm text-slate-300/90 leading-relaxed font-sans border-t border-slate-800/50 mt-1 break-words">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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

export default FAQSection;
