"use client";

import React, { useEffect, useState, useRef } from "react";
import { soundEffects } from "@/lib/audio";
import { Trash2, Footprints, Flame, Volume2, VolumeX, Sparkles } from "lucide-react";

interface AnimatedSecondCardProps {
  seconds: number;
  minutes: number;
}

export default function AnimatedSecondCard({ seconds, minutes }: AnimatedSecondCardProps) {
  // autoMode changes every minute: 0 -> 1 -> 2
  const [manualMode, setManualMode] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Effective mode: 0 = Two Hands Trash, 1 = Karate Kick, 2 = Cannon Blast
  const activeMode = manualMode !== null ? manualMode : Math.abs(minutes) % 3;

  const [animatingNum, setAnimatingNum] = useState<number>(seconds);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const prevSecRef = useRef<number>(seconds);

  useEffect(() => {
    if (prevSecRef.current !== seconds) {
      setAnimatingNum(prevSecRef.current);
      prevSecRef.current = seconds;
      setIsAnimating(true);

      if (soundEnabled) {
        if (activeMode === 0) soundEffects.playTrashDrop();
        else if (activeMode === 1) soundEffects.playKick();
        else if (activeMode === 2) soundEffects.playCannon();
      }

      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [seconds, activeMode, soundEnabled]);

  const MODES_INFO = [
    {
      id: 0,
      name: "ডাস্টবিন",
      icon: Trash2,
      tag: "🤲 ২ হাতে ডাস্টবিনে ড্রপ",
      badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    },
    {
      id: 1,
      name: "উড়াল লাথি",
      icon: Footprints,
      tag: "🦵 উড়াল লাথিতে বিদায়",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      id: 2,
      name: "কামান ব্লাস্ট",
      icon: Flame,
      tag: "💣 কামানে মহাশূন্যে ফায়ার",
      badgeColor: "text-red-400 bg-red-500/10 border-red-500/30",
    },
  ];

  const currentModeInfo = MODES_INFO[activeMode];

  const cycleMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMode = (activeMode + 1) % 3;
    setManualMode(nextMode);
    if (soundEnabled) {
      if (nextMode === 0) soundEffects.playTrashDrop();
      else if (nextMode === 1) soundEffects.playKick();
      else soundEffects.playCannon();
    }
  };

  return (
    <div
      onClick={cycleMode}
      className="bg-slate-950/90 rounded-2xl p-3 sm:p-4 border-2 border-emerald-500/40 hover:border-emerald-400/70 transition-all flex flex-col items-center justify-between relative overflow-hidden group cursor-pointer shadow-lg shadow-emerald-500/10 min-h-[140px] sm:min-h-[160px]"
      title="ক্লিক করে মোড বদলান (ডাস্টবিন ➔ লাথি ➔ কামান)"
    >
      {/* Background radial accent glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-slate-950 pointer-events-none" />

      {/* Top Header: Mode tag & sound toggle */}
      <div className="w-full flex items-center justify-between z-10">
        <span
          className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md border flex items-center gap-1 ${currentModeInfo.badgeColor}`}
        >
          <span>{currentModeInfo.tag}</span>
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setSoundEnabled(!soundEnabled);
          }}
          className={`p-1 rounded-md transition-colors ${
            soundEnabled
              ? "text-amber-400 bg-amber-500/20"
              : "text-slate-500 hover:text-slate-300 bg-slate-900"
          }`}
          title={soundEnabled ? "মিউট করুন" : "সাউন্ড অন করুন"}
        >
          {soundEnabled ? (
            <Volume2 className="w-3 h-3 text-amber-400" />
          ) : (
            <VolumeX className="w-3 h-3 text-slate-500" />
          )}
        </button>
      </div>

      {/* ======================================================== */}
      {/* 🎭 THE CENTRAL ANIMATED STAGE FOR SECONDS */}
      {/* ======================================================== */}
      <div className="relative w-full h-16 sm:h-20 flex items-center justify-center my-1 select-none">
        
        {/* ======================================================== */}
        {/* MODE 0: 2 হাত দিয়ে ধরে ডাস্টবিনে ড্রপ 🤲🗑️ */}
        {/* ======================================================== */}
        {activeMode === 0 && (
          <div className="w-full h-full relative flex items-center justify-center">
            {/* Base Current Second (appears when idle) */}
            <div
              className={`text-3xl sm:text-5xl font-black font-mono text-emerald-400 tracking-tight transition-opacity duration-150 ${
                isAnimating ? "opacity-30 scale-95" : "opacity-100 scale-100"
              }`}
            >
              {String(seconds).padStart(2, "0")}
            </div>

            {/* Falling previous second grasped by 2 Hands into the Dustbin */}
            {isAnimating && (
              <div
                key={`trash-${animatingNum}-${seconds}`}
                className="absolute inset-0 flex flex-col items-center justify-center animate-[handsTrash_0.7s_cubic-bezier(0.2,0.8,0.2,1)_forwards] z-20 pointer-events-none"
              >
                {/* 2 Cartoon Hands holding the number */}
                <div className="flex items-center gap-1 text-base sm:text-lg animate-pulse">
                  <span>🫲</span>
                  <div className="px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-black font-mono text-xl sm:text-2xl shadow-lg border border-amber-300">
                    {String(animatingNum).padStart(2, "0")}
                  </div>
                  <span>🫱</span>
                </div>
              </div>
            )}

            {/* Mini Dustbin at the bottom of the card */}
            <div className="absolute -bottom-1 sm:bottom-0 right-2 flex flex-col items-center z-10">
              <span
                className={`text-sm sm:text-base transition-transform duration-200 ${
                  isAnimating ? "-translate-y-2 -rotate-12 scale-110" : "translate-y-0"
                }`}
              >
                🗑️
              </span>
              <span className="text-[7px] text-slate-400 font-mono leading-none">
                {isAnimating ? "ড্রপ! 💨" : "Backlog"}
              </span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODE 1: উড়াল লাথিতে উড়িয়ে দেওয়া 🦵💨 */}
        {/* ======================================================== */}
        {activeMode === 1 && (
          <div className="w-full h-full relative flex items-center justify-center">
            {/* Base Current Second */}
            <div
              className={`text-3xl sm:text-5xl font-black font-mono text-emerald-400 tracking-tight transition-opacity duration-150 ${
                isAnimating ? "opacity-30 scale-95" : "opacity-100 scale-100"
              }`}
            >
              {String(seconds).padStart(2, "0")}
            </div>

            {/* Flying Kicked Box & Impact */}
            {isAnimating && (
              <div
                key={`kick-${animatingNum}-${seconds}`}
                className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
              >
                {/* Karate Leg on Left */}
                <div className="absolute -left-2 text-2xl sm:text-3xl animate-[karateStrike_0.35s_ease-out_forwards]">
                  🦵💨
                </div>

                {/* Flying Kicked Number */}
                <div className="px-2 py-0.5 rounded-lg bg-orange-500 text-white font-black font-mono text-xl sm:text-2xl shadow-xl border border-yellow-300 animate-[kickFlyOff_0.7s_cubic-bezier(0.1,0.8,0.2,1)_forwards]">
                  {String(animatingNum).padStart(2, "0")}
                </div>

                {/* Impact Starburst */}
                <div className="absolute text-sm font-black text-amber-300 animate-ping">
                  💥 POW!
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* MODE 2: কামানে মহাশূন্যে ব্লাস্ট 💣🚀 */}
        {/* ======================================================== */}
        {activeMode === 2 && (
          <div className="w-full h-full relative flex items-center justify-center">
            {/* Base Current Second */}
            <div
              className={`text-3xl sm:text-5xl font-black font-mono text-emerald-400 tracking-tight transition-opacity duration-150 ${
                isAnimating ? "opacity-30 scale-95" : "opacity-100 scale-100"
              }`}
            >
              {String(seconds).padStart(2, "0")}
            </div>

            {/* Fired Rocket Shell shooting upward */}
            {isAnimating && (
              <div
                key={`cannon-${animatingNum}-${seconds}`}
                className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
              >
                {/* Muzzle flash */}
                <div className="absolute bottom-1 left-2 text-xl animate-ping">
                  💥🔥
                </div>

                {/* Rocketing Number */}
                <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-amber-500 text-white font-black font-mono text-lg sm:text-xl shadow-xl border border-yellow-200 animate-[cannonShootUp_0.7s_cubic-bezier(0.1,0.9,0.2,1)_forwards]">
                  <span>🚀</span>
                  <span>{String(animatingNum).padStart(2, "0")}</span>
                </div>
              </div>
            )}

            {/* Mini Cannon Icon in corner */}
            <div className="absolute -bottom-1 sm:bottom-0 left-2 text-sm sm:text-base opacity-75">
              💣
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer: Label & Click-to-switch hint */}
      <div className="w-full flex items-center justify-between border-t border-slate-800/80 pt-1.5 z-10 text-[9px] sm:text-[10px] text-slate-400">
        <span className="font-semibold text-emerald-400 uppercase tracking-wider">
          Secs (সেকেন্ড)
        </span>
        <span className="text-[8px] text-slate-500 group-hover:text-amber-400 transition-colors flex items-center gap-0.5">
          <Sparkles className="w-2.5 h-2.5" /> ক্লিক করে মোড বদলান
        </span>
      </div>

      {/* Embedded CSS Animations */}
      <style jsx>{`
        @keyframes handsTrash {
          0% {
            opacity: 1;
            transform: translateY(-8px) scale(1.05);
          }
          30% {
            transform: translateY(0px) scale(1);
          }
          70% {
            transform: translateY(22px) scale(0.7) rotate(10deg);
          }
          100% {
            opacity: 0;
            transform: translateY(38px) scale(0.2) rotate(25deg);
          }
        }

        @keyframes karateStrike {
          0% {
            opacity: 0;
            transform: translateX(-20px) rotate(-30deg);
          }
          50% {
            opacity: 1;
            transform: translateX(10px) rotate(10deg);
          }
          100% {
            opacity: 0;
            transform: translateX(20px) rotate(0deg);
          }
        }

        @keyframes kickFlyOff {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          30% {
            transform: translate(25px, -20px) scale(1.1) rotate(45deg);
          }
          70% {
            transform: translate(70px, -45px) scale(0.7) rotate(220deg);
          }
          100% {
            opacity: 0;
            transform: translate(120px, -70px) scale(0.1) rotate(480deg);
          }
        }

        @keyframes cannonShootUp {
          0% {
            opacity: 1;
            transform: translate(0, 10px) scale(0.8) rotate(-20deg);
          }
          30% {
            transform: translate(15px, -20px) scale(1.15) rotate(0deg);
          }
          70% {
            transform: translate(45px, -55px) scale(0.9) rotate(20deg);
          }
          100% {
            opacity: 0;
            transform: translate(80px, -90px) scale(0.2) rotate(35deg);
          }
        }
      `}</style>
    </div>
  );
}
