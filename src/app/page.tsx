import HeroCountdown from "@/components/HeroCountdown";
import ProfileCard from "@/components/ProfileCard";
import SurvivalStats from "@/components/SurvivalStats";
import FaqSection from "@/components/FaqSection";
import Soundboard from "@/components/Soundboard";
import FreedomPassModal from "@/components/FreedomPassModal";
import WishWall from "@/components/WishWall";
import ShareCard from "@/components/ShareCard";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* Decorative ambient glowing orbs in the background */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="flex-1 w-full flex flex-col items-center">
        {/* Main Countdown Hero */}
        <HeroCountdown />

        {/* Profile Details & Mode Switcher */}
        <ProfileCard />

        {/* Telemetry & Funny Survival Metrics */}
        <SurvivalStats />

        {/* Interactive Audio Soundboard & Treat Claimer */}
        <Soundboard />

        {/* Freedom Pass NOC Modal */}
        <FreedomPassModal />

        {/* Frequently Asked Colleague Questions */}
        <FaqSection />

        {/* Farewell Wishes & Memories Wall */}
        <WishWall />

        {/* Share with Colleagues on Slack/WhatsApp */}
        <ShareCard />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
