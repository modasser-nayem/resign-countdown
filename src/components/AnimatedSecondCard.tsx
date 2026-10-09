"use client";

import React, { useEffect, useState, useRef } from "react";
import { soundEffects } from "@/lib/audio";
import { Trash2, Volume2, VolumeX, Sparkles, Footprints } from "lucide-react";

interface AnimatedSecondCardProps {
  seconds: number;
  minutes: number;
}

export default function AnimatedSecondCard({ seconds, minutes }: AnimatedSecondCardProps) {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  
  // Track previous second to detect ticks
  const prevSecRef = useRef<number>(seconds);
  const [activeNumber, setActiveNumber] = useState<number>(seconds);
  
  // Action type: 'idle' | 'cat_grab' | 'ninja_kick' | 'dumping'
  const [actionType, setActionType] = useState<"idle" | "cat_grab" | "ninja_kick" | "dumping">("idle");
  const [collectedCount, setCollectedCount] = useState<number>(0);
  
  // 60s walking & dumping state
  const [isDumping, setIsDumping] = useState<boolean>(false);
  const [scatterParticles, setScatterParticles] = useState<number[]>([]);
  const [speechBubble, setSpeechBubble] = useState<string>("কাজের ফাঁকে সেকেন্ড সরাচ্ছি... 🐾");

  // Every 2-3 seconds cadence trigger
  useEffect(() => {
    if (prevSecRef.current === seconds) return;
    const oldSec = prevSecRef.current;
    prevSecRef.current = seconds;
    setActiveNumber(oldSec);

    // If seconds === 0 (or full minute) or collected reaches 20+, trigger walking & dumping!
    if (seconds === 0 || seconds === 59) {
      triggerDumpAnimation();
      return;
    }

    // Every 2 or 3 seconds: Alternate between Cat 1 (Two-hand trash grab) & Cat 2 (Ninja kick)
    // When seconds is divisible by 2: Cat 1 grabs and drops to trash
    // When seconds is divisible by 3: Cat 2 flying karate kicks it away
    if (seconds % 2 === 0) {
      // Cat 1: Two-hand grab to trash
      setActionType("cat_grab");
      setCollectedCount((prev) => Math.min(prev + 1, 30));
      setSpeechBubble("🐱 দুই হাত দিয়ে সেকেন্ড ধরে ডাস্টবিনে ফেললাম!");
      if (soundEnabled) soundEffects.playTrashDrop();

      const timer = setTimeout(() => {
        setActionType("idle");
      }, 750);
      return () => clearTimeout(timer);
    } else if (seconds % 3 === 0) {
      // Cat 2: Karate Kick
      setActionType("ninja_kick");
      setSpeechBubble("🥷 উড়াল লাথি! সেকেন্ড সোজা স্ক্রিনের বাইরে!");
      if (soundEnabled) soundEffects.playKick();

      const timer = setTimeout(() => {
        setActionType("idle");
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [seconds, soundEnabled]);

  // The 60s Walk & Dump Animation
  const triggerDumpAnimation = () => {
    setIsDumping(true);
    setActionType("dumping");
    setSpeechBubble("🚶‍♂️🐱 ১ মিনিট শেষ! ডাস্টবিন নিয়ে নিচে ফেলে দিয়ে আসি!");
    if (soundEnabled) soundEffects.playCannon();

    // Generate falling number particles
    const sampleNumbers = [seconds, (seconds + 12) % 60, (seconds + 27) % 60, (seconds + 43) % 60];
    setScatterParticles(sampleNumbers);

    setTimeout(() => {
      // Dump completed, reset bin and walk back
      setCollectedCount(0);
      setIsDumping(false);
      setActionType("idle");
      setScatterParticles([]);
      setSpeechBubble("✨ ডাস্টবিন একদম খালি! আবার সেকেন্ড ধরা শুরু!");
    }, 2400);
  };

  return (
    <div className="bg-slate-950/90 rounded-2xl p-3 sm:p-4 border-2 border-emerald-500/40 hover:border-emerald-400/70 transition-all flex flex-col justify-between relative overflow-hidden shadow-lg shadow-emerald-500/10 min-h-[160px] sm:min-h-[175px]">
      {/* Background accent glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-slate-950 pointer-events-none" />

      {/* Top Header: Badge, Bin Count, Sound Toggle */}
      <div className="w-full flex items-center justify-between z-10 gap-1">
        <div className="flex items-center gap-1">
          <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md border text-amber-400 bg-amber-500/10 border-amber-500/30 flex items-center gap-1">
            <span>🐱 ডাবল বিড়াল মোড</span>
          </span>
          <span className="text-[9px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800" title="ডাস্টবিনে জমা সেকেন্ড">
            🗑️ {collectedCount} জমা
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
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
      </div>

      {/* Dynamic Mini Speech Bubble */}
      <div className="text-[9px] sm:text-[10px] text-amber-300/90 font-medium truncate px-1 mt-1 z-10 text-center">
        {speechBubble}
      </div>

      {/* ======================================================== */}
      {/* 🎭 CENTRAL ANIMATION THEATER */}
      {/* ======================================================== */}
      <div className="relative w-full h-16 sm:h-20 flex items-center justify-center my-1 select-none">
        
        {/* Static Base Second Number (dimmed slightly during active actions) */}
        <div
          className={`text-3xl sm:text-5xl font-black font-mono text-emerald-400 tracking-tight transition-all duration-150 ${
            actionType !== "idle" ? "opacity-30 scale-95" : "opacity-100 scale-100"
          }`}
        >
          {String(seconds).padStart(2, "0")}
        </div>

        {/* ---------------------------------------------------- */}
        {/* ACTION 1: CAT 1 (২ হাতে ধরে ডাস্টবিনে ড্রপ) 🐱🤲🗑️ */}
        {/* ---------------------------------------------------- */}
        {actionType === "cat_grab" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center animate-[catDrop_0.75s_cubic-bezier(0.2,0.8,0.2,1)_forwards] z-20 pointer-events-none">
            {/* Cute Cat Face with 2 Paws grasping the number */}
            <div className="flex items-center gap-1">
              <span className="text-sm">🐾</span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-black font-mono text-xl sm:text-2xl shadow-xl border border-amber-300">
                <span className="text-xs">🐱</span>
                <span>{String(activeNumber).padStart(2, "0")}</span>
              </div>
              <span className="text-sm">🐾</span>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* ACTION 2: NINJA CAT (উড়াল লাথি মেরে বিদায়) 🥷🦵💨 */}
        {/* ---------------------------------------------------- */}
        {actionType === "ninja_kick" && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            {/* Ninja Cat Flying Kick from Left */}
            <div className="absolute -left-1 text-2xl animate-[ninjaStrike_0.4s_ease-out_forwards]">
              🥷🦵
            </div>

            {/* Kicked Flying Number spinning off */}
            <div className="px-2 py-0.5 rounded-lg bg-orange-500 text-white font-black font-mono text-xl sm:text-2xl shadow-xl border border-yellow-300 animate-[kickFlyOff_0.7s_cubic-bezier(0.1,0.8,0.2,1)_forwards]">
              {String(activeNumber).padStart(2, "0")}
            </div>

            {/* Comic burst */}
            <div className="absolute text-xs font-black text-amber-300 animate-ping">
              💥 POW!
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* ACTION 3: 60s GRAND DUMP (হেঁটে গিয়ে ডাস্টবিন খালি করা) 🚶‍♂️🐱🗑️ */}
        {/* ---------------------------------------------------- */}
        {isDumping && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            {/* Walking Cat Carrying the Full Dustbin across */}
            <div className="flex flex-col items-center animate-[walkAndDump_2.4s_ease-in-out_forwards]">
              <div className="flex items-center gap-1 text-xl sm:text-2xl animate-bounce">
                <span>🐱</span>
                <span>🗑️</span>
              </div>
              <span className="text-[8px] bg-red-500 text-white font-bold px-1 rounded shadow">
                ডাস্টবিন খালি! 💨
              </span>
            </div>

            {/* Falling scattered numbers raining downwards */}
            <div className="absolute inset-x-0 bottom-0 flex justify-around pointer-events-none">
              {scatterParticles.map((num, idx) => (
                <span
                  key={idx}
                  className="px-1 py-0.5 rounded bg-amber-500/90 text-slate-950 font-black font-mono text-[10px] animate-[fallDown_1.8s_ease-in_forwards]"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  {String(num).padStart(2, "0")}s
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Mini Dustbin shown in the bottom-right corner */}
        <div className="absolute bottom-0 right-1 flex items-center gap-0.5 z-10 opacity-80">
          <span className={`text-xs transition-transform ${actionType === "cat_grab" ? "scale-125 -rotate-12" : ""}`}>
            🗑️
          </span>
          <span className="text-[7px] text-slate-400 font-mono">
            {isDumping ? "খালি..." : "Backlog"}
          </span>
        </div>

        {/* Mini Ninja Cat shown ready in the bottom-left corner */}
        <div className="absolute bottom-0 left-1 flex items-center gap-0.5 z-10 opacity-80">
          <span className={`text-xs transition-transform ${actionType === "ninja_kick" ? "scale-125 translate-x-1" : ""}`}>
            🥷
          </span>
          <span className="text-[7px] text-slate-400 font-mono">
            লাথি মারু
          </span>
        </div>
      </div>

      {/* Bottom Footer: Label & Manual Dump Button */}
      <div className="w-full flex items-center justify-between border-t border-slate-800/80 pt-1.5 z-10 text-[9px] sm:text-[10px] text-slate-400">
        <span className="font-semibold text-emerald-400 uppercase tracking-wider">
          Secs (সেকেন্ড)
        </span>

        {/* Manual Test Button for instant walking animation */}
        <button
          onClick={triggerDumpAnimation}
          className="text-[8px] sm:text-[9px] text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30 flex items-center gap-0.5 transition-colors cursor-pointer"
          title="১ মিনিট না অপেক্ষা করেও এখনই হেঁটে ডাস্টবিন খালি করে দেখার বোতাম"
        >
          <Trash2 className="w-2.5 h-2.5" /> ডাস্টবিন ফেলে দাও!
        </button>
      </div>

      {/* Embedded Smooth CSS Keyframes */}
      <style jsx>{`
        @keyframes catDrop {
          0% {
            opacity: 1;
            transform: translateY(-10px) scale(1.08);
          }
          30% {
            transform: translateY(-2px) scale(1);
          }
          70% {
            transform: translate(15px, 20px) scale(0.65) rotate(12deg);
          }
          100% {
            opacity: 0;
            transform: translate(25px, 35px) scale(0.2) rotate(25deg);
          }
        }

        @keyframes ninjaStrike {
          0% {
            opacity: 0;
            transform: translateX(-15px) rotate(-30deg);
          }
          50% {
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
            transform: translate(25px, -18px) scale(1.1) rotate(45deg);
          }
          70% {
            transform: translate(65px, -40px) scale(0.7) rotate(220deg);
          }
          100% {
            opacity: 0;
            transform: translate(110px, -65px) scale(0.1) rotate(480deg);
          }
        }

        @keyframes walkAndDump {
          0% {
            opacity: 0;
            transform: translateX(-60px) scale(0.9);
          }
          20% {
            opacity: 1;
            transform: translateX(-20px) scale(1);
          }
          45% {
            transform: translateX(25px) rotate(-15deg);
          }
          60% {
            transform: translate(35px, 15px) rotate(-45deg) scale(1.1);
          }
          80% {
            transform: translateX(10px) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateX(-50px) scale(0.8);
          }
        }

        @keyframes fallDown {
          0% {
            opacity: 1;
            transform: translateY(-10px) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translateY(20px) scale(0.85);
          }
          100% {
            opacity: 0;
            transform: translateY(50px) scale(0.3);
          }
        }
      `}</style>
    </div>
  );
}
