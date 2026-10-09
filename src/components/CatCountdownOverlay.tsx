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

// Dedicated Vector SVG Ninja Cat (লাথি মারু) - Custom designed karate martial artist!
function NinjaCatSvg({ isKicking }: { isKicking: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-2xl">
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

      {/* Body & Karate Belt */}
      <ellipse cx="60" cy="85" rx="30" ry="26" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
      <ellipse cx="60" cy="88" rx="18" ry="16" fill="#ffffff" />
      {/* Black Martial Arts Belt */}
      <rect x="34" y="80" width="52" height="8" rx="2" fill="#0f172a" />
      <path d="M56 88 L52 104 M62 88 L64 104" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />

      {/* Karate Kick Extended Leg or Fighting Stance */}
      {isKicking ? (
        // Extended high side-kick leg!
        <g className="animate-pulse">
          <path d="M40 85 Q15 75 2 65" stroke="#d97706" strokeWidth="14" strokeLinecap="round" />
          <ellipse cx="2" cy="65" rx="8" ry="6" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
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

// Reusable Metallic Dustbin Component for 100% design consistency
function MetallicDustbin({ binCount, isTipping }: { binCount: number; isTipping?: boolean }) {
  return (
    <div className={`flex flex-col items-center transition-transform duration-500 ${isTipping ? "rotate-180 -translate-y-4 scale-115" : ""}`}>
      {/* Dustbin Lid */}
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

export default function CatCountdownOverlay({ seconds }: CatCountdownOverlayProps) {
  const prevSecRef = useRef<number>(seconds);
  const [activeNum, setActiveNum] = useState<number>(seconds);

  // States: 'idle' | 'grabbing' | 'walking' | 'dumping' | 'returning'
  const [phase, setPhase] = useState<"idle" | "grabbing" | "walking" | "dumping" | "returning">("idle");
  const [isRoaming, setIsRoaming] = useState<boolean>(false);
  const [binCount, setBinCount] = useState<number>(0);
  const [erasingNumbers, setErasingNumbers] = useState<number[]>([]);
  const [ninjaKickNum, setNinjaKickNum] = useState<number | null>(null);

  // 15-Second Grand Roam (moves to Left Side to dump directly from mouth)
  const start15SecRoamAndDump = () => {
    if (isRoaming) return;
    setIsRoaming(true);
    setPhase("walking");

    // Phase 1: Roams around 4 sides to the LEFT SIDE (0s - 7s)
    setTimeout(() => {
      // Phase 2: At Left Side, tips dustbin upside down! (7s - 11.5s)
      setPhase("dumping");
      soundEffects.playCannon();
      // Numbers pouring out of dustbin mouth
      setErasingNumbers([
        (seconds + 19) % 60,
        (seconds + 14) % 60,
        (seconds + 9) % 60,
        (seconds + 4) % 60,
        seconds,
      ]);
    }, 7000);

    // Phase 3: Empty bin upright on head, waddles back along border (11.5s - 15s)
    setTimeout(() => {
      setPhase("returning");
      setBinCount(0);
    }, 11500);

    // Phase 4: Back at desk (15s)
    setTimeout(() => {
      setIsRoaming(false);
      setPhase("idle");
      setErasingNumbers([]);
    }, 15000);
  };

  useEffect(() => {
    if (prevSecRef.current === seconds) return;
    const oldSec = prevSecRef.current;
    prevSecRef.current = seconds;
    setActiveNum(oldSec);

    // EXACT USER SPECIFICATION: Collect for 20 seconds, then dump!
    // Trigger every 20 seconds (at 40s, 20s, 00s)!
    if (seconds % 20 === 0 && !isRoaming) {
      start15SecRoamAndDump();
      return;
    }

    // While Biltu is on his 15s roaming journey:
    // Ninja Cat kicks incoming seconds visibly flying completely out of the website!
    if (isRoaming) {
      setNinjaKickNum(oldSec);
      soundEffects.playKick();
      const kickTimer = setTimeout(() => {
        setNinjaKickNum(null);
      }, 750);
      return () => clearTimeout(kickTimer);
    }

    // EXACT USER SPECIFICATION: Every 3 seconds (seconds % 3 === 0)
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
          onClick={start15SecRoamAndDump}
          className="absolute -bottom-7 sm:-bottom-8 right-0 sm:right-2 flex items-end gap-2.5 pointer-events-auto cursor-pointer group select-none transition-transform duration-300 hover:scale-105"
          title="বিল্টুতে ক্লিক করলেই মাথায় ডাস্টবিন নিয়ে ৪ দিকে ঘুরে বামপাশে ডাম্প শুরু হবে!"
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
      {/* 🚶‍♂️🐱 15-SECOND EXPANSIVE 4-SIDED ROAMING WITH DUSTBIN ON HEAD */}
      {/* MOVES TO THE LEFT SIDE AND DUMPS DIRECTLY OUT OF THE TILTED DUSTBIN MOUTH! */}
      {/* ========================================================================= */}
      {isRoaming && (
        <div className="absolute inset-0">
          
          {/* Walking Biltu carrying the Metallic Dustbin on his Head! */}
          <div className="absolute -bottom-8 right-2 animate-[cat4SidesRoamToLeftDump_15s_ease-in-out_forwards] flex flex-col items-center z-40 select-none">
            
            {/* Dustbin sitting directly ON TOP of Biltu's head! */}
            <div className="relative">
              <MetallicDustbin binCount={binCount} isTipping={phase === "dumping"} />

              {/* NUMBERS POURING DIRECTLY OUT FROM THE MOUTH OF THE TILTED DUSTBIN! */}
              {phase === "dumping" && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-50 pointer-events-none">
                  {erasingNumbers.map((num, i) => (
                    <div
                      key={i}
                      className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 text-slate-950 font-black font-mono text-xs sm:text-sm shadow-2xl border-2 border-white whitespace-nowrap animate-[pourFromMouthAndSlowErase_4.5s_cubic-bezier(0.25,0.8,0.25,1)_forwards]"
                      style={{ animationDelay: `${i * 240}ms` }}
                    >
                      {String(num).padStart(2, "0")}s 💨
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Same SVG Biltu with paws raised up holding the bin on head */}
            <div className="w-16 h-20 sm:w-20 sm:h-24 -mt-3">
              <BiltuCatSvg isGrabbing={false} isCarryingOnHead={true} />
            </div>

            <span className="text-[10px] font-black text-amber-300 bg-slate-950/95 px-2 py-0.5 rounded-full border border-slate-700 shadow -mt-1">
              বিল্টু 🐱
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🥷 NINJA CAT (লাথি মারু): CUSTOM VECTOR SVG MARTIAL ARTIST KICKING SECONDS! */}
      {/* The kicked second visibly flies spinning UP and COMPLETELY OUT OF THE SCREEN! */}
      {/* ========================================================================= */}
      {isRoaming && (
        <div className="absolute -bottom-7 sm:-bottom-8 right-2 sm:right-6 flex flex-col items-center z-30 select-none">
          {/* Custom Vector Ninja Cat */}
          <div className="w-20 h-24 sm:w-24 sm:h-28 relative">
            <NinjaCatSvg isKicking={ninjaKickNum !== null} />

            {/* Big Comic Impact Burst */}
            {ninjaKickNum !== null && (
              <div className="absolute top-4 -left-6 text-sm sm:text-base font-black text-amber-300 animate-ping z-40">
                💥 POW!
              </div>
            )}
          </div>

          {/* Kicked Number Badge: VISIBLY FLIES SPINNING WAY OUT OF THE WEBSITE! */}
          {ninjaKickNum !== null && (
            <div
              key={`ninja-kick-${ninjaKickNum}-${seconds}`}
              className="absolute top-2 right-12 animate-[kickedFlyFarOutOfScreen_0.8s_cubic-bezier(0.1,0.8,0.2,1)_forwards] z-50 pointer-events-none"
            >
              <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 text-white font-black font-mono text-base shadow-2xl border-2 border-yellow-200 flex items-center gap-1">
                <span>🦵</span>
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

        /* 15-second expansive 4-side perimeter roam moving to the LEFT SIDE to dump */
        @keyframes cat4SidesRoamToLeftDump {
          0% {
            /* Start: Bottom-Right */
            transform: translate(0, 0) scale(1);
          }
          18% {
            /* Side 1: Walks along bottom border to Bottom-Left */
            transform: translate(-380px, 12px) scale(1.05);
          }
          35% {
            /* Side 2: Climbs up the entire left border to Top-Left */
            transform: translate(-430px, -170px) scale(1.1);
          }
          50% {
            /* Side 3: Walks along the top border to Top-Center */
            transform: translate(-220px, -170px) scale(1.1);
          }
          60% {
            /* Curves down into the LEFT-CENTER SIDE (over Card 1 / Card 2 ledge) */
            transform: translate(-360px, -90px) scale(1.2);
          }
          72% {
            /* At Left Side: Tipping dustbin upside down to dump directly from mouth */
            transform: translate(-360px, -85px) scale(1.25);
          }
          80% {
            /* Tipping complete, empty bin back upright on head */
            transform: translate(-360px, -90px) scale(1.15);
          }
          90% {
            /* Side 4: Waddles along border path back towards base */
            transform: translate(-100px, -10px) scale(1.05);
          }
          100% {
            /* Back home at Bottom-Right desk */
            transform: translate(0, 0) scale(1);
          }
        }

        /* Numbers pouring directly out from mouth of dustbin downwards and slowly erasing */
        @keyframes pourFromMouthAndSlowErase {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
            filter: blur(0px);
          }
          25% {
            opacity: 0.95;
            transform: translate(-10px, 50px) scale(0.95) rotate(25deg);
            filter: blur(0px);
          }
          50% {
            opacity: 0.75;
            transform: translate(-20px, 120px) scale(0.8) rotate(70deg);
            filter: blur(0.5px);
          }
          75% {
            opacity: 0.4;
            transform: translate(-25px, 200px) scale(0.6) rotate(140deg);
            filter: blur(2px);
          }
          90% {
            opacity: 0.15;
            transform: translate(-30px, 280px) scale(0.35) rotate(220deg);
            filter: blur(4px);
          }
          100% {
            opacity: 0;
            transform: translate(-35px, 340px) scale(0.1) rotate(300deg);
            filter: blur(7px);
          }
        }

        /* Ninja kick: Second visibly flies spinning UP and FAR OUT of the website! */
        @keyframes kickedFlyFarOutOfScreen {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          20% {
            /* Powerful impact impulse */
            transform: translate(-40px, -30px) scale(1.25) rotate(-45deg);
          }
          50% {
            /* Shooting high into the sky */
            transform: translate(-160px, -120px) scale(1) rotate(-220deg);
          }
          80% {
            /* Hurtling far past the screen border */
            transform: translate(-340px, -240px) scale(0.7) rotate(-520deg);
            opacity: 0.8;
          }
          100% {
            /* Completely off-screen and gone! */
            transform: translate(-500px, -340px) scale(0.2) rotate(-720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
