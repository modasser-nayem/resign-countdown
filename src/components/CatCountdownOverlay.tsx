"use client";

import React, { useEffect, useState, useRef } from "react";
import { soundEffects } from "@/lib/audio";

interface CatCountdownOverlayProps {
  seconds: number;
}

// Reusable SVG Biltu component for 100% design consistency
function BiltuCatSvg({
  isGrabbing,
  isCarryingOnHead,
  isDumping,
}: {
  isGrabbing?: boolean;
  isCarryingOnHead?: boolean;
  isDumping?: boolean;
}) {
  return (
    <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl">
      {/* Wagging Tail */}
      <path
        d={isDumping ? "M75 92 Q96 72 92 50 Q86 42 78 55" : "M75 100 Q95 85 92 65 Q88 55 80 68"}
        fill="none"
        stroke="#f59e0b"
        strokeWidth="8"
        strokeLinecap="round"
        className="animate-pulse"
      />

      {/* Body & White Belly */}
      <ellipse cx="50" cy="85" rx="32" ry="28" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
      <ellipse cx="50" cy="88" rx="20" ry="18" fill="#ffffff" />

      {/* Head */}
      <circle cx="50" cy="45" r="28" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />

      {/* Ears */}
      <polygon points="26,30 32,5 48,22" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
      <polygon points="30,27 34,12 44,22" fill="#f472b6" />
      <polygon points="74,30 68,5 52,22" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
      <polygon points="70,27 66,12 56,22" fill="#f472b6" />

      {/* Eyes: When dumping, eyes look downwards with focus at dustbin */}
      {isDumping ? (
        <>
          <ellipse cx="38" cy="46" rx="5" ry="6" fill="#0f172a" />
          <circle cx="37" cy="48" r="2" fill="#ffffff" />
          <ellipse cx="62" cy="46" rx="5" ry="6" fill="#0f172a" />
          <circle cx="61" cy="48" r="2" fill="#ffffff" />
        </>
      ) : (
        <>
          <ellipse cx="38" cy="42" rx="5" ry="6" fill="#0f172a" />
          <circle cx="36" cy="40" r="2" fill="#ffffff" />
          <ellipse cx="62" cy="42" rx="5" ry="6" fill="#0f172a" />
          <circle cx="60" cy="40" r="2" fill="#ffffff" />
        </>
      )}

      {/* Nose & Smile */}
      <polygon points="48,50 52,50 50,53" fill="#f472b6" />
      <path d="M46 53 Q50 57 54 53" fill="none" stroke="#78350f" strokeWidth="2" />

      {/* Whiskers */}
      <line x1="22" y1="48" x2="8" y2="45" stroke="#b45309" strokeWidth="1.5" />
      <line x1="22" y1="52" x2="8" y2="54" stroke="#b45309" strokeWidth="1.5" />
      <line x1="78" y1="48" x2="92" y2="45" stroke="#b45309" strokeWidth="1.5" />
      <line x1="78" y1="52" x2="92" y2="54" stroke="#b45309" strokeWidth="1.5" />

      {/* Paws */}
      {isDumping ? (
        // Paws extended downwards holding the dustbin below him!
        <>
          <ellipse cx="36" cy="98" rx="8" ry="7" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
          <ellipse cx="64" cy="98" rx="8" ry="7" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
        </>
      ) : isCarryingOnHead ? (
        // Raised paws supporting the dustbin on top of head!
        <>
          <ellipse cx="32" cy="20" rx="7" ry="9" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
          <ellipse cx="68" cy="20" rx="7" ry="9" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
        </>
      ) : isGrabbing ? (
        // Reaching up towards the second number
        <>
          <ellipse cx="32" cy="48" rx="7" ry="9" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
          <ellipse cx="48" cy="48" rx="7" ry="9" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
        </>
      ) : (
        // Resting front paws
        <>
          <ellipse cx="38" cy="78" rx="7" ry="9" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
          <ellipse cx="62" cy="78" rx="7" ry="9" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

// Dedicated Vector SVG Ninja Cat (লাথি মারু)
// Real martial arts leg kick motion: Torso recoils, leg violently whips forward with paw & claws!
function NinjaCatSvg({ isKicking }: { isKicking: boolean }) {
  return (
    <svg viewBox="-45 0 170 125" className="w-full h-full drop-shadow-2xl overflow-visible">
      {/* Fluttering Headband Ribbon */}
      <path
        d="M20 40 Q8 32 4 45 Q12 48 22 46"
        fill="#0f172a"
        stroke="#dc2626"
        strokeWidth="1.5"
        className="animate-pulse"
      />
      <path
        d="M18 45 Q6 42 2 55 Q10 56 20 50"
        fill="#0f172a"
        stroke="#dc2626"
        strokeWidth="1.5"
      />

      {/* Body & Karate Belt - Recoils back when kicking */}
      <g className={isKicking ? "animate-[karateTorsoRecoil_0.45s_ease-out]" : ""}>
        <ellipse cx="60" cy="85" rx="30" ry="26" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
        <ellipse cx="60" cy="88" rx="18" ry="16" fill="#ffffff" />
        {/* Black Martial Arts Belt */}
        <rect x="34" y="80" width="52" height="8" rx="2" fill="#0f172a" />
        <path d="M56 88 L52 104 M62 88 L64 104" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* Karate Kick Dynamic Leg or Standing Stance */}
      {isKicking ? (
        // Dynamic Karate Whip-Thrust Leg: Starts folded at hip, WHIPS out violently, striking with foot!
        <g className="animate-[karateLegWhip_0.45s_cubic-bezier(0.1,0.9,0.2,1)_forwards]">
          {/* Whoosh / Wind Motion Arcs */}
          <path d="M35 98 Q0 90 -28 75" fill="none" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" opacity="0.9" />
          <path d="M40 106 Q10 98 -20 85" fill="none" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 4" opacity="0.9" />

          {/* Extended Leg (Orange fur) */}
          <path d="M45 88 Q15 76 -10 65" stroke="#f59e0b" strokeWidth="16" strokeLinecap="round" />
          <path d="M45 88 Q15 76 -10 65" fill="none" stroke="#d97706" strokeWidth="2.5" />

          {/* Black Ninja Ankle Wrap */}
          <rect x="-14" y="55" width="9" height="19" rx="2" fill="#0f172a" stroke="#dc2626" strokeWidth="1.2" transform="rotate(22 -10 64)" />

          {/* Main White Cat Foot / Paw */}
          <ellipse cx="-24" cy="65" rx="15" ry="12" fill="#ffffff" stroke="#d97706" strokeWidth="2.5" transform="rotate(-15 -24 65)" />

          {/* 4 Pink Paw Toe Beans (Unmistakable cat paw pads!) */}
          <circle cx="-33" cy="57" r="3.5" fill="#f472b6" stroke="#db2777" strokeWidth="1" />
          <circle cx="-32" cy="68" r="3.5" fill="#f472b6" stroke="#db2777" strokeWidth="1" />
          <circle cx="-24" cy="74" r="3.2" fill="#f472b6" stroke="#db2777" strokeWidth="1" />
          <circle cx="-16" cy="74" r="3" fill="#f472b6" stroke="#db2777" strokeWidth="1" />
          {/* Central large pad */}
          <ellipse cx="-22" cy="64" rx="5.5" ry="4.5" fill="#f472b6" opacity="0.9" />

          {/* Sharp White Claws protruding on kick impact! */}
          <path d="M-36 55 L-43 52" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
          <path d="M-36 67 L-43 68" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
          <path d="M-26 77 L-29 84" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />

          {/* Ground supporting foot */}
          <ellipse cx="66" cy="104" rx="9" ry="7" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
        </g>
      ) : (
        // Low crouching martial arts stance
        <g>
          <ellipse cx="44" cy="104" rx="8" ry="6" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
          <ellipse cx="76" cy="104" rx="8" ry="6" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
        </g>
      )}

      {/* Head */}
      <circle cx="60" cy="45" r="28" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />

      {/* Ears */}
      <polygon points="36,30 42,5 58,22" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
      <polygon points="40,27 44,12 54,22" fill="#f472b6" />
      <polygon points="84,30 78,5 62,22" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
      <polygon points="80,27 76,12 66,22" fill="#f472b6" />

      {/* Black Ninja Headband across forehead */}
      <rect x="33" y="32" width="54" height="12" rx="3" fill="#0f172a" />
      {/* Red circular ninja crest in center */}
      <circle cx="60" cy="38" r="4" fill="#dc2626" />

      {/* Determined Ninja Eyes */}
      <ellipse cx="48" cy="46" rx="5" ry="4" fill="#0f172a" />
      <circle cx="47" cy="45" r="1.5" fill="#ffffff" />
      <ellipse cx="72" cy="46" rx="5" ry="4" fill="#0f172a" />
      <circle cx="71" cy="45" r="1.5" fill="#ffffff" />

      {/* Whiskers */}
      <line x1="32" y1="50" x2="18" y2="48" stroke="#b45309" strokeWidth="1.5" />
      <line x1="32" y1="54" x2="18" y2="56" stroke="#b45309" strokeWidth="1.5" />
      <line x1="88" y1="50" x2="102" y2="48" stroke="#b45309" strokeWidth="1.5" />
      <line x1="88" y1="54" x2="102" y2="56" stroke="#b45309" strokeWidth="1.5" />

      {/* Guarding Front Paws */}
      <ellipse cx={isKicking ? "78" : "48"} cy="72" rx="7" ry="8" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
      <ellipse cx={isKicking ? "92" : "74"} cy="72" rx="7" ry="8" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
    </svg>
  );
}

// Reusable Metallic Dustbin Component
function MetallicDustbin({ binCount }: { binCount: number }) {
  return (
    <div className="flex flex-col items-center">
      {/* Dustbin Lid (Mouth rim) */}
      <div className="w-13 sm:w-15 h-3 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-t-md border border-slate-300 shadow">
        <div className="w-3 h-1 bg-slate-700 mx-auto -mt-1 rounded-t" />
      </div>
      {/* Dustbin Body */}
      <div className="w-11 sm:w-13 h-14 sm:h-16 bg-gradient-to-b from-slate-600 via-slate-800 to-slate-950 border-2 border-slate-400 rounded-b-xl shadow-2xl flex flex-col items-center justify-between py-1 relative">
        <div className="w-full flex justify-around px-1 opacity-30">
          <div className="w-0.5 h-6 bg-slate-300" />
          <div className="w-0.5 h-6 bg-slate-300" />
          <div className="w-0.5 h-6 bg-slate-300" />
        </div>
        <span className="text-[9px] font-black font-mono text-amber-300 bg-slate-950/90 px-1 rounded border border-slate-700 shadow">
          🗑️ {binCount}
        </span>
      </div>
    </div>
  );
}

// 4 distinct trajectory directions for the kicked seconds (1.0s fast, crisp flight)
const KICK_ANIMATIONS = [
  "animate-[kickedFlyFarTopLeft_1s_cubic-bezier(0.15,0.85,0.25,1)_forwards]",
  "animate-[kickedFlyFarStraightLeft_1s_cubic-bezier(0.15,0.85,0.25,1)_forwards]",
  "animate-[kickedFlyFarHighSky_1s_cubic-bezier(0.15,0.85,0.25,1)_forwards]",
  "animate-[kickedFlyFarTopRight_1s_cubic-bezier(0.15,0.85,0.25,1)_forwards]",
];

const COMIC_WORDS = ["💥 POW!", "💥 HII-YAH!", "💥 WHAM!", "💥 KICK!"];

export default function CatCountdownOverlay({ seconds }: CatCountdownOverlayProps) {
  const prevSecRef = useRef<number>(seconds);
  const [activeNum, setActiveNum] = useState<number>(seconds);

  // States: 'idle' | 'grabbing' | 'walking' | 'dumping' | 'returning'
  const [phase, setPhase] = useState<"idle" | "grabbing" | "walking" | "dumping" | "returning">("idle");
  const [isRoaming, setIsRoaming] = useState<boolean>(false);
  const [binCount, setBinCount] = useState<number>(0);
  const [erasingNumbers, setErasingNumbers] = useState<number[]>([]);
  const [ninjaKickNum, setNinjaKickNum] = useState<number | null>(null);
  const [kickDirIndex, setKickDirIndex] = useState<number>(0);

  // 12.5-Second Snappy Grand Roam:
  // Walks UP (0s-2.8s) -> Strolls top (2.8s-5.5s) -> Descends (5.5s-7.5s) ->
  // Snappy Dumping (7.5s-10.1s: 2.6s total!) -> Waddles back home (10.1s-12.5s)
  const startSnappyRoamAndDump = () => {
    if (isRoaming) return;
    setIsRoaming(true);
    setPhase("walking");

    // Phase 1: Walks UP, crosses top, comes DOWN to lower-left (0s - 7.5s)
    setTimeout(() => {
      // Phase 2: Holds dustbin BELOW him and dumps quickly (7.5s - 10.1s: only 2.6s!)
      setPhase("dumping");
      soundEffects.playCannon();
      // 5 collected seconds pour out rapidly with 180ms gap
      setErasingNumbers([
        (seconds + 19) % 60,
        (seconds + 14) % 60,
        (seconds + 9) % 60,
        (seconds + 4) % 60,
        seconds,
      ]);
    }, 7500);

    // Phase 3: Empty bin upright on head, waddles back home (10.1s - 12.5s)
    setTimeout(() => {
      setPhase("returning");
      setBinCount(0);
    }, 10100);

    // Phase 4: Back at desk (12.5s)
    setTimeout(() => {
      setIsRoaming(false);
      setPhase("idle");
      setErasingNumbers([]);
    }, 12500);
  };

  useEffect(() => {
    if (prevSecRef.current === seconds) return;
    const oldSec = prevSecRef.current;
    prevSecRef.current = seconds;
    setActiveNum(oldSec);

    // Collect for 20 seconds, then snappy roam & dump!
    if (seconds % 20 === 0 && !isRoaming) {
      startSnappyRoamAndDump();
      return;
    }

    // While Biltu is on his roaming journey:
    // Ninja Cat KICKS with a clear 450ms leg thrust! Then leg retracts so user clearly sees the leg kick and move!
    if (isRoaming) {
      setNinjaKickNum(oldSec);
      setKickDirIndex((prev) => (prev + 1) % 4);
      soundEffects.playKick();
      const kickTimer = setTimeout(() => {
        setNinjaKickNum(null);
      }, 450); // 450ms kick duration! Leg shoots forward and snaps back so user clearly sees leg moving!
      return () => clearTimeout(kickTimer);
    }

    // Every 3 seconds (seconds % 3 === 0)
    // Biltu pulls the second from top down into the dustbin
    if (seconds % 3 === 0 && !isRoaming) {
      setPhase("grabbing");
      soundEffects.playTrashDrop();
      setBinCount((prev) => Math.min(prev + 1, 50));

      const grabTimer = setTimeout(() => {
        setPhase("idle");
      }, 1000);
      return () => clearTimeout(grabTimer);
    }
  }, [seconds, isRoaming]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-20">
      
      {/* ========================================================================= */}
      {/* 🐱 STATIONARY AT DESK: BILTU & METALLIC DUSTBIN */}
      {/* ========================================================================= */}
      {!isRoaming && (
        <div
          onClick={startSnappyRoamAndDump}
          className="absolute -bottom-7 sm:-bottom-8 right-0 sm:right-2 flex items-end gap-2.5 pointer-events-auto cursor-pointer group select-none transition-transform duration-300 hover:scale-105"
          title="বিল্টুতে ক্লিক করলেই উপরে গিয়ে ঘুরে নিচে এসে ডাস্টবিনের মুখ দিয়ে ময়লা ফেলবে!"
        >
          {/* Metallic Dustbin */}
          <MetallicDustbin binCount={binCount} />

          {/* Biltu Cat */}
          <div className="flex flex-col items-center">
            <div
              className={`w-16 h-20 sm:w-20 sm:h-24 transition-transform duration-300 ${
                phase === "grabbing" ? "-translate-y-3 scale-105" : "translate-y-0"
              }`}
            >
              <BiltuCatSvg isGrabbing={phase === "grabbing"} isCarryingOnHead={false} />
            </div>

            <span className="text-[10px] font-extrabold text-amber-300 mt-0.5 bg-slate-900/95 px-2 py-0.5 rounded-full border border-amber-500/40 shadow">
              বিল্টু 🐱
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🫲 [NUM] 🫱 TWO HANDS PULLING THE NUMBER DOWN FROM TOP INTO DUSTBIN */}
      {/* ========================================================================= */}
      {!isRoaming && phase === "grabbing" && (
        <div
          key={`grab-${activeNum}-${seconds}`}
          className="absolute right-8 sm:right-14 bottom-22 sm:bottom-26 animate-[pullDownFromTopIntoDustbin_1s_cubic-bezier(0.2,0.8,0.2,1)_forwards] z-30 pointer-events-none"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 font-black font-mono text-sm sm:text-base shadow-2xl border-2 border-white">
            <span className="text-base sm:text-lg animate-pulse">🫲</span>
            <span>{String(activeNum).padStart(2, "0")}s</span>
            <span className="text-base sm:text-lg animate-pulse">🫱</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚶‍♂️🐱 12.5-SECOND SNAPPY GRAND ROAMING: */}
      {/* GOES UPWARDS -> CIRCLES TOP -> COMES DOWNWARDS -> DUSTBIN BELOW CAT -> FAST DUMP (2.6s)! */}
      {/* ========================================================================= */}
      {isRoaming && (
        <div className="absolute inset-0">
          
          <div className="absolute -bottom-8 right-2 roam-container flex flex-col items-center z-40 select-none">
            {phase === "dumping" ? (
              /* DUMPING VIEW: Cat on TOP, Dustbin BELOW cat, Borjo pouring DOWNWARDS from mouth! */
              <div className="flex flex-col items-center">
                {/* 1. Biltu looking down with paws extended downward */}
                <div className="w-16 h-20 sm:w-20 sm:h-24">
                  <BiltuCatSvg isGrabbing={false} isCarryingOnHead={false} isDumping={true} />
                </div>

                <span className="text-[10px] font-black text-amber-300 bg-slate-950/95 px-2 py-0.5 rounded-full border border-slate-700 shadow -mt-1 mb-1">
                  বিল্টু 🐱
                </span>

                {/* 2. Dustbin BELOW Biltu ('cat dasbinta cat er niser dike thakbe') */}
                <div className="relative flex flex-col items-center">
                  {/* Tilted dustbin upside-down so the open mouth points DOWNWARDS */}
                  <div className="transform rotate-180 scale-110 drop-shadow-2xl">
                    <MetallicDustbin binCount={0} />
                  </div>

                  {/* 3. Borjo pouring DOWNWARDS briskly from the mouth (2.2s quick dissolve)! */}
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 w-48 flex items-center justify-center pointer-events-none z-50">
                    {erasingNumbers.map((num, i) => (
                      <div
                        key={i}
                        className="absolute top-0 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 text-slate-950 font-black font-mono text-xs sm:text-sm shadow-2xl border-2 border-white whitespace-nowrap opacity-0 animate-[pourDownAndSlowErase_2.2s_cubic-bezier(0.2,0.8,0.2,1)_forwards]"
                        style={{ animationDelay: `${i * 180}ms` }}
                      >
                        {String(num).padStart(2, "0")}s 💨
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* WALKING / RETURNING VIEW: Dustbin ON HEAD */
              <div className="flex flex-col items-center">
                {/* Dustbin ON TOP of head */}
                <div className="relative">
                  <MetallicDustbin binCount={binCount} />
                </div>

                {/* Biltu with paws raised supporting bin on head */}
                <div className="w-16 h-20 sm:w-20 sm:h-24 -mt-3">
                  <BiltuCatSvg isGrabbing={false} isCarryingOnHead={true} isDumping={false} />
                </div>

                <span className="text-[10px] font-black text-amber-300 bg-slate-950/95 px-2 py-0.5 rounded-full border border-slate-700 shadow -mt-1">
                  বিল্টু 🐱
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🥷 NINJA CAT (লাথি মারু): DYNAMIC LEG KICK WITH REAL PUNCH & RETRACTION */}
      {/* ========================================================================= */}
      {isRoaming && (
        <div className="absolute -bottom-7 sm:-bottom-8 right-2 sm:right-6 flex flex-col items-center z-30 select-none">
          <div className="w-24 h-22 sm:w-28 sm:h-26 relative">
            <NinjaCatSvg isKicking={ninjaKickNum !== null} />

            {/* Comic Impact Burst right at foot impact point */}
            {ninjaKickNum !== null && (
              <div className="absolute top-1 -left-12 text-xs sm:text-sm font-black text-amber-300 animate-ping z-40 whitespace-nowrap drop-shadow-md">
                {COMIC_WORDS[kickDirIndex % COMIC_WORDS.length]}
              </div>
            )}
          </div>

          {/* Kicked Number Badge: FLIES IN DIFFERENT DIRECTIONS AT A CRISP 1s PACE */}
          {ninjaKickNum !== null && (
            <div
              key={`ninja-kick-${ninjaKickNum}-${seconds}-${kickDirIndex}`}
              className={`absolute top-2 -left-8 z-50 pointer-events-none ${
                KICK_ANIMATIONS[kickDirIndex % KICK_ANIMATIONS.length]
              }`}
            >
              <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 text-white font-black font-mono text-sm sm:text-base shadow-2xl border-2 border-yellow-200 flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-base sm:text-lg">🐾</span>
                <span>{String(ninjaKickNum).padStart(2, "0")}s</span>
                <span>💨</span>
              </div>
            </div>
          )}

          <span className="text-[10px] font-extrabold text-emerald-400 mt-0.5 bg-slate-900/95 px-2 py-0.5 rounded-full border border-emerald-500/40 shadow">
            লাথি মারু 🥷
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CSS KEYFRAMES */}
      {/* ========================================================================= */}
      <style jsx>{`
        /* 1-second pull down from top (SECS number) down into the Dustbin */
        @keyframes pullDownFromTopIntoDustbin {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1.1);
          }
          25% {
            opacity: 1;
            transform: translate(-5px, 20px) scale(1.05);
          }
          55% {
            opacity: 0.9;
            transform: translate(-12px, 55px) scale(0.9) rotate(8deg);
          }
          80% {
            opacity: 0.7;
            transform: translate(-18px, 80px) scale(0.65) rotate(16deg);
          }
          100% {
            opacity: 0;
            transform: translate(-22px, 100px) scale(0.2) rotate(25deg);
          }
        }

        /* Responsive roaming animation container (12.5 seconds total) */
        .roam-container {
          animation: catRoamUpAcrossDownAndDump 12.5s ease-in-out forwards;
        }

        /* 12.5-second brisk and snappy roaming:
           Upwards (0-2.8s) -> Top stroll (2.8-5.5s) -> Descend (5.5-7.5s) ->
           Snappy Dumping (7.5-10.1s: 2.6s total!) -> Return stroll (10.1-12.5s) */
        @keyframes catRoamUpAcrossDownAndDump {
          0% {
            /* Start: Bottom-Right desk */
            transform: translate(0, 0) scale(1);
          }
          22% {
            /* UPWARDS along right edge to Top-Right */
            transform: translate(0, -185px) scale(1.05);
          }
          34% {
            /* Roams across top edge to Top-Center */
            transform: translate(-200px, -200px) scale(1.1);
          }
          46% {
            /* Roams across top edge to Top-Left */
            transform: translate(-380px, -185px) scale(1.1);
          }
          60% {
            /* Comes DOWNWARDS to Lower-Left */
            transform: translate(-380px, -35px) scale(1.2);
          }
          61% {
            /* DUMPING: Tilted dustbin held BELOW cat, mouth facing DOWN */
            transform: translate(-380px, -35px) scale(1.25);
          }
          80% {
            /* Finishes dumping waste */
            transform: translate(-380px, -35px) scale(1.25);
          }
          81% {
            /* Empty dustbin placed back upright on head */
            transform: translate(-380px, -30px) scale(1.15);
          }
          91% {
            /* Waddles along bottom edge back towards desk */
            transform: translate(-160px, 0px) scale(1.05);
          }
          100% {
            /* Back home at desk */
            transform: translate(0, 0) scale(1);
          }
        }

        /* Mobile adaptation for narrower screens (12.5s) */
        @media (max-width: 639px) {
          @keyframes catRoamUpAcrossDownAndDump {
            0% {
              transform: translate(0, 0) scale(0.95);
            }
            22% {
              transform: translate(0, -165px) scale(1);
            }
            34% {
              transform: translate(-120px, -175px) scale(1.05);
            }
            46% {
              transform: translate(-240px, -165px) scale(1.05);
            }
            60% {
              transform: translate(-240px, -25px) scale(1.1);
            }
            61% {
              transform: translate(-240px, -25px) scale(1.15);
            }
            80% {
              transform: translate(-240px, -25px) scale(1.15);
            }
            81% {
              transform: translate(-240px, -20px) scale(1.05);
            }
            91% {
              transform: translate(-100px, 0px) scale(1);
            }
            100% {
              transform: translate(0, 0) scale(0.95);
            }
          }
        }

        /* Numbers pouring DOWNWARDS quickly directly out of dustbin mouth (2.2s snappy dissolve) */
        @keyframes pourDownAndSlowErase {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.6) rotate(0deg);
            filter: blur(0px);
          }
          10% {
            opacity: 1;
            transform: translate(0, 15px) scale(1) rotate(10deg);
            filter: blur(0px);
          }
          35% {
            opacity: 0.95;
            transform: translate(-10px, 60px) scale(0.95) rotate(35deg);
            filter: blur(0px);
          }
          65% {
            opacity: 0.65;
            transform: translate(-18px, 120px) scale(0.75) rotate(75deg);
            filter: blur(1.5px);
          }
          85% {
            opacity: 0.3;
            transform: translate(-24px, 170px) scale(0.5) rotate(120deg);
            filter: blur(4px);
          }
          100% {
            opacity: 0;
            transform: translate(-28px, 210px) scale(0.2) rotate(160deg);
            filter: blur(7px);
          }
        }

        /* ========================================================================= */
        /* DYNAMIC MARTIAL ARTS KICK ANIMATION: LEG THRUSTS FORWARD & RECOILS */
        /* ========================================================================= */

        @keyframes karateLegWhip {
          0% {
            transform: translate(25px, 15px) scale(0.3) rotate(35deg);
            opacity: 0.4;
          }
          35% {
            /* Powerful snap extension! */
            transform: translate(-10px, -4px) scale(1.2) rotate(-10deg);
            opacity: 1;
          }
          65% {
            /* Holds extension on strike */
            transform: translate(-5px, -2px) scale(1.1) rotate(-6deg);
            opacity: 1;
          }
          100% {
            /* Pulls back */
            transform: translate(15px, 10px) scale(0.6) rotate(20deg);
            opacity: 0.7;
          }
        }

        @keyframes karateTorsoRecoil {
          0% {
            transform: rotate(0deg);
          }
          30% {
            transform: rotate(8deg) translate(3px, 2px);
          }
          70% {
            transform: rotate(4deg) translate(2px, 1px);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        /* ========================================================================= */
        /* MULTIPLE DISTINCT TRAJECTORIES FOR KICKED SECONDS (1.0s FAST PACE) */
        /* ========================================================================= */

        /* Direction 1: High Top-Left Arc */
        @keyframes kickedFlyFarTopLeft {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          25% {
            transform: translate(-70px, -50px) scale(1.25) rotate(-60deg);
          }
          55% {
            transform: translate(-240px, -180px) scale(1.05) rotate(-280deg);
          }
          85% {
            transform: translate(-420px, -320px) scale(0.7) rotate(-560deg);
            opacity: 0.85;
          }
          100% {
            transform: translate(-580px, -440px) scale(0.2) rotate(-780deg);
            opacity: 0;
          }
        }

        /* Direction 2: Bullet Straight Left Across Cards */
        @keyframes kickedFlyFarStraightLeft {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          25% {
            transform: translate(-90px, -15px) scale(1.25) rotate(-45deg);
          }
          55% {
            transform: translate(-320px, -30px) scale(1.05) rotate(-360deg);
          }
          85% {
            transform: translate(-560px, -50px) scale(0.7) rotate(-720deg);
            opacity: 0.85;
          }
          100% {
            transform: translate(-780px, -70px) scale(0.2) rotate(-1080deg);
            opacity: 0;
          }
        }

        /* Direction 3: High Sky Launch Vertically Up */
        @keyframes kickedFlyFarHighSky {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          25% {
            transform: translate(-40px, -90px) scale(1.25) rotate(45deg);
          }
          55% {
            transform: translate(-80px, -260px) scale(1.05) rotate(240deg);
          }
          85% {
            transform: translate(-120px, -420px) scale(0.65) rotate(520deg);
            opacity: 0.85;
          }
          100% {
            transform: translate(-150px, -560px) scale(0.2) rotate(760deg);
            opacity: 0;
          }
        }

        /* Direction 4: Diagonally Up-Right Off Screen */
        @keyframes kickedFlyFarTopRight {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          25% {
            transform: translate(40px, -60px) scale(1.25) rotate(60deg);
          }
          55% {
            transform: translate(160px, -200px) scale(1.05) rotate(320deg);
          }
          85% {
            transform: translate(300px, -340px) scale(0.7) rotate(620deg);
            opacity: 0.85;
          }
          100% {
            transform: translate(440px, -480px) scale(0.2) rotate(880deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
