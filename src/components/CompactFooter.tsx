"use client";
import { ArrowUp, Mail } from "lucide-react";
import logo from "../assets/logo.webp";

interface CompactFooterProps {
  onOpenRegister?: () => void;
}

export function CompactFooter({ onOpenRegister }: CompactFooterProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const logoSrc = (logo as any)?.src || logo || "/logo.webp";

  return (
    <footer className="relative w-full text-white select-none z-20 pt-8 pb-6 sm:pt-14 sm:pb-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-[#02040a] via-[#030611]/80 to-transparent">
      {/* TOP GLOW LINE ACCENT */}
      <div className="w-full max-w-6xl mx-auto mb-6 sm:mb-10">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/35 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8 text-center md:text-left">
        
        {/* MOBILE TOP ROW: BRAND ON LEFT, SOCIAL + BACK TO TOP ON RIGHT */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-start gap-3.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <img src={logoSrc} alt="YODHA 2.0 Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain shrink-0 filter drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
            <div className="text-left">
              <h4 className="text-base sm:text-xl font-black font-heading tracking-tight text-white flex items-center gap-1">
                <span>YODHA</span>
                <span className="text-blue-400 font-extrabold">2.0</span>
              </h4>
              <p className="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-none">
                WARRIORS OF AI • AI & DS & JECC
              </p>
            </div>
          </div>

          {/* MOBILE COMPACT SOCIAL & BACK TO TOP BUTTONS */}
          <div className="flex items-center gap-2 text-xs font-mono md:hidden">
            <a
              href="https://chat.whatsapp.com/JyW5dGEUiX8B19JRfwRmwb"
              target="_blank"
              rel="noopener noreferrer"
              title="Join WhatsApp Group"
              className="w-8 h-8 rounded-full bg-slate-950/80 border border-blue-500/30 flex items-center justify-center text-slate-300 hover:text-blue-400 transition-all shadow-md"
            >
              <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.472-1.761-1.645-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>

            <a
              href="https://www.instagram.com/yodha_hackathon.official?igsh=cmxiNGs2c2hiMDdy"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram Official"
              className="w-8 h-8 rounded-full bg-slate-950/80 border border-blue-500/30 flex items-center justify-center text-slate-300 hover:text-blue-400 transition-all shadow-md"
            >
              <svg className="w-3.5 h-3.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>

            <a
              href="mailto:yodha@jecc.ac.in"
              title="Email Support"
              className="w-8 h-8 rounded-full bg-slate-950/80 border border-blue-500/30 flex items-center justify-center text-slate-300 hover:text-blue-400 transition-all shadow-md"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />
            </a>

            <button
              onClick={scrollToTop}
              title="Back to Top"
              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.5)] active:scale-95"
            >
              <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* NAVIGATION LINKS — COMPACT INLINE WRAP ON MOBILE */}
        <nav className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-1.5 text-xs font-mono text-slate-300 my-1 md:my-0">
          <button onClick={() => scrollToSection("about")} className="hover:text-blue-400 transition-colors cursor-pointer">
            About
          </button>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <button onClick={() => scrollToSection("tracks")} className="hover:text-blue-400 transition-colors cursor-pointer">
            Tracks
          </button>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <button onClick={() => scrollToSection("timeline")} className="hover:text-blue-400 transition-colors cursor-pointer">
            Journey
          </button>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <button onClick={() => scrollToSection("prizes")} className="hover:text-blue-400 transition-colors cursor-pointer">
            Prizes
          </button>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <button onClick={() => scrollToSection("faq")} className="hover:text-blue-400 transition-colors cursor-pointer">
            FAQ
          </button>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <button
            onClick={() => {
              if (onOpenRegister) onOpenRegister();
              else scrollToSection("register");
            }}
            className="text-blue-400 hover:text-blue-300 font-bold transition-colors cursor-pointer"
          >
            Register
          </button>
        </nav>

        {/* DESKTOP SOCIAL & BACK TO TOP BUTTONS */}
        <div className="hidden md:flex items-center gap-3 text-xs font-mono">
          <a
            href="https://chat.whatsapp.com/JyW5dGEUiX8B19JRfwRmwb"
            target="_blank"
            rel="noopener noreferrer"
            title="Join WhatsApp Group"
            className="w-9 h-9 rounded-full bg-slate-950/80 border border-blue-500/30 hover:border-blue-400 flex items-center justify-center text-slate-300 hover:text-blue-400 transition-all cursor-pointer shadow-md"
          >
            <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.472-1.761-1.645-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>

          <a
            href="https://www.instagram.com/yodha_hackathon.official?igsh=cmxiNGs2c2hiMDdy"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram Official"
            className="w-9 h-9 rounded-full bg-slate-950/80 border border-blue-500/30 hover:border-blue-400 flex items-center justify-center text-slate-300 hover:text-blue-400 transition-all cursor-pointer shadow-md"
          >
            <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </a>

          <a
            href="mailto:yodha@jecc.ac.in"
            title="Email Support"
            className="w-9 h-9 rounded-full bg-slate-950/80 border border-blue-500/30 hover:border-blue-400 flex items-center justify-center text-slate-300 hover:text-blue-400 transition-all cursor-pointer shadow-md"
          >
            <Mail className="w-4 h-4 text-blue-400" />
          </a>

          <button
            onClick={scrollToTop}
            title="Back to Top"
            className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.5)] active:scale-95 ml-1"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

      </div>



      {/* MINIMAL BOTTOM COPYRIGHT LINE */}
      <div className="max-w-6xl mx-auto mt-6 sm:mt-8 pt-4 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-500 gap-1 text-center sm:text-left">
        <span>© 2026 YODHA 2.0 • All Rights Reserved.</span>
        <span>Dept. of AI & DS • Jyothi Engineering College (Autonomous)</span>
      </div>
    </footer>
  );
}

export default CompactFooter;
