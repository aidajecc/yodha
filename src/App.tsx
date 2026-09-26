import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { CompactFooter } from "./components/CompactFooter";
import { ScrollBackgroundManager } from "./components/ScrollBackgroundManager";
import { IntroLoader } from "./components/IntroLoader";
import { ReferralDashboardModal } from "./components/ReferralDashboardModal";
import { RegistrationClosedModal } from "./components/RegistrationClosedModal";

// Lazy load non-hero sections below the fold for optimal initial load speed
const AboutSection = lazy(() => import("./components/AboutSection").then((m) => ({ default: m.AboutSection })));
const TracksSection = lazy(() => import("./components/TracksSection").then((m) => ({ default: m.TracksSection })));
const PrizesSection = lazy(() => import("./components/PrizesSection").then((m) => ({ default: m.PrizesSection })));
const TimelineSection = lazy(() => import("./components/TimelineSection").then((m) => ({ default: m.TimelineSection })));
const FAQSection = lazy(() => import("./components/FAQSection").then((m) => ({ default: m.FAQSection })));
const GuidelinesSection = lazy(() => import("./components/GuidelinesSection").then((m) => ({ default: m.GuidelinesSection })));
const PartnersSection = lazy(() => import("./components/PartnersSection").then((m) => ({ default: m.PartnersSection })));
const RegistrationPage = lazy(() => import("./components/RegistrationPage").then((m) => ({ default: m.RegistrationPage })));
const ReferralRoomPage = lazy(() => import("./components/ReferralRoomPage").then((m) => ({ default: m.ReferralRoomPage })));
const VerticalYodhaCarousel = lazy(() => import("./components/VerticalYodhaCarousel").then((m) => ({ default: m.VerticalYodhaCarousel })));
const TrackPage = lazy(() => import("./components/TrackPage").then((m) => ({ default: m.TrackPage })));
const TrailerModal = lazy(() => import("./components/TrailerModal").then((m) => ({ default: m.TrailerModal })));

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [trailerVideoUrl, setTrailerVideoUrl] = useState<string | undefined>(undefined);
  const [selectedTrack, setSelectedTrack] = useState("Healthcare AI");
  const [activePage, setActivePage] = useState<"home" | "healthcare" | "register" | "referral-room">("home");

  // Referral Dashboard & Room State
  const [referralDashboardCode, setReferralDashboardCode] = useState<string>("");
  const [isReferralDashboardOpen, setIsReferralDashboardOpen] = useState<boolean>(false);

  // Auto Registration Closed Modal (opens as soon as site loaded)
  const [isRegistrationClosedOpen, setIsRegistrationClosedOpen] = useState<boolean>(false);

  // Preserve home page scroll position when opening dedicated sub-pages
  const homeScrollPosRef = useRef<number>(0);

  const handleOpenRegisterWithTrack = (trackName?: string) => {
    if (activePage === "home") {
      homeScrollPosRef.current = window.scrollY;
    }
    if (trackName) setSelectedTrack(trackName);
    setActivePage("register");
    window.scrollTo({ top: 0, behavior: "instant" });
    window.history.pushState({ activePage: "register" }, "");
  };

  const handleOpenTrailer = (videoUrl?: string) => {
    if (videoUrl) setTrailerVideoUrl(videoUrl);
    setTrailerModalOpen(true);
  };

  const handleOpenReferralDashboard = (code: string) => {
    if (code && code.trim()) {
      setReferralDashboardCode(code.trim().toUpperCase());
      setIsReferralDashboardOpen(true);
    }
  };

  const handleSelectPage = (page: "home" | "healthcare" | "register" | "referral-room") => {
    if (page === activePage) return;

    if (activePage === "home") {
      homeScrollPosRef.current = window.scrollY;
    }

    setActivePage(page);

    if (page !== "home") {
      window.scrollTo({ top: 0, behavior: "instant" });
      window.history.pushState({ activePage: page }, "");
    }
  };

  // Extract referral codes from URL parameters on initial load
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get("ref") || urlParams.get("referral") || urlParams.get("r");
      const viewRefCode = urlParams.get("view_ref") || urlParams.get("dashboard_ref") || urlParams.get("code") || urlParams.get("ref_room");
      const isRegisterPath = window.location.pathname.toLowerCase().includes("register");
      const isReferralRoomPath = window.location.pathname.toLowerCase().includes("referral") || window.location.pathname.toLowerCase().includes("room");

      if (viewRefCode && viewRefCode.trim()) {
        const cleanViewRef = viewRefCode.trim().toUpperCase();
        setReferralDashboardCode(cleanViewRef);
        setActivePage("referral-room");
      } else if (isReferralRoomPath && refCode) {
        setReferralDashboardCode(refCode.trim().toUpperCase());
        setActivePage("referral-room");
      } else if (refCode && refCode.trim()) {
        const cleanRef = refCode.trim().toUpperCase();
        localStorage.setItem("yodha_referral_code", cleanRef);
        setActivePage("register");
      } else if (isRegisterPath) {
        setActivePage("register");
      }
    } catch (err) {
      console.warn("Error parsing URL referral params:", err);
    }
  }, []);

  // Restore saved scroll position when returning to the home page
  useEffect(() => {
    if (activePage === "home" && homeScrollPosRef.current > 0) {
      const savedPos = homeScrollPosRef.current;
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedPos, behavior: "instant" });
      });
    }
  }, [activePage]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.activePage) {
        setActivePage(e.state.activePage);
      } else {
        setActivePage("home");
      }
    };
    window.addEventListener("popstate", handlePopState);

    document.title = "YODHA 2.0 — WARRIORS OF AI";

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Automatically open Registration Closed popup modal as soon as the site has loaded
  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      setIsRegistrationClosedOpen(true);
    }, 250);

    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleCloseClosedModal = () => {
    setIsRegistrationClosedOpen(false);
  };

  return (
    <>
    <div className="w-full min-h-screen bg-[#03060d] text-white selection:bg-blue-600 selection:text-white font-sans relative overflow-x-hidden">
      
      {/* INITIAL PRELOADER */}
      <AnimatePresence>
        {isLoading && (
          <IntroLoader
            onComplete={() => {
              setIsLoading(false);
              setIsRegistrationClosedOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Dynamic Scroll-Driven Fixed Background */}
      {activePage === "home" && <ScrollBackgroundManager />}

      {/* DEDICATED FULL PAGE VIEWS */}
      <Suspense fallback={<div className="min-h-screen bg-[#03060d]" />}>
        {activePage === "referral-room" ? (
          <ReferralRoomPage
            onBack={() => handleSelectPage("home")}
            referralCode={referralDashboardCode}
          />
        ) : activePage === "register" ? (
          <RegistrationPage
            onBack={() => handleSelectPage("home")}
            selectedTrack={selectedTrack}
            onOpenReferralDashboard={handleOpenReferralDashboard}
          />
        ) : activePage === "healthcare" ? (
          <div className="min-h-screen w-full relative z-20">
            <TrackPage
              trackType={activePage}
              onBack={() => handleSelectPage("home")}
              onOpenRegisterWithTrack={handleOpenRegisterWithTrack}
            />
          </div>
        ) : (
          <div className="relative z-10 w-full min-h-screen block">
            {/* Top Navbar Header */}
            <Navbar onOpenRegister={handleOpenRegisterWithTrack} />

            {/* 1. Hero Section (Loaded Immediately) */}
            <HeroSection
              onOpenRegister={handleOpenRegisterWithTrack}
              onOpenTrailer={handleOpenTrailer}
            />

            {/* 2. About YODHA 2.0 */}
            <AboutSection />

            {/* 3. Healthcare AI Tracks */}
            <TracksSection
              onOpenTrackPage={(tType) => handleSelectPage(tType)}
            />

            {/* 4. Hackathon Journey (Timeline) */}
            <TimelineSection onOpenRegister={handleOpenRegisterWithTrack} />

            {/* 5. Prizes & Trophies */}
            <PrizesSection onOpenRegister={() => handleOpenRegisterWithTrack()} />

            {/* 6. Partners & Sponsors Section */}
            <PartnersSection />

            {/* 7. FAQ Section */}
            <FAQSection />

            {/* 8. Guidelines Section */}
            <GuidelinesSection />

            {/* 9. Vertical YODHA Moving Carousel */}
            <VerticalYodhaCarousel />

            {/* 10. Glassmorphism Footer */}
            <CompactFooter />

            {/* Trailer Video Modal Popup */}
            <TrailerModal
              isOpen={trailerModalOpen}
              onClose={() => setTrailerModalOpen(false)}
              videoUrl={trailerVideoUrl}
            />
          </div>
        )}
      </Suspense>

      {/* REFERRAL DASHBOARD MODAL */}
      <ReferralDashboardModal
        isOpen={isReferralDashboardOpen}
        onClose={() => setIsReferralDashboardOpen(false)}
        referralCode={referralDashboardCode}
      />

      {/* AUTO-POPUP REGISTRATION CLOSED ANIMATION */}
      <RegistrationClosedModal
        isOpen={isRegistrationClosedOpen}
        onClose={handleCloseClosedModal}
        onViewTimeline={() => {
          handleCloseClosedModal();
          const el = document.getElementById("timeline");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
    </>
  );
}

export default App;

