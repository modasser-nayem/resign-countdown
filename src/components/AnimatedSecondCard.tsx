"use client";

import React, { useEffect, useState, useRef } from "react";
import { soundEffects } from "@/lib/audio";

interface AnimatedSecondCardProps {
  seconds: number;
  minutes: number;
}

export default function AnimatedSecondCard({ seconds }: AnimatedSecondCardProps) {
  const prevSecRef = useRef<number>(seconds);
  const [activeNumber, setActiveNumber] = useState<number>(seconds);
  const [actionType, setActionType] = useState<"idle" | "cat_grab" | "ninja_kick" | "dumping">("idle");
  const [isDumping, setIsDumping] = useState<boolean>(false);
  const [scatterParticles, setScatterParticles] = useState<number[]>([]);

  useEffect(() => {
    if (prevSecRef.current === seconds) return;
    const oldSec = prevSecRef.current;
    prevSecRef.current = seconds;
    setActiveNumber(oldSec);

    // At 00 or 59: Cat walks across carrying dustbin and dumps it downwards!
    if (seconds === 0 || seconds === 59) {
      setIsDumping(true);
      setActionType("dumping");
      setScatterParticles([seconds, (seconds + 15) % 60, (seconds + 30) % 60]);

      const dumpTimer = setTimeout(() => {
        setIsDumping(false);
        setActionType("idle");
        setScatterParticles([]);
      }, 2200);
      return () => clearTimeout(dumpTimer);
    }

    // Every 2 or 3 seconds: Alternate between Cat 1 (Two-hand trash grab) & Cat 2 (Ninja kick)
    if (seconds % 2 === 0) {
      setActionType("cat_grab");
      const timer = setTimeout(() => setActionType("idle"), 700);
      return () => clearTimeout(timer);
    } else if (seconds % 3 === 0) {
      setActionType("ninja_kick");
      const timer = setTimeout(() => setActionType("idle"), 700);
      return () => clearTimeout(timer);
    }
  }, [seconds]);

  return (
    <div className="bg-slate-950/80 rounded-2xl p-3 sm:p-4 border border-slate-800 flex flex-col items-center justify-between min-h-[140px] sm:min-h-[160px] shadow-md relative overflow-hidden group">
      {/* Top Badge - Exactly matching Card 1, 2, 3 */}
      <span className="text-[10px] font-bold text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 z-10">
        ⚡ সেকেন্ড বাকি
      </span>

      {/* Central Area: Big Number + Smooth Cartoon Action */}
      <div className="relative w-full my-auto flex items-center justify-center select-none h-14 sm:h-16">
        {/* Base Big Second Number - Matches other 3 cards perfectly */}
        <span
          className={`text-4xl sm:text-6xl font-black font-mono text-emerald-400 tracking-tight transition-opacity duration-150 ${
            actionType !== "idle" ? "opacity-25 scale-95" : "opacity-100 scale-100"
          }`}
        >
          {String(seconds).padStart(2, "0")}
        </span>

        {/* Action 1: Cat two-paws grab & drop into dustbin */}
        {actionType === "cat_grab" && (
          <div className="absolute inset-0 flex items-center justify-center animate-[catDrop_0.7s_cubic-bezier(0.2,0.8,0.2,1)_forwards] z-20 pointer-events-none">
            <div className="flex items-center gap-1">
              <span className="text-base">🐾</span>
              <div className="px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-black font-mono text-2xl sm:text-3xl shadow-xl border border-amber-300">
                {String(activeNumber).padStart(2, "0")}
              </div>
              <span className="text-base">🐾</span>
            </div>
            <span className="absolute bottom-0 right-2 text-base">🗑️</span>
          </div>
        )}

        {/* Action 2: Ninja cat flying kick */}
        {actionType === "ninja_kick" && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="absolute -left-2 text-2xl animate-[ninjaStrike_0.35s_ease-out_forwards]">
              🥷🦵
            </div>
            <div className="px-2 py-0.5 rounded-lg bg-orange-500 text-white font-black font-mono text-2xl sm:text-3xl shadow-xl border border-yellow-300 animate-[kickFlyOff_0.7s_cubic-bezier(0.1,0.8,0.2,1)_forwards]">
              {String(activeNumber).padStart(2, "0")}
            </div>
            <div className="absolute text-xs font-black text-amber-300 animate-ping">
              💥 POW!
            </div>
          </div>
        )}

        {/* Action 3: 60s Cat walking with dustbin and dumping downwards */}
        {isDumping && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <div className="flex flex-col items-center animate-[walkAndDump_2.2s_ease-in-out_forwards]">
              <div className="flex items-center gap-1 text-2xl animate-bounce">
                <span>🐱</span>
                <span>🗑️</span>
              </div>
            </div>

            {/* Falling numbers */}
            <div className="absolute inset-x-0 bottom-0 flex justify-around pointer-events-none">
              {scatterParticles.map((num, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black font-mono text-xs animate-[fallDown_1.6s_ease-in_forwards]"
                  style={{ animationDelay: `${idx * 120}ms` }}
                >
                  {String(num).padStart(2, "0")}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Label - Exactly matching Card 1, 2, 3 */}
      <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider z-10">
        Secs (সেকেন্ড)
      </span>

      {/* Clean keyframe styles */}
      <style jsx>{`
        @keyframes catDrop {
          0% {
            opacity: 1;
            transform: translateY(-8px) scale(1.05);
          }
          40% {
            transform: translateY(0px) scale(1);
          }
          80% {
            transform: translate(20px, 18px) scale(0.6) rotate(15deg);
          }
          100% {
            opacity: 0;
            transform: translate(30px, 30px) scale(0.2) rotate(30deg);
          }
        }

        @keyframes ninjaStrike {
          0% {
            opacity: 0;
            transform: translateX(-15px) rotate(-30deg);
          }
          60% {
            opacity: 1;
            transform: translateX(8px) rotate(10deg);
          }
          100% {
            opacity: 0;
            transform: translateX(18px) rotate(0deg);
          }
        }

        @keyframes kickFlyOff {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          30% {
            transform: translate(20px, -15px) scale(1.1) rotate(45deg);
          }
          70% {
            transform: translate(60px, -35px) scale(0.7) rotate(220deg);
          }
          100% {
            opacity: 0;
            transform: translate(110px, -60px) scale(0.1) rotate(480deg);
          }
        }

        @keyframes walkAndDump {
          0% {
            opacity: 0;
            transform: translateX(-50px) scale(0.9);
          }
          25% {
            opacity: 1;
            transform: translateX(-10px) scale(1);
          }
          50% {
            transform: translateX(20px) rotate(-20deg);
          }
          70% {
            transform: translate(30px, 10px) rotate(-50deg) scale(1.1);
          }
          85% {
            transform: translateX(10px) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateX(-40px) scale(0.8);
          }
        }

        @keyframes fallDown {
          0% {
            opacity: 1;
            transform: translateY(-5px) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translateY(18px) scale(0.85);
          }
          100% {
            opacity: 0;
            transform: translateY(45px) scale(0.2);
          }
        }
      `}</style>
    </div>
  );
}
