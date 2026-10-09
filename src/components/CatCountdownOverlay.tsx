"use client";

import React, { useEffect, useState, useRef } from "react";
import { soundEffects } from "@/lib/audio";

interface CatCountdownOverlayProps {
  seconds: number;
}

export default function CatCountdownOverlay({ seconds }: CatCountdownOverlayProps) {
  const prevSecRef = useRef<number>(seconds);
  const [activeNum, setActiveNum] = useState<number>(seconds);

  // States:
  // 'idle' | 'grabbing_trash' | 'ninja_kick' | 'walking_to_dump'
  const [catState, setCatState] = useState<"idle" | "grabbing_trash" | "ninja_kick" | "walking_to_dump">("idle");
  const [isDumping, setIsDumping] = useState<boolean>(false);
  const [binCount, setBinCount] = useState<number>(0);
  const [scatteredNumbers, setScatteredNumbers] = useState<number[]>([]);

  // Trigger walking & dumping
  const startWalkAndDump = () => {
    setIsDumping(true);
    setCatState("walking_to_dump");
    setScatteredNumbers([
      (seconds + 10) % 60,
      (seconds + 24) % 60,
      (seconds + 37) % 60,
      (seconds + 49) % 60,
      seconds,
    ]);

    // Duration of walking, dumping, and walking back: 3.5 seconds
    setTimeout(() => {
      setBinCount(0);
      setIsDumping(false);
      setCatState("idle");
      setScatteredNumbers([]);
    }, 3500);
  };

  useEffect(() => {
    if (prevSecRef.current === seconds) return;
    const oldSec = prevSecRef.current;
    prevSecRef.current = seconds;
    setActiveNum(oldSec);

    // If 60s reached (seconds === 0 or 59), trigger walk & dump!
    if ((seconds === 0 || seconds === 59) && !isDumping) {
      startWalkAndDump();
      return;
    }

    // While Cat 1 is walking & dumping, Ninja Cat 🥷 kicks the seconds away!
    if (isDumping) {
      setCatState("ninja_kick");
      const timer = setTimeout(() => {
        if (isDumping) setCatState("walking_to_dump");
      }, 700);
      return () => clearTimeout(timer);
    }

    // Normal operation (every 2-3 seconds):
    // Cat 1 reaches over the SECS card and throws second into dustbin
    if (seconds % 2 === 0) {
      setCatState("grabbing_trash");
      setBinCount((prev) => Math.min(prev + 1, 30));

      const timer = setTimeout(() => {
        setCatState("idle");
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [seconds, isDumping]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-20">
      
      {/* ========================================================================= */}
      {/* 🐱 BIG CAT 1 & DUSTBIN: Situated by the SECS card (bottom-right / 4th col) */}
      {/* ========================================================================= */}
      {!isDumping && (
        <div className="absolute right-2 sm:right-6 bottom-4 sm:bottom-6 flex items-end gap-1.5 transition-all duration-300">
          
          {/* Dustbin with lid & count */}
          <div className="flex flex-col items-center">
            <span
              className={`text-2xl sm:text-3xl transition-transform duration-200 ${
                catState === "grabbing_trash" ? "-translate-y-2 -rotate-12 scale-110" : "translate-y-0"
              }`}
            >
              🗑️
            </span>
            <span className="text-[8px] sm:text-[9px] font-mono font-bold text-amber-300 bg-slate-950/90 px-1 rounded border border-slate-700 shadow -mt-1">
              {binCount}
            </span>
          </div>

          {/* Big White/Orange Cartoon Cat */}
          <div className="flex flex-col items-center relative">
            {/* Speech bubble for Cat 1 */}
            {catState === "grabbing_trash" && (
              <div className="absolute -top-7 right-0 whitespace-nowrap bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-lg border border-amber-300 animate-bounce">
                ডাস্টবিনে ফেললাম! 🐾
              </div>
            )}

            {/* Cat Character */}
            <div
              className={`text-3xl sm:text-4xl transition-transform duration-200 select-none ${
                catState === "grabbing_trash"
                  ? "-translate-x-2 -translate-y-2 rotate-6 scale-110"
                  : "translate-y-0"
              }`}
            >
              🐱
            </div>
            
            {/* Animated Paws reaching out */}
            <div className="flex items-center gap-1 -mt-1">
              <span
                className={`text-xs transition-transform duration-200 ${
                  catState === "grabbing_trash" ? "-translate-x-2 -translate-y-2 scale-125" : ""
                }`}
              >
                🐾
              </span>
              <span
                className={`text-xs transition-transform duration-200 ${
                  catState === "grabbing_trash" ? "translate-x-1 -translate-y-1 scale-125" : ""
                }`}
              >
                🐾
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🫲 [NUM] 🫱 THE GRABBED SECOND ARCING FROM SECS CARD INTO DUSTBIN */}
      {/* ========================================================================= */}
      {!isDumping && catState === "grabbing_trash" && (
        <div
          key={`grab-${activeNum}-${seconds}`}
          className="absolute right-8 sm:right-16 bottom-10 sm:bottom-14 animate-[arcIntoTrash_0.75s_cubic-bezier(0.2,0.8,0.2,1)_forwards]"
        >
          <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 font-black font-mono text-sm sm:text-base shadow-xl border border-white">
            <span>🐾</span>
            <span>{String(activeNum).padStart(2, "0")}s</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚶‍♂️🐱 CAT 1 WALKING WITH FULL DUSTBIN ACROSS THE CARDS AND DUMPING OVER THE EDGE */}
      {/* ========================================================================= */}
      {isDumping && (
        <div className="absolute inset-0 flex items-center justify-center">
          
          {/* Walking Cat carrying the dustbin */}
          <div className="absolute bottom-6 sm:bottom-8 animate-[catWalkAcrossAndDump_3.5s_ease-in-out_forwards] flex flex-col items-center">
            {/* Speech bubble */}
            <div className="whitespace-nowrap bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xl border border-red-300 animate-pulse mb-1">
              ডাস্টবিন খালি করতে যাচ্ছি! 🚶‍♂️💨
            </div>

            {/* Cat with Dustbin on shoulders */}
            <div className="flex items-center gap-1 text-3xl sm:text-4xl animate-bounce">
              <span>🐱</span>
              <span className="scale-110">🗑️</span>
            </div>
          </div>

          {/* Raining / Falling Scattered Numbers when dumped at the edge */}
          <div className="absolute bottom-0 left-4 sm:left-12 flex gap-2">
            {scatteredNumbers.map((num, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black font-mono text-xs shadow-lg animate-[fallAndFade_1.8s_ease-in_forwards]"
                style={{ animationDelay: `${1.2 + i * 0.15}s` }}
              >
                {String(num).padStart(2, "0")}s
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🥷 NINJA CAT: LEAPS IN AND KARATE KICKS SECONDS WHILE CAT 1 IS DUMPING TRASH */}
      {/* ========================================================================= */}
      {isDumping && (
        <div className="absolute right-4 sm:right-10 bottom-6 sm:bottom-8 flex flex-col items-center z-30">
          
          {/* Speech bubble for Ninja Cat */}
          <div className="whitespace-nowrap bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow border border-emerald-300 animate-bounce mb-1">
            লাথি মারু অন ডিউটি! 🥷🦵
          </div>

          {/* Ninja Cat */}
          <div className="relative">
            <div
              className={`text-3xl sm:text-4xl transition-transform duration-150 ${
                catState === "ninja_kick"
                  ? "-translate-x-3 -translate-y-3 rotate-[-20deg] scale-125"
                  : ""
              }`}
            >
              🥷🐱
            </div>

            {/* Flying Karate Kick Leg & Impact */}
            {catState === "ninja_kick" && (
              <>
                <div className="absolute -left-4 top-1 text-2xl animate-[ninjaStrike_0.35s_ease-out_forwards]">
                  🦵💨
                </div>
                <div className="absolute -top-3 -left-2 text-xs font-black text-amber-300 animate-ping">
                  💥 POW!
                </div>
              </>
            )}
          </div>

          {/* Kicked flying number badge flying off */}
          {catState === "ninja_kick" && (
            <div
              key={`kick-${activeNum}-${seconds}`}
              className="absolute -top-6 -left-8 animate-[kickedFlyAway_0.7s_cubic-bezier(0.1,0.8,0.2,1)_forwards]"
            >
              <div className="px-2 py-0.5 rounded-lg bg-orange-500 text-white font-black font-mono text-sm sm:text-base shadow-xl border border-yellow-300">
                {String(activeNum).padStart(2, "0")}s
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* KEYFRAME ANIMATIONS FOR THE ENTIRE LIVING OVERLAY THEATER */}
      {/* ========================================================================= */}
      <style jsx>{`
        @keyframes arcIntoTrash {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          40% {
            transform: translate(25px, -30px) scale(1.15) rotate(45deg);
          }
          75% {
            transform: translate(45px, 5px) scale(0.7) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: translate(55px, 25px) scale(0.2) rotate(270deg);
          }
        }

        @keyframes catWalkAcrossAndDump {
          0% {
            transform: translateX(120px) scale(1);
          }
          30% {
            transform: translateX(-40px) scale(1);
          }
          45% {
            /* Tilting dustbin to dump */
            transform: translateX(-120px) rotate(-35deg) scale(1.1);
          }
          65% {
            /* Dustbin emptied, shaking */
            transform: translateX(-120px) rotate(-45deg) scale(1.05);
          }
          75% {
            transform: translateX(-80px) rotate(0deg) scale(1);
          }
          100% {
            /* Walking back */
            transform: translateX(120px) scale(1);
          }
        }

        @keyframes fallAndFade {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1) rotate(0deg);
          }
          50% {
            transform: translateY(35px) scale(0.85) rotate(45deg);
          }
          100% {
            opacity: 0;
            transform: translateY(70px) scale(0.2) rotate(180deg);
          }
        }

        @keyframes ninjaStrike {
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

        @keyframes kickedFlyAway {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          30% {
            transform: translate(-30px, -25px) scale(1.1) rotate(-60deg);
          }
          70% {
            transform: translate(-90px, -60px) scale(0.8) rotate(-220deg);
          }
          100% {
            opacity: 0;
            transform: translate(-160px, -100px) scale(0.1) rotate(-480deg);
          }
        }
      `}</style>
    </div>
  );
}
