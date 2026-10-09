"use client";

import React, { useEffect, useState, useRef } from "react";
import { soundEffects } from "@/lib/audio";

interface CatCountdownOverlayProps {
  seconds: number;
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

  // 12-Second Grand Roam, Dump & Erase Adventure
  const startGrandRoamAndDump = () => {
    if (isRoaming) return;
    setIsRoaming(true);
    setPhase("walking");

    // Phase 1: Roaming around the perimeter of the countdown (0s - 5.5s)
    setTimeout(() => {
      // Phase 2: At top-left rim, tips dustbin upside down! (5.5s - 9s)
      setPhase("dumping");
      soundEffects.playCannon();
      // Numbers that tumble and erase
      setErasingNumbers([
        (seconds + 50) % 60,
        (seconds + 38) % 60,
        (seconds + 26) % 60,
        (seconds + 14) % 60,
        seconds,
      ]);
    }, 5500);

    // Phase 3: Walking back to base (9s - 12.5s)
    setTimeout(() => {
      setPhase("returning");
      setBinCount(0);
      setErasingNumbers([]);
    }, 9500);

    // Phase 4: Back at desk (12.5s)
    setTimeout(() => {
      setIsRoaming(false);
      setPhase("idle");
    }, 12500);
  };

  useEffect(() => {
    if (prevSecRef.current === seconds) return;
    const oldSec = prevSecRef.current;
    prevSecRef.current = seconds;
    setActiveNum(oldSec);

    // Every 60s (at 00 / 59): Cat goes on the 12-second roaming & dumping journey!
    if ((seconds === 0 || seconds === 59) && !isRoaming) {
      startGrandRoamAndDump();
      return;
    }

    // WHILE BILTU IS ROAMING & DUMPING:
    // Ninja Cat 🥷 guards the SECS card and kicks every second!
    if (isRoaming) {
      setNinjaKickNum(oldSec);
      soundEffects.playKick();
      const kickTimer = setTimeout(() => {
        setNinjaKickNum(null);
      }, 700);
      return () => clearTimeout(kickTimer);
    }

    // NORMAL OPERATION: Exactly every 3 seconds (seconds % 3 === 0)
    // Biltu reaches two hands UP to the number and pulls it down into the dustbin!
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
      {/* 🐱 STATIONARY BASE: BILTU & DUSTBIN ANCHORED AT BOTTOM-RIGHT OUTSIDE DIGITS */}
      {/* Positioned so they do NOT cover the big numbers in the cards! */}
      {/* ========================================================================= */}
      {!isRoaming && (
        <div
          onClick={startGrandRoamAndDump}
          className="absolute -bottom-7 sm:-bottom-8 right-0 sm:right-2 flex items-end gap-2.5 pointer-events-auto cursor-pointer group select-none transition-transform duration-300 hover:scale-105"
          title="বিল্টুতে ক্লিক করলেই ডাস্টবিন নিয়ে ওয়াক ও ডাম্প শুরু হবে!"
        >
          {/* BIG METALLIC DUSTBIN */}
          <div className="flex flex-col items-center">
            {/* Dustbin Lid - Bounces when trash enters */}
            <div
              className={`w-13 sm:w-15 h-3 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-t-md border border-slate-300 shadow transition-transform duration-200 origin-bottom-right ${
                phase === "grabbing" ? "-translate-y-4 -rotate-35 scale-110" : "translate-y-0"
              }`}
            >
              <div className="w-3 h-1 bg-slate-700 mx-auto -mt-1 rounded-t" />
            </div>

            {/* Dustbin Body */}
            <div
              className={`w-11 sm:w-13 h-14 sm:h-16 bg-gradient-to-b from-slate-600 via-slate-800 to-slate-950 border-2 border-slate-400 rounded-b-xl shadow-2xl flex flex-col items-center justify-between py-1 transition-all duration-200 ${
                phase === "grabbing" ? "ring-2 ring-amber-400 scale-105" : ""
              }`}
            >
              {/* Metallic vertical ridges */}
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

          {/* BILTU (BIG EXPRESSIVE CARTOON CAT) */}
          <div className="flex flex-col items-center">
            <div
              className={`w-16 h-20 sm:w-20 sm:h-24 transition-transform duration-200 ${
                phase === "grabbing" ? "-translate-y-3 scale-105" : "translate-y-0"
              }`}
            >
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

                {/* Body & Belly */}
                <ellipse cx="50" cy="85" rx="32" ry="28" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
                <ellipse cx="50" cy="88" rx="20" ry="18" fill="#ffffff" />

                {/* Head */}
                <circle cx="50" cy="45" r="28" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />

                {/* Ears */}
                <polygon points="26,30 32,5 48,22" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
                <polygon points="30,27 34,12 44,22" fill="#f472b6" />
                <polygon points="74,30 68,5 52,22" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
                <polygon points="70,27 66,12 56,22" fill="#f472b6" />

                {/* Expressive Eyes with Sparkles */}
                <ellipse cx="38" cy="42" rx="5" ry="6" fill="#0f172a" />
                <circle cx="36" cy="40" r="2" fill="#ffffff" />
                <ellipse cx="62" cy="42" rx="5" ry="6" fill="#0f172a" />
                <circle cx="60" cy="40" r="2" fill="#ffffff" />

                {/* Nose & Sweet Cat Smile */}
                <polygon points="48,50 52,50 50,53" fill="#f472b6" />
                <path d="M46 53 Q50 57 54 53" fill="none" stroke="#78350f" strokeWidth="2" />

                {/* Whiskers */}
                <line x1="22" y1="48" x2="8" y2="45" stroke="#b45309" strokeWidth="1.5" />
                <line x1="22" y1="52" x2="8" y2="54" stroke="#b45309" strokeWidth="1.5" />
                <line x1="78" y1="48" x2="92" y2="45" stroke="#b45309" strokeWidth="1.5" />
                <line x1="78" y1="52" x2="92" y2="54" stroke="#b45309" strokeWidth="1.5" />

                {/* Two Hands Reaching UP high towards the number when grabbing */}
                <ellipse
                  cx={phase === "grabbing" ? "32" : "38"}
                  cy={phase === "grabbing" ? "48" : "78"}
                  rx="7"
                  ry="9"
                  fill="#ffffff"
                  stroke="#d97706"
                  strokeWidth="2"
                />
                <ellipse
                  cx={phase === "grabbing" ? "48" : "62"}
                  cy={phase === "grabbing" ? "48" : "78"}
                  rx="7"
                  ry="9"
                  fill="#ffffff"
                  stroke="#d97706"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* ONLY Clean Name Badge: বিল্টু 🐱 */}
            <span className="text-[10px] font-extrabold text-amber-300 mt-0.5 bg-slate-900/95 px-2 py-0.5 rounded-full border border-amber-500/40 shadow">
              বিল্টু 🐱
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🫲 [NUM] 🫱 TWO HANDS PULLING THE NUMBER DOWN FROM TOP INTO DUSTBIN */}
      {/* Starts up at the SECS digit, two hands pull it straight down into dustbin! */}
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
      {/* 🚶‍♂️🐱 THE 12-SECOND ROAMING & DUMPING ADVENTURE */}
      {/* Roams along the perimeter (without covering center digits), dumps at top-left! */}
      {/* ========================================================================= */}
      {isRoaming && (
        <div className="absolute inset-0">
          
          {/* Walking Cat carrying the Dustbin - Roams along perimeter path */}
          <div className="absolute -bottom-6 sm:-bottom-8 right-2 animate-[catPerimeterRoamAndDump_12.5s_ease-in-out_forwards] flex flex-col items-center z-40">
            <div className="flex items-center gap-1.5 animate-bounce">
              <span className="text-4xl sm:text-5xl">🐱</span>
              <span
                className={`text-4xl sm:text-5xl transition-transform duration-700 ${
                  phase === "dumping" ? "rotate-180 -translate-y-2 scale-125" : ""
                }`}
              >
                🗑️
              </span>
            </div>
            <span className="text-[10px] font-black text-amber-300 bg-slate-950/90 px-2 py-0.5 rounded-full border border-slate-700 shadow mt-0.5">
              বিল্টু 🐱
            </span>
          </div>

          {/* FALLING & ERASING NUMBERS: */}
          {/* As they fall downwards from the top, they gradually dissolve/erase! */}
          {phase === "dumping" && (
            <div className="absolute top-2 left-6 sm:left-14 flex flex-col gap-2 z-50">
              {erasingNumbers.map((num, i) => (
                <div
                  key={i}
                  className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black font-mono text-sm shadow-2xl border border-white animate-[fallDownAndErase_3.2s_ease-out_forwards]"
                  style={{ animationDelay: `${i * 180}ms` }}
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
      {/* NO TEXT BUBBLE! Clean ninja character with flying kicks! */}
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

            {/* Flying Karate Kick Leg & Impact */}
            {ninjaKickNum !== null && (
              <>
                <div className="absolute -left-6 top-2 text-3xl animate-[ninjaStrikeClean_0.35s_ease-out_forwards]">
                  🦵💨
                </div>
                <div className="absolute -top-4 -left-3 text-xs font-black text-amber-300 animate-ping">
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
      {/* CSS KEYFRAMES: CLEAN, REALISTIC, AND DISSOLVING/ERASING ANIMATION */}
      {/* ========================================================================= */}
      <style jsx>{`
        /* 3-second pull down from top (SECS number) down into the Dustbin opening */
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

        /* 12.5-second perimeter roaming path: walks around the perimeter without obscuring center numbers */
        @keyframes catPerimeterRoamAndDump {
          0% {
            transform: translate(0, 0) scale(1);
          }
          20% {
            /* Roams along the bottom perimeter towards the left */
            transform: translate(-180px, 10px) scale(1.05);
          }
          38% {
            /* Curves up along the left edge towards top-left */
            transform: translate(-380px, -80px) scale(1.1);
          }
          45% {
            /* Reaches top ledge, pauses to dump */
            transform: translate(-420px, -130px) scale(1.15) rotate(-15deg);
          }
          55% {
            /* Tips dustbin completely upside down */
            transform: translate(-430px, -135px) scale(1.2) rotate(-65deg);
          }
          68% {
            /* Dustbin emptied, stands proud */
            transform: translate(-420px, -130px) scale(1.1) rotate(0deg);
          }
          85% {
            /* Waddles back down along the bottom perimeter */
            transform: translate(-140px, 0px) scale(1);
          }
          100% {
            /* Back home at desk */
            transform: translate(0, 0) scale(1);
          }
        }

        /* Tumbling and dissolving/erasing numbers as they fall */
        @keyframes fallDownAndErase {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1) rotate(0deg);
            filter: blur(0px);
          }
          35% {
            opacity: 0.95;
            transform: translateY(60px) scale(0.95) rotate(45deg);
            filter: blur(0px);
          }
          65% {
            opacity: 0.6;
            transform: translateY(130px) scale(0.7) rotate(120deg);
            filter: blur(1.5px);
          }
          85% {
            opacity: 0.25;
            transform: translateY(200px) scale(0.4) rotate(220deg);
            filter: blur(3px);
          }
          100% {
            opacity: 0;
            transform: translateY(260px) scale(0.1) rotate(360deg);
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
