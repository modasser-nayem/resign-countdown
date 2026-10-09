"use client";

import React, { useState, useSyncExternalStore, useCallback } from "react";
import confetti from "canvas-confetti";
import {
   Volume2,
   Coffee,
   HeartHandshake,
} from "lucide-react";
import { soundEffects } from "@/lib/audio";

const STORAGE_KEY = "nayem_treat_claims";
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
   listeners.add(callback);
   const handleStorage = () => callback();
   window.addEventListener("storage", handleStorage);
   return () => {
      listeners.delete(callback);
      window.removeEventListener("storage", handleStorage);
   };
}

function getSnapshot(): number {
   const saved = localStorage.getItem(STORAGE_KEY);
   return saved ? parseInt(saved, 10) || 48 : 48;
}

function getServerSnapshot(): number {
   return 48;
}

export default function Soundboard() {
   const treatClaims = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
   const [lastClaimTime, setLastClaimTime] = useState<string | null>(null);

   const handleClaimTreat = useCallback(() => {
      const nextCount = (parseInt(localStorage.getItem(STORAGE_KEY) || "48", 10) || 48) + 1;
      localStorage.setItem(STORAGE_KEY, nextCount.toString());
      listeners.forEach((l) => l());

      setLastClaimTime(
         new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
         }),
      );

      soundEffects.playKaChing();
      confetti({
         particleCount: 50,
         spread: 60,
         origin: { y: 0.7 },
         colors: ["#f59e0b", "#10b981", "#3b82f6"],
      });
   }, []);

   const sounds = [
      {
         name: "বিদায়ী ফ্যানফেয়ার 🎺",
         action: () => {
            soundEffects.playFanfare();
            confetti({ particleCount: 30, spread: 50 });
         },
         desc: "নতুন সম্ভাবনা ও সফল সমাপনীর সুর",
         color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 hover:border-amber-400",
      },
      {
         name: "অফিস বেল 🔔",
         action: () => soundEffects.playKaChing(),
         desc: "চা-কফি ও আড্ডার আনন্দ সংকেত",
         color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 hover:border-emerald-400",
      },
      {
         name: "স্মৃতির সুর 🎻",
         action: () => soundEffects.playSadViolin(),
         desc: "একসাথে কাটানো সুন্দর দিনগুলোর স্মৃতি",
         color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30 hover:border-blue-400",
      },
      {
         name: "উৎসবের ধ্বনি 🎉",
         action: () => {
            soundEffects.playFanfare();
            confetti({ particleCount: 60, spread: 70 });
         },
         desc: "উজ্জ্বল ভবিষ্যৎ ও নতুন ক্যারিয়ারের জয়গান",
         color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 hover:border-purple-400",
      },
   ];

   return (
      <section className="w-full max-w-5xl mx-auto px-4 py-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Soundboard Column */}
            <div className="glass-card rounded-3xl p-4 sm:p-6 border border-slate-700/60 flex flex-col justify-between">
               <div>
                  <div className="flex items-center gap-2 mb-2">
                     <Volume2 className="w-5 h-5 text-amber-400" />
                     <h3 className="text-lg sm:text-xl font-bold text-white">
                        আনন্দময় সাউন্ডবোর্ড 🔊
                     </h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 sm:mb-5">
                     সহকর্মীদের সাথে উপভোগ করার জন্য আনন্দ ও স্মৃতির সুর শুনুন!
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                     {sounds.map((snd, idx) => (
                        <button
                           key={idx}
                           onClick={snd.action}
                           className={`p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br ${snd.color} border text-left transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer flex flex-col justify-between min-h-[5rem] sm:min-h-[6.5rem]`}
                        >
                           <span className="font-bold text-xs sm:text-sm text-slate-100">
                              {snd.name}
                           </span>
                           <span className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-1">
                              {snd.desc}
                           </span>
                        </button>
                     ))}
                  </div>
               </div>

               <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <span>ওয়েব অডিও সিন্থেসাইজার</span>
                  <span className="text-amber-400/80">১০০% ব্রাউজার অডিও</span>
               </div>
            </div>

            {/* Treat Claimer Column */}
            <div className="glass-card rounded-3xl p-4 sm:p-6 border border-slate-700/60 flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

               <div>
                  <div className="flex items-center gap-2 mb-2">
                     <Coffee className="w-5 h-5 text-orange-400" />
                     <h3 className="text-lg sm:text-xl font-bold text-white">
                        বিদায়ী মিষ্টি ও ট্রিট কাউন্টার 🍰☕
                     </h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 sm:mb-5">
                     নায়েম ভাইয়ের ফেয়ারওয়েল মিষ্টিমুখ ও চায়ের আয়োজনের দাবিদার তালিকা!
                  </p>

                  <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 text-center mb-4">
                     <div className="text-4xl sm:text-5xl font-black font-mono text-orange-400 mb-1">
                        {treatClaims}
                     </div>
                     <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        জন সহকর্মী মিষ্টি ও চায়ের অপেক্ষায়
                     </div>
                     {lastClaimTime && (
                        <div className="text-[11px] text-emerald-400 mt-2">
                           ✅ সর্বশেষ যুক্ত হয়েছেন আজ {lastClaimTime}-এ
                        </div>
                     )}
                  </div>

                  <button
                     onClick={handleClaimTreat}
                     className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-orange-500/25 transition-all transform hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                     <HeartHandshake className="w-4 h-4" />
                     <span>নায়েম ভাই, মিষ্টিমুখ চাই! (+১ যোগ করুন)</span>
                  </button>
               </div>

               <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
                  *ট্রিট পর্ব: ২১ অক্টোবর ২০২৬, বিকাল ৫:০০ টায় অফিসের সবাইকে নিয়ে!
               </div>
            </div>
         </div>
      </section>
   );
}
