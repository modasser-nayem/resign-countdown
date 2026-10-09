import MemeCountdown from "@/components/MemeCountdown";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center selection:bg-amber-500 selection:text-black overflow-x-hidden relative py-6">
      {/* Decorative ambient glowing orbs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Main compact developer countdown */}
      <MemeCountdown />
    </main>
  );
}
