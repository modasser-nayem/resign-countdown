"use client";

import React, { useEffect, useState, useRef } from "react";
import { soundEffects } from "@/lib/audio";

interface CatCountdownOverlayProps {
  seconds: number;
}

export default function CatCountdownOverlay({ seconds }: CatCountdownOverlayProps) {
  const prevSecRef = useRef<number>(seconds);
  const [activeNum, setActiveNum] = useState<number>(seconds);

  // States: 'idle' | 'grabbing_trash' | 'ninja_kick' | 'walking' | 'dumping' | 'returning'
  const [catPhase, setCatPhase] = useState<
    "idle" | "grabbing_trash" | "ninja_kick" | "walking" | "dumping" | "returning"
  >("idle");
  const [isRoaming, setIsRoaming] = useState<boolean>(false);
  const [binCount, setBinCount] = useState<number>(0);
  const [fallingNumbers, setFallingNumbers] = useState<number[]>([]);
  const [ninjaKickedNum, setNinjaKickedNum] = useState<number | null>(null);

  // 12-14 Seconds Grand Walk & Dump Routine
  const startGrandWalkAndDump = () => {
    if (isRoaming) return;
    setIsRoaming(true);
    setCatPhase("walking");

    // Phase 1: Walking across the cards (0s - 5s)
    setTimeout(() => {
      // Phase 2: Cat reaches top ledge, dumps bin downwards! (5s - 9s)
      setCatPhase("dumping");
      soundEffects.playCannon();
      setFallingNumbers([
        (seconds + 48) % 60,
        (seconds + 36) % 60,
        (seconds + 24) % 60,
        (seconds + 12) % 60,
        seconds,
      ]);
    }, 5500);

    // Phase 3: Dusts off paws, walks back (9s - 13s)
    setTimeout(() => {
      setCatPhase("returning");
      setFallingNumbers([]);
      setBinCount(0);
    }, 9500);

    // Phase 4: Back in position (13s)
    setTimeout(() => {
      setIsRoaming(false);
      setCatPhase("idle");
    }, 13000);
  };

  useEffect(() => {
    if (prevSecRef.current === seconds) return;
    const oldSec = prevSecRef.current;
    prevSecRef.current = seconds;
    setActiveNum(oldSec);

    // Automatic trigger: At 00 (once every 60s), initiate the 13-second grand walk and dump!
    if ((seconds === 0 || seconds === 59) && !isRoaming) {
      startGrandWalkAndDump();
      return;
    }

    // WHILE CAT 1 IS ROAMING WITH THE DUSTBIN (13 seconds duration):
    // Ninja Cat 🥷 kicks every incoming second away!
    if (isRoaming) {
      setNinjaKickedNum(oldSec);
      soundEffects.playKick();
      const kickTimer = setTimeout(() => {
        setNinjaKickedNum(null);
      }, 700);
      return () => clearTimeout(kickTimer);
    }

    // NORMAL OPERATION: "proti 4s por por dastbine dalbe"
    // Exactly every 4 seconds (seconds % 4 === 0)
    if (seconds % 4 === 0 && !isRoaming) {
      setCatPhase("grabbing_trash");
      soundEffects.playTrashDrop();
      setBinCount((prev) => Math.min(prev + 1, 40));

      const grabTimer = setTimeout(() => {
        setCatPhase("idle");
      }, 950);
      return () => clearTimeout(grabTimer);
    }
  }, [seconds, isRoaming]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-20">
      
      {/* ========================================================================= */}
      {/* 🐱 BIG CARTOON CAT 1 & BIG DUSTBIN (STATIONARY AT SECONDS CARD) */}
      {/* ========================================================================= */}
      {!isRoaming && (
        <div
          onClick={startGrandWalkAndDump}
          className="absolute -bottom-3 sm:-bottom-4 right-1 sm:right-4 flex items-end gap-2 transition-all duration-300 pointer-events-auto cursor-pointer group"
          title="বিড়াল বা ডাস্টবিনে ক্লিক করলেই ১০-১৫ সেকেন্ডের ওয়াক ও ডাম্প শুরু হবে!"
        >
          
          {/* BIG METALLIC DUSTBIN */}
          <div className="flex flex-col items-center">
            {/* Animated Dustbin Lid */}
            <div
              className={`w-14 sm:w-16 h-3 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-t-md border border-slate-300 shadow-md transition-transform duration-200 ${
                catPhase === "grabbing_trash" ? "-translate-y-3 -rotate-25" : "translate-y-0"
              }`}
            >
              <div className="w-3 h-1.5 bg-slate-600 mx-auto -mt-1.5 rounded-t" />
            </div>

            {/* Dustbin Body */}
            <div
              className={`w-12 sm:w-14 h-14 sm:h-18 bg-gradient-to-b from-slate-600 via-slate-800 to-slate-900 border-2 border-slate-400 rounded-b-xl shadow-2xl flex flex-col items-center justify-between py-1 transition-transform duration-200 ${
                catPhase === "grabbing_trash" ? "scale-105 ring-2 ring-amber-400" : ""
              }`}
            >
              {/* Vertical ribs */}
              <div className="w-full flex justify-around px-1 opacity-40">
                <div className="w-0.5 h-6 bg-slate-300" />
                <div className="w-0.5 h-6 bg-slate-300" />
                <div className="w-0.5 h-6 bg-slate-300" />
              </div>
              <span className="text-[8px] font-black font-mono text-amber-300 uppercase tracking-tighter bg-slate-950/90 px-1 rounded border border-slate-700">
                🗑️ {binCount}
              </span>
            </div>
            <span className="text-[9px] font-bold text-slate-400 mt-0.5">ডাস্টবিন</span>
          </div>

          {/* BIG CARTOON CAT 1 (70px - 90px tall) */}
          <div className="flex flex-col items-center relative">
            {/* Speech bubble */}
            {catPhase === "grabbing_trash" && (
              <div className="absolute -top-9 -left-4 whitespace-nowrap bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xl border border-amber-200 animate-bounce z-30">
                ৪ সেকে. পর ডাস্টবিনে ফেললাম! 🐾
              </div>
            )}

            {/* Big Expressive Cat Vector SVG */}
            <div
              className={`w-16 h-20 sm:w-20 sm:h-24 transition-transform duration-200 ${
                catPhase === "grabbing_trash"
                  ? "-translate-x-3 -translate-y-2 rotate-6 scale-105"
                  : "translate-y-0"
              }`}
            >
              <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-xl">
                {/* Cat Tail */}
                <path
                  d="M75 100 Q95 85 90 65 Q85 55 78 70"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="animate-pulse"
                />

                {/* Cat Body */}
                <ellipse cx="50" cy="85" rx="32" ry="28" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
                {/* White belly patch */}
                <ellipse cx="50" cy="88" rx="20" ry="18" fill="#ffffff" />

                {/* Cat Head */}
                <circle cx="50" cy="45" r="28" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />

                {/* Left Ear */}
                <polygon points="26,30 32,5 48,22" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
                <polygon points="30,27 34,12 44,22" fill="#f472b6" />

                {/* Right Ear */}
                <polygon points="74,30 68,5 52,22" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
                <polygon points="70,27 66,12 56,22" fill="#f472b6" />

                {/* Big Anime Eyes */}
                <ellipse cx="38" cy="42" rx="5" ry="6" fill="#1e293b" />
                <circle cx="36" cy="40" r="2" fill="#ffffff" />
                <ellipse cx="62" cy="42" rx="5" ry="6" fill="#1e293b" />
                <circle cx="60" cy="40" r="2" fill="#ffffff" />

                {/* Cute Pink Nose & Mouth */}
                <polygon points="48,50 52,50 50,53" fill="#f472b6" />
                <path d="M46 53 Q50 57 54 53" fill="none" stroke="#78350f" strokeWidth="2" />

                {/* Whiskers */}
                <line x1="22" y1="48" x2="10" y2="45" stroke="#b45309" strokeWidth="1.5" />
                <line x1="22" y1="52" x2="10" y2="54" stroke="#b45309" strokeWidth="1.5" />
                <line x1="78" y1="48" x2="90" y2="45" stroke="#b45309" strokeWidth="1.5" />
                <line x1="78" y1="52" x2="90" y2="54" stroke="#b45309" strokeWidth="1.5" />

                {/* Moving Front Paws */}
                <ellipse
                  cx={catPhase === "grabbing_trash" ? "30" : "38"}
                  cy={catPhase === "grabbing_trash" ? "70" : "78"}
                  rx="7"
                  ry="9"
                  fill="#ffffff"
                  stroke="#d97706"
                  strokeWidth="2"
                />
                <ellipse
                  cx={catPhase === "grabbing_trash" ? "42" : "62"}
                  cy={catPhase === "grabbing_trash" ? "70" : "78"}
                  rx="7"
                  ry="9"
                  fill="#ffffff"
                  stroke="#d97706"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <span className="text-[9px] font-bold text-amber-300 mt-0.5 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700">
              বিল্টু বিড়াল 🐱
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🫲 [NUM] 🫱 THE GRABBED SECOND FLYING FROM SECS CARD INTO BIG DUSTBIN */}
      {/* ========================================================================= */}
      {!isRoaming && catPhase === "grabbing_trash" && (
        <div
          key={`grab-${activeNum}-${seconds}`}
          className="absolute right-12 sm:right-24 bottom-16 sm:bottom-20 animate-[grabArcIntoBin_0.9s_cubic-bezier(0.2,0.8,0.2,1)_forwards] z-30"
        >
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 font-black font-mono text-base sm:text-lg shadow-2xl border-2 border-white">
            <span>🐾</span>
            <span>{String(activeNum).padStart(2, "0")}s</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚶‍♂️🐱 THE 12-14 SECOND GRAND WALK & DUMP ACROSS THE CARDS */}
      {/* ========================================================================= */}
      {isRoaming && (
        <div className="absolute inset-0 flex items-center justify-center">
          
          {/* Walking Cat carrying the Big Dustbin */}
          <div className="absolute bottom-6 sm:bottom-8 animate-[cat13SecWalkAndDump_13s_ease-in-out_forwards] flex flex-col items-center z-40">
            {/* Dynamic speech bubble during the walk */}
            <div className="whitespace-nowrap bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-2xl border border-red-300 animate-pulse mb-1">
              {catPhase === "dumping"
                ? "💥 উপরে এসে সব সেকেন্ড নিচে ফেলে দিলাম!"
                : catPhase === "returning"
                ? "✨ ডাস্টবিন একদম খালি! ফিরছি ডেস্কে 🐾"
                : "🚶‍♂️ ডাস্টবিন মাথায় নিয়ে কিনারায় যাচ্ছি... (১০-১৫ সে.)"}
            </div>

            {/* Walking Cat with Dustbin on shoulders */}
            <div className="flex items-center gap-1.5 animate-bounce">
              <span className="text-4xl sm:text-5xl">🐱</span>
              <span className={`text-4xl sm:text-5xl transition-transform duration-500 ${catPhase === "dumping" ? "rotate-180 scale-125" : ""}`}>
                🗑️
              </span>
            </div>
          </div>

          {/* Falling / Cascading Shower of Scattered Numbers when dumped over the ledge */}
          {catPhase === "dumping" && (
            <div className="absolute top-12 left-4 sm:left-12 flex flex-wrap gap-2 max-w-[200px] z-50">
              {fallingNumbers.map((num, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-lg bg-amber-400 text-slate-950 font-black font-mono text-sm shadow-2xl border border-white animate-[cascadeDownAndFade_3s_ease-in_forwards]"
                  style={{ animationDelay: `${i * 180}ms` }}
                >
                  {String(num).padStart(2, "0")}s
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🥷 NINJA CAT (লাথি মারু): GUARDS SECS CARD & KICKS SECONDS AWAY DURING THE WALK */}
      {/* ========================================================================= */}
      {isRoaming && (
        <div className="absolute -bottom-2 sm:-bottom-3 right-4 sm:right-10 flex flex-col items-center z-30">
          
          {/* Speech bubble for Ninja Cat */}
          <div className="whitespace-nowrap bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xl border border-emerald-300 animate-bounce mb-1">
            বিল্টু বাইরে, লাথি মারু অন ডিউটি! 🥷🦵
          </div>

          {/* Big Ninja Cat */}
          <div className="relative">
            <div
              className={`text-4xl sm:text-5xl transition-transform duration-150 ${
                ninjaKickedNum !== null
                  ? "-translate-x-4 -translate-y-4 rotate-[-25deg] scale-125"
                  : ""
              }`}
            >
              🥷🐱
            </div>

            {/* Flying Karate Kick Leg */}
            {ninjaKickedNum !== null && (
              <>
                <div className="absolute -left-6 top-2 text-3xl animate-[ninjaStrikeBig_0.35s_ease-out_forwards]">
                  🦵💨
                </div>
                <div className="absolute -top-4 -left-4 text-sm font-black text-amber-300 animate-ping">
                  💥 POW!
                </div>
              </>
            )}
          </div>

          {/* Kicked Flying Number Badge */}
          {ninjaKickedNum !== null && (
            <div
              key={`ninja-kick-${ninjaKickedNum}-${seconds}`}
              className="absolute -top-8 -left-12 animate-[ninjaKickedFlyOff_0.75s_cubic-bezier(0.1,0.8,0.2,1)_forwards]"
            >
              <div className="px-2.5 py-1 rounded-xl bg-orange-500 text-white font-black font-mono text-base shadow-2xl border-2 border-yellow-300">
                {String(ninjaKickedNum).padStart(2, "0")}s
              </div>
            </div>
          )}
          <span className="text-[9px] font-bold text-emerald-400 mt-0.5 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700">
            লাথি মারু 🥷
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* KEYFRAMES FOR THE ENTIRE 13-SECOND ADVENTURE & 4-SEC GRAB */}
      {/* ========================================================================= */}
      <style jsx>{`
        @keyframes grabArcIntoBin {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          40% {
            transform: translate(35px, -45px) scale(1.2) rotate(45deg);
          }
          75% {
            transform: translate(65px, 10px) scale(0.7) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: translate(80px, 35px) scale(0.2) rotate(270deg);
          }
        }

        /* 13-second walking routine: roaming across from right to left, climbing up, dumping, and walking back */
        @keyframes cat13SecWalkAndDump {
          0% {
            transform: translate(140px, 0) scale(1);
          }
          20% {
            /* Roaming towards center */
            transform: translate(20px, -10px) scale(1.05);
          }
          40% {
            /* Roaming towards top/left ledge */
            transform: translate(-140px, -40px) scale(1.1);
          }
          45% {
            /* Climbing up to the edge */
            transform: translate(-180px, -60px) scale(1.15) rotate(-15deg);
          }
          55% {
            /* Tipping bin completely upside down to dump */
            transform: translate(-190px, -65px) scale(1.2) rotate(-55deg);
          }
          70% {
            /* Bin empty, pausing */
            transform: translate(-180px, -60px) scale(1.1) rotate(0deg);
          }
          85% {
            /* Waddling back across the arena */
            transform: translate(-40px, -15px) scale(1);
          }
          100% {
            /* Back at the desk */
            transform: translate(140px, 0) scale(1);
          }
        }

        @keyframes cascadeDownAndFade {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.9;
            transform: translateY(80px) scale(0.85) rotate(45deg);
          }
          100% {
            opacity: 0;
            transform: translateY(180px) scale(0.2) rotate(180deg);
          }
        }

        @keyframes ninjaStrikeBig {
          0% {
            opacity: 0;
            transform: translateX(15px) rotate(20deg);
          }
          50% {
            opacity: 1;
            transform: translateX(-20px) rotate(-30deg);
          }
          100% {
            opacity: 0;
            transform: translateX(-35px) rotate(-45deg);
          }
        }

        @keyframes ninjaKickedFlyOff {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          30% {
            transform: translate(-40px, -35px) scale(1.2) rotate(-60deg);
          }
          70% {
            transform: translate(-120px, -80px) scale(0.8) rotate(-220deg);
          }
          100% {
            opacity: 0;
            transform: translate(-220px, -130px) scale(0.1) rotate(-480deg);
          }
        }
      `}</style>
    </div>
  );
}
