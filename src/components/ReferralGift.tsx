"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Info } from "lucide-react";

function useTypewriter(text: string, speed = 30, delay = 0) {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    setDisplayedText("");
    const timer = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, speed, delay]);
  return displayedText;
}

function TypewriterText({ text, speed = 30, delay = 0, className = "" }: { text: string; speed?: number; delay?: number; className?: string }) {
  const displayed = useTypewriter(text, speed, delay);
  return <span className={className}>{displayed}</span>;
}

function TypewriterList({ items, speed = 20, delay = 0 }: { items: string[]; speed?: number; delay?: number }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedItems, setDisplayedItems] = useState<string[]>([]);
  
  useEffect(() => {
    if (currentIndex >= items.length) return;
    
    let timer: NodeJS.Timeout;
    
    if (currentIndex === 0 && !isTyping) {
      timer = setTimeout(() => {
        setIsTyping(true);
      }, delay);
      return () => clearTimeout(timer);
    }
    
    if (isTyping) {
      const currentText = items[currentIndex];
      let charIndex = 0;
      
      timer = setInterval(() => {
        const partial = currentText.slice(0, charIndex + 1);
        setDisplayedItems(prev => {
          const newArr = [...prev];
          newArr[currentIndex] = partial;
          return newArr;
        });
        charIndex++;
        
        if (charIndex >= currentText.length) {
          clearInterval(timer);
          setCurrentIndex(prev => prev + 1);
        }
      }, speed);
    }
    
    return () => clearInterval(timer);
  }, [currentIndex, isTyping, items, speed, delay]);

  return (
    <ol className="list-decimal pl-5 space-y-4 font-medium text-slate-800">
      {items.map((item, i) => (
        i <= currentIndex ? (
          <li key={i}>{displayedItems[i] || ""}</li>
        ) : null
      ))}
    </ol>
  );
}

export function ReferralGift({ onOpenRegister }: { onOpenRegister?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll visibility logic
  useEffect(() => {
    const handleScroll = () => {
      const aboutSec = document.getElementById("about");
      const tracksSec = document.getElementById("tracks");
      
      if (aboutSec && tracksSec) {
        // threshold to show gift when scrolling into about section
        const aboutTop = aboutSec.offsetTop - (window.innerHeight * 0.7);
        // threshold to hide gift after tracks section
        const tracksBottom = tracksSec.offsetTop + tracksSec.offsetHeight - (window.innerHeight * 0.3);
        
        if (window.scrollY >= aboutTop && window.scrollY <= tracksBottom) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-hide body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleRegister = () => {
    if (onOpenRegister) {
      onOpenRegister();
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
      window.history.pushState({ activePage: "register" }, "");
      window.dispatchEvent(new PopStateEvent("popstate", { state: { activePage: "register" } }));
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* FLOATING GIFT BOX */}
      <AnimatePresence>
        {!isOpen && isVisible && (
          <motion.div
            style={{ position: "fixed", bottom: "5%", right: "5%", zIndex: 99999 }}
            className="cursor-pointer group"
            onClick={handleOpen}
            initial={{ opacity: 0, scale: 0, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 40 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 180 }}
            whileHover={{ scale: 1.12 }}
          >
            <motion.div
            animate={{
              rotate: [-5, 5, -5, 5, 0],
              y: [0, -6, 0],
            }}
            transition={{
              rotate: { repeat: Infinity, duration: 0.45, repeatDelay: 2.5 },
              y: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
            }}
            style={{ position: "relative" }}
          >
            {/* Blue glow halo */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "rgba(59,130,246,0.35)",
              borderRadius: "50%",
              filter: "blur(18px)",
              transform: "scale(1.6)",
              animation: "pulse 2s infinite",
            }} />
            <img
              src="/gift.webp"
              alt="Referral Gift"
              style={{
                width: 72,
                height: 72,
                objectFit: "contain",
                position: "relative",
                zIndex: 1,
                filter: "drop-shadow(0 0 16px rgba(59,130,246,0.7))",
              }}
            />
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* FULL SCREEN WHITE MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 95% 95%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 95% 95%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 95% 95%)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "fixed", inset: 0, zIndex: 99999, background: "white", overflowY: "auto" }}
            className="flex flex-col items-center py-12 px-4 sm:px-8 text-slate-900"
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={handleClose}
              style={{ position: "absolute", top: 24, right: 24, zIndex: 100000 }}
              className="w-12 h-12 bg-slate-100 border border-slate-200 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-900 transition-colors shadow-lg cursor-pointer"
            >
              <X className="w-6 h-6 stroke-[3]" />
            </button>

            {/* FLOATING BACKGROUND ELEMENTS */}
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`trophy-${i}`}
                  animate={{
                    y: ["-10vh", "110vh"],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 18 + i * 3,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 1.5,
                  }}
                  style={{
                    position: "absolute",
                    left: `${10 + i * 15}%`,
                    top: "-20%",
                    opacity: 0.08,
                  }}
                >
                  <Trophy className="w-28 h-28 text-amber-500" />
                </motion.div>
              ))}
              {["GIFTS", "REWARDS", "WIN", "REFER", "PRIZES", "GIFTS", "SHARE", "WIN"].map((word, i) => (
                <motion.div
                  key={`word-${i}`}
                  animate={{ y: ["110vh", "-10vh"] }}
                  transition={{
                    duration: 22 + i * 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 2,
                  }}
                  style={{
                    position: "absolute",
                    left: `${5 + i * 12}%`,
                    bottom: "-20%",
                    opacity: 0.04,
                    fontSize: "3rem",
                    fontWeight: 900,
                    color: "#92400e",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  {word}
                </motion.div>
              ))}
            </div>

            {/* MODAL CONTENT */}
            <div className="relative max-w-3xl w-full mt-4 flex flex-col items-center text-slate-900" style={{ zIndex: 10 }}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center space-y-2 text-center mb-6 w-full"
              >
                <h2 className="text-4xl sm:text-5xl font-black font-heading text-slate-900 tracking-tight text-center uppercase drop-shadow-sm">
                  Referral Rewards
                </h2>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-1 w-24 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded-full"
                />
              </motion.div>

              <div className="w-full text-center font-bold font-sans mb-10 text-amber-700 h-14 sm:h-10">
                <TypewriterText text="You are going to get super cool rewards! 🎁 Keep referring and unlock massive surprises." speed={2} delay={300} className="text-lg sm:text-xl block" />
              </div>

              <div className="w-full text-slate-800 text-sm sm:text-base font-sans leading-relaxed space-y-5">
                <h3 className="text-2xl font-black text-slate-900 uppercase border-b-2 border-slate-200 pb-3 mb-6 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-500" /> Referral Gift Rules
                </h3>
                
                <TypewriterList 
                  items={[
                    "Each team receives a unique referral code.",
                    "Other participants can register for the hackathon using a team's referral code.",
                    "Teams must have at least 2 valid referred teams to be qualified for referral rewards.",
                    "The team with the highest number of valid referrals is eligible to receive the referral gift.",
                    "Only shortlisted teams are eligible for the gift.",
                    "If a non-shortlisted team has the highest referral count, they will not be eligible for the gift. The gift will instead go to the highest-referring shortlisted team.",
                    "Fake, duplicate, spam, or otherwise invalid registrations will not be counted toward a team's referral total.",
                    "The organizers reserve the right to verify referral registrations before declaring the winner."
                  ]}
                  delay={1000} 
                  speed={2}
                />

                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 2.5, duration: 0.5 }}
                  className="mt-8 pt-8 text-center flex flex-col items-center"
                >
                  <p className="font-bold text-slate-700 text-base sm:text-lg mb-6 max-w-2xl">
                    In order to refer your friends and earn rewards, you must first register your team to receive your unique referral code.
                  </p>
                  <motion.button
                    type="button"
                    onClick={handleRegister}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="px-12 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-mono text-base font-black tracking-widest uppercase cursor-pointer"
                  >
                    REGISTER NOW
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ReferralGift;
