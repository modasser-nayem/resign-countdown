"use client";

import React, { useEffect, useState, useRef } from "react";
import { soundEffects } from "@/lib/audio";

interface CatCountdownOverlayProps {
  seconds: number;
}

// Reusable SVG Biltu component for 100% design consistency
function BiltuCatSvg({ isGrabbing, isCarryingOnHead }: { isGrabbing?: boolean; isCarryingOnHead?: boolean }) {
  return (
    <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl">
      {/* Wagging Tail */}
      <path
        d="M75 100 Q95 85 92 65 Q88 55 80 68"
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

      {/* Big Eyes with Sparkles */}
      <ellipse cx="38" cy="42" rx="5" ry="6" fill="#0f172a" />
      <circle cx="36" cy="40" r="2" fill="#ffffff" />
      <ellipse cx="62" cy="42" rx="5" ry="6" fill="#0f172a" />
      <circle cx="60" cy="40" r="2" fill="#ffffff" />

      {/* Nose & Smile */}
      <polygon points="48,50 52,50 50,53" fill="#f472b6" />
      <path d="M46 53 Q50 57 54 53" fill="none" stroke="#78350f" strokeWidth="2" />

      {/* Whiskers */}
      <line x1="22" y1="48" x2="8" y2="45" stroke="#b45309" strokeWidth="1.5" />
      <line x1="22" y1="52" x2="8" y2="54" stroke="#b45309" strokeWidth="1.5" />
      <line x1="78" y1="48" x2="92" y2="45" stroke="#b45309" strokeWidth="1.5" />
      <line x1="78" y1="52" x2="92" y2="54" stroke="#b45309" strokeWidth="1.5" />

      {/* Paws */}
      {isCarryingOnHead ? (
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

// Reusable Metallic Dustbin Component for 100% design consistency
function MetallicDustbin({ binCount, isTipping }: { binCount: number; isTipping?: boolean }) {
  return (
    <div className={`flex flex-col items-center transition-transform duration-300 ${isTipping ? "rotate-180 -translate-y-3 scale-110" : ""}`}>
      {/* Dustbin Lid */}
      <div className="w-13 sm:w-15 h-3 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-t-md border border-slate-300 shadow">
        <div className="w-3 h-1 bg-slate-700 mx-auto -mt-1 rounded-t" />
      </div>
      {/* Dustbin Body */}
      <div className="w-11 sm:w-13 h-14 sm:h-16 bg-gradient-to-b from-slate-600 via-slate-800 to-slate-950 border-2 border-slate-400 rounded-b-xl shadow-2xl flex flex-col items-center justify-between py-1">
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

export default function CatCountdownOverlay({ seconds }: CatCountdownOverlayProps) {
  const prevSecRef = useRef<number>(seconds);
  const [activeNum, setActiveNum] = useState<number>(seconds);

  // States: 'idle' | 'grabbing' | 'walking' | 'dumping' | 'returning'
  const [phase, setPhase] = useState<"idle" | "grabbing" | "walking" | "dumping" | "returning">("idle");
  const [isRoaming, setIsRoaming] = useState<boolean>(false);
  const [binCount, setBinCount] = useState<number>(0);
  const [erasingNumbers, setErasingNumbers] = useState<number[]>([]);
  const [ninjaKickNum, setNinjaKickNum] = useState<number | null>(null);

  // 10-Second Grand Roam (4 sides) & Center Dump Routine
  const start10SecRoamAndDump = () => {
    if (isRoaming) return;
    setIsRoaming(true);
    setPhase("walking");

    // Phase 1: Roams around the 4 sides to the center (0s - 6s)
    setTimeout(() => {
      // Phase 2: Arrives at Center Screen, turns bin upside down! (6s - 8s)
      setPhase("dumping");
      soundEffects.playCannon();
      setErasingNumbers([
        (seconds + 25) % 60,
        (seconds + 18) % 60,
        (seconds + 11) % 60,
        (seconds + 4) % 60,
        seconds,
      ]);
    }, 6000);

    // Phase 3: Empty bin upright on head, waddles back (8s - 10s)
    setTimeout(() => {
      setPhase("returning");
      setBinCount(0);
      setErasingNumbers([]);
    }, 8000);

    // Phase 4: Back in place (10s)
    setTimeout(() => {
      setIsRoaming(false);
      setPhase("idle");
    }, 10000);
  };

  useEffect(() => {
    if (prevSecRef.current === seconds) return;
    const oldSec = prevSecRef.current;
    prevSecRef.current = seconds;
    setActiveNum(oldSec);

    // EXACT REQUIREMENT: Trigger every 30 seconds (at 30s and at 00s)!
    if ((seconds === 30 || seconds === 0) && !isRoaming) {
      start10SecRoamAndDump();
      return;
    }

    // While Biltu is on his 10s journey:
    // Ninja Cat kicks incoming seconds away
    if (isRoaming) {
      setNinjaKickNum(oldSec);
      soundEffects.playKick();
      const kickTimer = setTimeout(() => {
        setNinjaKickNum(null);
      }, 700);
      return () => clearTimeout(kickTimer);
    }

    // EXACT REQUIREMENT: Every 3 seconds (seconds % 3 === 0)
    // Biltu pulls the second from the top down into the dustbin!
    if (seconds % 3 === 0 && !isRoaming) {
      setPhase("grabbing");
      soundEffects.playTrashDrop();
      setBinCount((prev) => Math.min(prev + 1, 50));

      const grabTimer = setTimeout(() => {
        setPhase("idle");
      }, 950);
      return () => clearTimeout(grabTimer);
    }
  }, [seconds, isRoaming]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-20">
      
      {/* ========================================================================= */}
      {/* 🐱 STATIONARY AT DESK: EXACT SAME SVG BILTU & METALLIC DUSTBIN */}
      {/* Positioned at bottom-right outside the digits */}
      {/* ========================================================================= */}
      {!isRoaming && (
        <div
          onClick={start10SecRoamAndDump}
          className="absolute -bottom-7 sm:-bottom-8 right-0 sm:right-2 flex items-end gap-2.5 pointer-events-auto cursor-pointer group select-none transition-transform duration-300 hover:scale-105"
          title="বিল্টুতে ক্লিক করলেই মাথায় ডাস্টবিন নিয়ে ১০ সেকেন্ডের ওয়াক ও মাঝখানে ডাম্প শুরু হবে!"
        >
          {/* Metallic Dustbin */}
          <MetallicDustbin binCount={binCount} isTipping={false} />

          {/* Biltu Cat */}
          <div className="flex flex-col items-center">
            <div
              className={`w-16 h-20 sm:w-20 sm:h-24 transition-transform duration-200 ${
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
      {/* Every 3 seconds, starts up at the SECS digit, pulls straight down into bin! */}
      {/* ========================================================================= */}
      {!isRoaming && phase === "grabbing" && (
        <div
          key={`grab-${activeNum}-${seconds}`}
          className="absolute right-8 sm:right-14 bottom-22 sm:bottom-26 animate-[pullDownFromTopIntoDustbin_0.9s_cubic-bezier(0.25,0.8,0.25,1)_forwards] z-30 pointer-events-none"
        >
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 font-black font-mono text-sm sm:text-base shadow-2xl border-2 border-white">
            <span className="text-base sm:text-lg animate-pulse">🫲</span>
            <span>{String(activeNum).padStart(2, "0")}s</span>
            <span className="text-base sm:text-lg animate-pulse">🫱</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚶‍♂️🐱 10-SECOND ROAMING AROUND 4 SIDES WITH DUSTBIN ON HEAD */}
      {/* DUMPS FROM THE CENTER OF THE SCREEN DOWNWARDS WITH SMOOTH ERASING! */}
      {/* Uses the EXACT SAME SVG Biltu and EXACT SAME Metallic Dustbin on his head! */}
      {/* ========================================================================= */}
      {isRoaming && (
        <div className="absolute inset-0">
          
          {/* Walking Biltu carrying the Metallic Dustbin on his Head! */}
          <div className="absolute -bottom-8 right-2 animate-[cat4SidesRoamToCenterDump_10s_ease-in-out_forwards] flex flex-col items-center z-40 select-none">
            {/* Dustbin sitting directly ON TOP of Biltu's head! */}
            <div className={`transition-transform duration-500 origin-bottom ${phase === "dumping" ? "rotate-180 -translate-y-3 scale-110" : ""}`}>
              <MetallicDustbin binCount={binCount} isTipping={phase === "dumping"} />
            </div>

            {/* Same SVG Biltu with paws raised up holding the bin on head */}
            <div className="w-16 h-20 sm:w-20 sm:h-24 -mt-3">
              <BiltuCatSvg isGrabbing={false} isCarryingOnHead={true} />
            </div>

            <span className="text-[10px] font-black text-amber-300 bg-slate-950/95 px-2 py-0.5 rounded-full border border-slate-700 shadow -mt-1">
              বিল্টু 🐱
            </span>
          </div>

          {/* DUMPING FROM SCREEN CENTER DOWNWARDS WITH GRADUAL ERASING! */}
          {phase === "dumping" && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-50 pointer-events-none">
              {erasingNumbers.map((num, i) => (
                <div
                  key={i}
                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black font-mono text-sm shadow-2xl border-2 border-white animate-[centerCascadeDownAndErase_2.8s_ease-out_forwards]"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  {String(num).padStart(2, "0")}s 💨
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🥷 NINJA CAT (লাথি মারু): GUARDS SECS CARD DURING BILTU'S ROAMING */}
      {/* ========================================================================= */}
      {isRoaming && (
        <div className="absolute -bottom-6 sm:-bottom-7 right-2 sm:right-6 flex flex-col items-center z-30 select-none">
          <div className="relative">
            <div
              className={`text-4xl sm:text-5xl transition-transform duration-150 ${
                ninjaKickNum !== null
                  ? "-translate-x-4 -translate-y-4 rotate-[-25deg] scale-125"
                  : ""
              }`}
            >
              🥷🐱
            </div>

            {/* Flying Karate Kick Leg */}
            {ninjaKickNum !== null && (
              <>
                <div className="absolute -left-6 top-2 text-3xl animate-[ninjaStrikeClean_0.35s_ease-out_forwards]">
                  🦵💨
                </div>
                <div className="absolute -top-4 -left-3 text-sm font-black text-amber-300 animate-ping">
                  💥 POW!
                </div>
              </>
            )}
          </div>

          {/* Flying Kicked Number Badge */}
          {ninjaKickNum !== null && (
            <div
              key={`ninja-kick-${ninjaKickNum}-${seconds}`}
              className="absolute -top-6 -left-10 animate-[kickedFlyAwayClean_0.75s_cubic-bezier(0.1,0.8,0.2,1)_forwards]"
            >
              <div className="px-2 py-0.5 rounded-lg bg-orange-500 text-white font-black font-mono text-sm sm:text-base shadow-2xl border-2 border-yellow-300">
                {String(ninjaKickNum).padStart(2, "0")}s
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
        /* 3-second pull down from top (SECS number) down into the Dustbin */
        @keyframes pullDownFromTopIntoDustbin {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1.1);
          }
          35% {
            transform: translate(-10px, 35px) scale(0.95);
          }
          70% {
            transform: translate(-18px, 75px) scale(0.7) rotate(10deg);
          }
          100% {
            opacity: 0;
            transform: translate(-22px, 98px) scale(0.2) rotate(25deg);
          }
        }

        /* 10-second 4-side perimeter roam reaching Screen Center to dump */
        @keyframes cat4SidesRoamToCenterDump {
          0% {
            /* Start: Bottom-Right */
            transform: translate(0, 0) scale(1);
          }
          20% {
            /* Side 1: Walks along bottom edge to Bottom-Left */
            transform: translate(-320px, 0px) scale(1.05);
          }
          40% {
            /* Side 2: Walks up the left edge to Top-Left */
            transform: translate(-350px, -150px) scale(1.1);
          }
          55% {
            /* Side 3: Walks along top edge to SCREEN CENTER */
            transform: translate(-180px, -150px) scale(1.15);
          }
          65% {
            /* At Screen Center: Tips bin upside down to dump */
            transform: translate(-180px, -145px) scale(1.2);
          }
          75% {
            /* Empty bin back upright on head */
            transform: translate(-180px, -150px) scale(1.15);
          }
          90% {
            /* Side 4: Walks down right perimeter back towards base */
            transform: translate(-50px, -40px) scale(1.05);
          }
          100% {
            /* Back home at Bottom-Right desk */
            transform: translate(0, 0) scale(1);
          }
        }

        /* Center cascade downwards with gradual dissolving/erasing */
        @keyframes centerCascadeDownAndErase {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1) rotate(0deg);
            filter: blur(0px);
          }
          30% {
            opacity: 0.95;
            transform: translateY(40px) scale(0.95) rotate(25deg);
            filter: blur(0px);
          }
          60% {
            opacity: 0.6;
            transform: translateY(90px) scale(0.7) rotate(90deg);
            filter: blur(1.5px);
          }
          85% {
            opacity: 0.25;
            transform: translateY(150px) scale(0.4) rotate(180deg);
            filter: blur(3px);
          }
          100% {
            opacity: 0;
            transform: translateY(210px) scale(0.1) rotate(270deg);
            filter: blur(6px);
          }
        }

        @keyframes ninjaStrikeClean {
          0% {
            opacity: 0;
            transform: translateX(10px) rotate(15deg);
          }
          50% {
            opacity: 1;
            transform: translateX(-15px) rotate(-25deg);
          }
          100% {
            opacity: 0;
            transform: translateX(-25px) rotate(-40deg);
          }
        }

        @keyframes kickedFlyAwayClean {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          30% {
            transform: translate(-35px, -30px) scale(1.15) rotate(-60deg);
          }
          70% {
            transform: translate(-100px, -70px) scale(0.8) rotate(-220deg);
          }
          100% {
            opacity: 0;
            transform: translate(-190px, -120px) scale(0.1) rotate(-480deg);
          }
        }
      `}</style>
    </div>
  );
}
