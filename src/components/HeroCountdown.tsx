"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import confetti from "canvas-confetti";
import { Clock, PartyPopper, Zap, AlertCircle } from "lucide-react";
import { RESIGNATION_DETAILS } from "@/lib/constants";
import { soundEffects } from "@/lib/audio";

interface TimeLeft {
   days: number;
   hours: number;
   minutes: number;
   seconds: number;
   milliseconds: number;
   isComplete: boolean;
   totalProgressPercent: number;
}

function calculateTimeLeft(): TimeLeft {
   if (typeof window === "undefined") {
      return {
         days: 0,
         hours: 0,
         minutes: 0,
         seconds: 0,
         milliseconds: 0,
         isComplete: false,
         totalProgressPercent: 0,
      };
   }

   const target = new Date(RESIGNATION_DETAILS.targetDate).getTime();
   const start = new Date(RESIGNATION_DETAILS.submissionDate).getTime();
   const totalDuration = target - start;
   const now = Date.now();
   const difference = target - now;

   if (difference <= 0) {
      return {
         days: 0,
         hours: 0,
         minutes: 0,
         seconds: 0,
         milliseconds: 0,
         isComplete: true,
         totalProgressPercent: 100,
      };
   }

   const elapsed = Math.max(0, now - start);
   const progress = Math.min(100, (elapsed / totalDuration) * 100);

   const days = Math.floor(difference / (1000 * 60 * 60 * 24));
   const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
   const minutes = Math.floor((difference / 1000 / 60) % 60);
   const seconds = Math.floor((difference / 1000) % 60);
   const milliseconds = Math.floor((difference % 1000) / 10);

   return {
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      isComplete: false,
      totalProgressPercent: parseFloat(progress.toFixed(2)),
   };
}

const subscribe = () => () => {};

export default function HeroCountdown() {
   const isClient = useSyncExternalStore(subscribe, () => true, () => false);
   const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

   const triggerCelebration = () => {
      soundEffects.playFanfare();
      confetti({
         particleCount: 120,
         spread: 80,
         origin: { y: 0.6 },
         colors: ["#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#8b5cf6"],
      });
   };

   useEffect(() => {
      const timer = setInterval(() => {
         setTimeLeft(calculateTimeLeft());
      }, 50);

      return () => clearInterval(timer);
   }, []);

   if (!isClient) {
      return (
         <div className="w-full py-16 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
         </div>
      );
   }

   return (
      <section className="relative w-full max-w-5xl mx-auto px-4 py-8 text-center">
         {/* Top Banner Tag */}
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-medium mb-6 animate-pulse">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>
               Official Farewell Tracker: SM Technology ➔ Mukti (Freedom)
            </span>
         </div>

         {/* Main Title */}
         <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-3 sm:mb-4 px-2">
            {timeLeft.isComplete ? (
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  🎉 MISSION COMPLETED! NAYEM BHAI IS FREE! 🎉
               </span>
            ) : (
               <>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-400">
                     Ali Modasser Nayem
                  </span>
                  <br />
                  <span className="text-slate-300 text-lg xs:text-xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold">
                     R Koydin Ache? (Notice Period Live)
                  </span>
               </>
            )}
         </h1>

         <p className="max-w-2xl mx-auto text-slate-400 text-xs sm:text-sm md:text-base mb-6 sm:mb-8 px-2 leading-relaxed">
            {timeLeft.isComplete
               ? "5:00 PM baje gese! Laptop submission done, access revoked, and Nayem bhai is off to new adventures! 🚀"
               : "Jara jara jiggnesh koren 'Bhai tumi r koydin aso?'— tader jonno live countdown! 21 October 2026, 5:00 PM e porer station e train chharbe."}
         </p>

         {/* Big Dynamic Countdown Grid */}
         <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-4 max-w-4xl mx-auto mb-6 sm:mb-8">
            {/* Days */}
            <div className="glass-card glass-card-hover rounded-2xl p-3 sm:p-5 border border-slate-700/60 flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-amber-500/10 rounded-bl-full pointer-events-none group-hover:bg-amber-500/20 transition-all" />
               <span className="text-3xl sm:text-5xl lg:text-6xl font-black text-amber-400 font-mono tracking-tight drop-shadow-md">
                  {String(timeLeft.days).padStart(2, "0")}
               </span>
               <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1.5 sm:mt-2">
                  Days (দিন)
               </span>
            </div>

            {/* Hours */}
            <div className="glass-card glass-card-hover rounded-2xl p-3 sm:p-5 border border-slate-700/60 flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-orange-500/10 rounded-bl-full pointer-events-none group-hover:bg-orange-500/20 transition-all" />
               <span className="text-3xl sm:text-5xl lg:text-6xl font-black text-orange-400 font-mono tracking-tight drop-shadow-md">
                  {String(timeLeft.hours).padStart(2, "0")}
               </span>
               <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1.5 sm:mt-2">
                  Hours (ঘণ্টা)
               </span>
            </div>

            {/* Minutes */}
            <div className="glass-card glass-card-hover rounded-2xl p-3 sm:p-5 border border-slate-700/60 flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-cyan-500/10 rounded-bl-full pointer-events-none group-hover:bg-cyan-500/20 transition-all" />
               <span className="text-3xl sm:text-5xl lg:text-6xl font-black text-cyan-400 font-mono tracking-tight drop-shadow-md">
                  {String(timeLeft.minutes).padStart(2, "0")}
               </span>
               <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1.5 sm:mt-2">
                  Minutes (মিনিট)
               </span>
            </div>

            {/* Seconds */}
            <div className="glass-card glass-card-hover rounded-2xl p-3 sm:p-5 border border-slate-700/60 flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-emerald-500/10 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
               <span className="text-3xl sm:text-5xl lg:text-6xl font-black text-emerald-400 font-mono tracking-tight drop-shadow-md">
                  {String(timeLeft.seconds).padStart(2, "0")}
               </span>
               <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1.5 sm:mt-2">
                  Seconds (সেকেন্ড)
               </span>
            </div>

            {/* Milliseconds (Ticking live) */}
            <div className="col-span-2 sm:col-span-1 glass-card glass-card-hover rounded-2xl p-3 sm:p-5 border border-slate-700/60 flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-purple-500/10 rounded-bl-full pointer-events-none group-hover:bg-purple-500/20 transition-all" />
               <span className="text-3xl sm:text-5xl lg:text-6xl font-black text-purple-400 font-mono tracking-tight drop-shadow-md">
                  {String(timeLeft.milliseconds).padStart(2, "0")}
               </span>
               <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1.5 sm:mt-2">
                  Millis (ধৈর্য্য)
               </span>
            </div>
         </div>

         {/* Progress Bar towards Freedom */}
         <div className="max-w-3xl mx-auto glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl mb-6">
            <div className="flex justify-between items-center mb-2 text-xs sm:text-sm font-medium">
               <span className="flex items-center gap-1.5 text-amber-400">
                  <Zap className="w-3.5 sm:w-4 h-3.5 sm:h-4" /> Freedom Loading Status
               </span>
               <span className="text-emerald-400 font-bold font-mono">
                  {timeLeft.totalProgressPercent}% Completed
               </span>
            </div>

            {/* Progress track */}
            <div className="w-full bg-slate-800/80 rounded-full h-3 sm:h-3.5 p-0.5 overflow-hidden border border-slate-700/50">
               <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 transition-all duration-300 shadow-sm"
                  style={{
                     width: `${Math.max(4, timeLeft.totalProgressPercent)}%`,
                  }}
               />
            </div>

            <div className="flex flex-wrap justify-between items-center gap-1.5 mt-3 text-[10px] sm:text-xs text-slate-500">
               <span>📅 21 Sep (Resigned)</span>
               <span className="text-slate-300 font-medium">
                  🎯 Target: 21 Oct 2026, 5:00 PM
               </span>
               <span>🕊️ Complete Freedom</span>
            </div>
         </div>

         {/* Interactive Trigger Buttons */}
         <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <button
               onClick={triggerCelebration}
               className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all transform active:scale-95 cursor-pointer"
            >
               <PartyPopper className="w-4 h-4" />
               <span>Blast Freedom Confetti 🎊</span>
            </button>

            <button
               onClick={() => {
                  soundEffects.playSiren();
               }}
               className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
               <AlertCircle className="w-4 h-4 text-red-400" />
               <span>Sound Azadi Siren 🚨</span>
            </button>

            <a
               href="#faq"
               className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white font-medium text-xs sm:text-sm transition-all"
            >
               <span>Frequently Asked Questions ❓</span>
            </a>
         </div>
      </section>
   );
}
