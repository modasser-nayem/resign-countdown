"use client";

import React, { useEffect, useState, useRef } from "react";
import { Trash2, Footprints, Flame, RefreshCw, Volume2, VolumeX, Sparkles } from "lucide-react";
import { soundEffects } from "@/lib/audio";

interface SecondDestroyerProps {
  seconds: number;
  minutes: number;
}

export default function SecondDestroyer({ seconds, minutes }: SecondDestroyerProps) {
  // autoRotate is true by default: switches mode automatically every minute (minutes % 3)
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [manualMode, setManualMode] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Active mode index: 0 = Trash, 1 = Kick, 2 = Cannon
  const currentMode = manualMode !== null ? manualMode : Math.abs(minutes) % 3;

  // Track animation state when seconds change
  const [animatingSec, setAnimatingSec] = useState<number>(seconds);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const prevSecRef = useRef<number>(seconds);

  useEffect(() => {
    if (prevSecRef.current !== seconds) {
      setAnimatingSec(prevSecRef.current);
      prevSecRef.current = seconds;
      setIsAnimating(true);

      // Play sound if enabled
      if (soundEnabled) {
        if (currentMode === 0) soundEffects.playTrashDrop();
        else if (currentMode === 1) soundEffects.playKick();
        else if (currentMode === 2) soundEffects.playCannon();
      }

      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [seconds, currentMode, soundEnabled]);

  const MODES_CONFIG = [
    {
      id: 0,
      name: "ডাস্টবিন মোড",
      icon: Trash2,
      color: "text-amber-400 border-amber-500/40 bg-amber-500/10",
      activeColor: "bg-amber-500 text-slate-950 font-bold",
      desc: "প্রতি সেকেন্ড ডাস্টবিনে (Jira Backlog) ছুড়ে ফেলে দেওয়া হচ্ছে!",
      dialog: "🗑️ ডাস্টবিনে গায়েব! নোটিশ পিরিয়ডে কোনো টিকিট আর পেন্ডিং নাই!",
    },
    {
      id: 1,
      name: "উড়াল লাথি মোড",
      icon: Footprints,
      color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
      activeColor: "bg-emerald-500 text-slate-950 font-bold",
      desc: "কনভেয়র বেল্ট থেকে সেকেন্ডের বক্স উড়িয়ে লাথি মেরে বিদায়!",
      dialog: "👟 উড়াল লাথি খেয়ে সেকেন্ড সোজা স্ক্রিনের বাইরে! টাটা!",
    },
    {
      id: 2,
      name: "কামান মোড",
      icon: Flame,
      color: "text-red-400 border-red-500/40 bg-red-500/10",
      activeColor: "bg-red-500 text-white font-bold",
      desc: "কামান দিয়ে সেকেন্ডকে মহাশূন্যে ফায়ার করে ব্লাস্ট করা হচ্ছে!",
      dialog: "💣 বুম! মহাশূন্যে পাঠিয়ে দিলাম, আর জীবনেও ফিরে আসবে না!",
    },
  ];

  const activeMeta = MODES_CONFIG[currentMode];

  return (
    <div className="w-full bg-slate-950/95 border-2 border-amber-500/50 rounded-3xl p-4 sm:p-6 mb-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Background ambient glow */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Mode Switcher & Sound Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-800 mb-4">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <h3 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wide">
              <span>🎬 সেকেন্ড ডিস্ট্রয়ার অ্যারেনা</span>
              <span className="text-[10px] text-amber-400 font-mono font-normal">
                ({autoRotate ? "প্রতি ১ মিনিটে অটো চেঞ্জ 🔄" : "ম্যানুয়াল মোড"})
              </span>
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{activeMeta.desc}</p>
        </div>

        {/* Sound toggle & auto rotate indicator */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-2.5 py-1 rounded-xl text-xs flex items-center gap-1 border transition-all cursor-pointer ${
              soundEnabled
                ? "bg-amber-500 text-slate-950 font-bold border-amber-400"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
            }`}
            title="সাউন্ড অন/অফ করুন"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="text-[10px]">{soundEnabled ? "সাউন্ড অন 🔊" : "মিউট 🔇"}</span>
          </button>

          <button
            onClick={() => {
              setAutoRotate(true);
              setManualMode(null);
            }}
            className={`px-2.5 py-1 rounded-xl text-xs flex items-center gap-1 border transition-all cursor-pointer ${
              autoRotate
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
            }`}
            title="প্রতি মিনিটে স্বয়ংক্রিয়ভাবে মোড পরিবর্তন"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin text-amber-400" : ""}`} />
            <span className="text-[10px]">অটো মিনিট</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {MODES_CONFIG.map((m) => {
          const Icon = m.icon;
          const isSelected = currentMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                setAutoRotate(false);
                setManualMode(m.id);
                if (soundEnabled) {
                  if (m.id === 0) soundEffects.playTrashDrop();
                  else if (m.id === 1) soundEffects.playKick();
                  else soundEffects.playCannon();
                }
              }}
              className={`py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isSelected
                  ? m.activeColor + " shadow-lg ring-2 ring-amber-400/50"
                  : "bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{m.name}</span>
            </button>
          );
        })}
      </div>

      {/* Speech bubble */}
      <div className="inline-block bg-slate-900 border border-slate-800 text-amber-300 text-[11px] sm:text-xs font-medium px-3.5 py-1 rounded-full mb-3">
        {activeMeta.dialog}
      </div>

      {/* ======================================================== */}
      {/* THE LIVE ANIMATED ARENA STAGE (Height 150px) */}
      {/* ======================================================== */}
      <div className="w-full h-36 sm:h-40 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden flex items-center justify-center p-3 select-none">
        
        {/* ======================================================== */}
        {/* MODE 0: ডাস্টবিনে ফেলে দেওয়া (TRASH CAN THROW) 🗑️ */}
        {/* ======================================================== */}
        {currentMode === 0 && (
          <div className="w-full h-full relative flex items-center justify-between px-4 sm:px-10">
            {/* Cartoon Developer Thrower */}
            <div className="flex flex-col items-center relative z-10 transition-transform duration-300">
              {/* Developer Avatar */}
              <div
                className={`text-4xl sm:text-5xl transition-transform duration-200 ${
                  isAnimating ? "-translate-y-2 rotate-12 scale-110" : "translate-y-0"
                }`}
              >
                🧑‍💻
              </div>
              <span className="text-[10px] font-bold text-amber-300 mt-1 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                নয়ন ভাই
              </span>
            </div>

            {/* Flying Number Ball thrown into the trash */}
            <div
              key={`trash-${animatingSec}-${seconds}`}
              className={`absolute left-1/4 sm:left-1/3 z-20 flex items-center justify-center ${
                isAnimating
                  ? "animate-[trashThrow_0.75s_cubic-bezier(0.25,1,0.5,1)_forwards]"
                  : "opacity-0"
              }`}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 font-black font-mono text-sm sm:text-base flex items-center justify-center shadow-lg shadow-amber-500/50 border-2 border-white">
                {String(animatingSec).padStart(2, "0")}s
              </div>
            </div>

            {/* Target Dustbin */}
            <div className="flex flex-col items-center relative z-10">
              {/* Trash Can Lid */}
              <div
                className={`text-2xl sm:text-3xl transition-transform duration-200 ${
                  isAnimating ? "-translate-y-3 -rotate-45" : "translate-y-0"
                }`}
              >
                🧹
              </div>
              {/* Dustbin Body */}
              <div
                className={`w-14 h-16 sm:w-18 sm:h-20 bg-gradient-to-b from-slate-700 to-slate-900 border-2 border-slate-500 rounded-b-2xl rounded-t-sm flex flex-col items-center justify-center shadow-2xl relative transition-transform duration-200 ${
                  isAnimating ? "scale-105 rotate-3 ring-2 ring-amber-400" : ""
                }`}
              >
                <Trash2 className="w-5 h-5 text-amber-400" />
                <span className="text-[8px] sm:text-[9px] font-black text-slate-300 uppercase tracking-tighter mt-1 bg-slate-950/80 px-1 rounded">
                  JIRA BACKLOG
                </span>
                {isAnimating && (
                  <span className="absolute -top-3 right-0 text-xs animate-ping">💥</span>
                )}
              </div>
              <span className="text-[9px] text-slate-400 mt-1">ডাস্টবিন</span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODE 1: কনভেয়র বেল্ট থেকে উড়াল লাথি (KARATE KICK) 👟📦 */}
        {/* ======================================================== */}
        {currentMode === 1 && (
          <div className="w-full h-full relative flex items-center justify-center">
            {/* Conveyor Belt Floor */}
            <div className="absolute bottom-2 left-0 right-0 h-4 bg-slate-800 border-t border-emerald-500/40 flex items-center justify-around overflow-hidden opacity-80">
              <span className="text-[9px] text-emerald-400 font-mono animate-pulse tracking-widest">
                ⚙️ ═══ ⚙️ ═══ ⚙️ ═══ ⚙️ ═══ ⚙️
              </span>
            </div>

            {/* Karate Kicking Developer */}
            <div className="absolute left-8 sm:left-20 bottom-5 z-10 flex flex-col items-center">
              <div
                className={`text-4xl sm:text-5xl transition-all duration-200 ${
                  isAnimating
                    ? "translate-x-6 -translate-y-4 scale-125 rotate-12"
                    : "translate-x-0"
                }`}
              >
                {isAnimating ? "🥋🦵" : "🧑‍💻"}
              </div>
              <span className="text-[9px] font-bold text-emerald-400 mt-0.5 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                {isAnimating ? "উড়াল লাথি! 💨" : "রেডি"}
              </span>
            </div>

            {/* Impact Starburst */}
            {isAnimating && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-12 text-2xl animate-ping z-30">
                💥 POW!
              </div>
            )}

            {/* Kicked Box Flying off to the right */}
            <div
              key={`kick-${animatingSec}-${seconds}`}
              className={`absolute bottom-6 z-20 ${
                isAnimating
                  ? "animate-[kickFly_0.75s_cubic-bezier(0.2,0.8,0.2,1)_forwards]"
                  : "left-1/2 -translate-x-1/2 opacity-100"
              }`}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-amber-600 to-amber-400 border-2 border-amber-200 rounded-xl shadow-xl flex flex-col items-center justify-center text-slate-950 font-black font-mono">
                <span className="text-xs">📦</span>
                <span className="text-xs sm:text-sm tracking-tight leading-none">
                  {String(animatingSec).padStart(2, "0")}s
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODE 2: কামান দিয়ে মহাশূন্যে উড়িয়ে দেওয়া (CANNON BLAST) 💣🚀 */}
        {/* ======================================================== */}
        {currentMode === 2 && (
          <div className="w-full h-full relative flex items-center justify-between px-6 sm:px-14">
            {/* Pirate / Artillery Cannon */}
            <div className="flex flex-col items-center relative z-10">
              <div
                className={`text-4xl sm:text-5xl transition-transform duration-150 origin-bottom-left ${
                  isAnimating ? "-translate-x-2 rotate-[-15deg] scale-110" : "rotate-0"
                }`}
              >
                💣
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs">🧑‍💻</span>
                <span className="text-[9px] font-bold text-red-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  {isAnimating ? "ফায়ার! 🔥" : "কামান চালক"}
                </span>
              </div>
            </div>

            {/* Cannon Blast Flash & Smoke */}
            {isAnimating && (
              <div className="absolute left-20 sm:left-32 top-8 text-3xl animate-ping z-30">
                💥🔥
              </div>
            )}

            {/* Fired Shell shooting up into outer space */}
            <div
              key={`cannon-${animatingSec}-${seconds}`}
              className={`absolute left-20 sm:left-32 bottom-8 z-20 flex items-center justify-center ${
                isAnimating
                  ? "animate-[cannonRocket_0.75s_cubic-bezier(0.1,0.9,0.2,1)_forwards]"
                  : "opacity-0"
              }`}
            >
              <div className="flex items-center gap-1 bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 text-white font-black font-mono text-xs sm:text-sm px-3 py-1.5 rounded-full shadow-2xl border border-yellow-200">
                <span>🚀</span>
                <span>{String(animatingSec).padStart(2, "0")}s</span>
                <span className="text-yellow-200 animate-pulse">✨</span>
              </div>
            </div>

            {/* Deep Space Destination on the right */}
            <div className="flex flex-col items-end relative z-10 text-right opacity-80">
              <div className="text-3xl sm:text-4xl animate-pulse">🌌</div>
              <span className="text-[9px] font-mono text-cyan-300 mt-1">মহাশূন্য (Void)</span>
              <span className="text-[8px] text-slate-500">404 Never Returns</span>
            </div>
          </div>
        )}
      </div>

      {/* Live Second Counter Bar */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> বর্তমান সেকেন্ড:
          <span className="text-amber-300 font-bold font-mono text-xs ml-1">
            {String(seconds).padStart(2, "0")}s
          </span>
        </span>
        <span className="text-[10px] text-slate-500">
          প্রতি ৬০ সেকেন্ডে স্বয়ংক্রিয়ভাবে মোড বদলে যাবে
        </span>
      </div>

      {/* Embedded CSS Keyframes for the 3 distinct ultra-smooth animations */}
      <style jsx>{`
        @keyframes trashThrow {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          40% {
            transform: translate(60px, -45px) scale(1.1) rotate(180deg);
          }
          80% {
            transform: translate(140px, -10px) scale(0.7) rotate(360deg);
          }
          100% {
            opacity: 0;
            transform: translate(170px, 20px) scale(0.2) rotate(480deg);
          }
        }

        @keyframes kickFly {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          20% {
            transform: translate(30px, -30px) scale(1.1) rotate(45deg);
          }
          60% {
            transform: translate(120px, -60px) scale(0.9) rotate(220deg);
          }
          100% {
            opacity: 0;
            transform: translate(250px, -120px) scale(0.2) rotate(720deg);
          }
        }

        @keyframes cannonRocket {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(0.7) rotate(-30deg);
          }
          30% {
            transform: translate(60px, -40px) scale(1.2) rotate(0deg);
          }
          70% {
            transform: translate(150px, -80px) scale(1) rotate(15deg);
          }
          100% {
            opacity: 0;
            transform: translate(260px, -130px) scale(0.3) rotate(30deg);
          }
        }
      `}</style>
    </div>
  );
}
