"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  Info,
  Lightbulb,
  Route,
  Trophy,
  HelpCircle,
  FileText,
  Handshake,
} from "lucide-react";
import logo from "../assets/logo.webp";

interface NavbarProps {
  onOpenRegister: (trackName?: string) => void;
}

export function Navbar({ onOpenRegister }: NavbarProps) {
  const [showNavbar, setShowNavbar] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateNavbarVisibility = () => {
      const aboutElem = document.getElementById("about");
      if (aboutElem) {
        const rect = aboutElem.getBoundingClientRect();
        setShowNavbar(rect.top <= window.innerHeight * 0.85);
      } else {
        setShowNavbar(window.scrollY > window.innerHeight * 0.85);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbarVisibility);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateNavbarVisibility();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "ABOUT", href: "#about", icon: Info },
    { name: "PROBLEMS", href: "#tracks", icon: Lightbulb },
    { name: "JOURNEY", href: "#timeline", icon: Route },
    { name: "PRIZES", href: "#prizes", icon: Trophy },
    { name: "PARTNERS", href: "#partners", icon: Handshake },
    { name: "FAQ", href: "#faq", icon: HelpCircle },
    { name: "GUIDELINES", href: "#guidelines", icon: FileText },
  ];

  return (
    <header
      className={`fixed top-0 lg:top-0 left-1/2 -translate-x-1/2 z-50 w-full transition-all duration-500 transform flex justify-center ${
        showNavbar
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-28 opacity-0 pointer-events-none"
      }`}
    >
      {/* DESKTOP NAVBAR (RESTORED TO ORIGINAL FULL HORIZONTAL BAR ON PC SCREENS) */}
      <div className="hidden lg:block max-w-6xl w-[94%] pt-0">
        <div className="w-full px-5 py-2 rounded-b-2xl bg-[#060817]/90 border-b border-x border-blue-500/40 dark:border-blue-500/50 backdrop-blur-3xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex items-center justify-between">
          {/* BRAND LOGO */}
          <a href="#" className="flex items-center gap-3 group shrink-0">
            <img
              src="/logo.webp"
              alt="YODHA Logo"
              className="h-11 sm:h-13 w-auto object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-transform group-hover:scale-105"
            />
            <div className="flex items-baseline">
              <span className="font-heading font-black text-2xl sm:text-3xl text-slate-950 dark:text-white tracking-tight">
                YODHA
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm font-mono relative top-[1px] ml-1.5">
                2.0
              </span>
            </div>
          </a>

          {/* DESKTOP HORIZONTAL NAV LINKS */}
          <nav className="flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-mono font-bold text-slate-900 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors tracking-wider uppercase cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* DESKTOP REGISTER BUTTON */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenRegister()}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:scale-105 transition-all cursor-pointer"
            >
              <span>REGISTER</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE & TABLET NAVBAR (FLOATING PILL & CINEMATIC EXPANDED MENU BELOW LG SCREENS) */}
      <div className="block lg:hidden max-w-sm sm:max-w-md w-[92%] pt-2">
        <div className="relative w-full">
          <AnimatePresence mode="wait">
            {!menuOpen ? (
              /* CLOSED MOBILE COMPACT PILL NAVBAR */
              <motion.div
                key="closed-pill-mobile"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-full px-4 py-2 sm:py-2.5 rounded-full bg-[#060817]/95 border border-blue-500/40 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.5)] flex items-center justify-between"
              >
                <a
                  href="#"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 group shrink-0"
                >
                  <img
                    src="/logo.webp"
                    alt="YODHA Logo"
                    className="h-9 sm:h-11 w-auto object-contain drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                  />
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif font-medium text-xl text-white tracking-wide">
                      YODHA
                    </span>
                    <span className="text-blue-400 font-mono text-xs font-bold">
                      2.0
                    </span>
                  </div>
                </a>

                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-600/70 hover:border-slate-400 text-slate-200 hover:text-white bg-slate-800/40 hover:bg-slate-800/70 flex items-center justify-center transition-all cursor-pointer shadow-inner active:scale-95"
                  aria-label="Open Navigation Menu"
                >
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
                </button>
              </motion.div>
            ) : (
              /* OPEN MOBILE CINEMATIC EXPANDED PANEL */
              <motion.div
                key="open-panel-mobile"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full p-4 sm:p-5 rounded-3xl bg-[#060817]/95 border border-blue-500/50 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/70">
                  <a
                    href="#"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 group shrink-0"
                  >
                    <img
                      src="/logo.webp"
                      alt="YODHA Logo"
                      className="h-9 sm:h-11 w-auto object-contain drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                    />
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif font-medium text-xl text-white tracking-wide">
                        YODHA
                      </span>
                      <span className="text-blue-400 font-mono text-xs font-bold">
                        2.0
                      </span>
                    </div>
                  </a>

                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-600/70 hover:border-slate-400 text-slate-200 hover:text-white bg-slate-800/40 hover:bg-slate-800/70 flex items-center justify-center transition-all cursor-pointer shadow-inner active:scale-95"
                    aria-label="Close Navigation Menu"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
                  </button>
                </div>

                <div className="flex flex-col space-y-1 py-1">
                  {navLinks.map((link) => {
                    const IconComp = link.icon;
                    return (
                      <a
                        key={link.name}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="py-3 px-3.5 rounded-xl hover:bg-slate-800/50 text-slate-300 hover:text-white transition-all flex items-center justify-between group border-b border-slate-800/40 last:border-b-0 cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5">
                          <IconComp className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors stroke-[1.75]" />
                          <span className="font-serif text-sm tracking-[0.2em] font-normal uppercase">
                            {link.name}
                          </span>
                        </div>
                        <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all text-xs">
                          →
                        </span>
                      </a>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenRegister();
                    }}
                    className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-600 text-white font-serif text-xs tracking-[0.2em] font-medium uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(59,130,246,0.4)] hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <span>REGISTER NOW</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div className="pt-1 text-center">
                  <div className="text-[9px] font-mono tracking-[0.25em] text-slate-500 uppercase">
                    IDEAS TODAY • A HEALTHIER TOMORROW
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
