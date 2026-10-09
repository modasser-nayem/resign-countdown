"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import confetti from "canvas-confetti";
import { Clock, PartyPopper, Zap, Bell, MessageSquareQuote } from "lucide-react";
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
      <section className="relative w-full max-w-5xl mx-auto px-4 pt-6 sm:pt-10 pb-6 text-center">
         {/* Top Banner Tag */}
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6 animate-pulse">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>এসএম টেকনোলজি ➔ বিদায়ী সংবর্ধনা ও প্রীতি কাউন্টডাউন</span>
         </div>

         {/* Main Title */}
         <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-3 sm:mb-4 px-2">
            {timeLeft.isComplete ? (
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  🎉 সফলভাবে সম্পন্ন! নায়েম ভাইয়ের নতুন ঠিকানায় শুভকামনা! 🎉
               </span>
            ) : (
               <>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400">
                     {RESIGNATION_DETAILS.name}
                  </span>
                  <br />
                  <span className="text-slate-200 text-xl xs:text-2xl sm:text-4xl md:text-5xl font-bold mt-1 inline-block">
                     অফিসে আর বাকি রয়েছে মাত্র
                  </span>
               </>
            )}
         </h1>

         <p className="max-w-2xl mx-auto text-slate-300 text-xs sm:text-sm md:text-base mb-6 sm:mb-8 px-2 leading-relaxed">
            {timeLeft.isComplete
               ? "বিকাল ৫:০০ টা পূর্ণ হয়েছে! সকল দায়িত্ব সফলভাবে বুঝিয়ে দিয়ে নায়েম ভাই নতুন সম্ভাবনার পথে পা বাড়িয়েছেন। শুভকামনা রইল! 🚀"
               : "সহকর্মী ও শুভাকাঙ্ক্ষীদের জন্য লাইভ কাউন্টডাউন! আগামী ২১ অক্টোবর ২০২৬, বিকাল ৫:০০ টায় এসএম টেকনোলজি পরিবারের সাথে সুন্দর স্মৃতি নিয়ে বিদায়।"}
         </p>

         {/* Big Dynamic Countdown Grid */}
         <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-4 max-w-4xl mx-auto mb-6 sm:mb-8">
            {/* Days */}
            <div className="glass-card glass-card-hover rounded-2xl p-3 sm:p-6 border border-slate-700/60 flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-amber-500/10 rounded-bl-full pointer-events-none group-hover:bg-amber-500/20 transition-all" />
               <span className="text-4xl sm:text-6xl lg:text-7xl font-black text-amber-400 font-mono tracking-tight drop-shadow-md">
                  {String(timeLeft.days).padStart(2, "0")}
               </span>
               <span className="text-xs sm:text-sm font-bold tracking-wide text-slate-300 mt-1.5 sm:mt-2">
                  দিন (Days)
               </span>
            </div>

            {/* Hours */}
            <div className="glass-card glass-card-hover rounded-2xl p-3 sm:p-6 border border-slate-700/60 flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-orange-500/10 rounded-bl-full pointer-events-none group-hover:bg-orange-500/20 transition-all" />
               <span className="text-4xl sm:text-6xl lg:text-7xl font-black text-orange-400 font-mono tracking-tight drop-shadow-md">
                  {String(timeLeft.hours).padStart(2, "0")}
               </span>
               <span className="text-xs sm:text-sm font-bold tracking-wide text-slate-300 mt-1.5 sm:mt-2">
                  ঘণ্টা (Hours)
               </span>
            </div>

            {/* Minutes */}
            <div className="glass-card glass-card-hover rounded-2xl p-3 sm:p-6 border border-slate-700/60 flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-cyan-500/10 rounded-bl-full pointer-events-none group-hover:bg-cyan-500/20 transition-all" />
               <span className="text-4xl sm:text-6xl lg:text-7xl font-black text-cyan-400 font-mono tracking-tight drop-shadow-md">
                  {String(timeLeft.minutes).padStart(2, "0")}
               </span>
               <span className="text-xs sm:text-sm font-bold tracking-wide text-slate-300 mt-1.5 sm:mt-2">
                  মিনিট (Minutes)
               </span>
            </div>

            {/* Seconds */}
            <div className="glass-card glass-card-hover rounded-2xl p-3 sm:p-6 border border-slate-700/60 flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-emerald-500/10 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
               <span className="text-4xl sm:text-6xl lg:text-7xl font-black text-emerald-400 font-mono tracking-tight drop-shadow-md">
                  {String(timeLeft.seconds).padStart(2, "0")}
               </span>
               <span className="text-xs sm:text-sm font-bold tracking-wide text-slate-300 mt-1.5 sm:mt-2">
                  সেকেন্ড (Seconds)
               </span>
            </div>

            {/* Milliseconds (Ticking live) */}
            <div className="col-span-2 sm:col-span-1 glass-card glass-card-hover rounded-2xl p-3 sm:p-6 border border-slate-700/60 flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-purple-500/10 rounded-bl-full pointer-events-none group-hover:bg-purple-500/20 transition-all" />
               <span className="text-4xl sm:text-6xl lg:text-7xl font-black text-purple-400 font-mono tracking-tight drop-shadow-md">
                  {String(timeLeft.milliseconds).padStart(2, "0")}
               </span>
               <span className="text-xs sm:text-sm font-bold tracking-wide text-slate-300 mt-1.5 sm:mt-2">
                  মিলি-সেকেন্ড
               </span>
            </div>
         </div>

         {/* Progress Bar towards Freedom */}
         <div className="max-w-3xl mx-auto glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl mb-6">
            <div className="flex justify-between items-center mb-2 text-xs sm:text-sm font-medium">
               <span className="flex items-center gap-1.5 text-amber-400">
                  <Zap className="w-3.5 sm:w-4 h-3.5 sm:h-4" /> নোটিশ পিরিয়ডের অগ্রগতি
               </span>
               <span className="text-emerald-400 font-bold font-mono">
                  {timeLeft.totalProgressPercent}% সম্পন্ন
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

            <div className="flex flex-wrap justify-between items-center gap-1.5 mt-3 text-[11px] sm:text-xs text-slate-400">
               <span>📅 ২১ সেপ্টেম্বর (পদত্যাগপত্র জমা)</span>
               <span className="text-amber-300 font-semibold">
                  🎯 শেষ দিন: ২১ অক্টোবর ২০২৬, বিকাল ৫:০০ টা
               </span>
               <span>🌟 নতুন সম্ভাবনা</span>
            </div>
         </div>

         {/* Interactive Trigger Buttons */}
         <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <button
               onClick={triggerCelebration}
               className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all transform active:scale-95 cursor-pointer"
            >
               <PartyPopper className="w-4 h-4" />
               <span>আনন্দ কনফেটি উড়াই 🎊</span>
            </button>

            <button
               onClick={() => {
                  soundEffects.playFanfare();
               }}
               className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
               <Bell className="w-4 h-4 text-amber-400" />
               <span>বিদায়ী ঘণ্টা বাজাই 🔔</span>
            </button>

            <a
               href="#faq"
               className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-medium text-xs sm:text-sm transition-all"
            >
               <MessageSquareQuote className="w-4 h-4 text-cyan-400" />
               <span>মজার প্রশ্নোত্তর 💬</span>
            </a>
         </div>
      </section>
   );
}
