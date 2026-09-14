"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { TracksSection } from "@/components/TracksSection";
import { PrizesSection } from "@/components/PrizesSection";
import { TimelineSection } from "@/components/TimelineSection";
import { FAQSection } from "@/components/FAQSection";
import { GuidelinesSection } from "@/components/GuidelinesSection";
import { PartnersSection } from "@/components/PartnersSection";
import { RegistrationPage } from "@/components/RegistrationPage";
import { ReferralRoomPage } from "@/components/ReferralRoomPage";
import { ReferralDashboardModal } from "@/components/ReferralDashboardModal";
import { CompactFooter } from "@/components/CompactFooter";
import { VerticalYodhaCarousel } from "@/components/VerticalYodhaCarousel";
import { TrackPage } from "@/components/TrackPage";
import { ScrollBackgroundManager } from "@/components/ScrollBackgroundManager";
import { TrailerModal } from "@/components/TrailerModal";
import { IntroLoader } from "@/components/IntroLoader";
import { PaymentPortalPage } from "@/components/PaymentPortalPage";
import { trackUserSession } from "@/lib/firebase";

import { ReferralGift } from "@/components/ReferralGift";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isHeroRevealed, setIsHeroRevealed] = useState(true);
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [trailerVideoUrl, setTrailerVideoUrl] = useState<string | undefined>(undefined);
  const [selectedTrack, setSelectedTrack] = useState("Healthcare AI");
  const [activePage, setActivePage] = useState<"home" | "healthcare" | "register" | "referral-room" | "payment">("home");
  const [paymentTeamId, setPaymentTeamId] = useState<string>("");

  // Referral Dashboard & Room State
  const [referralDashboardCode, setReferralDashboardCode] = useState<string>("");
  const [isReferralDashboardOpen, setIsReferralDashboardOpen] = useState<boolean>(false);

  // Preserve home page scroll position when opening dedicated sub-pages
  const homeScrollPosRef = useRef<number>(0);

  const handleOpenRegisterWithTrack = (trackName?: string) => {
    if (activePage === "home") {
      homeScrollPosRef.current = window.scrollY;
    }
    if (trackName) setSelectedTrack(trackName);
    setIsHeroRevealed(true);
    setActivePage("register");
    window.scrollTo({ top: 0, behavior: "instant" });
    window.history.pushState({ activePage: "register" }, "");
  };

  const handleOpenTrailer = (videoUrl?: string) => {
    if (videoUrl) setTrailerVideoUrl(videoUrl);
    setTrailerModalOpen(true);
  };

  const handleCloseTrailer = () => {
    setIsHeroRevealed(true);
    setTrailerModalOpen(false);
  };

  const handleOpenReferralDashboard = (code: string) => {
    if (code && code.trim()) {
      setReferralDashboardCode(code.trim().toUpperCase());
      setIsReferralDashboardOpen(true);
    }
  };

  const handleSelectPage = (page: "home" | "healthcare" | "register" | "referral-room" | "payment") => {
    if (page === activePage) return;

    if (activePage === "home") {
      homeScrollPosRef.current = window.scrollY;
    }

    setIsHeroRevealed(true);
    setActivePage(page);

    if (page !== "home") {
      window.scrollTo({ top: 0, behavior: "instant" });
      window.history.pushState({ activePage: page }, "");
    }
  };

  // Extract referral and payment team ID parameters from URL on initial load
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get("ref") || urlParams.get("referral") || urlParams.get("r");
      const viewRefCode = urlParams.get("view_ref") || urlParams.get("dashboard_ref") || urlParams.get("code") || urlParams.get("ref_room");
      const payTeamId = urlParams.get("teamId") || urlParams.get("payId") || urlParams.get("pay_id") || urlParams.get("id");
      const pathname = window.location.pathname.toLowerCase();
      const isRegisterPath = pathname.includes("register");
      const isReferralRoomPath = pathname.includes("referral") || pathname.includes("room");
      const isPayPath = pathname.includes("pay") || pathname.includes("payment");

      if (payTeamId || isPayPath) {
        if (payTeamId) setPaymentTeamId(payTeamId.trim());
        setIsHeroRevealed(true);
        setActivePage("payment");
      } else if (viewRefCode && viewRefCode.trim()) {
        const cleanViewRef = viewRefCode.trim().toUpperCase();
        setReferralDashboardCode(cleanViewRef);
        setIsHeroRevealed(true);
        setActivePage("referral-room");
      } else if (isReferralRoomPath && refCode) {
        setReferralDashboardCode(refCode.trim().toUpperCase());
        setIsHeroRevealed(true);
        setActivePage("referral-room");
      } else if (refCode && refCode.trim()) {
        const cleanRef = refCode.trim().toUpperCase();
        localStorage.setItem("yodha_referral_code", cleanRef);
        setIsHeroRevealed(true);
        setActivePage("register");
      } else if (isRegisterPath) {
        setIsHeroRevealed(true);
        setActivePage("register");
      }
    } catch (err) {
      console.warn("Error parsing URL params:", err);
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

    const cleanupSessionTracker = trackUserSession();

    return () => {
      window.removeEventListener("popstate", handlePopState);
      cleanupSessionTracker();
    };
  }, []);

  return (
    <>
    <div className="w-full min-h-screen bg-[#03060d] text-white selection:bg-blue-600 selection:text-white font-sans relative overflow-x-hidden">
      
      {/* INITIAL PRELOADER: GATES SITE UNTIL CORE ASSETS ARE LOADED */}
      <AnimatePresence>
        {isLoading && (
          <IntroLoader
            onComplete={() => {
              setIsLoading(false);
              setIsHeroRevealed(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Dynamic Scroll-Driven Fixed Background (Night/Day Hills) for All Non-Hero Sections */}
      {activePage === "home" && <ScrollBackgroundManager />}

      {/* DEDICATED FULL PAGE VIEWS */}
      {activePage === "payment" ? (
        <PaymentPortalPage
          onBack={() => handleSelectPage("home")}
          initialTeamId={paymentTeamId}
        />
      ) : activePage === "referral-room" ? (
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
        <div
          className={`relative z-10 w-full min-h-screen block transition-opacity duration-700 ${
            isHeroRevealed ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Top Navbar Header */}
          <Navbar onOpenRegister={handleOpenRegisterWithTrack} />

          {/* 1. Hero Section */}
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

          {/* 4. Hackathon Journey (Timeline) in SDG Position */}
          <TimelineSection onOpenRegister={handleOpenRegisterWithTrack} />

          {/* 5. Prizes & Trophies */}
          <PrizesSection onOpenRegister={() => handleOpenRegisterWithTrack()} />

          {/* 6. Partners & Sponsors */}
          <PartnersSection />

          {/* 7. FAQ Section (Cinematic Editorial Accordion) */}
          <FAQSection />

          {/* 7. Guidelines Section */}
          <GuidelinesSection />

          {/* 9. Vertical YODHA Moving Carousel */}
          <VerticalYodhaCarousel />

          {/* 10. Glassmorphism Footer */}
          <CompactFooter />

        </div>
      )}

      {/* Trailer Video Modal Popup */}
      <TrailerModal
        isOpen={trailerModalOpen}
        onClose={handleCloseTrailer}
        videoUrl={trailerVideoUrl}
        onNearEnd={() => setIsHeroRevealed(true)}
      />

      {/* REFERRAL DASHBOARD MODAL */}
      <ReferralDashboardModal
        isOpen={isReferralDashboardOpen}
        onClose={() => setIsReferralDashboardOpen(false)}
        referralCode={referralDashboardCode}
      />
    </div>

    {/* FLOATING REFERRAL GIFT */}
    <ReferralGift onOpenRegister={handleOpenRegisterWithTrack} />
    </>
  );
}

